/**
 * Cloudflare Worker: add security headers in front of GitHub Pages.
 *
 * Deploy (once Cloudflare proxies drrtechradar.org):
 *   npx wrangler deploy cloudflare/security-headers-worker.js
 *
 * Or paste this as a Worker and route *drrtechradar.org/* to it.
 * GitHub Pages alone cannot set these response headers.
 */
export default {
  async fetch(request, _env, _ctx) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);

    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );
    headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
