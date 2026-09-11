---
schema: sdgqalab/executive-summary/v1
project: "UNDP Digital Technologies Radar"
audit_date: "2026-09-09T17:38 UTC"
overall_score_pct: 40.0
overall_rating: "Low"
verdict: "NOT PRODUCTION READY"
layers_audited: 3
quality_attributes_audited: 17
total_checks: 200
context_checkpoints:
  completed: 3
  corrected: 1
  skipped: 0
---

# Production Readiness — Executive Summary

**Project**: UNDP Digital Technologies Radar  
**Audit date**: 2026-09-09T17:38 UTC  
**Overall score**: 40.0% Low (severity-weighted ≈40%; critical-severity fails weighted 3×)  
**Verdict**: NOT PRODUCTION READY

---

## Project Context Basis

| Area | Audit Understanding | Evidence |
|------|---------------------|----------|
| Product purpose | FTR4DRR — browse/search DRR technologies & projects on radar/map; admin CRUD | `README.md`, `package.json` homepage |
| Primary workflows | Public SPA browse/filter/map; admin project/tech CRUD; Cypress E2E journeys | `src/App.tsx`, `src/navigation/AppNav.tsx`, `cypress/e2e/` |
| Interfaces | GH Pages SPA → Netlify Functions `/api/*` → Supabase Postgres; daily heartbeat workflow | `netlify/functions/api.js`, `netlify.toml`, `supabase-heartbeat.yml` |
| Data contracts | Resource maps + ad-hoc allowlists; no in-repo migrations/OpenAPI/Zod | `api.js` `PUBLIC_RESOURCES`, form helpers |
| AI/ML behavior | None at runtime | project-context.md |

### Human Checkpoints

| Scope | Status | Correction Applied |
|-------|--------|--------------------|
| frontend | corrected | GlitchTip DSN confirmed in GitHub Secrets; SEC-005 headers accepted residual risk (meta tags only) |
| api | no_feedback | Proceeded on evidence |
| documentation (project-wide) | no_feedback | User continued to finalize scoring |

---

## Scorecard

### Per-Layer Quality Attribute Scores

| Layer | Quality Attribute | Score | Rating | Pass | Partial | Fail | N/A |
|-------|-------------------|-------|--------|------|---------|------|-----|
| frontend | Security | 66.7% | Adequate | 5 | 6 | 1 | 16 |
| frontend | Reliability | 37.5% | Low | 1 | 1 | 2 | 18 |
| frontend | Maintainability | 78.1% | Solid | 9 | 7 | 0 | 6 |
| frontend | Observability | 17.9% | Critical | 0 | 5 | 9 | 6 |
| frontend | Performance Efficiency | 50.0% | Adequate | 1 | 5 | 1 | 15 |
| frontend | Interaction Capability | 50.0% | Adequate | 2 | 10 | 2 | 4 |
| frontend | Compatibility | 75.0% | Solid | 2 | 2 | 0 | 12 |
| frontend | Flexibility | 55.0% | Adequate | 3 | 5 | 2 | 8 |
| api | Security | 53.6% | Adequate | 4 | 7 | 3 | 14 |
| api | Data Quality | 13.6% | Critical | 0 | 3 | 8 | 7 |
| api | Reliability | 25.0% | Critical | 1 | 4 | 7 | 10 |
| api | Observability | 18.8% | Critical | 1 | 4 | 11 | 4 |
| api | Performance Efficiency | 35.0% | Low | 1 | 5 | 4 | 12 |
| api | Maintainability | 56.7% | Adequate | 5 | 7 | 3 | 7 |
| api | Flexibility | 50.0% | Adequate | 3 | 7 | 3 | 5 |
| api | Compatibility | 54.2% | Adequate | 3 | 7 | 2 | 4 |
| project | Documentation | 18.8% | Critical | 0 | 6 | 10 | 4 |

### Layer Totals

| Layer | Type | Score | Rating | Checks (applicable) |
|-------|------|-------|--------|---------------------|
| frontend | react-typescript | 53.8% | Adequate | 81 |
| api | nodejs-netlify | 38.4% | Low | 103 |
| project | project-wide | 18.8% | Critical | 16 |

### Quality Attribute Totals (Across All Layers)

| Quality Attribute | Avg Score | Rating |
|-------------------|-----------|--------|
| Security | 60.2% | Adequate |
| Reliability | 31.3% | Low |
| Maintainability | 67.4% | Adequate |
| Observability | 18.4% | Critical |
| Performance Efficiency | 42.5% | Low |
| Interaction Capability | 50.0% | Adequate |
| Compatibility | 64.6% | Adequate |
| Flexibility | 52.5% | Adequate |
| Data Quality | 13.6% | Critical |
| Documentation | 18.8% | Critical |

---

## Production Readiness Verdict

| Criterion | Status |
|-----------|--------|
| Overall score >= 60% | FAIL (40.0%) |
| Zero P0 blockers | FAIL (3+ remaining) |
| All critical-severity checks pass | FAIL (multiple: SEC-001, DQ-013, REL-013, …) |

