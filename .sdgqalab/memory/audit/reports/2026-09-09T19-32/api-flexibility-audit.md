---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: flexibility
quality_attribute_name: Flexibility
iso_characteristic: "ISO 25010 Flexibility (adaptability, scalability, installability, replaceability)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 3
  partial: 5
  fail: 4
  na: 6
  applicable: 12
  score_pct: 45.8
  rating: "Low"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 3
  p3_improvement: 6

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Flexibility Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 45.8% · Low
> **Results**: 3 pass · 5 partial · 4 fail · 6 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 3
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Flexibility · ISO/IEC 25023

---

## Summary

The API layer is horizontally scalable and stateless by construction — Netlify Functions replay the handler across arbitrary instances, no filesystem writes exist, no in-memory state persists between invocations, and all shared state lives in Supabase. Environment-based configuration is clean and documented. Everything else scores low: there is no OpenAPI / GraphQL contract to code against (any consumer breaks silently on shape changes), no infrastructure-as-code so a new environment must be assembled by hand from Netlify + Supabase UIs, no feature-flag mechanism, and no meaningful abstraction over the Supabase SDK (which is called directly from `api.js` in ~40 places, making provider replacement a rewrite). Nothing is a launch blocker on this axis, but the "how do we spin up a staging or DR environment quickly" story is genuinely unanswered.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Managed serverless API — Netlify hosts, Supabase persists. |
| Interfaces | Single Netlify Function `netlify/functions/api.js`; `netlify.toml` redirects `/api/*` → `/.netlify/functions/api/:splat`. |
| Data contracts | Inline in the handler; no external schema. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. |

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| FLX-003 | Environment-Based Configuration | `api.js` reads only `process.env.SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS`. `.env.example` documents all three with placeholders and safety notes. `configuredClient` throws `Server configuration is incomplete` on first use if either Supabase var is missing (fail-fast). `.env` in `.gitignore` lines 17–18. |
| FLX-005 | Stateless Application Design | No `fs.writeFile*`, `fs.appendFile*`, or `os.tmpdir` in `netlify/functions/`. No in-memory caches, no module-level mutable state that carries between requests. All persistent state lives in Supabase. Sessions are JWT (client-held). |
| FLX-006 | Horizontal Scaling Readiness | Netlify runs the function across arbitrary instances by default; the code has no singleton assumptions, no cron-in-process, no local locks, no WebSocket state. Deployment is atomic (Netlify Function bundle) — no migrations run on instance boot. |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| FLX-004 | Multi-Environment Support | `ALLOWED_ORIGINS` is a comma-separated allowlist so a single value works for prod (`https://drrtechradar.org`) plus preview/staging origins. Netlify supports per-deploy-context environment variables (Production / Deploy Previews / Branch deploys) which can differ per environment. | The staging vs production split is not represented in the repository — no `netlify.staging.toml`, no environment-specific config files, no `.env.staging.example`. A new maintainer cannot see from the repo alone which env var values live where, and preview deploys pointing at the **production** Supabase URL is a real risk (no automatic isolation). | high |
| FLX-007 | Database Scalability | Supabase provides PgBouncer server-side (transaction pool on port 6543) and horizontal PostgREST scaling. Read paths use FK-embedded selects (single query per request). | No explicit client pool configuration, no read-replica setup, no verifiable index coverage (migrations absent). See PER-002 / PER-006. | medium |
| FLX-013 | Setup Documentation | README exists for the project. `.env.example` documents the three API env vars. `package.json` scripts cover `test:api` and `test:api:coverage`. | No `docs/api/` or README section explaining how to run the function locally (`netlify dev`), no `dev:api` script, no walk-through of "clone → install → link → run". A new engineer must reverse-engineer the local dev workflow. | medium |
| FLX-014 | Dependency Abstraction | The Supabase JS client is a single library dependency; secrets are read via `process.env`; CORS logic is centralized in `allowedOrigin`; response building is centralized in `response()`. | The Supabase SDK is called **directly** from `api.js` in ~40 sites (`.from().select()`, `.auth.getUser`, `.auth.signInWithPassword`, `.auth.admin.createUser`, etc.). No `PersistenceGateway`/`repositories/` layer. Swapping to another Postgres-backed provider (e.g., self-hosted PostgREST, Neon + custom auth) would be a codebase-wide edit. Tests confirm the coupling — `tests/api/api.test.js` mocks the full Supabase client surface. | medium |
| FLX-016 | CI/CD Pipeline Portability | Build & test are portable (`yarn install`, `yarn lint`, `yarn build`, `yarn test`). Deployment to Netlify is a git push, driven by Netlify's own git integration — no bespoke deploy scripts in-repo to migrate. | The secret-scan step and the `git config --global url."https://${{ secrets.PAT }}...` step are GitHub-specific. There is no `Makefile`/`justfile` to abstract common commands. Local execution of the workflow is not documented (no `act` mention). | low |

