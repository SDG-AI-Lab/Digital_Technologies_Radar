---
schema: sdgqalab/audit@3
layer: project
layer_type: project-wide
quality_attribute: documentation
quality_attribute_name: Documentation
iso_characteristic: "ISO 25010 Maintainability.Analysability + Interaction Capability.Self-descriptiveness"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:16Z"
config_version: 3

score:
  pass: 0
  partial: 6
  fail: 10
  na: 4
  applicable: 16
  score_pct: 18.8
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 4
  p2_important: 8
  p3_improvement: 4

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Documentation Audit — Project-Wide

> **Score**: 18.8% · Critical
> **Results**: 0 pass · 6 partial · 10 fail · 4 n/a
> **Blockers**: 0 | **Critical (P1)**: 4 | **Important (P2)**: 8
> **Audited**: 2026-09-09
> **Layer**: project (project-wide)
> **ISO Grounding**: Maintainability.Analysability + Interaction Capability.Self-descriptiveness

---

## Summary

Documentation is critically thin for a React + Netlify Functions + Supabase production app. The README is CRA-script oriented and stale (last commit 2024-01-31), with no prerequisites, install/.env/API setup, or architecture section. There is no OpenAPI, CONTRIBUTING/CHANGELOG/LICENSE, runbooks, monitoring guide, or schema docs; `ONBOARDING.md` and a short README CI/CD section only partially cover contributor and deploy topics. Env vars are partially inventoried in `.env.example` but miss `REACT_APP_RADAR_API_URL`.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Product | FTR4DRR SPA + Netlify API; live `https://drrtechradar.org/` (`README.md`, `package.json` homepage) |
| Interfaces | SPA HashRouter; `netlify/functions/api.js` behind `/api/*` (`netlify.toml`); Cypress under `cypress/e2e/` |
| Data contracts | No OpenAPI/migrations/SQL in-repo; resource→table maps in `api.js` (`PUBLIC_RESOURCES`, `PUBLIC_DETAIL_RESOURCES`) |
| Auth | Supabase JWT Bearer + `user_roles.admin` (`requireAdmin` in `api.js`); sessionStorage on frontend |
| AI/ML | None at runtime — DOC-017–020 N/A |
| Ops | GH Pages (`publish.yml`), staging PM2 (`deploy.yml` on `staging`), Netlify functions, Supabase heartbeat |
| Checkpoint status | skipped_unattended (single-domain request) |

### Tech-trigger applicability

| Trigger | Matched? | Source |
|---------|----------|--------|
| `universal` | Yes | All projects |
| `any_api` | Yes | `api` layer `tech_tags` + `netlify/functions/api.js` |
| `any_web_framework` | Yes | `frontend` layer `react` / `any_web_framework` |
| `any_database` | Yes | Supabase/Postgres via Netlify env |
| `any_ai_ml` / langchain / openai / anthropic / airflow / dbt | No | Project context: no runtime AI/ML |

---

## Inventory notes (existence)

| Artifact | Present? | Path / note |
|----------|----------|-------------|
| OpenAPI / Swagger | **No** | No `openapi.*` / `swagger.*` / `docs/api/` |
| Runbooks | **No** | No `docs/runbooks/`, `docs/ops/`, incident docs |
| Architecture docs / ADRs | **No** | No `docs/architecture*`, `ADR/`, numbered ADRs, diagrams folder |
| `docs/` tree | **No** | Absent at repo root |
| LICENSE | **No** | Not at repo root |
| CONTRIBUTING | **No** | Partial substitute: `ONBOARDING.md` |
| CHANGELOG / release tags | **No** | No `CHANGELOG.md`; `git tag -l` empty |
| Cypress notes | **No** | `cypress.config.ts` stub only; no Cypress README |

---

## Results

### PASS (0 items)

_None._

