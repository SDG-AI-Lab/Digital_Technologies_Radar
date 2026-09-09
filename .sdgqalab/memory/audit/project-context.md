# Project Context Brief — UNDP Digital Technologies Radar

**Audited:** 2026-09-09T11:57Z  
**Branch:** `sdgqalab-audit/2026-09-09T11-57`  
**Layers (config):** `frontend` (React/CRA), `api` (Netlify Functions + Supabase)

## Product

Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR) — browse/search disaster-risk technologies and projects on a radar/map, with admin CRUD. Live: `https://drrtechradar.org/` (`README.md`, `package.json` homepage).

## Interfaces

- **Frontend:** HashRouter SPA (`src/App.tsx`) for GitHub Pages; routes in `src/navigation/routes.ts` / `AppNav.tsx`.
- **API:** `netlify/functions/api.js` behind `/api/*` (`netlify.toml`). Default client base `REACT_APP_RADAR_API_URL` or `https://undp-drr-radar-api.netlify.app/api`.
- **E2E:** 16 Cypress journeys under `cypress/e2e/`.

## Data / Auth

- Supabase Postgres via service role in Netlify env (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`). No in-repo migrations/RLS.
- UI auth is localStorage advisory (`auth.ts`); API re-checks JWT + `user_roles.admin` via `requireAdmin`.

## AI/ML

**None at runtime.** “AI” is branding/taxonomy only. Skip Safety domain and AI-specific checks.

## Runtime

- Prod frontend: GH Pages (`publish.yml` on `master`).
- API: Netlify Functions.
- Staging: `deploy.yml` on `staging` → PM2/`serve` (README may be stale vs workflow).
- CI: `develop.yml` runs `yarn test` (unit+api+e2e).

## Quality signals

Strong Jest/RTL + API Jest + Cypress; ESLint/Prettier. **No Sentry/APM** (only unused `reportWebVitals()`). Prior testmap: Exemplary unit/integ/line coverage on frontend.

## Config conflicts / gaps

- `bcryptjs` in package.json unused (auth is Supabase).
- `REACT_APP_RADAR_API_URL` not in `.env.example`.
- Staging branch naming: README `develop` vs workflow `staging`.
- Heartbeat workflow embeds Supabase anon JWT in plaintext.
