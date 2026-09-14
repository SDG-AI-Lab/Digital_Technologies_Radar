---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: maintainability
quality_attribute_name: Maintainability
iso_characteristic: "ISO 25010 Maintainability (modularity, reusability, analysability, modifiability, testability)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 9
  partial: 3
  fail: 4
  na: 6
  applicable: 16
  score_pct: 65.6
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 2
  p2_important: 2
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

# Maintainability Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 65.6% · Adequate
> **Results**: 9 pass · 3 partial · 4 fail · 6 n/a
> **Blockers**: 0 | **Critical**: 2 | **High**: 2
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Maintainability · ISO/IEC 5055:2021 · ISO/IEC 25023

---

## Summary

The API layer benefits from the shared repository infrastructure — ESLint runs in CI, Prettier is configured (and enforced on frontend sources via `pretest`), the lock file is committed, Dependabot updates run weekly, `.gitignore` is comprehensive, and there is a dedicated Jest project for the API (`jest.api.config.js`, ~36 test cases in `tests/api/api.test.js`) that runs on every PR through `yarn test`. The environment configuration story is clean: three env vars, all documented in `.env.example`, all validated at first use. The two structural problems are the file itself and the database story: `netlify/functions/api.js` is a **~472-line monolith** that mixes HTTP routing, auth, validation, business logic, and DB access in a single `exports.handler` function (MNT-017); and there is no migration framework at all for the Postgres schema (MNT-020). Both are P1. Secondary gaps: no API versioning strategy, no pre-commit hooks, no `.editorconfig`, and the Prettier check does not cover `netlify/functions/`.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Single-file Netlify Function `netlify/functions/api.js` implementing all API routes. |
| Interfaces | HTTP handler dispatched by hand-rolled regex/switch on `event.path`. |
| Data contracts | Route/table maps in `PUBLIC_RESOURCES`, `PUBLIC_DETAIL_RESOURCES`, `ADMIN_INFO_RESOURCES`; field allowlists in `INFO_FIELDS`, `EVENT_FIELDS`. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. |

---

## Results

### PASS (9 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| MNT-001 | Linter Configuration | `package.json` `eslintConfig` extends `react-app` + `react-app/jest`. `develop.yml` runs `yarn lint` on every PR. Meaningful rules (React hooks, promise, import) via the plugin chain. |
| MNT-004 | Dependency Management | `yarn.lock` is committed (not in `.gitignore`). `.github/dependabot.yml` runs npm updates weekly and GitHub Actions monthly, both with `open-pull-requests-limit`. |
| MNT-005 | Project Structure Convention | Clear top-level split: `netlify/functions/api.js` (source), `tests/api/api.test.js` (mirrored tests), `jest.api.config.js` (dedicated Jest project). Frontend, e2e, and API are separated. |
| MNT-006 | Dead Code Detection | `api.js` contains no large commented-out blocks; every constant (`PUBLIC_RESOURCES`, `PUBLIC_DETAIL_RESOURCES`, `ADMIN_INFO_RESOURCES`, `INFO_FIELDS`, `EVENT_FIELDS`) is referenced. Two purposeful comments explain the "fresh privileged client" pattern at lines 148–149 and 249–250. |
| MNT-008 | Version Control Hygiene | `.gitignore` covers `.env`, `.env.*` (lines 17–18), plus standard artifacts (node_modules, build, coverage). No secrets tracked. |
| MNT-009 | CI Pipeline Exists | `.github/workflows/develop.yml` runs on `pull_request` to `master`/`develop` with checkout, secret scan, install, lint, audit, build, test steps. `publish.yml` and `deploy.yml` cover release automation. |
| MNT-010 | Automated Testing in CI | `develop.yml` line 61: `yarn test` which per `package.json` line 54 runs `test:unit && test:api && test:e2e`. No `continue-on-error: true` on the test step; failure blocks the pipeline. |
| MNT-016 | Package.json Scripts | `package.json` `scripts` defines `start`, `build`, `test:unit`, `test:api`, `test:api:coverage`, `test:e2e`, `test`, `lint`, `prettify`, `format`, `deploy`. `test:api` is the API-specific entry point. |
| MNT-018 | Configuration Management | `api.js` reads only from `process.env.{SUPABASE_URL, SUPABASE_SECRET_KEY, ALLOWED_ORIGINS}`. `.env.example` documents all three with placeholder values and safety notes. `configuredClient` fails fast with `Server configuration is incomplete` if either Supabase var is missing. No hardcoded secrets or URLs in `api.js`. |

