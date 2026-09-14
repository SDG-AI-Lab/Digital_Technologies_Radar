---
schema: sdgqalab/executive-summary/v1
project: "UNDP Digital Technologies Radar"
audit_date: "2026-09-09T19:32 UTC"
overall_score_pct: 49.7
overall_rating: "Low"
verdict: "NOT PRODUCTION READY"
layers_audited: 2
quality_attributes_audited: 17
total_checks: 202
context_checkpoints:
  completed: 3
  corrected: 1
  skipped: 0
---

# Production Readiness — Executive Summary

**Project**: UNDP Digital Technologies Radar (FTR4DRR)  
**Audit date**: 2026-09-09T19:32 UTC  
**Branch**: `sdgqalab-audit/2026-09-09T19-32`  
**Overall score**: 49.7% · **Low** (check-count weighted)  
**Verdict**: **NOT PRODUCTION READY**

---

## Project Context Basis

| Area | Audit Understanding | Evidence |
|------|---------------------|----------|
| Product purpose | Frontier Technology Radar for Disaster Risk Reduction — browse/search tech & projects; admin CRUD | `README.md`, `package.json` homepage |
| Primary workflows | Public catalog/radar/map; admin project/info/event management; sign-in | `src/navigation/AppNav.tsx`, `netlify/functions/api.js` |
| Interfaces | GH Pages SPA + Netlify `/api/*` + Supabase; daily heartbeat → `/api/health` | `netlify.toml`, `supabase-heartbeat.yml` |
| Data contracts | Resource maps + `allowedFields` in API; no OpenAPI/migrations/RLS in repo | `api.js`, `.env.example` |
| AI/ML behavior | None at runtime (taxonomy/branding only) | `package.json`, project-context |

### Human Checkpoints

| Scope | Status | Correction Applied |
|-------|--------|--------------------|
| frontend | corrected | GlitchTip DSN live in prod; default branch = `master`; staging = `staging` |
| api | confirmed | — |
| documentation (project-wide) | confirmed | — |

---

## Scorecard

### Per-Layer Quality Attribute Scores

| Layer | Quality Attribute | Score | Rating | Pass | Partial | Fail | N/A |
|-------|-------------------|------:|--------|-----:|--------:|-----:|----:|
| frontend | Security | 68.2% | Adequate | 4 | 7 | 0 | 17 |
| frontend | Reliability | 37.5% | Low | 1 | 1 | 2 | 18 |
| frontend | Observability | 30.8% | Low | 1 | 6 | 6 | 7 |
| frontend | Performance Efficiency | 62.5% | Adequate | 3 | 4 | 1 | 14 |
| frontend | Maintainability | 71.9% | Solid | 8 | 7 | 1 | 6 |
| frontend | Flexibility | 61.1% | Adequate | 3 | 5 | 1 | 9 |
| frontend | Compatibility | 66.7% | Adequate | 1 | 2 | 0 | 13 |
| frontend | Interaction Capability | 75.0% | Solid | 8 | 5 | 1 | 4 |
| api | Security | 69.4% | Adequate | 8 | 9 | 1 | 10 |
| api | Reliability | 34.6% | Low | 2 | 5 | 6 | 9 |
| api | Observability | 12.5% | Critical | 0 | 4 | 12 | 4 |
| api | Performance Efficiency | 55.0% | Adequate | 3 | 5 | 2 | 12 |
| api | Maintainability | 65.6% | Adequate | 9 | 3 | 4 | 6 |
| api | Flexibility | 45.8% | Low | 3 | 5 | 4 | 6 |
| api | Compatibility | 62.5% | Adequate | 5 | 5 | 2 | 4 |
| api | Data Quality | 22.7% | Critical | 0 | 5 | 6 | 7 |
| project | Documentation | 15.6% | Critical | 0 | 5 | 11 | 4 |

### Layer Totals

| Layer | Type | Score | Rating | Applicable checks |
|-------|------|------:|--------|------------------:|
| frontend | react-typescript | 60.9% | Adequate | 78 |
| api | nodejs-netlify | 46.7% | Low | 108 |
| project | documentation | 15.6% | Critical | 16 |
| **overall** | — | **49.7%** | **Low** | **202** |

### Notable improvements this run