### PARTIAL (6 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DOC-004 | Contributing Guide | `ONBOARDING.md` covers branch-from-`develop`, `feature/x` naming, PR into `develop`, Prettier/React style | No `CONTRIBUTING.md`; no commit conventions; no testing/coverage expectations; CI mismatch (workflows use Node 16.20.1, staging is `staging` not `develop`); last touch ~2022 | medium |
| DOC-009 | Deployment Guide | README **CI/CD** describes GH Pages via `publish.yml`, staging via Digital Ocean, PR CI via `develop.yml`; `netlify.toml` notes API-only Netlify deploy; workflows exist | No rollback; weak secrets guidance; README says staging on `develop` but `deploy.yml` triggers on `staging`; Netlify API deploy not documented as operator steps | high |
| DOC-010 | Environment Variables | `.env.example` lists `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS`, comments for `REACT_APP_GLITCHTIP_DSN` | `REACT_APP_RADAR_API_URL` used in `src/helpers/apiClient.ts` undocumented; incomplete required/optional/defaults matrix | high |
| DOC-014 | Code Comments Quality | Useful “why” comments in `api.js` (CORS Origin, privileged client after sign-in); scattered JSDoc (`glitchtip.ts`, `locationUtils.ts`, `RequireAdmin.tsx`, `ErrorBoundary.tsx`) | Inconsistent module headers; TODOs in `src/pages/Radar.tsx`, `QuadrantView.tsx`, `QuadrantHorizonList.tsx` | low |
| DOC-015 | Configuration Documentation | Inline comments in `.env.example` and `netlify.toml`; `app.config.json` present for PM2 | No `docs/configuration.md`; PM2/`app.config.json` and CRA build-time vs Netlify runtime split poorly explained | medium |
| DOC-016 | Database Schema Documentation | `PUBLIC_RESOURCES` / `PUBLIC_DETAIL_RESOURCES` map routes→tables/columns in `api.js` | No ERD, migrations, data dictionary, or schema doc; relationships implied only | medium |

### FAIL (10 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| DOC-001 | README Completeness | `README.md` lacks real product description, prerequisites (Node), setup (install/.env), architecture; mostly CRA scripts + UNV credits. `git log -1 -- README.md` → **2024-01-31** (>6 months stale) | high | P1 |
| DOC-002 | Setup Instructions | No clone→run guide covering `yarn install`, `.env.example`, local Netlify functions, Supabase, or Node 16.20.1 (as in workflows). Scripts exist in `package.json` but are not wired into a setup walkthrough | high | P1 |
| DOC-003 | Architecture Documentation | No `docs/architecture*`, ADRs, or design docs. Gitflow image in README is process-only. Split SPA (GH Pages) / API (Netlify) / Supabase only visible in code/`netlify.toml` comments | medium | P2 |
| DOC-005 | Changelog / Release Notes | No `CHANGELOG.md` / `HISTORY.md`; no git tags; no evidence of semantic-release/standard-version | medium | P2 |
| DOC-006 | API Documentation | Large surface in `api.js` (`health`, `public/*`, `auth/*`, `admin/*`) with **no** OpenAPI/Swagger or `docs/api/` | high | P1 |
| DOC-007 | API Examples | No request/response examples, Postman/Insomnia, or `.http` files | medium | P2 |
| DOC-008 | Authentication Documentation | Auth implemented (`POST auth/sign-in`, Bearer + `requireAdmin`, roles) but no README/docs/OpenAPI `securitySchemes` describing credential flow, headers, lifecycle, or roles | high | P1 |
| DOC-011 | Incident Response Runbook | No `docs/runbooks/`, on-call, or troubleshooting beyond generic CRA README | medium | P2 |
| DOC-012 | Monitoring & Alerting Guide | GlitchTip wired in `src/helpers/glitchtip.ts` + `publish.yml` secret; heartbeat in `supabase-heartbeat.yml` — **no** monitoring/alerting docs, alert inventory, or response procedures | medium | P2 |
| DOC-013 | Backup & Recovery | Supabase persists data; no backup/retention/restore docs or in-repo backup config | medium | P2 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| DOC-017 | AI/ML Model Documentation | Tech trigger `any_ai_ml` — no runtime AI/ML |
| DOC-018 | Prompt Documentation | Tech triggers langchain/openai/anthropic/`any_ai_ml` — not present |
| DOC-019 | AI Decision Documentation | Tech trigger `any_ai_ml` — not present |
| DOC-020 | Data Pipeline Documentation | Tech triggers `any_ai_ml`/airflow/dbt — not present |

---

## Remediation Roadmap

### P1 — Critical (high severity FAIL)

#### DOC-001: README Completeness

**Current state:** Script/credits README; stale since 2024-01-31.  
**Required state:** Description, prerequisites (Node 16.20.x / Yarn), setup, dev commands (`test:unit` / `test:api` / `test:e2e`), architecture overview of SPA + Netlify + Supabase.  
**Fix:** Rewrite `README.md` with those five sections; link to `ONBOARDING.md` and a new architecture page.  
**Effort:** Short

