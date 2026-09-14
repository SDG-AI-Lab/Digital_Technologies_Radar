/**
 * Structured logging + optional GlitchTip (Sentry-compatible) reporting.
 * Set GLITCHTIP_DSN (or SENTRY_DSN) in Netlify env to enable remote capture.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

function log(level, message, fields = {}) {
  const payload = {
    level,
    message,
    ts: new Date().toISOString(),
    ...fields
  };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

function parseDsn(dsn) {
  try {
    const url = new URL(dsn);
    const publicKey = decodeURIComponent(url.username || '');
    const projectId = url.pathname.replace(/^\//, '').split('/')[0];
    if (!publicKey || !projectId) return null;
    return {
      publicKey,
      projectId,
      ingest: `${url.protocol}//${url.host}/api/${projectId}/store/`
    };
  } catch {
    return null;
  }
}

function postJson(urlString, headers, body) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const lib = url.protocol === 'http:' ? http : https;
      const req = lib.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || (url.protocol === 'http:' ? 80 : 443),
          path: `${url.pathname}${url.search}`,
          method: 'POST',
          headers: {
            ...headers,
            'Content-Length': Buffer.byteLength(body)
          }
        },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on('error', () => resolve());
      req.setTimeout(3000, () => {
        req.destroy();
        resolve();
      });
      req.write(body);
      req.end();
    } catch {
      resolve();
    }
  });
}

async function captureException(error, context = {}) {
  const message = error?.message || String(error);
  log('error', message, {
    stack: error?.stack,
    ...context
  });

  const dsn = process.env.GLITCHTIP_DSN || process.env.SENTRY_DSN;
  if (!dsn || process.env.NODE_ENV === 'test') return;

  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const body = JSON.stringify({
    message,
    level: 'error',
    platform: 'node',
    timestamp: Date.now() / 1000,
    exception: {
      values: [
        {
          type: error?.name || 'Error',
          value: message,
          stacktrace: error?.stack
            ? {
                frames: String(error.stack)
                  .split('\n')
                  .slice(1)
                  .map((line) => ({ filename: line.trim() }))
              }
            : undefined
        }
      ]
    },
    tags: { service: 'netlify-api' },
    extra: context
  });

  await postJson(
    parsed.ingest,
    {
      'Content-Type': 'application/json',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${parsed.publicKey}`
    },
    body
  );
}

module.exports = { log, captureException, parseDsn };
