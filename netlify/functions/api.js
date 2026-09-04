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
      return response(200, {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
        user: { id: data.user.id, email: data.user.email }
      }, origin);
    }

    return response(404, { error: 'Not found' }, origin);
  } catch (error) {
    console.error('API request failed', error);
    return response(500, { error: 'The request could not be completed' }, origin);
  }
};
