---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: security
quality_attribute_name: Security
iso_characteristic: "ISO 25010 Security (confidentiality, integrity, non-repudiation, accountability, authenticity, resistance)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 8
  partial: 9
  fail: 1
  na: 10
  applicable: 18
  score_pct: 69.4
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 6
  p3_improvement: 3

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Security Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 69.4% · Adequate
> **Results**: 8 pass · 9 partial · 1 fail · 10 n/a
> **Blockers**: 0 | **Critical**: 1 | **High**: 6
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Security · ISO/IEC 27001:2022 · OWASP Top 10 2021 · ISO/IEC 5055:2021

---

## Summary

The API layer has a solid authentication and CORS baseline — Supabase JWT bearer tokens are validated on every admin route via `requireAdmin`, CORS is allowlist-based, the body size cap is explicit, and no raw SQL is used (all queries go through the Supabase query builder). Secrets are correctly sourced from Netlify environment variables, the daily heartbeat workflow no longer carries any key material, and a repository secret scanner runs on every PR. The single blocker for launch on the security axis is the complete absence of rate limiting on public and authentication endpoints, which leaves brute-force and abuse vectors wide open. Secondary gaps cluster around weak project payload validation (raw insert), no CSP/HSTS response headers, coarse admin-only RBAC with no object-level checks, and a soft (non-blocking) `yarn audit` in CI.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Single Netlify Function `netlify/functions/api.js` (~472 lines) fronting Supabase Postgres via PostgREST and Supabase Auth. Exposes `/api/health`, `/api/public/*`, `/api/auth/*`, and `/api/admin/*`. |
| Interfaces | HTTP routes assembled by regex/switch inside the handler; browser client reaches it via `src/helpers/apiClient.ts`. External cron: `.github/workflows/supabase-heartbeat.yml` (daily GET `/api/health`, no keys). |
| Data contracts | `PUBLIC_RESOURCES`, `PUBLIC_DETAIL_RESOURCES`, `ADMIN_INFO_RESOURCES`, `INFO_FIELDS`, `EVENT_FIELDS` allowlists in `api.js`. No OpenAPI, Zod, or Joi schemas. |
| AI/ML behavior | N/A — no runtime AI/ML in the API layer. |
| Checkpoint status | Confirmed (default branch `master`, GlitchTip live in prod builds only, staging branch `staging`). |

---

## Results

### PASS (8 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | No live secrets in tracked files. `.github/workflows/supabase-heartbeat.yml` now curls `/api/health` with no `apikey`/JWT; repo grep for `eyJhbGci` returns none; `.env` is in `.gitignore` (lines 17–18); `.env.example` uses `sb_secret_replace_me` placeholders. `develop.yml` runs a working-tree secret scanner on every PR. |
| SEC-003 | Environment Variable Management | `api.js` reads only from `process.env.SUPABASE_URL`, `process.env.SUPABASE_SECRET_KEY`, `process.env.ALLOWED_ORIGINS`. `configuredClient` throws `Server configuration is incomplete` if either Supabase var is missing. `.env.example` documents all three. |
| SEC-004 | HTTPS Enforcement | Netlify Functions are served HTTPS-only on `undp-drr-radar-api.netlify.app`; the platform terminates TLS at the edge with no HTTP listener to redirect. No cookies are issued (bearer tokens only), so cookie `Secure` flag is not applicable. |
| SEC-006 | CORS Configuration | `allowedOrigin` (api.js lines 92–99) parses `ALLOWED_ORIGINS` into an allowlist; requests with an `Origin` not on the list get `403 Origin is not allowed`. Preflight `OPTIONS` returns 204 with explicit methods/headers. Wildcard is impossible — an unlisted origin can never be echoed back. |
| SEC-007 | CSRF Protection | API is stateless and bearer-token-based (`Authorization: Bearer <supabase_jwt>`). No cookies, no session middleware; CSRF is moot per the check's SPA+API guidance. |
| SEC-008 | SQL Injection Prevention | Every DB operation uses the Supabase query builder (`.from().select()/insert()/update()/delete().eq()`). Grep for raw SQL primitives (`rpc(`, `execute(`, `raw(`) in `api.js` returns none. |
| SEC-010 | Authentication Implementation | `requireAdmin` (api.js lines 134–157) parses `Bearer <token>`, calls `supabase.auth.getUser(token)`, then loads the caller's role from `user_roles` via a **separate** privileged client (comment explains why: `signInWithPassword` mutates the current client's session). Passwords are hashed by Supabase Auth (bcrypt); admin-created users require `password.length >= 12`. |
| SEC-016 | API Authentication | Every `admin/*` route is gated by `requireAdmin` at the top of the `admin/` branch (line 302–304). Public reads are explicitly under `public/*`; anything else falls through to `404 Not found`. Unauthenticated requests to admin routes get 401. |

