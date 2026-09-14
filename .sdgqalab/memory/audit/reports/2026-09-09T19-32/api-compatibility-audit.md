---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: compatibility
quality_attribute_name: Compatibility
iso_characteristic: "ISO 25010 Compatibility (co-existence, interoperability)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 5
  partial: 5
  fail: 2
  na: 4
  applicable: 12
  score_pct: 62.5
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 2
  p3_improvement: 4

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Compatibility Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 62.5% · Adequate
> **Results**: 5 pass · 5 partial · 2 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 1 | **High**: 2
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Compatibility · ISO/IEC 25023

---

## Summary

The API's wire-level interoperability is solid: every response sets a correct JSON `Content-Type`, CORS is a strict allowlist with proper preflight handling, timestamps flow through Supabase's `timestamptz` defaults in ISO 8601, and Postgres uses UTF-8. Field naming is consistently `snake_case` throughout. The two failing checks — no OpenAPI/GraphQL contract (CMP-001) and no API versioning (CMP-002) — are the same shape as FLX-012/MNT-019 and mean any breaking change is invisible to consumers until it hits production. Backwards-compatibility posture is unverifiable because no migrations are checked in (see MNT-020). Response envelopes and health-check dependency structure are close to consistent but not fully standardized.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | JSON API consumed by the React SPA on `drrtechradar.org` and by the daily heartbeat cron. |
| Interfaces | `/api/health`, `/api/public/*`, `/api/auth/*`, `/api/admin/*`. |
| Data contracts | Response shapes exist only in `api.js` and in the Jest mocks — no external contract file. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. |

---

## Results