| Item | Status |
|------|--------|
| SEC-001 Heartbeat JWT in workflow | **PASS** — curls Netlify `/api/health`; no keys in Actions |
| Frontend GlitchTip | Confirmed live in prod builds |
| Default branch | Confirmed **`master`** (cron uses this) |

---

## Production Readiness Verdict

| Criterion | Status |
|-----------|--------|
| Overall score >= 60% | **FAIL** (49.7%) |
| Zero P0 blockers | **FAIL** (2 remaining) |
| No Critical-rated quality attributes | **FAIL** (3 Critical: API observability, API data quality, documentation) |

**Verdict**: **NOT PRODUCTION READY**

Three Critical-rated attributes and two P0 blockers block production readiness even though frontend security/maintainability/a11y are Adequate–Solid and SEC-001 is remediated.

---

## Blockers (P0)

| # | Check ID | Layer | Finding | Severity |
|---|----------|-------|---------|----------|
| 1 | DQ-013 | api | Public `disaster-events` uses `select: '*'`, exposing `contacts` (PII) to anonymous clients | critical |
| 2 | REL-013 | api | No in-repo backup/restore documentation or evidence for Supabase data | critical |

---

## Top 10 Priorities

| # | Check ID | Layer | Finding | Severity | Effort |
|---|----------|-------|---------|----------|--------|
| 1 | DQ-013 | api | Strip `contacts` from public disaster-event projections | critical | Quick win |
| 2 | REL-013 | api | Document Supabase backup/PITR + restore drill | critical | Short |
| 3 | DQ-014 | api | Split anon vs service-role clients; add RLS baseline | high | Large |
| 4 | SEC-012 | api | Rate-limit `/auth/*` and `/admin/*` | high | Medium |
| 5 | DOC-001/002 | project | Rewrite README + local setup (Node 16, env, architecture) | high | Short |
| 6 | DOC-006/008 | project | OpenAPI + auth documentation | high | Medium |
| 7 | OBS-001/008 | api | Structured logs + GlitchTip on Netlify function | high | Medium |
| 8 | SEC-005 | frontend | Add CSP (+ HSTS where host supports it) to `_headers` | high | Short |
| 9 | PER / FE | frontend | Route-level `React.lazy` code splitting | medium | Medium |
| 10 | MNT-017 | api | Split monolith `api.js` into modules + project body allowlists | high | Medium |

---

## Remediation Effort Estimate

| Category | Count | Examples |
|----------|------:|----------|
| Quick wins (< 1 hour) | ~4 | Exclude `contacts` from public selects; document `REACT_APP_RADAR_API_URL` in `.env.example`; fix README staging branch name |
| Short tasks (1–4 hours) | ~6 | Backup/PITR doc; README rewrite; CSP headers; SignIn `htmlFor` |
| Medium tasks (4–16 hours) | ~8 | Rate limits; API GlitchTip; OpenAPI; project payload allowlist; code splitting |
| Large tasks (> 16 hours) | ~3 | RLS + dual clients; schema/migrations in repo; full ops runbooks |

**Estimated total effort**: ~20–25 prioritized items, roughly **60–120 hours** depending on RLS/migration scope.

---

## Delta from Previous Audit

First complete scored snapshot retained on this branch under `reports/2026-09-09T19-32/`. Compared to the earlier same-day narrative audit (pre-heartbeat fix):

| Metric | Previous narrative | Current | Delta |
|--------|--------------------|---------|-------|
| SEC-001 heartbeat JWT | FAIL / P0 | **PASS** | ↑ remediated |
| Overall posture | ~40% Low / not ready | **49.7% Low** | ↑ but still not ready |
| P0 count | 3 (JWT + DQ + backup) | **2** (DQ + backup) | ↓ 1 |

---

## Reports Index

| Report | Path |
|--------|------|
| Project context | `.sdgqalab/memory/audit/project-context.md` |
| Frontend — 8 domains | `.sdgqalab/memory/audit/frontend-*-audit.md` |
| API — 8 domains | `.sdgqalab/memory/audit/api-*-audit.md` |
| Project — Documentation | `.sdgqalab/memory/audit/project-documentation-audit.md` |
| Historical snapshot | `.sdgqalab/memory/audit/reports/2026-09-09T19-32/` |
| Metrics history | `.sdgqalab/memory/audit/metrics.yml` |
