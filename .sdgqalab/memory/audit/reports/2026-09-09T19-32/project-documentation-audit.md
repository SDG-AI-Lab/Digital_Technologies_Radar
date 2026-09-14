---
schema: sdgqalab/audit@3
layer: project
layer_type: project-wide
quality_attribute: documentation
quality_attribute_name: Documentation
iso_characteristic: "ISO 25010 Maintainability.Analysability + Interaction Capability.Self-descriptiveness"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 0
  partial: 5
  fail: 11
  na: 4
  applicable: 16
  score_pct: 15.6
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 4
  p2_important: 9
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

# Documentation Audit — Project-Wide

> **Score**: 15.6% · Critical
> **Results**: 0 pass · 5 partial · 11 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 4 | **High**: 9
> **Audited**: 2026-09-09
> **Layer**: project (project-wide)
> **ISO Grounding**: ISO/IEC 25010:2023 Maintainability.Analysability + Interaction Capability.Self-descriptiveness; ISO/IEC 25023

---

## Summary

Documentation for the UNDP Digital Technologies Radar (FTR4DRR) is **critically insufficient** for production operation. The root `README.md` is a Create React App scaffold extended with CI/CD notes and a large UN Volunteers contributor section, but it lacks a real product description, local setup prerequisites, environment-variable guidance, and architecture overview. Operational knowledge (deployment promotion, rollback, incident response, monitoring, Supabase backup/restore) is not written down; API consumers have no OpenAPI spec, examples, or auth guide. A generated `.sdgqalab/tech-stack.md` and partially commented `.env.example` provide limited signal, but onboarding a new developer or on-call operator from docs alone is not feasible today.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | FTR4DRR — browse/search disaster-risk technologies and projects on a radar/map with admin CRUD. Live at `https://drrtechradar.org/` (`package.json` homepage, `project-context.md`). |
| Interfaces | React HashRouter SPA (`src/App.tsx`); Netlify Functions API at `undp-drr-radar-api.netlify.app/api` (`netlify/functions/api.js`, `src/helpers/apiClient.ts`); Cypress E2E; daily `supabase-heartbeat.yml` cron. |
| Data contracts | Supabase Postgres via service role (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`); no in-repo migrations or schema docs. Client catalog cache in `localStorage`. |
| AI/ML behavior | None at runtime. Product taxonomy uses AI branding only. DOC-017–DOC-020 are N/A. |
| Checkpoint status | pending — user has not yet confirmed or corrected this brief. |

---

## Results

### PASS (0 items)

_No checks achieved full PASS in this audit._

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DOC-003 | Architecture Documentation | `.sdgqalab/tech-stack.md` (generated) lists frontend, API, database, and hosting components with versions. | No component interaction diagram, no ADRs, no `docs/architecture.md`, no explanation of SPA ↔ Netlify API ↔ Supabase data flow or auth boundary. | medium |
| DOC-009 | Deployment Guide | `README.md` CI/CD section names workflows (`publish.yml`, `deploy.yml`, `develop.yml`), prod URL (`drrtechradar.org`), and staging IP. Workflow YAML files exist and are readable. | Staging branch documented as `develop` but `deploy.yml` triggers on `staging`. No rollback procedure, secrets-injection guide, or environment-promotion diagram. No operator runbook. | high |
| DOC-010 | Environment Variables Documentation | `.env.example` lists `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS`, and commented `REACT_APP_GLITCHTIP_DSN` with brief inline notes. | `REACT_APP_RADAR_API_URL` used in `src/helpers/apiClient.ts` but absent from `.env.example`. No required/optional matrix, no per-environment table (local / staging / prod / Netlify). Server vs build-time vars not explained. | high |
| DOC-014 | Code Comments Quality | Targeted JSDoc in `src/helpers/glitchtip.ts` and `src/helpers/apiClient.ts`. Only ~5 TODO markers in `src/` (non-critical paths such as `Radar.tsx`, `QuadrantView.tsx`). | No module-level docs on entry points (`src/App.tsx`, `src/index.tsx`). Inconsistent comment coverage across components. | low |
| DOC-015 | Configuration Documentation | Inline comments in `.env.example`. `netlify.toml`, `app.config.json`, and workflow YAML encode deployment config. | No `docs/configuration.md`. `netlify.toml` redirects/headers undocumented. PM2 staging config (`app.config.json`) unexplained. Feature flags and build-time vs runtime config not catalogued. | medium |

### FAIL (11 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| DOC-001 | README Completeness | `README.md` exists with CRA scripts, git-hook setup, CI/CD overview, and prod URL. **Missing**: FTR4DRR product description, prerequisites (Node 16.20.1 per workflows), `yarn install`, env-var setup, architecture section. Last updated 2024-01-31 (>6 months stale). ~70% of file is UNV contributor tables. | high | P1 |
| DOC-002 | Setup Instructions | No step-by-step clone → install → configure → run guide. `yarn start`/`yarn test` documented but not `yarn install`, `.env` creation, or API URL configuration. `ONBOARDING.md` covers conventions only. | high | P1 |
| DOC-004 | Contributing Guide | No `CONTRIBUTING.md` or `docs/contributing.md`. `ONBOARDING.md` has branch naming and style notes but lacks PR process, commit conventions, testing requirements, and CI alignment. | medium | P2 |
| DOC-005 | Changelog / Release Notes | No `CHANGELOG.md`, `HISTORY.md`, or GitHub Releases with categorized entries. `package.json` version `0.1.0` with no version history. | medium | P2 |
| DOC-006 | API Documentation | Netlify Functions API (`netlify/functions/api.js`) exposes public endpoints. No `openapi.yaml`/`swagger.json`, no `/docs` route, no manual `docs/api/` reference. | high | P1 |
| DOC-007 | API Examples | No request/response examples in docs. No Postman collection, `.http` files, or `docs/examples/` directory. OpenAPI `example` fields absent (no spec exists). | medium | P2 |
| DOC-008 | Authentication Documentation | JWT Bearer auth implemented (`src/components/shared/helpers/auth.ts`, `apiClient.ts`; API enforces `user_roles.admin`). No `docs/auth.md`, no README auth section, no `securitySchemes` in OpenAPI. Credential acquisition and token lifecycle undocumented. | high | P1 |
| DOC-011 | Incident Response Runbook | No `docs/runbooks/`, `docs/ops/`, or incident/on-call docs. No escalation path, diagnostic commands, or post-mortem process. | medium | P2 |
| DOC-012 | Monitoring & Alerting Guide | GlitchTip (`REACT_APP_GLITCHTIP_DSN`) live in prod (`publish.yml`). `supabase-heartbeat.yml` cron pings `/api/health` daily. Neither is documented for operators — no alert inventory, dashboard links, or response procedures. | medium | P2 |
| DOC-013 | Backup & Recovery Procedures | Supabase Postgres stores persistent data. No `docs/backup*.md`, disaster-recovery docs, or documented restore procedure. Supabase managed backups not referenced. | medium | P2 |
| DOC-016 | Database Schema Documentation | No ERD, `docs/database.md`, or in-repo migrations. Supabase schema lives outside the repo with no data dictionary. | medium | P2 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| DOC-017 | AI/ML Model Documentation | No AI/ML models at runtime (`project-context.md`). |
| DOC-018 | Prompt Documentation | No LLM prompts or AI integrations. |
| DOC-019 | AI Decision Documentation | No AI-driven decision boundaries. |
| DOC-020 | Data Pipeline Documentation | No Airflow/dbt/ETL pipelines; triggers `[any_ai_ml, airflow, dbt]` not matched. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None — no Critical-severity FAIL items. Documentation gaps are severe but classified P1/P2 per scoring rules._

---

### P1 — Critical (fix before production)

#### DOC-001: README Completeness

**Current state:** `README.md` is CRA boilerplate plus CI notes and UNV credits. Missing product purpose, prerequisites, setup, env vars, and architecture. Stale since 2024-01-31; staging branch mismatch (`develop` vs `staging`).
**Fix:** Replace the opening section with an FTR4DRR overview, add Prerequisites (Node 16.20.1, Yarn), Setup (`yarn install`, copy `.env.example`), Environment Variables table, Architecture diagram (SPA → Netlify API → Supabase), and correct branch strategy (`master` → prod, `staging` → DO, PRs to `master`/`develop`). Move UNV section to `docs/CONTRIBUTORS.md`.
**Effort:** Short

#### DOC-002: Setup Instructions

**Current state:** No reproducible local-setup path documented.
**Fix:** Add a `## Local Development` section to README (or `docs/setup.md`):

```bash
git clone https://github.com/SDG-AI-Lab/Digital_Technologies_Radar.git
cd Digital_Technologies_Radar
nvm use 16   # or install Node 16.20.1
yarn install
cp .env.example .env.local
# Optional: point API at staging or local Netlify dev
# REACT_APP_RADAR_API_URL=https://undp-drr-radar-api.netlify.app/api
yarn start   # http://localhost:3000
```

Document that admin flows require a running API with valid Supabase credentials.
**Effort:** Quick win

#### DOC-006: API Documentation

**Current state:** Single `netlify/functions/api.js` handler with no machine-readable spec.
**Fix:** Create `docs/api/openapi.yaml` (or add `swagger-jsdoc` annotations) covering at minimum: `GET /health`, `POST /auth/sign-in`, CRUD routes for projects/technologies/disasters, admin routes. Publish via README link or Netlify redirect to a static Swagger UI.
**Effort:** Medium

#### DOC-008: Authentication Documentation

**Current state:** Auth logic exists in code only.
**Fix:** Add `docs/authentication.md` describing: sign-in flow (`POST /auth/sign-in`), Bearer header format, token storage (`sessionStorage`), 401 handling, admin role (`user_roles.admin`), and that `RequireAdmin` is UI-only. Cross-link from README and OpenAPI `securitySchemes`.
**Effort:** Short

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DOC-004 | Contributing Guide | Create `CONTRIBUTING.md` from `ONBOARDING.md` content plus PR template, branch rules (`feature/*` from `develop`), required CI checks (`develop.yml`: lint, build, test), and commit style. | Short |
| DOC-005 | Changelog | Add `CHANGELOG.md` (Keep a Changelog format). Tag releases on `master` deploys; document breaking API changes. | Quick win |
| DOC-007 | API Examples | Add `docs/api/examples.http` or Postman collection with health, sign-in, list projects, and 401/404 error samples. | Short |
| DOC-009 | Deployment Guide | Create `docs/deployment.md`: env promotion (`develop` → PR → `master` → GH Pages; `staging` → DO via `deploy.yml`), rollback (re-deploy prior GH Pages commit / `pm2 restart` on staging), secrets in GitHub/Netlify env. Fix README staging branch text. | Medium |
| DOC-010 | Environment Variables | Extend `.env.example` with `REACT_APP_RADAR_API_URL`, required/optional flags, and link to `docs/configuration.md`. | Quick win |
| DOC-011 | Incident Response Runbook | Create `docs/runbooks/incident-response.md`: on-call contact, GlitchTip triage, `/api/health` check, Supabase dashboard, communication template. | Medium |
| DOC-012 | Monitoring Guide | Document GlitchTip project URL, heartbeat workflow purpose/failure alerts, and key SLIs (API 5xx rate, health cron success). | Short |
| DOC-013 | Backup & Recovery | Document Supabase backup schedule, PITR if enabled, restore steps, and annual recovery-test cadence. | Medium |
| DOC-016 | Database Schema | Export Supabase schema to `docs/database/schema.md` or ERD; document core tables (projects, technologies, disasters, user_roles) and relationships. | Medium |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DOC-003 | Architecture Documentation | Expand `.sdgqalab/tech-stack.md` into `docs/architecture.md` with Mermaid diagram; add ADRs for HashRouter-on-GH-Pages and Netlify Functions API choice. | Medium |
| DOC-014 | Code Comments Quality | Add module headers to `App.tsx`, `apiClient.ts`, and `netlify/functions/api.js`; resolve or ticket remaining TODOs. | Short |
| DOC-015 | Configuration Documentation | Document `netlify.toml` redirects, `public/_headers`, and `app.config.json` PM2 settings in `docs/configuration.md`. | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state

**Current posture:** 0/4 acceptance criteria met. Documentation score 15.6% (Critical) — **not production-ready** from a documentation standpoint.

---

## Scorecard

**Documentation · 15.6% · Critical** — 0 pass, 5 partial, 11 fail, 4 n/a (16 applicable)
