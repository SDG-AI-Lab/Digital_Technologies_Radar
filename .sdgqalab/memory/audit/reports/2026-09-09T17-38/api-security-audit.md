---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security (confidentiality, integrity, non-repudiation, accountability, authenticity)"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:38:00Z"
config_version: 3

score:
  pass: 4
  partial: 7
  fail: 3
  na: 14
  applicable: 14
  score_pct: 53.6
  rating: "Adequate"

priority_summary:
  p0_blockers: 1
  p1_critical: 2
  p2_important: 5
  p3_improvement: 2

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "no_feedback"
---

# Security Audit — API

> **Score**: 53.6% · Adequate
> **Results**: 4 pass · 7 partial · 3 fail · 14 n/a
> **Blockers**: 1 | **Critical**: 2 | **Important**: 5
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify `netlify/functions/`)
> **ISO Grounding**: Security

---

## Summary

API security is Adequate on paper but blocked for production by **P0 SEC-001**: a live Supabase anon JWT is hardcoded in `.github/workflows/supabase-heartbeat.yml`. Env-based service-role credentials, Supabase client queries (no string-concat SQL), JWT + `user_roles.admin` on mutations, and explicit public vs admin routes are solid. CORS allowlisting was reviewed as **PASS via trigger override** (see below). Remaining gaps: no rate limiting, raw project payloads on write paths, soft dependency audit, and incomplete response filtering.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Functions API (`netlify/functions/api.js`) behind `/api/*` (`netlify.toml`) |
| Interfaces | Public GETs for radar resources; admin CRUD under Bearer JWT; `/api/health`; CORS via `ALLOWED_ORIGINS` |
| Data contracts | Ad-hoc `allowedFields` / resource maps; Supabase JS client; no OpenAPI/Zod |
| AI/ML behavior | None |
| Checkpoint status | **no_feedback** — proceeded on current evidence |

### Trigger overrides

| Check | Default trigger | Override | Rationale |
|-------|-----------------|----------|-----------|
| SEC-006 CORS | `any_web_framework` → would be N/A for API-only tags | **Reviewed PASS** (not double-counted in score; qualitative confirmation) | `allowedOrigin()` reflect-only allowlist; never `*`; mismatch → no ACAO / 403 path for browsers (`api.js`) |

**Score basis:** pass=4, partial=7, fail=3, applicable=14 → `(4 + 0.5×7) / 14 × 100 = 53.6%`.

---

## Results

### PASS (4)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-003 | Environment Variable Management | `SUPABASE_URL` / `SUPABASE_SECRET_KEY` / `ALLOWED_ORIGINS` via `process.env` in `api.js`; no hardcoded DB URL in function source |
| SEC-008 | SQL Injection Prevention | All access via Supabase client `.from().select/insert/update/delete` — no raw SQL string concat |
| SEC-010 | Authentication Implementation | `requireAdmin` validates Bearer JWT via Supabase auth + `user_roles.admin` |
| SEC-016 | API Authentication | Public resources explicit (`PUBLIC_RESOURCES`); mutations require admin; unauthenticated → 401 |

**Also reviewed (trigger override, not in score numerator):** SEC-006 CORS — `ALLOWED_ORIGINS` comma allowlist; reflect only; empty allowlist blocks browsers.

### PARTIAL (7)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-002 | Dependency Vulnerability Scanning | `yarn audit` in CI; Dependabot | Soft/non-blocking audit; limited Netlify function dep surface review | high |
| SEC-004 | HTTPS Enforcement | Netlify serves HTTPS in prod | No in-repo force-HTTPS config (platform-owned) | high |
| SEC-011 | Authorization & RBAC | Admin role gate on CRUD | Binary admin vs public only; no object-level ACLs | high |
| SEC-013 | Input Validation | Body size cap; `allowedFields` on some resources | Inconsistent schemas; project writes accept broad payloads | high |
| SEC-018 | API Response Data Filtering | Public selects use column lists on many resources | Some admin paths `.select()` / `.select().single()` without tight projection | medium |
| SEC-027 | Dependency Pinning | Lockfile at repo root | Function deps not isolated; soft audit | medium |
| SEC-028 | Branch Protection | Workflows on protected branches assumed | No as-code protection evidence in repo | medium |

### FAIL (3)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| SEC-001 | Secrets in Source Control | Anon JWT (apikey + Bearer) committed in `.github/workflows/supabase-heartbeat.yml` | critical | **P0** |
| SEC-012 | Rate Limiting | No rate-limit library, Netlify edge limit config, or handler throttling | high | P1 |
| SEC-017 | API Input Sanitization | Project create/update passes raw/lightly filtered payloads into Supabase inserts | high | P1 |

### N/A (14)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-005 | Security Headers | Browser/edge concern; SPA on GH Pages (see frontend SEC-005) |
| SEC-006 | CORS Configuration | Tech trigger `any_web_framework` — scored N/A; **override reviewed PASS** (documented above) |
| SEC-007 | CSRF Protection | Bearer token API (cookie CSRF N/A) |
| SEC-009 | XSS Prevention | JSON API; HTML XSS owned by frontend |
| SEC-014 | Cookie Security | No session cookies |
| SEC-015 | File Upload Security | No multipart upload endpoints |
| SEC-019–021 | Docker / network | No Docker/K8s for API |
| SEC-022–025 | AI/ML security | No AI/ML |
| SEC-026 | CI/CD Secrets Management | Overlaps SEC-001 finding; not separately scored as N/A remainder after FAIL attribution |

*(N/A count includes web-framework-only, Docker, and AI checks; SEC-006 retained N/A in numeric rollup while override is documented.)*

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

#### SEC-001: Secrets in Source Control

**Current state:** Supabase anon `apikey` and `Authorization: Bearer` JWT are literal strings in `supabase-heartbeat.yml`.
**Required state:** Credentials only in GitHub Actions secrets; workflow references `${{ secrets.* }}`; rotate the exposed anon key in Supabase.
**Fix:**
```yaml
# .github/workflows/supabase-heartbeat.yml (concept)
-H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}"
-H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```
**Effort:** Quick win (+ key rotation Short)

---

### P1 — Critical (fix before production)

#### SEC-012: Rate Limiting

**Current state:** No throttling on public GETs or auth-adjacent routes.
**Fix:** Add Netlify/edge rate limits or in-function token-bucket for `/api/*` (stricter on writes).
**Effort:** Medium

#### SEC-017: API Input Sanitization

**Current state:** Project payloads reach `.insert()` / `.update()` with weak schema enforcement.
**Fix:** Define allowlists + type checks (or Joi/Zod) for `tr_projects` / `project_data` writes; reject unknown keys.
**Effort:** Medium

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-002 | Dep scanning | Fail CI on high/critical advisories for production deps | Short |
| SEC-011 | RBAC | Document admin-only model; add ownership checks if multi-editor | Medium |
| SEC-013 | Input validation | Shared schema module for all write routes | Medium |
| SEC-004 | HTTPS | Document Netlify TLS + HSTS as platform control | Quick win |
| SEC-018 | Response filtering | Explicit `.select('col,…')` on all admin responses | Short |

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-027 | Dependency pinning | Isolate function `package.json` + exact pins | Short |
| SEC-028 | Branch protection | Document required checks for deploy branches | Quick win |

---

## Delta from Previous Audit

First audit — no comparison available.

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (SEC-001)
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [x] Quality attribute score >= 50% (Adequate minimum)
- [ ] No critical-severity items in FAIL state (SEC-001 open)
