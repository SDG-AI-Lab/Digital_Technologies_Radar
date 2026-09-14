const { createClient } = require('@supabase/supabase-js');
const { clientIp, takeToken } = require('./lib/rateLimit');
const { captureException } = require('./lib/observability');

const MAX_BODY_BYTES = 16 * 1024;
const AUTH_RATE = { limit: 10, windowMs: 60_000 };
const ADMIN_RATE = { limit: 60, windowMs: 60_000 };

// Public disaster-event columns — never include contacts (PII).
const DISASTER_EVENT_PUBLIC_SELECT =
  'id, uuid, title, overview, img_url, impact, source, summary, solutions, resources, help_needed, how_to_help, countries, slug';
const DISASTER_EVENT_ADMIN_SELECT = `${DISASTER_EVENT_PUBLIC_SELECT}, contacts`;

const PROJECT_FIELDS = [
  'title',
  'description',
  'source',
  'img_url',
  'date_of_implementation',
  'theme',
  'sdg',
  'data',
  'use_case',
  'status',
  'partner',
  'un_host',
  'country',
  'disaster_type',
  'technology',
  'region',
  'subregion',
  'approved'
];

const PUBLIC_RESOURCES = {
  technologies: { table: 'technologies', select: 'name, description, img_url, slug, source', order: 'name' },
  'disaster-types': { table: 'disaster_types', select: 'id, name, description, img_url, slug, source', order: 'name' },
  'dataset-version': { table: 'dataset_version', select: 'data_version', single: true },
  locations: { table: 'locations', select: '*', order: 'country' },
  themes: { table: 'themes', select: '*', order: 'theme' },
  'data-types': { table: 'data_types', select: '*', order: 'name' },
  'use-cases': { table: 'use_cases', select: '*', order: 'use_case' },
  partners: { table: 'partners', select: '*', order: 'name' },
  'un-hosts': { table: 'un_hosts', select: '*', order: 'name' },
  projects: {
    table: 'tr_projects',
    select: '*, project_data(*)',
    order: 'id',
    ascending: false,
    excludeFalse: 'approved'
  },
  'disaster-projects': { table: 'disaster_types_projects', select: '*' },
  'disaster-events': {
    table: 'disaster_events',
    // Explicit projection — never expose contacts (PII) on public reads.
    select: `${DISASTER_EVENT_PUBLIC_SELECT}, locations(id, country, region)`
  },
  'radar-csv': {
    table: 'project_data',
    select: '*',
    order: 'id',
    ascending: false,
    csv: true
  },
  'tech-projects': { table: 'tech_projects', select: '*' },
  'home-projects': { table: 'tr_projects', select: '*', limit: 4 },
  'home-technologies': { table: 'technologies', select: '*', limit: 3 },
  'home-disaster-types': {
    table: 'disaster_types',
    select: '*',
    order: 'id',
    limit: 3
  },
  'home-help-needed': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT,
    order: 'id',
    ascending: false,
    equals: { help_needed: 1 }
  },
  'home-recent-events': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT,
    order: 'id',
    ascending: false,
    equals: { help_needed: 0 }
  }
};

const PUBLIC_DETAIL_RESOURCES = {
  project: { table: 'tr_projects', select: '*, project_data(*)', column: 'uuid', single: true },
  'radar-project': { table: 'project_data', select: '*', column: 'uuid', single: true },
  technology: { table: 'technologies', select: '*', column: 'slug', single: true },
  'technology-projects': { table: 'tech_projects', select: '*', column: 'slug' },
  'disaster-type': { table: 'disaster_types', select: '*', column: 'slug', single: true },
  'disaster-projects': { table: 'disaster_types_projects', select: '*', column: 'slug' },
  'disaster-event': {
    table: 'disaster_events',
    select: `${DISASTER_EVENT_PUBLIC_SELECT}, locations(id, country, region)`,
    column: 'uuid',
    single: true
  }
};

const ADMIN_INFO_RESOURCES = {
  technology: 'technologies',
  'disaster-type': 'disaster_types'
};
const INFO_FIELDS = ['name', 'img_url', 'description', 'source', 'slug'];
const EVENT_FIELDS = [
  'title', 'overview', 'img_url', 'impact', 'source', 'summary', 'contacts',
  'solutions', 'resources', 'help_needed', 'how_to_help', 'countries', 'slug'
];

function allowedFields(input, fields) {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => fields.includes(key))
  );
}

