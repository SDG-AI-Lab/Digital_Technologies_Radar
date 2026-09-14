# Project Context Brief — UNDP Digital Technologies Radar

**Audited:** 2026-09-09T19:32Z  
**Branch:** `sdgqalab-audit/2026-09-09T19-32`  
**Layers (config):** `frontend` (React/CRA), `api` (Netlify Functions + Supabase)

## Product

Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR) — browse/search disaster-risk technologies and projects on a radar/map, with admin CRUD. Live: `https://drrtechradar.org/` (`README.md`, `package.json` homepage).

## Interfaces

- **Frontend:** HashRouter SPA (`src/App.tsx`) for GitHub Pages; routes in `src/navigation/AppNav.tsx`.
- **API:** `netlify/functions/api.js` behind `/api/*` (`netlify.toml`). Client: `REACT_APP_RADAR_API_URL` or default `https://undp-drr-radar-api.netlify.app/api` (`src/helpers/apiClient.ts`).
- **E2E:** Cypress specs under `cypress/e2e/`.
- **Jobs:** `.github/workflows/supabase-heartbeat.yml` daily cron curls Netlify `GET /api/health` (probes Supabase `dataset_version`); no keys in the workflow.

## Data / Auth

- Supabase Postgres via **service role** in Netlify env (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`). No in-repo migrations/RLS policies.
- UI tokens in **sessionStorage** with legacy localStorage migration (`src/components/shared/helpers/auth.ts`). `RequireAdmin` is UI-only; API enforces JWT + `user_roles.admin` via `requireAdmin`.
- Catalog/cache data still uses `localStorage` (technologies, projects, disasters).

## AI/ML

**None at runtime.** “AI” / ML appears only in product taxonomy/branding (`@undp_sdg_ai_lab/undp-radar` is visualization). **Skip Safety domain** and AI-specific checks.

## Runtime

- Prod frontend: GH Pages (`publish.yml` on `master`).
- API: Netlify Functions (`undp-drr-radar-api.netlify.app`).
- Staging: `deploy.yml` on branch **`staging`** → self-hosted PM2/`serve` (README still says `develop` — doc drift only).
- CI: `develop.yml` on PRs to `master`/`develop` — secret scan, lint, soft `yarn audit`, build, `yarn test`.
- **Default branch:** **`master`** (confirmed 2026-09-09). Cron workflows (heartbeat) use the YAML on `master`. Prod publish is also `master`.
- **GlitchTip:** `REACT_APP_GLITCHTIP_DSN` is live in production builds (`publish.yml`) — confirmed.

## Quality signals (post P0/P1)

- Jest/RTL unit + integration suites; API Jest in `tests/api/`; Cypress E2E.
- ESLint + Prettier; lint in CI (`develop.yml`).
- GlitchTip via `@sentry/react` (`src/helpers/glitchtip.ts`); DSN from `REACT_APP_GLITCHTIP_DSN` at build time.
- Root `ErrorBoundary` wraps the app (`src/App.tsx`).
- Security headers in `public/_headers` and `netlify.toml` (no CSP/HSTS).
- Prior testmap: strong frontend unit/integration coverage.

## Config conflicts / gaps

- `bcryptjs` in `package.json` unused (auth is Supabase Auth).
- `REACT_APP_RADAR_API_URL` used in code but absent from `.env.example`.
- README staging branch (`develop`) vs `deploy.yml` (`staging`).
- Heartbeat JWT previously hardcoded — **remediated** on this working tree: pings `/api/health` only (verify merged to **default** branch for cron).
- Docs: no CONTRIBUTING, SECURITY.md, ADRs, runbooks, or backup/restore for Supabase.
- Dual UI stacks (Chakra + MUI); no route-level `React.lazy` code splitting.

## Audit matrix (this run)

| Layer | Domains |
|-------|---------|
| frontend | security, reliability, observability, performance-efficiency, maintainability, flexibility, compatibility, interaction-capability |
| api | security, reliability, observability, performance-efficiency, maintainability, flexibility, compatibility, data-quality |
| project-wide | documentation |
| skipped | safety (no AI/ML tags); frontend data-quality (no DB tags) |

**Trigger overrides:** none beyond skipping Safety / FE data-quality per evidence above.