#### DOC-002: Setup Instructions

**Current state:** No end-to-end local setup.  
**Required state:** Step-by-step: clone → Node version → `yarn install` → copy `.env.example` → Netlify env for functions → `yarn start` / `netlify dev` → smoke `GET /api/health`.  
**Fix:** Add `docs/setup.md` (or README section) aligned with `package.json` scripts and `.github/workflows/*`.  
**Effort:** Short

#### DOC-006: API Documentation

**Current state:** Contract only in `api.js` maps/handlers.  
**Required state:** OpenAPI 3 covering public, auth, and admin routes (≥80% of paths).  
**Fix:** Add `docs/api/openapi.yaml` (or generate from annotated routes); publish link from README.  
**Effort:** Medium

#### DOC-008: Authentication Documentation

**Current state:** Behavior only in code (`auth/sign-in`, Bearer, `user_roles`).  
**Required state:** Document method, how to obtain tokens, `Authorization: Bearer`, expiry/`expires_at`, admin vs user roles.  
**Fix:** `docs/auth.md` + OpenAPI `securitySchemes`; cross-link from README.  
**Effort:** Short

### P2 — Important

#### DOC-003: Architecture Documentation

Document SPA (GH Pages) ↔ Netlify Functions ↔ Supabase; auth boundary; CORS/`ALLOWED_ORIGINS`. Add at least 2 ADRs (e.g., HashRouter/GH Pages; service-role on Netlify).  
**Effort:** Medium

#### DOC-005: Changelog / Release Notes

Adopt Keep a Changelog or release tags + GitHub Releases for next 3+ versions.  
**Effort:** Short

#### DOC-007: API Examples

Add examples in OpenAPI and/or `docs/examples/` (sign-in, public list, admin approve, error 401/403).  
**Effort:** Short

#### DOC-009: Deployment Guide

Document master→GH Pages, staging→PM2, Netlify API; rollback (`gh-pages` prior commit / Netlify rollback / PM2); secrets (`REACT_APP_GLITCHTIP_DSN`, Supabase, `ALLOWED_ORIGINS`); fix README branch mismatch (`staging` vs `develop`).  
**Effort:** Short

#### DOC-010: Environment Variables

Add `REACT_APP_RADAR_API_URL` to `.env.example` with description; mark each var required/optional/default.  
**Effort:** Quick win

#### DOC-011 / DOC-012: Runbook + Monitoring

Minimal runbook: `/api/health` fail, Supabase pause, Netlify function errors, GlitchTip triage, staging PM2 restart; document heartbeat vs real uptime.  
**Effort:** Medium

#### DOC-013: Backup & Recovery

Document Supabase managed backups (frequency/retention/region) and restore steps; note last restore test.  
**Effort:** Short

### P3 — Improvement

| Check | Remediation |
|-------|-------------|
| DOC-004 | Promote `ONBOARDING.md` → `CONTRIBUTING.md`; add commit format, required tests (`yarn test` / unit+api+e2e), align with CI |
| DOC-014 | Prefer “why” comments on non-obvious admin/public path logic; clear or ticket TODOs |
| DOC-015 | Document `app.config.json`, Netlify vs CRA config split in `docs/configuration.md` |
| DOC-016 | Add `docs/data-model.md` or ERD for `tr_projects`, `project_data`, `technologies`, `user_roles`, etc. |

---

## Score detail

```
applicable = 16  (DOC-001..016)
score_pct  = (0 + 0.5×6) / 16 × 100 = 18.8%
rating     = Critical (0–29%)
```

| Result | Count |
|--------|-------|
| PASS | 0 |
| PARTIAL | 6 |
| FAIL | 10 |
| N/A | 4 |
| **Total checks** | **20** |

---

## Positive signals

- README documents yarn scripts, pretest/Prettier, git hook setup, and high-level CI/CD hosts.
- `.env.example` exists and separates server secrets from CRA build-time vars.
- `netlify.toml` comments clarify API-only Netlify vs GH Pages SPA.
- `api.js` contains non-trivial explanatory comments around CORS and auth client reuse.
- Workflows under `.github/workflows/` are inspectable as living deploy evidence.