**Verdict**: **NOT PRODUCTION READY**

Critical domain ratings (frontend Observability; API Data Quality, Reliability, Observability; Documentation) plus P0 SEC-001 (committed heartbeat JWT) block production readiness. The following blockers must be resolved before production deployment.

---

## Blockers (P0)

| # | Check ID | Layer | Finding | Severity |
|---|----------|-------|---------|----------|
| 1 | SEC-001 | api | Anon JWT hardcoded in `.github/workflows/supabase-heartbeat.yml` | critical |
| 2 | DQ-013 | api | No PII inventory/encryption/scrubbing/privacy runbooks | critical |
| 3 | DQ-014 | api | Service-role key used for all DB access (bypasses RLS / not least-privilege) | high (elevated to P0) |
| 4 | REL-013 | api | No backup/PITR/restore documentation for Supabase | critical |

---

## Top 10 Priorities

| # | Check ID | Layer | Finding | Severity | Effort |
|---|----------|-------|---------|----------|--------|
| 1 | SEC-001 | api | Move heartbeat JWT to GitHub Secrets; rotate anon key | critical | Quick win |
| 2 | DQ-014 | api | Replace blanket service-role usage with RLS + least-privilege keys | high | Large |
| 3 | DQ-013 | api | PII inventory, access controls, log scrubbing, privacy ops docs | critical | Large |
| 4 | REL-013 | api | Document Supabase backups/PITR + tested restore runbook | critical | Short |
| 5 | SEC-012 | api | Add rate limiting on `/api/*` (stricter on writes) | high | Medium |
| 6 | SEC-017 | api | Schema-validate project/admin write payloads | high | Medium |
| 7 | DQ-001 / DQ-003 | api | Export migrations; add FK/NOT NULL/CHECK constraints | high | Medium |
| 8 | OBS-* | frontend+api | Release tags, source maps, alerts, SPA/API uptime monitors | high | Medium |
| 9 | DOC-* | project | Refresh README, `.env.example`, architecture, runbooks, OpenAPI sketch | high | Medium |
| 10 | REL-001 / retries | frontend+api | Structured error reporting + retry/backoff on transient failures | high | Short–Medium |

---

## Remediation Effort Estimate

| Category | Count | Examples |
|----------|-------|---------|
| Quick wins (< 1 hour) | 4 | SEC-001 secret move; `.env.example`; HTTPS/ops notes; branch-protection docs |
| Short tasks (1–4 hours) | 6 | REL-013 backup docs; response field projection; token expiry UX; retention note |
| Medium tasks (4–16 hours) | 8 | Rate limits; input schemas; migrations export; observability alerts; README/architecture |
| Large tasks (> 16 hours) | 4 | RLS + least-privilege; PII/privacy program; full DQ monitoring; DR drills |

**Estimated total effort**: ~22 priority items in roadmap, approximately **80–140 hours** to clear P0/P1 and lift Critical domains above the Adequate band.

---

## Delta from Previous Audit

First audit — no comparison available.

---

## Reports Index

| Report | Path |
|--------|------|
| Frontend — Security | `.sdgqalab/memory/audit/frontend-security-audit.md` |
| Frontend — Reliability | `.sdgqalab/memory/audit/frontend-reliability-audit.md` |
| Frontend — Maintainability | `.sdgqalab/memory/audit/frontend-maintainability-audit.md` |
| Frontend — Observability | `.sdgqalab/memory/audit/frontend-observability-audit.md` |
| Frontend — Performance Efficiency | `.sdgqalab/memory/audit/frontend-performance-efficiency-audit.md` |
| Frontend — Interaction Capability | `.sdgqalab/memory/audit/frontend-interaction-capability-audit.md` |
| Frontend — Compatibility | `.sdgqalab/memory/audit/frontend-compatibility-audit.md` |
| Frontend — Flexibility | `.sdgqalab/memory/audit/frontend-flexibility-audit.md` |
| API — Security | `.sdgqalab/memory/audit/api-security-audit.md` |
| API — Data Quality | `.sdgqalab/memory/audit/api-data-quality-audit.md` |
| API — Reliability | `.sdgqalab/memory/audit/api-reliability-audit.md` |
| API — Observability | `.sdgqalab/memory/audit/api-observability-audit.md` |
| API — Performance Efficiency | `.sdgqalab/memory/audit/api-performance-efficiency-audit.md` |
| API — Maintainability | `.sdgqalab/memory/audit/api-maintainability-audit.md` |
| API — Flexibility | `.sdgqalab/memory/audit/api-flexibility-audit.md` |
| API — Compatibility | `.sdgqalab/memory/audit/api-compatibility-audit.md` |
| Project — Documentation | `.sdgqalab/memory/audit/project-documentation-audit.md` |
| Metrics history | `.sdgqalab/memory/audit/metrics.yml` |
