# Project Context Brief — UNDP Digital Technologies Radar

**Audited:** 2026-09-09T17:38Z  
**Branch:** `sdgqalab-audit/2026-09-09T17-38`  
**Layers (config):** `frontend` (React/CRA), `api` (Netlify Functions + Supabase)

## Product

Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR) — browse/search disaster-risk technologies and projects on a radar/map, with admin CRUD. Live: `https://drrtechradar.org/` (`README.md`, `package.json` homepage).

## Interfaces

- **Frontend:** HashRouter SPA (`src/App.tsx`) for GitHub Pages; routes in `src/navigation/AppNav.tsx` with `RequireAdmin` on admin CRUD.
- **API:** `netlify/functions/api.js` behind `/api/*` (`netlify.toml`). Client: `REACT_APP_RADAR_API_URL` or `https://undp-drr-radar-api.netlify.app/api`.
- **API CORS:** `ALLOWED_ORIGINS` comma allowlist; reflect only (never `*`); browser Origin mismatch → 403; missing Origin allowed (health/monitors). Empty allowlist blocks browsers.
- **E2E:** 16 Cypress journeys under `cypress/e2e/`.

## Data / Auth

- Supabase Postgres via service role in Netlify env (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`). No in-repo migrations/RLS.
- UI session: `sessionStorage` via `auth.ts` (`setSession` / migrate from legacy localStorage); API re-checks JWT + `user_roles.admin`.

## AI/ML

**None at runtime.** Skip Safety domain and AI-specific checks.

## Runtime

- Prod frontend: GH Pages (`publish.yml` on `master`); `REACT_APP_GLITCHTIP_DSN` is set in GitHub Secrets and injected at build (`publish.yml`).
- API: Netlify Functions.
- Staging: `deploy.yml` on `staging` → PM2/`serve`.
- CI (`develop.yml`): secret scan, lint, soft `yarn audit`, build, `yarn test` (unit+api+e2e). Dependabot configured.
- Cloudflare/Wrangler intentionally **not** used (removed; no GoDaddy access for nameserver cutover).

## Quality signals (post P0/P1)

- ErrorBoundary + optional GlitchTip (`src/helpers/glitchtip.ts`).
- `apiClient` 30s timeout; HTTPS map tiles; skip link / focus-visible / BackButton labels.
- `public/_headers` + Netlify `[[headers]]` present but **ineffective on GH Pages**.
- Strong Jest/RTL + API tests + Cypress; Prettier pretest; ESLint on production sources.

## Config conflicts / gaps

- `REACT_APP_RADAR_API_URL` still thin in `.env.example` docs vs usage.
- Staging branch naming: README vs `deploy.yml`.
- Full HTTP security headers need edge host change (Netlify SPA or CDN) — accepted residual risk without Cloudflare.

## Operator corrections (2026-09-09)

- GlitchTip DSN: confirmed present in GitHub Secrets (not a missing-ops gap). Residual observability work is release tags, source maps, alerts, SPA uptime — not DSN wiring.
- **SEC-005 (security headers):** Accepted residual risk. Keep `public/index.html` meta tags (`referrer`, `upgrade-insecure-requests`) only. Do not pursue Cloudflare/CDN/Netlify SPA move for headers at this time. Treat full HTTP security headers (`X-Frame-Options`, CSP, HSTS, etc.) as a **known gap** on GitHub Pages; `public/_headers` / Netlify `[[headers]]` remain for a future host change.

## Checkpoint metadata

- Frontend layer: feedback received (GlitchTip DSN; SEC-005 accepted).
- API layer: **No feedback received** (proceeded on current evidence when audit resumed).
- Documentation: **No feedback received** (user continued to finalize scoring).
