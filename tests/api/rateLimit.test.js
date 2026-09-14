const {
  clientIp,
  takeToken,
  _resetForTests
} = require('../../netlify/functions/lib/rateLimit');
const { parseDsn } = require('../../netlify/functions/lib/observability');

describe('rateLimit helpers', () => {
  beforeEach(() => _resetForTests());

  it('reads client IP from Netlify / forwarded headers', () => {
    expect(
      clientIp({ headers: { 'x-nf-client-connection-ip': '1.2.3.4' } })
    ).toBe('1.2.3.4');
    expect(
      clientIp({ headers: { 'x-forwarded-for': '9.9.9.9, 8.8.8.8' } })
    ).toBe('9.9.9.9');
  });

  it('enforces a sliding window limit', () => {
    const opts = { limit: 2, windowMs: 60_000 };
    expect(takeToken('k', opts).allowed).toBe(true);
    expect(takeToken('k', opts).allowed).toBe(true);
    const blocked = takeToken('k', opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });
});

describe('observability helpers', () => {
  it('parses a GlitchTip/Sentry DSN', () => {
    const parsed = parseDsn('https://abc123@app.glitchtip.com/42');
    expect(parsed).toEqual({
      publicKey: 'abc123',
      projectId: '42',
      ingest: 'https://app.glitchtip.com/api/42/store/'
    });
  });

  it('returns null for invalid DSN', () => {
    expect(parseDsn('not-a-url')).toBeNull();
  });
});