### PARTIAL (3 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| MNT-002 | Code Formatter | Prettier configured (`prettier` + `eslint-config-prettier` in devDependencies); `yarn prettify` runs as `pretest`, blocking `yarn test` on unformatted code. | The `prettify` script targets `src/` only (`prettier -c src/`) — `netlify/functions/api.js` and `tests/api/` are **not** in the format-check scope. API-layer formatting drift would not be caught. | medium |
| MNT-007 | Code Complexity | Individual helper functions (`allowedFields`, `bumpDataVersion`, `allowedOrigin`, `response`, `configuredClient`, `getRole`, `requireAdmin`, `parseBody`) are short and single-purpose. | `exports.handler` itself spans ~305 lines (api.js 168–470) with roughly 15 route branches inside nested `if` chains. No ESLint `complexity` rule is configured to catch this going forward. | medium |
| MNT-012 | Consistent Development Environment | `package.json` scripts cover standard workflows; README describes setup at the SPA level. | No `.editorconfig`, no `Makefile`/`justfile`, no `.devcontainer/`. Local API dev requires `netlify dev` which is not scripted or documented in the repo. | medium |

### FAIL (4 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| MNT-011 | Pre-commit Hooks | No `.pre-commit-config.yaml`, no `.husky/`, no `lint-staged` config in `package.json`. Nothing runs locally before commit; the first quality gate is CI. | medium | P2 |
| MNT-017 | Separation of Concerns | `api.js` is a single file where `exports.handler` performs CORS handling, path parsing, Supabase client construction, authentication, authorization, payload parsing, per-route validation, database access, response formatting, and error handling. Business logic is inseparable from HTTP concerns and cannot be unit-tested without mocking the full Supabase client (as `tests/api/api.test.js` does). | high | P1 |
| MNT-019 | API Versioning Strategy | Routes are `/api/{resource}` — no `/v1/`, no version header, no `Sunset`/`Deprecation` middleware. Any breaking change to a response shape will silently affect all live SPA versions. | medium | P2 |
| MNT-020 | Database Migration Framework | No `supabase/migrations/`, no Alembic, no Prisma, no Knex. Schema is presumably managed via Supabase Studio, undocumented and unreviewed. Same finding as REL-016 and DQ-005. | high | P1 |

### N/A (6 items)

| Check ID | Item | Reason |
|----------|------|--------|
| MNT-003 | Type Safety | The API layer is JavaScript, not TypeScript. Trigger `[typescript, python]` does not match. |
| MNT-013 | Python Package Structure | Not a Python project. |
| MNT-014 | Python Import Organization | Not a Python project. |
| MNT-015 | TypeScript Strict Configuration | API is JavaScript. The frontend's `tsconfig.json` is out of scope for this layer. |
| MNT-021 | Prompt Management | No LLM prompts. |
| MNT-022 | Model Configuration Management | No AI/ML config. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

#### MNT-017: Separation of Concerns

**Current state:** `api.js` mixes routing, auth, validation, and data access in one 472-line function. Any change to a single endpoint requires understanding the whole file, and the test file is a heavy mock of the Supabase client rather than a business-logic test.

**Required state:** A small routing layer that dispatches by (method, path) into thin handler modules; a services module holding business logic (data-version bumping, admin project create-with-cycles, taxonomy reassignment); a `supabase-client.js` that owns client construction; a `validation/` module for schemas.

**Fix (target structure):**

```
netlify/functions/
  api.js                      # ← thin: parseRoute + dispatch + global error handler
  lib/
    supabase-client.js        # configuredClient + serverOnlyClient (see PER-006)
    cors.js                   # allowedOrigin + preflight
    response.js               # response() helper
    logger.js                 # pino instance (see OBS-001)
    validation/
      schemas.js              # Zod schemas per write endpoint
      parseBody.js
    auth/
      requireAdmin.js
      getRole.js
  routes/
    health.js                 # GET /health
    public.js                 # GET /public/*  and /public/details/*
    authSignIn.js             # POST /auth/sign-in
    authUsers.js              # POST /auth/users
    admin/
      projects.js             # POST/PUT/DELETE /admin/projects/*
      info.js                 # POST/PUT/DELETE /admin/info/*
      disasterEvents.js       # POST/PUT/DELETE /admin/disaster-events/*
      approve.js              # POST /admin/projects/approve
      pending.js              # GET  /admin/projects/pending
```