### PASS (5 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| CMP-004 | Content Negotiation | The `response()` helper (api.js lines 100–111) sets `Content-Type: application/json; charset=utf-8` on every non-preflight response. Preflight OPTIONS (line 170–184) returns an empty body with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`. No routes emit HTML or bare text. |
| CMP-005 | CORS Configuration | `allowedOrigin` (lines 92–99) parses `ALLOWED_ORIGINS` into an allowlist; browsers from unlisted origins get `403 Origin is not allowed` (line 187–190). Preflight returns 204 with a bounded `Access-Control-Max-Age: 86400` and explicit `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`. `Access-Control-Allow-Credentials` is **not** combined with wildcard (no credentials header + no wildcard — correct). `Vary: Origin` is set on every response. Direct server-to-server calls (no `Origin` header) are tolerated for health probes. |
| CMP-007 | Database Character Encoding | Supabase provisions PostgreSQL with `UTF8` server encoding by default; there is no override in the repo. All JSON responses declare `charset=utf-8`. |
| CMP-008 | Timezone Handling | Supabase columns of type `timestamptz` (default for `now()`/`created_at`/`updated_at`) return ISO 8601 with a `Z` offset via PostgREST. `bumpDataVersion` uses `Date.now()` (UTC epoch ms). No naive `new Date().toString()` or hardcoded timezone strings anywhere in `api.js`. |
| CMP-010 | Shared Resource Management | The Supabase project is dedicated to FTR4DRR (single-tenant). Table names use consistent prefixes/domains (`tr_projects`, `disaster_events`, `disaster_types`, `disaster_types_projects`, `dataset_version`, `user_roles`), so a hypothetical shared instance would still be namespace-safe. No shared Redis or message broker to worry about. |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| CMP-003 | Standard Response Format | The `response()` helper is the single call site for every response body. Most reads return `{ data }`; simple ok signals return `{ status: 'ok' }`; errors return `{ error: '<message>' }`. Sign-in returns `{ access_token, expires_at, user: { id, email, role } }`. No route emits ad-hoc shapes. | The success envelope alternates between `{ data }`, `{ status: 'ok' }`, and per-endpoint fields (auth/sign-in, auth/users). Error responses have a human message but no machine-readable `code` or `details` array — client-side error handling has to string-match. No pagination envelope exists because no list endpoint is paginated (see PER-004). | medium |
| CMP-006 | Standard Data Formats | Field names are consistently `snake_case` (`img_url`, `disaster_type`, `help_needed`, `data_version`, `disaster_cycle`, `tr_projects_id`) — no `camelCase` leakage. UUIDs used for `tr_projects.uuid`, `disaster_events.uuid`. Timestamps ISO 8601 (see CMP-008). | The naming/format policy is undocumented. `role` values (`admin`/`user`) are lowercase strings but not backed by an ENUM or CHECK constraint — a typo like `'Admin'` would silently store as a distinct value. No `docs/api/style-guide.md`. `home-help-needed` filters `help_needed: 1` (integer coerced to boolean) — the mixed integer/boolean modelling is not documented anywhere. | medium |
| CMP-014 | Service Health Dependency Checks | `/api/health` performs a real dependency probe (`supabase.from('dataset_version').select('id').limit(1)`) so a broken Supabase link produces a 500. The heartbeat workflow verifies HTTP status. | The health response is `{ status: 'ok' }` — a single boolean-in-disguise. There is no per-dependency structure (e.g., `{ db: 'ok', auth: 'ok', edge: 'degraded' }`). The heartbeat cannot distinguish "DB down" from "function crashed on parse". | medium |
| CMP-015 | Backwards Compatibility | No visible destructive changes in `api.js` — response envelopes have been stable through the observable history; write endpoints strip DB-managed columns (`id, created_at, updated_at, uuid` on project PUT). | Without migrations in the repo (MNT-020) there is no way to audit schema history for destructive column drops. Without API versioning (MNT-019) there is no explicit deprecation channel — any field removal from a public read shape is immediately breaking. No documented deprecation policy. | high |
| CMP-016 | External Service Contract Testing | `tests/api/api.test.js` (~36 cases) covers request/response shape for every route by mocking the Supabase client at the boundary and asserting HTTP status + JSON body. `test:api` runs on every PR via `yarn test`. | The tests mock the Supabase JS client rather than exercise a real contract with Supabase itself. There is no contract test verifying that Supabase's PostgREST response shape for `dataset_version`, `technologies`, `tr_projects.project_data(*)` embed, `auth.getUser`, or `auth.admin.createUser` still matches assumptions — a Supabase upgrade could silently break the API without any pre-prod signal. | medium |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| CMP-001 | API Schema Documentation | No `openapi.yaml`/`openapi.json`, no `schema.graphql`, no `.proto`, no `drf-spectacular`/`fastapi`-generated docs. Route definitions live only in `api.js`'s hand-rolled path switch, and response shapes only in code + Jest mocks. Consumers (the SPA + any future integration) have nothing to code against. | high | P1 |
| CMP-002 | API Versioning | Every route lives under an unversioned `/api/` prefix. No URL versioning (`/v1/`), no header versioning (`API-Version`), no content-type versioning. No `Sunset`, no `Deprecation` headers. Any breaking change becomes a hot-fix scramble. | medium | P2 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| CMP-009 | Port Conflict Prevention | No Docker Compose; Netlify allocates function endpoints. |
| CMP-011 | Message Queue Compatibility | No message broker in the API layer. |
| CMP-012 | Browser Support Policy | Frontend concern. |
| CMP-013 | Progressive Enhancement | Frontend concern. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

#### CMP-001: API Schema Documentation

**Current state:** No machine-readable API schema exists. Consumers depend on de-facto shapes read from the SPA and the Jest mocks.

**Required state:** An `openapi.yaml` at the repository root (and/or `docs/openapi.yaml`) covering all 20+ routes, kept in sync with the implementation via a schema-validated integration test.

**Fix:** Author the spec by hand (surface is small) and validate every fixture response against it with `ajv`. See the FLX-012 fix for the concrete template. Publish the spec by adding a static route in `api.js`:

```javascript
// api.js — early route
if (event.httpMethod === 'GET' && path === 'openapi.yaml') {
  const fs = require('fs');
  const path = require('path');
  const spec = fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Origin',
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {})
    },
    body: spec
  };
}
```

Bundle `openapi.yaml` into the function deploy (Netlify Functions pick up sibling files). Optionally serve Swagger UI on `/api/docs` via a small `swagger-ui-dist` static page. Pair with CMP-002 by adopting `/api/v1/` as the base and setting `info.version: '1.0.0'` in the spec.

**Effort:** Medium (2 days for the initial spec + validation test).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| CMP-002 | API Versioning | Introduce `/api/v1/` as the current version. Update `netlify.toml` redirects to map both `/api/*` (transitional alias) and `/api/v1/*` to the function. Add a `Deprecation: true` and `Sunset: <date>` header on the unversioned alias after one release cycle. Document the versioning + deprecation policy in `docs/api-versioning.md` (link from `openapi.yaml` `info.description`). | Short |
| CMP-015 | Backwards Compatibility | Blocked on MNT-020 (migrations) + CMP-002 (versioning). Once both land, write a `docs/api-change-policy.md`: additive-only within a major version; column drops require a deprecation cycle behind a Sunset header; migrations that would remove a column require the code to first stop writing/reading it, deployed and observed, before the drop. | Rolled into MNT-020 + CMP-002 |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| CMP-003 | Standard Response Format | Adopt a single envelope for every route: `{ data: T, meta?: { ...pagination } }` for success and `{ error: { code, message, details? } }` for failure. Machine-readable `code` values (`invalid_input`, `unauthorized`, `forbidden`, `not_found`, `conflict`, `internal`) let clients branch without string matching. Update the `response()` helper and rev all Jest fixtures at once. | Short |
| CMP-006 | Standard Data Formats | Add `docs/api/data-conventions.md` stating: `snake_case` field names, ISO 8601 `Z` timestamps, `uuid` identifiers, boolean fields are actual PostgreSQL BOOLEAN (fix `help_needed` if it's an integer today), enums use text with a CHECK constraint (`role IN ('admin','user','viewer')`). Enforce via migrations (MNT-020) and via the OpenAPI schema types. | Short |
| CMP-014 | Service Health Dependency Checks | Expand `/api/health` to return `{ status: 'ok', dependencies: { database: 'ok', auth: 'ok' }, version: process.env.COMMIT_REF, checkedAt: new Date().toISOString() }`. Probe `auth` via a cheap `supabase.auth.getSession()` (returns null quickly) or a dedicated no-op RPC. Return 503 if any dep is `degraded`. |

```javascript
// api.js — replace the current health branch
if (event.httpMethod === 'GET' && path === 'health') {
  const dependencies = {};
  let statusCode = 200;

  try {
    const { error } = await supabase.from('dataset_version').select('id').limit(1);
    dependencies.database = error ? 'error' : 'ok';
    if (error) statusCode = 503;
  } catch (e) {
    dependencies.database = 'error';
    statusCode = 503;
  }

  return response(statusCode, {
    status: statusCode === 200 ? 'ok' : 'degraded',
    dependencies,
    version: process.env.COMMIT_REF || null,
    checkedAt: new Date().toISOString()
  }, origin);
}
```

Note the heartbeat workflow's `[ "$RESPONSE" -ge 200 ] && [ "$RESPONSE" -lt 300 ]` check keeps working with the 503 addition. | Quick win |

| CMP-016 | External Service Contract Testing | Add a small nightly `test:contract` job (out-of-band from the main CI) that hits a **staging** Supabase project with the service role and asserts the shapes the API depends on (`dataset_version.id`, `tr_projects.uuid`, `auth.admin.createUser` response shape). Fail loudly on drift. Consider using `postman/newman` or a plain Jest suite hitting the real Supabase URL. | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off (CMP-001)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **62.5%** ✓
- [ ] No critical-severity items in FAIL state ✓