### PARTIAL (9 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-002 | Dependency Vulnerability Scanning | `.github/dependabot.yml` runs weekly npm + monthly GitHub Actions PRs; `yarn audit --level high --groups dependencies` runs in `develop.yml`. | `develop.yml` line 53 sets `continue-on-error: true` on the audit step, so vulnerable deps do not block merge. | high |
| SEC-005 | Security Headers | `netlify.toml` and `public/_headers` set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`. | No `Content-Security-Policy` and no `Strict-Transport-Security` (HSTS). API JSON responses set only `Content-Type`, `Cache-Control`, `Vary`, and CORS headers. | high |
| SEC-011 | Authorization & RBAC | Two roles enforced (`admin` vs anything else) via `user_roles` table lookup with a dedicated privileged client. Admin routes are consistently protected. | No object-level authorization — any admin can edit/delete any project, disaster event, or taxonomy row. No approval-workflow separation of duties, no per-tenant scoping. | high |
| SEC-013 | Input Validation | `auth/sign-in` and `auth/users` do type + length checks; `admin/info/*` and `admin/disaster-events` use `allowedFields(payload, INFO_FIELDS/EVENT_FIELDS)` allowlists with per-field type checks on info. `parseBody` enforces a 16 KB cap. | `POST /admin/projects` accepts a largely raw `projectPayload` (only `title` is validated as a non-empty string, and `disaster_cycles` is stringly parsed). `PUT /admin/projects/:uuid` strips only `disaster_cycles, project_data, id, created_at, updated_at, uuid` from the caller's body — everything else flows straight into the `tr_projects` and `project_data` updates. No schema library (Zod/Joi/AJV/Yup). | high |
| SEC-017 | API Input Sanitization | Bodies are JSON-parsed under a 16 KB cap; path parameters (`slug`, `uuid`) are decoded but never fed to raw SQL; no `eval`, `yaml.load`, or `pickle`-equivalent deserialization. | Same gap as SEC-013 — project payloads are not schema-validated, so any Postgres-typed column reachable by the caller can be written with attacker-supplied JSON. Header values (`Authorization`, `Origin`) are read but not otherwise validated. | high |
| SEC-018 | API Response Data Filtering | Most catalog reads use explicit projections (e.g., `technologies: 'name, description, img_url, slug, source'`); sign-in response is `{ id, email, role }` — no session refresh token, no password hash. Errors return safe messages (`{ error: '<string>' }`). | Several public resources still use `select: '*'` (`locations`, `themes`, `data_types`, `use_cases`, `partners`, `un_hosts`, `tr_projects` for `projects`/`home-projects`, `disaster_events` incl. `contacts`, `project_data`), so any column added upstream is silently exposed. See DQ-013 for the PII consequence on `disaster_events.contacts`. | medium |
| SEC-026 | CI/CD Secrets Management | All workflow secrets use `${{ secrets.* }}`; `develop.yml` scans the working tree for AWS/OpenSSH-style keys on every PR. No literal secrets in `.github/workflows/*.yml`. | Workflows do not declare an explicit `permissions:` block, so they inherit the repository's default `GITHUB_TOKEN` scopes (least-privilege not enforced). | high |
| SEC-027 | Dependency Pinning | `yarn.lock` is committed (not in `.gitignore`); Node runtime pinned to `16.20.1` in `develop.yml`. Package versions use caret ranges but are locked by `yarn.lock`. | CI actions use mutable major-version tags (`actions/checkout@v2`, `actions/setup-node@v1`) rather than immutable SHA pins. | medium |
| SEC-028 | Branch Protection | CI (`develop.yml`) is defined to run on `pull_request` to `master`/`develop`, providing status-check inputs; publish is `push`-to-`master` gated. | No `.github/CODEOWNERS`, no IaC for branch-protection rules — required-review count, required-status-checks list, and direct-push blocks cannot be verified from the repository alone. | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| SEC-012 | Rate Limiting | Grep across `netlify/functions/`, `netlify.toml`, and `.github/workflows/` for `rateLimit`, `Limiter`, `throttle`, `limit_req` returns nothing. `POST /api/auth/sign-in`, `POST /api/auth/users`, admin write endpoints, and every public read are unthrottled. Netlify's platform-level DDoS protection is not a substitute for per-endpoint rate limits. | high | P1 |

### N/A (10 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-009 | XSS Prevention | API returns JSON only; no HTML rendering path in `api.js`. |
| SEC-014 | Cookie Security | No cookies are issued — the API is bearer-token-only. |
| SEC-015 | File Upload Security | No multipart/upload endpoints in `api.js`. |
| SEC-019 | Docker Security | Netlify Functions runtime is managed; no Dockerfile in scope for the API. |
| SEC-020 | Container Secrets Management | No containers; secrets are injected as Netlify env vars. |
| SEC-021 | Network Segmentation | No container network to segment (managed serverless). |
| SEC-022 | Prompt Injection Prevention | No LLM/AI runtime in the API. |
| SEC-023 | API Key Protection for LLM Services | No LLM providers used. |
| SEC-024 | Model Access Control | No ML model endpoints. |
| SEC-025 | Data Leakage Prevention (LLM) | No LLM pipelines. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

#### SEC-012: Rate Limiting

**Current state:** No rate limits anywhere. `/api/auth/sign-in` accepts unlimited attempts, exposing the entire user directory to online password guessing, and public reads can be scraped without throttling.

**Required state:** Per-IP rate limits on authentication routes (e.g., 10/min per IP, 100/hour per email); coarse limit on write routes (e.g., 30/min per admin token); soft limit on public reads (e.g., 300/min per IP) with sensible burst.

**Fix:** Since Netlify Functions have no built-in rate limiter, options are (in order of preference):

1. Move authentication and write routes behind Netlify's **[Edge Rate Limiting](https://docs.netlify.com/edge-functions/api/#rate-limits)** using an Edge Function that pre-filters `/api/auth/*` and `/api/admin/*`. Store counters in **Netlify Blobs** or **Upstash Redis**.
2. As a stop-gap, add an IP-based counter in a Supabase table (`api_rate_limits(ip, bucket, count, window_start)`) and enforce in `api.js`:

```javascript
// netlify/functions/api.js
async function checkRateLimit(supabase, ip, bucket, limit, windowSeconds) {
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count } = await supabase
    .from('api_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('bucket', bucket)
    .gte('created_at', windowStart);
  if ((count || 0) >= limit) {
    return { limited: true, retryAfter: windowSeconds };
  }
  await supabase.from('api_rate_limits').insert({ ip, bucket });
  return { limited: false };
}

// Inside handler, before auth/sign-in:
const clientIp = event.headers['x-nf-client-connection-ip']
  || event.headers['x-forwarded-for']?.split(',')[0]?.trim();
const rl = await checkRateLimit(supabase, clientIp, 'auth-sign-in', 10, 60);
if (rl.limited) {
  return response(429, { error: 'Too many attempts. Try again shortly.' }, origin, `no-store`);
}
```

Add a scheduled cleanup (delete rows older than 24h) or use a TTL-supported store.

**Effort:** Short (1–2 days including migration + tests).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-002 | Dependency Vulnerability Scanning | Drop `continue-on-error: true` on the `yarn audit` step in `develop.yml` for the `high` and `critical` severity levels; keep `moderate` non-blocking or run it in a warn-only follow-up job. Consider adding `npm-audit-resolver` or Snyk for triaged waivers. | Quick win |
| SEC-005 | Security Headers | Add `Content-Security-Policy` and `Strict-Transport-Security` to both `netlify.toml` `[[headers]]` and `public/_headers`. For the API JSON responses, keep as-is (CSP has little effect on JSON) but add HSTS to the platform headers. Example: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`; a starter CSP for the SPA: `default-src 'self'; connect-src 'self' https://undp-drr-radar-api.netlify.app https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'`. | Quick win |
| SEC-011 | Authorization & RBAC | Introduce object-level checks on admin writes (e.g., only original submitter or approver may edit a project). Split admin capabilities into `admin`, `editor`, `approver` roles in `user_roles` and check per-route. Combine with DB-level RLS (see DQ-014) as defence in depth. | Medium |
| SEC-013 | Input Validation | Add a schema library (Zod is a small, dependency-light choice for a Node function) and validate every request body. Replace the raw project payload with an allowlist schema for the `tr_projects` columns actually meant to be user-editable. Example: | Medium |

```javascript
// netlify/functions/schemas.js (new)
const { z } = require('zod');

const ProjectWriteSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(4000).optional(),
  technology: z.string().max(120).optional(),
  disaster_type: z.string().max(120).optional(),
  disaster_cycles: z.string().max(300).optional(),   // "{mitigation,response}"
  // ...enumerate every writable column here...
});

module.exports = { ProjectWriteSchema };
```

```javascript
// netlify/functions/api.js — inside admin POST projects
const { ProjectWriteSchema } = require('./schemas');
// ...
const parsed = ProjectWriteSchema.safeParse(await parseBody(event));
if (!parsed.success) {
  return response(400, {
    error: 'Invalid project payload',
    details: parsed.error.issues
  }, origin);
}
const payload = parsed.data;
```

Apply the same treatment to `PUT /admin/projects/:uuid` and to `admin/disaster-events` (`allowedFields` alone doesn't type-check).

| SEC-017 | API Input Sanitization | Covered by the SEC-013 fix (schema validation). Additionally, coerce and validate the `Origin` header early and reject any request whose body claims to update DB-managed columns (`id`, `created_at`, `updated_at`). | Rolled into SEC-013 |
| SEC-026 | CI/CD Secrets Management | Add an explicit `permissions:` block to every workflow (`contents: read` for CI, elevated only where needed): |

```yaml
# .github/workflows/develop.yml
permissions:
  contents: read
```

Move the `PAT` used in `git config --global url."https://${{ secrets.PAT }}@github.com/"...` into a repository-scoped token with the minimum scope required, or preferably drop it if no private submodules remain.

**Effort:** Quick win.

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-018 | API Response Data Filtering | Replace `select: '*'` with explicit column lists on every public resource, particularly `disaster-events`, `disaster-projects`, `tech-projects`, `radar-csv`, and the `home-*` widgets. Drop `contacts` from the public projection (see DQ-013). | Short |
| SEC-027 | Dependency Pinning | Pin GitHub Actions to commit SHAs (`actions/checkout@8ade135...` etc.) — Dependabot can keep them fresh once configured for `github-actions` (already enabled monthly). | Quick win |
| SEC-028 | Branch Protection | Add `.github/CODEOWNERS`, then enable branch protection on `master` requiring: 1 review, CODEOWNER approval, `CI Development / build` status check, and no direct pushes. Document in a top-level `SECURITY.md`. | Quick win |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off (SEC-012)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **69.4%** ✓
- [ ] No critical-severity items in FAIL state ✓
