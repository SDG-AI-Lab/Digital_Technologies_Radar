---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "compatibility"
quality_attribute_name: "Compatibility"
iso_characteristic: "Compatibility"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 3
  partial: 7
  fail: 2
  na: 4
  applicable: 12
  score_pct: 54.2
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 1
  p3_improvement: 7

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Compatibility Audit — API

> **Score**: 54.2% · Adequate
> **Results**: 3 pass · 7 partial · 2 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 1 | **Important**: 1
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: Compatibility

---

## Summary

CORS/`ALLOWED_ORIGINS` behavior is intentionally strict and well-tested (reflect allowlist; never `*`; Origin-less health allowed). Compatibility is Adequate overall: JSON `Content-Type` and response helpers are consistent enough for the SPA, but there is no machine-readable schema or API versioning, and datetime/encoding policies rely on Supabase defaults rather than explicit contracts.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | BFF for GH Pages SPA + admin CRUD over Supabase |
| Interfaces | `/api/health`, `/api/public/*`, `/api/auth/*`, `/api/admin/*` |
| Consumers | `src/helpers/apiClient.ts` → `REACT_APP_RADAR_API_URL` or `https://undp-drr-radar-api.netlify.app/api` |
| Checkpoint status | Unattended |

**CORS note (CMP-005):** See detailed behavior in Results / Remediation — do not treat empty `ALLOWED_ORIGINS` as “allow all”.

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| CMP-004 | Content Negotiation | `response()` always sets `Content-Type: application/json; charset=utf-8`; JSON-only API via `res.json`-equivalent body |
| CMP-005 | CORS Configuration | Allowlist via `ALLOWED_ORIGINS`; OPTIONS 204/403; rejects disallowed browser Origin with 403; no `Access-Control-Allow-Origin: *`; tested in `tests/api/api.test.js` |
| CMP-010 | Shared Resource Management | Single dedicated Supabase project/tables; no shared Redis/generic queue namespace collision in this layer |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| CMP-003 | Standard Response Format | Success often `{ data }` / `{ status: 'ok' }`; errors `{ error: string }` via shared `response()` | Auth success returns `{ access_token, expires_at, user }` (no `data` envelope); no machine-readable error codes | medium |
| CMP-006 | Standard Data Formats | Field names are DB snake_case consistently | `data_version` set with `Date.now()` (epoch ms); timestamps not normalized to documented ISO 8601 in API layer | medium |
| CMP-007 | Database Character Encoding | PostgreSQL/Supabase defaults to UTF-8 | No committed encoding/collation evidence or connection charset param in repo | medium |
| CMP-008 | Timezone Handling | No local-tz business logic in handler; version bump uses epoch ms | No documented UTC/timestamptz policy; no TZ-aware formatting at API boundary | medium |
| CMP-014 | Service Health Dependency Checks | `GET .../health` queries `dataset_version` (DB reachability), not a blind 200 | Response is only `{ status: 'ok' }` — no per-dependency map; Supabase Auth not probed | medium |
| CMP-015 | Backwards Compatibility | Info/event payloads use `allowedFields`; some project fields stripped on update | Unversioned API; project `insert(projectPayload)` still broad; no migration/deprecation process in repo | high |
| CMP-016 | External Service Contract Testing | Broad Jest suite mocks Supabase client; runs in CI via `yarn test:api` | No Pact/live contract against Supabase schema; drift possible until runtime | medium |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| CMP-001 | API Schema Documentation | No `openapi.*` / swagger / GraphQL / proto in repo | high | P1 |
| CMP-002 | API Versioning | No `/api/v[n]` or version headers; no Sunset/Deprecation docs | medium | P2 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| CMP-009 | Port Conflict Prevention | docker tag not on api layer (Netlify assigns runtime) |
| CMP-011 | Message Queue Compatibility | no message broker tags |
| CMP-012 | Browser Support Policy | frontend build-tool triggers |
| CMP-013 | Progressive Enhancement | frontend / any_web_framework UI triggers |

---

## CORS / `ALLOWED_ORIGINS` behavior (evidence)

From `netlify/functions/api.js`:

1. **Parse allowlist:** `process.env.ALLOWED_ORIGINS` split on `,`, trim, drop empties. Default `''` → **empty allowlist**.
2. **Reflect only:** `Access-Control-Allow-Origin` is set **only** when `Origin` is exactly in the list — never `*`.
3. **OPTIONS preflight:** allowed origin → `204` + Allow-Methods/Headers/Max-Age; otherwise `403` with `Vary: Origin` only.
4. **Browser gate:** if request has `Origin` and it is not allowlisted → `403` `{ error: 'Origin is not allowed' }` **before** routing (including health).
5. **No Origin:** requests without `Origin` (curl, monitors, server-to-server) are **not** blocked by CORS gate — intentional for health checks.
6. **Credentials:** no `Access-Control-Allow-Credentials: true` (Bearer token via `Authorization` header; preflight allows `Authorization, Content-Type`).
7. **Documented example:** `.env.example` → `ALLOWED_ORIGINS=https://drrtechradar.org,http://localhost:3000`.
8. **Tests:** reject evil origin; allow OPTIONS from allowlist; reject OPTIONS from evil; allow health with no Origin (`tests/api/api.test.js`).

**Operational implication:** misconfigured/empty `ALLOWED_ORIGINS` in Netlify **breaks the SPA** (browsers send Origin) but leaves Origin-less probes working — fail closed for browsers, fail open for non-browser callers.

---

## Remediation Roadmap

### P1 — Critical

#### CMP-001: API Schema Documentation

**Current state:** Consumers reverse-engineer `api.js` / `apiClient.ts`.
**Fix:** Add `openapi.yaml` covering public, auth, and admin routes (request/response + 401/403/404/500). Optionally generate or validate in CI.
**Effort:** Medium

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| CMP-002 | Versioning | Mount under `/api/v1` (redirect old paths or dual-mount during transition) | Short |
| CMP-015 | Backwards compat | Tighten project create allowlist; pair schema changes with migrations + changelog | Medium |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| CMP-003 | Response envelope | Unify auth payloads under `{ data }` + `{ error: { code, message } }` | Short |
| CMP-006 | Data formats | Document snake_case + ISO timestamps; consider ISO for `data_version` or keep epoch documented | Quick win |
| CMP-007 | Encoding | Note UTF-8/Supabase default in ops docs | Quick win |
| CMP-008 | Timezone | Document timestamptz/UTC assumption | Quick win |
| CMP-014 | Health | Return `{ status, checks: { database: 'ok' } }` | Quick win |
| CMP-016 | Contracts | Optional schema snapshot test or periodic live `/health` + sample public GET against staging | Short |
| CMP-005 | CORS ops | Ensure Netlify prod `ALLOWED_ORIGINS` includes all SPA hosts (prod + preview if any) | Quick win |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