Each route module exports a function `(event, ctx) => Response` where `ctx` carries `{ supabase, origin, user?, logger }`. The dispatcher table replaces the giant `if` chain:

```javascript
// netlify/functions/api.js
const routes = [
  { method: 'GET',    match: /^health$/,                        handler: require('./routes/health') },
  { method: 'GET',    match: /^public\/details\/([^/]+)\/([^/]+)$/, handler: require('./routes/public').detail },
  { method: 'GET',    match: /^public\/([^/]+)$/,               handler: require('./routes/public').list },
  { method: 'POST',   match: /^auth\/sign-in$/,                 handler: require('./routes/authSignIn') },
  // ...one line per route...
];

exports.handler = async (event) => {
  const ctx = { origin: allowedOrigin(event.headers.origin), logger, supabase: configuredClient() };
  // CORS preflight, origin gate — as today...
  const path = (event.path || '').replace(/^.*\/api\/?/, '').replace(/^\//, '');
  const match = routes.find(r => r.method === event.httpMethod && r.match.test(path));
  if (!match) return response(404, { error: 'Not found' }, ctx.origin);
  try {
    return await match.handler(event, ctx);
  } catch (error) {
    logger.error({ err: error, path, method: event.httpMethod }, 'api_request_failed');
    return response(500, { error: 'The request could not be completed' }, ctx.origin);
  }
};
```

**Effort:** Medium (2–3 days). Keep the split behind a green test suite — the existing 36 tests in `tests/api/api.test.js` should still pass unchanged (they only care about the handler contract).

#### MNT-020: Database Migration Framework

**Current state:** No migrations in repo; schema changes bypass code review.

**Fix:** Adopt the Supabase CLI migration workflow (same fix as REL-016). Commit `supabase/migrations/*.sql` and a `supabase/config.toml`; add a CI check that `supabase db lint` passes and that `supabase db reset --no-seed` succeeds on a throwaway project or a local dockerised Postgres.

```bash
supabase init
supabase link --project-ref <ref>
supabase db pull                             # baseline
supabase migration new <descriptive_name>    # every subsequent change
```

Add to `develop.yml`:

```yaml
- name: Supabase migration lint
  run: npx supabase db lint
```

**Effort:** Medium.

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| MNT-011 | Pre-commit Hooks | Add Husky + lint-staged. Run `eslint --fix` and `prettier --write` on staged `.js`/`.ts` files. Once introduced, expand the Prettier scope to `netlify/functions/**` to also address MNT-002. Example: |

```json
// package.json additions
"scripts": {
  "prepare": "husky install"
},
"lint-staged": {
  "src/**/*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "netlify/functions/**/*.js": ["eslint --fix", "prettier --write"],
  "tests/api/**/*.js": ["eslint --fix", "prettier --write"]
}
```

```bash
yarn add -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

| MNT-019 | API Versioning Strategy | Introduce `/api/v1/` as the current base and update `netlify.toml` redirects. Reserve `/api/` (unversioned) as a soft alias pointing at v1 for one release cycle, then add a `Deprecation: true` and `Sunset: <date>` header to the alias. Document the versioning policy in a new `docs/api-versioning.md`. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| MNT-002 | Code Formatter | Widen `prettify` scope: `prettier -c "src/**/*" "netlify/functions/**/*" "tests/**/*"`. Convert `format` accordingly. (Fully closed once MNT-011 lands with the wider `lint-staged` config.) | Quick win |
| MNT-007 | Code Complexity | Add `"complexity": ["error", 15]` and `"max-lines-per-function": ["warn", 100]` to the ESLint config for `netlify/functions/**`. Naturally passes once MNT-017 refactor is done. | Quick win |
| MNT-012 | Consistent Development Environment | Add `.editorconfig` (2-space indent, LF, trim trailing whitespace, final newline); add a `netlify dev` script (`"dev:api": "netlify dev --port 8888"`); document local API setup in the README under an "API development" section. | Quick win |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off (MNT-017, MNT-020)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **65.6%** ✓
- [ ] No critical-severity items in FAIL state ✓