async function bumpDataVersion(supabase) {
  const { error } = await supabase
    .from('dataset_version')
    .update({ data_version: Date.now() })
    .eq('id', 1);
  if (error) throw error;
}

function allowedOrigin(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return origin && allowed.includes(origin) ? origin : null;
}

function response(statusCode, body, origin, cacheControl = 'no-store') {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
      Vary: 'Origin',
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {})
    },
    body: JSON.stringify(body)
  };
}

function serviceClient() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error('Server configuration is incomplete');
  }
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

/** Prefer anon key for public reads when set (requires RLS). Falls back to service role. */
function publicClient() {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (url && anon) {
    return createClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return serviceClient();
}

// Back-compat alias used by older call sites / tests mental model.
function configuredClient() {
  return serviceClient();
}

function rateLimitResponse(origin, retryAfterSec) {
  const res = response(429, { error: 'Too many requests. Please try again later.' }, origin);
  res.headers['Retry-After'] = String(retryAfterSec);
  return res;
}

async function getRole(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.role || null;
}

async function requireAdmin(supabase, event, origin) {
  const authorization = event.headers.authorization || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { error: response(401, { error: 'Sign in is required' }, origin) };
  }

  const { data, error } = await supabase.auth.getUser(match[1]);
  if (error || !data.user) {
    return {
      error: response(401, { error: 'Your session is no longer valid' }, origin)
    };
  }

  // Use a fresh privileged client for role lookups. A client that has just
  // called signInWithPassword may hold the signed-in user's token instead.
  const role = await getRole(serviceClient(), data.user.id);
  if (role !== 'admin') {
    return {
      error: response(403, { error: 'Administrator access is required' }, origin)
    };
  }
  return { user: data.user, role };
}

async function parseBody(event) {
  if (!event.body) return {};
  if (Buffer.byteLength(event.body, 'utf8') > MAX_BODY_BYTES) {
    throw new Error('Request body is too large');
  }
  return JSON.parse(event.body);
}