### FAIL (4 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| FLX-010 | Feature Flags | No feature-flag library (LaunchDarkly, Unleash, Flagsmith) and no env-var-driven feature toggles in `api.js`. Every functional change requires a code deploy. | low | P3 |
| FLX-011 | Plugin/Extension Architecture | Monolithic handler with no middleware chain, no event/hook system, no DI. Adding a cross-cutting concern (e.g., audit logging, rate limiting, correlation IDs) means editing `api.js` directly. | low | P3 |
| FLX-012 | API Contract Stability | No `openapi.yaml`, no `schema.graphql`, no `.proto`, no auto-generated docs. Request/response shapes exist only in the handler and in the Jest mocks. Consumers (the SPA + any future integration) have no machine-readable contract, no versioned schema, and no deprecation channel. | medium | P2 |
| FLX-015 | Infrastructure as Code | No `terraform/`, `infra/`, `cdk/`, or `pulumi/` directory. Netlify site config, environment variables, custom domain, and Supabase project settings (schema, RLS, roles, storage buckets, extensions) live only in vendor UIs. Reproducing the environment in a DR scenario requires screenshot-driven memory. | medium | P2 |

### N/A (6 items)

| Check ID | Item | Reason |
|----------|------|--------|
| FLX-001 | Containerization | Netlify Functions runtime is managed; no Dockerfile applies to the API layer. |
| FLX-002 | Docker Compose for Local Development | No Docker in scope. |
| FLX-008 | Async Task Queue | No long-running work in the API (see PER-005). |
| FLX-009 | Load Balancer Configuration | Netlify's edge handles TLS + load balancing transparently. |
| FLX-017 | LLM Provider Abstraction | No LLM. |
| FLX-018 | Model Configuration Flexibility | No AI/ML config. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

#### FLX-012: API Contract Stability

**Current state:** No published API schema; consumers depend on de-facto shapes read from the SPA source.

**Required state:** A machine-readable OpenAPI 3.1 spec that covers every route in `api.js`, published alongside the function and validated against the implementation in CI.

**Fix:** Author `openapi.yaml` by hand at first (the surface is small — ~20 routes) and validate it in tests. Optionally, generate a runtime router from the spec later.

```yaml
# openapi.yaml (excerpt)
openapi: 3.1.0
info:
  title: UNDP DRR Radar API
  version: 1.0.0
servers:
  - url: https://undp-drr-radar-api.netlify.app/api
paths:
  /health:
    get:
      summary: Health probe (queries dataset_version)
      responses:
        '200':
          description: Healthy
          content:
            application/json:
              schema:
                type: object
                required: [status]
                properties:
                  status: { const: ok }
        '500':
          $ref: '#/components/responses/ServerError'
  /public/technologies:
    get:
      summary: List technologies
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Technology' }
components:
  responses:
    ServerError:
      description: Server-side error
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
  schemas:
    Technology:
      type: object
      required: [name, slug]
      properties:
        name: { type: string }
        description: { type: string, nullable: true }
        img_url: { type: string, format: uri, nullable: true }
        slug: { type: string }
        source: { type: string, nullable: true }
    Error:
      type: object
      required: [error]
      properties:
        error: { type: string }
```

