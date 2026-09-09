---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "maintainability"
quality_attribute_name: "Maintainability"
iso_characteristic: "Maintainability"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 5
  partial: 7
  fail: 3
  na: 7
  applicable: 15
  score_pct: 56.7
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 2
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

# Maintainability Audit — API

> **Score**: 56.7% · Adequate
> **Results**: 5 pass · 7 partial · 3 fail · 7 n/a
> **Blockers**: 0 | **Critical**: 2 | **Important**: 1
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: Maintainability

---

## Summary

The Netlify Functions API is testable and wired into CI (`yarn test:api` via `yarn test`), with env-driven config and a clear single-handler surface. Maintainability is held back by a monolithic `exports.handler` (~300 lines), no lint/format/type tooling on `netlify/functions/`, no URL API versioning, and no in-repo database migration framework for Supabase/Postgres schema.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Single serverless handler `netlify/functions/api.js` proxied as `/api/*` (`netlify.toml`) |
| Interfaces | Public GETs, auth sign-in/user create, admin CRUD for projects/info/disaster-events; `GET /api/health` |
| Data contracts | Resource maps + field allowlists in handler; no OpenAPI; Supabase tables |
| AI/ML behavior | None — MNT-021/022 N/A |
| Checkpoint status | Unattended API-focused audit (maintainability / flexibility / compatibility only) |

**Trigger overrides:** none. N/A checks follow domain tech triggers (python/typescript/AI) and MNT-016 frontend-framework list.

---

## Results

### PASS (5 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| MNT-004 | Dependency Management | `yarn.lock` committed; `.github/dependabot.yml` weekly npm + monthly actions |
| MNT-008 | Version Control Hygiene | `.gitignore` excludes `node_modules`, `coverage`, `build`, `.env` / `.env.*` with `!.env.example`, `.netlify/` |
| MNT-009 | CI Pipeline Exists | `.github/workflows/develop.yml` on PR to `master`/`develop`: install, lint, build, `yarn test` |
| MNT-010 | Automated Testing in CI | `package.json` `"test"` runs `test:unit` + `test:api` + `test:e2e`; `test:api` uses `jest.api.config.js`; no `continue-on-error` on test step |
| MNT-018 | Configuration Management | `.env.example` documents `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS`; `configuredClient()` throws if URL/secret missing; secrets not hardcoded in `api.js` |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| MNT-001 | Linter Configuration | Root ESLint + `yarn lint` in CI | `lint` is `eslint src/` only — `netlify/functions/api.js` not linted; `.eslintrc.json` is TS/React-oriented | high |
| MNT-002 | Code Formatter | `.prettierrc`; `prettify`/`format` scripts; pretest runs Prettier | Scripts target `src/` only — API JS not format-gated | medium |
| MNT-005 | Project Structure Convention | `netlify/functions/` + `tests/api/` (tests kept out of deploy root) | Single 434-line handler; no modules for auth/public/admin | medium |
| MNT-006 | Dead Code Detection | No TODOs / commented-out blocks in `api.js` | No unused-import / dead-code rules applied to API path | low |
| MNT-007 | Code Complexity | Helper functions short (`allowedOrigin`, `response`, `requireAdmin`) | `exports.handler` ~lines 167–471 with deep nesting; no complexity lint on API | medium |
| MNT-011 | Pre-commit Hooks | `gitHooks/hooks/pre-push` runs `yarn test` (includes API) | Manual `cp` install per README; no Husky/`prepare` automation | medium |
| MNT-012 | Consistent Development Environment | `test:api` / `test:api:coverage` scripts; `netlify.toml` `[dev]` | No `.editorconfig`; README does not document Netlify Functions / env for API | medium |

### FAIL (3 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| MNT-017 | Separation of Concerns | Routing, auth, validation, Supabase queries, and response shaping all live in one handler | high | P1 |
| MNT-019 | API Versioning Strategy | Paths are `/api/public/...`, `/api/auth/...`, `/api/admin/...` with no `/v1` or header versioning; no deprecation policy | medium | P2 |
| MNT-020 | Database Migration Framework | No `supabase/migrations`, Prisma/Knex/Alembic, or SQL migration tree in repo; schema ownership is external to Supabase console | high | P1 |

### N/A (7 items)

| Check ID | Item | Reason |
|----------|------|--------|
| MNT-003 | Type Safety | Triggers typescript/python — API is plain Node JS |
| MNT-013 | Python Package Structure | python |
| MNT-014 | Python Import Organization | python |
| MNT-015 | TypeScript Strict Configuration | typescript |
| MNT-016 | Package.json Scripts | Triggers react/vue/angular/nextjs/express — not on api tech_tags (note: `test:api` exists nonetheless) |
| MNT-021 | Prompt Management | any_ai_ml |
| MNT-022 | Model Configuration Management | any_ai_ml |

---

## Remediation Roadmap

### P1 — Critical (fix before production hardening)

#### MNT-017: Separation of Concerns

**Current state:** One `exports.handler` owns all routes and DB access.
**Required state:** Route/adapters vs services vs data access separated and unit-testable.
**Fix:** Split into `routes/`, `services/`, `db/` (or at least `public.js` / `admin.js` / `auth.js` required by a thin handler). Keep Netlify entry as `api.js` re-export.
**Effort:** Medium

#### MNT-020: Database Migration Framework

**Current state:** No versioned schema in git.
**Required state:** Committed Supabase/SQL migrations applied in deploy/docs.
**Fix:** Add `supabase/migrations/` (or equivalent) and document apply steps for each environment.
**Effort:** Medium

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| MNT-019 | API Versioning | Introduce `/api/v1/...` (or Accept versioning) before next breaking response change; document sunset policy | Short |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| MNT-001 | Linter | Add `eslint netlify/functions tests/api` (or flat config override for Node CJS) to CI | Short |
| MNT-002 | Formatter | Extend `prettify`/`format` to `netlify/` and `tests/api/` | Quick win |
| MNT-005 | Structure | Extract resource maps + admin handlers into modules | Medium |
| MNT-006 | Dead code | Enable `no-unused-vars` on API lint config | Quick win |
| MNT-007 | Complexity | Cap handler size; optional `complexity` ESLint rule ≤15 | Short |
| MNT-011 | Hooks | Automate via Husky `prepare` or document required `cp` in CONTRIBUTING | Short |
| MNT-012 | Dev env | Add `.editorconfig`; README section for Netlify Functions + `.env.example` | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
