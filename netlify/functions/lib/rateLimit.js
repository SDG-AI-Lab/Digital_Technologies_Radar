/**
 * Best-effort in-memory rate limiter for Netlify Functions.
 * Limits are per warm instance (not global). Still raises the cost of brute force.
 */

const buckets = new Map();

function clientIp(event) {
  const headers = event.headers || {};
  return (
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'] ||
    'unknown'
  );
}

/**
 * @param {string} key
 * @param {{ limit: number, windowMs: number }} opts
 * @returns {{ allowed: boolean, remaining: number, retryAfterSec: number }}
 */
function takeToken(key, { limit, windowMs }) {
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || now - entry.windowStart >= windowMs) {
    entry = { windowStart: now, count: 0 };
    buckets.set(key, entry);
  }
  entry.count += 1;
  const allowed = entry.count <= limit;
  const retryAfterSec = Math.max(
    1,
    Math.ceil((entry.windowStart + windowMs - now) / 1000)
  );
  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSec
  };
}

/** @visibleForTesting */
function _resetForTests() {
  buckets.clear();
}

module.exports = {
  clientIp,
  takeToken,
  _resetForTests
};
