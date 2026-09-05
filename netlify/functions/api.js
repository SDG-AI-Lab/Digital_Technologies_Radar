const { createClient } = require('@supabase/supabase-js');

const MAX_BODY_BYTES = 16 * 1024;
const PUBLIC_RESOURCES = {
  technologies: { table: 'technologies', select: 'name, description, img_url, slug, source', order: 'name' },
  'disaster-types': { table: 'disaster_types', select: 'id, name, description, img_url, slug, source', order: 'name' },
  'dataset-version': { table: 'dataset_version', select: 'data_version', single: true }
};

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

function configuredClient() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error('Server configuration is incomplete');
  }
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
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
  const role = await getRole(configuredClient(), data.user.id);
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

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: origin ? 204 : 403,
      headers: origin
        ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const path = (event.path || '').replace(/^.*\/api\/?/, '').replace(/^\//, '');
    const supabase = configuredClient();

    if (event.httpMethod === 'GET' && path === 'health') {
      const { error } = await supabase.from('dataset_version').select('id').limit(1);
      if (error) throw error;
      return response(200, { status: 'ok' }, origin);
    }

    if (event.httpMethod === 'GET' && path.startsWith('public/')) {
      const resource = PUBLIC_RESOURCES[path.slice('public/'.length)];
      if (!resource) return response(404, { error: 'Not found' }, origin);

      let query = supabase.from(resource.table).select(resource.select);
      if (resource.order) query = query.order(resource.order);
      if (resource.single) query = query.single();
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
      const role = await getRole(configuredClient(), data.user.id);
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

      const { error: roleError } = await configuredClient()
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

    return response(404, { error: 'Not found' }, origin);
  } catch (error) {
    console.error('API request failed', error);
    return response(500, { error: 'The request could not be completed' }, origin);
  }
};