exports.handler = async (event) => {
  const origin = allowedOrigin(event.headers.origin);
  const ip = clientIp(event);
  const path = (event.path || '').replace(/^.*\/api\/?/, '').replace(/^\//, '');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: origin ? 204 : 403,
      headers: origin
        ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
            'Access-Control-Max-Age': '86400',
            Vary: 'Origin'
          }
        : { Vary: 'Origin' },
      body: ''
    };
  }

  // Browsers must come from one of the configured frontend origins. Direct
  // server-to-server health checks do not send an Origin header.
  if (event.headers.origin && !origin) {
    return response(403, { error: 'Origin is not allowed' }, null);
  }

  try {
    if (process.env.NODE_ENV !== 'test') {
      if (path === 'auth/sign-in' || path === 'auth/users') {
        const result = takeToken(`auth:${ip}:${path}`, AUTH_RATE);
        if (!result.allowed) return rateLimitResponse(origin, result.retryAfterSec);
      } else if (path.startsWith('admin/')) {
        const result = takeToken(`admin:${ip}`, ADMIN_RATE);
        if (!result.allowed) return rateLimitResponse(origin, result.retryAfterSec);
      }
    }

    const supabase = serviceClient();

    if (event.httpMethod === 'GET' && path === 'health') {
      const { error } = await publicClient().from('dataset_version').select('id').limit(1);
      if (error) throw error;
      return response(200, { status: 'ok' }, origin);
    }

    if (event.httpMethod === 'GET' && path.startsWith('public/')) {
      const reader = publicClient();
      const detailMatch = path.match(/^public\/details\/([^/]+)\/([^/]+)$/);
      if (detailMatch) {
        const resource = PUBLIC_DETAIL_RESOURCES[detailMatch[1]];
        if (!resource) return response(404, { error: 'Not found' }, origin);

        let query = reader
          .from(resource.table)
          .select(resource.select)
          .eq(resource.column, decodeURIComponent(detailMatch[2]));
        if (resource.single) query = query.single();
        const { data, error } = await query;
        if (error) throw error;
        return response(200, { data }, origin, 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
      }

      const resource = PUBLIC_RESOURCES[path.slice('public/'.length)];
      if (!resource) return response(404, { error: 'Not found' }, origin);

      let query = reader.from(resource.table).select(resource.select);
      if (resource.excludeFalse) query = query.neq(resource.excludeFalse, false);
      if (resource.equals) {
        Object.entries(resource.equals).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }
      if (resource.order) {
        query = query.order(resource.order, { ascending: resource.ascending });
      }
      if (resource.limit) query = query.limit(resource.limit);
      if (resource.single) query = query.single();
      if (resource.csv) query = query.csv();
      const { data, error } = await query;
      if (error) throw error;
      return response(200, { data }, origin, 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
    }

    if (event.httpMethod === 'POST' && path === 'auth/sign-in') {
      const { email, password } = await parseBody(event);
      if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        return response(400, { error: 'Email and password are required' }, origin);
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        return response(401, { error: 'Incorrect email or password' }, origin);
      }
      // signInWithPassword updates this client's session to the new user, so
      // role access must use a separate server-only client.
      const role = await getRole(serviceClient(), data.user.id);
      if (!role) {
        return response(403, {
          error: 'This account has not been granted access'
        }, origin);
      }
      return response(200, {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
        user: { id: data.user.id, email: data.user.email, role }
      }, origin);
    }

    if (event.httpMethod === 'POST' && path === 'auth/users') {
      const admin = await requireAdmin(supabase, event, origin);
      if (admin.error) return admin.error;

      const { email, password, role } = await parseBody(event);
      if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !['admin', 'user'].includes(role) ||
        password.length < 12
      ) {
        return response(400, {
          error: 'Provide an email, a 12-character password, and a valid role'
        }, origin);
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true
      });
      if (error || !data.user) {
        return response(400, {
          error: error?.message || 'Could not create the user'
        }, origin);
      }

      const { error: roleError } = await serviceClient()
        .from('user_roles')
        .insert({ user_id: data.user.id, role });
      if (roleError) {
        await supabase.auth.admin.deleteUser(data.user.id);
        throw roleError;
      }
      return response(201, {
        user: { id: data.user.id, email: data.user.email, role }
      }, origin);
    }

    if (path.startsWith('admin/')) {
      const admin = await requireAdmin(supabase, event, origin);
      if (admin.error) return admin.error;

      if (event.httpMethod === 'GET' && path === 'admin/projects/pending') {
        const { data, error } = await supabase
          .from('tr_projects')
          .select()
          .eq('approved', false);
        if (error) throw error;
        return response(200, { data }, origin);
      }

      if (event.httpMethod === 'POST' && path === 'admin/projects/approve') {
        const { uuid } = await parseBody(event);
        if (typeof uuid !== 'string' || !uuid) {
          return response(400, { error: 'A project UUID is required' }, origin);
        }
        const { error } = await supabase
          .from('tr_projects')
          .update({ approved: true })
          .eq('uuid', uuid);
        if (error) throw error;
        await bumpDataVersion(supabase);
        return response(200, { status: 'ok' }, origin);
      }

      if (event.httpMethod === 'POST' && path === 'admin/projects') {
        const payload = await parseBody(event);
        if (!payload || typeof payload.title !== 'string' || !payload.title) {
          return response(400, { error: 'A project title is required' }, origin);
        }
        const { disaster_cycles } = payload;
        const projectPayload = allowedFields(payload, PROJECT_FIELDS);
        const { data: project, error: projectError } = await supabase
          .from('tr_projects')
          .insert(projectPayload)
          .select('id, uuid')
          .single();
        if (projectError) throw projectError;
        const cycles = String(disaster_cycles || '')
          .replace(/[{}]/g, '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
        const radarRows = cycles.map((disaster_cycle) => ({
          ...projectPayload,
          disaster_cycle,
          tr_projects_id: project.id
        }));
        if (radarRows.length) {
          const { error } = await supabase.from('project_data').insert(radarRows);
          if (error) throw error;
        }
        await bumpDataVersion(supabase);
        return response(201, { data: project }, origin);
      }

      const projectMatch = path.match(/^admin\/projects\/([^/]+)$/);
      if (projectMatch && event.httpMethod === 'PUT') {
        const uuid = decodeURIComponent(projectMatch[1]);
        const payload = await parseBody(event);
        const projectPayload = allowedFields(payload, PROJECT_FIELDS);
        const { data: project, error: projectError } = await supabase
          .from('tr_projects')
          .update(projectPayload)
          .eq('uuid', uuid)
          .select('id, uuid')
          .single();
        if (projectError) throw projectError;
        const { error: radarError } = await supabase
          .from('project_data')
          .update(projectPayload)
          .eq('tr_projects_id', project.id);
        if (radarError) throw radarError;
        await bumpDataVersion(supabase);
        return response(200, { data: project }, origin);
      }

      if (projectMatch && event.httpMethod === 'DELETE') {
        const uuid = decodeURIComponent(projectMatch[1]);
        const { data: project, error: lookupError } = await supabase
          .from('tr_projects')
          .select('id')
          .eq('uuid', uuid)
          .single();
        if (lookupError) throw lookupError;
        const { error: radarError } = await supabase
          .from('project_data')
          .delete()
          .eq('tr_projects_id', project.id);
        if (radarError) throw radarError;
        const { error } = await supabase.from('tr_projects').delete().eq('uuid', uuid);
        if (error) throw error;
        await bumpDataVersion(supabase);
        return response(200, { status: 'ok' }, origin);
      }

      const infoMatch = path.match(/^admin\/info\/(technology|disaster-type)(?:\/([^/]+))?$/);
      if (infoMatch) {
        const table = ADMIN_INFO_RESOURCES[infoMatch[1]];
        const slug = infoMatch[2] && decodeURIComponent(infoMatch[2]);
        if (event.httpMethod === 'POST') {
          const payload = allowedFields(await parseBody(event), INFO_FIELDS);
          if (!INFO_FIELDS.every((field) => typeof payload[field] === 'string' && payload[field])) {
            return response(400, { error: 'All information fields are required' }, origin);
          }
          const { data, error } = await supabase.from(table).insert(payload).select().single();
          if (error) throw error;
          await bumpDataVersion(supabase);
          return response(201, { data }, origin);
        }
        if (event.httpMethod === 'PUT' && slug) {
          const body = await parseBody(event);
          const payload = allowedFields(body, INFO_FIELDS);
          const { data, error } = await supabase.from(table).update(payload).eq('slug', slug).select().single();
          if (error) throw error;
          if (Array.isArray(body.relatedProjectUpdates)) {
            for (const update of body.relatedProjectUpdates) {
              if (!update || typeof update.uuid !== 'string') continue;
              const fields = allowedFields(update, ['technology', 'disaster_type']);
              if (Object.keys(fields).length) {
                const { error: updateError } = await supabase
                  .from('tr_projects')
                  .update(fields)
                  .eq('uuid', update.uuid);
                if (updateError) throw updateError;
              }
            }
          }
          await bumpDataVersion(supabase);
          return response(200, { data }, origin);
        }
        if (event.httpMethod === 'DELETE' && slug) {
          const { error } = await supabase.from(table).delete().eq('slug', slug);
          if (error) throw error;
          await bumpDataVersion(supabase);
          return response(200, { status: 'ok' }, origin);
        }
      }

      const eventMatch = path.match(/^admin\/disaster-events(?:\/([^/]+))?$/);
      if (eventMatch) {
        const uuid = eventMatch[1] && decodeURIComponent(eventMatch[1]);
        // Admin reads may include contacts; public routes never do.
        if (event.httpMethod === 'GET') {
          let query = supabase
            .from('disaster_events')
            .select(DISASTER_EVENT_ADMIN_SELECT);
          if (uuid) query = query.eq('uuid', uuid).single();
          else query = query.order('id', { ascending: false });
          const { data, error } = await query;
          if (error) throw error;
          return response(200, { data }, origin);
        }
        if (event.httpMethod === 'POST' || (event.httpMethod === 'PUT' && uuid)) {
          const payload = allowedFields(await parseBody(event), EVENT_FIELDS);
          const query = event.httpMethod === 'POST'
            ? supabase.from('disaster_events').insert(payload)
            : supabase.from('disaster_events').update(payload).eq('uuid', uuid);
          const { data, error } = await query.select(DISASTER_EVENT_ADMIN_SELECT).single();
          if (error) throw error;
          await bumpDataVersion(supabase);
          return response(event.httpMethod === 'POST' ? 201 : 200, { data }, origin);
        }
        if (event.httpMethod === 'DELETE' && uuid) {
          const { error } = await supabase.from('disaster_events').delete().eq('uuid', uuid);
          if (error) throw error;
          await bumpDataVersion(supabase);
          return response(200, { status: 'ok' }, origin);
        }
      }

      return response(404, { error: 'Not found' }, origin);
    }

    return response(404, { error: 'Not found' }, origin);
  } catch (error) {
    await captureException(error, { path, method: event.httpMethod, ip });
    return response(500, { error: 'The request could not be completed' }, origin);
  }
};