Add a Jest test that walks the spec and validates every fixture response against the schema (e.g., using `ajv`). Publish the spec at `/api/openapi.yaml` (add a static route in `api.js` or serve via `netlify.toml` `[[headers]]`). Combine with MNT-019 to introduce `/api/v1/` as the versioned base.

**Effort:** Medium (2 days for the initial spec + validation test).

#### FLX-015: Infrastructure as Code

**Current state:** Netlify + Supabase configuration live only in the vendor UIs.

**Fix:** Introduce IaC in two tracks:

1. **Netlify** — commit a `netlify.toml` that captures every non-secret setting (already partially done — `[build]`, `[[redirects]]`, `[[headers]]`, `[dev]` are there). Add `[context.production.environment]`, `[context.branch-deploy.environment]`, `[context.deploy-preview.environment]` blocks referencing the required env-var names (values still live in Netlify's secret store) so a fresh Netlify site can be linked to this repo without hunting for context-specific config.

2. **Supabase** — use the Supabase CLI to version-control the DB schema (see MNT-020 / REL-016) plus `supabase/config.toml` for project-level settings. For infrastructure that Supabase CLI does not cover (project creation, plan tier, region), keep a `docs/infra/supabase-setup.md` runbook. Longer term consider the community-maintained [Terraform provider for Supabase](https://registry.terraform.io/providers/supabase/supabase/latest/docs) once it graduates from beta.

**Effort:** Medium (2–3 days for the first pass).

#### FLX-004: Multi-Environment Support

**Fix:** Formalize the environment split.

* Create `supabase-staging` (new project) and `supabase-prod` (existing).
* In Netlify, set `SUPABASE_URL`/`SUPABASE_SECRET_KEY` per context (Production → prod project, Deploy Previews & Branch deploys → staging).
* Add `[context.production.environment]` and `[context.branch-deploy.environment]` scaffolding to `netlify.toml` documenting the required variable names.
* Update `.env.example` to include a comment block for staging vs prod URLs.
* Add a "which environment am I?" endpoint (`GET /api/health` already returns `status: ok`; consider adding `environment: process.env.CONTEXT`) so preview deploys are self-identifying.

**Effort:** Short.

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| FLX-007 | Database Scalability | Add module-scope client caching (see PER-006), commit indexes as migrations (PER-002), and document read-replica options in the runbook once traffic warrants it. | Rolled into PER-006 / PER-002 |
| FLX-010 | Feature Flags | Introduce a lightweight env-var flag pattern first: `if (process.env.FEATURE_X === 'true') { ... }` documented in a `docs/feature-flags.md`. If needs grow, adopt Flagsmith's free tier (has a Node SDK). | Quick win |
| FLX-011 | Plugin/Extension Architecture | Falls out of the MNT-017 refactor: once routes are in modules with a `(event, ctx) => Response` signature, wrapping them with middleware (auth, rate limit, correlation ID, timing) is a one-liner per module. | Rolled into MNT-017 |
| FLX-013 | Setup Documentation | Add `docs/api/README.md` with clone → `yarn install` → copy `.env.example` → `netlify dev` → `yarn test:api` steps. Add `"dev:api": "netlify dev --port 8888"` to `package.json`. | Quick win |
| FLX-014 | Dependency Abstraction | Extract a `repositories/` module that wraps every Supabase call site behind a plain-async function (`getTechnologies()`, `getProjectByUuid()`, `insertDisasterEvent(payload)`, etc.). Naturally follows from the MNT-017 refactor. Provider swap becomes swapping the `repositories/` module. | Rolled into MNT-017 |
| FLX-016 | CI/CD Pipeline Portability | Add a `Makefile` (or `package.json` scripts) that wraps `install`, `lint`, `audit`, `build`, `test` so CI becomes `make ci`. Replace the GitHub-specific secret-scan with `gitleaks` (portable across CI vendors). Document local execution with `act`. | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off *(none)*
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **45.8%** ✗
- [ ] No critical-severity items in FAIL state ✓
