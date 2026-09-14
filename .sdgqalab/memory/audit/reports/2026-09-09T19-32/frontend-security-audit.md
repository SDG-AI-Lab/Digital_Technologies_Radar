---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: security
quality_attribute_name: Security
iso_characteristic: "ISO/IEC 25010:2023 Security (confidentiality, integrity, non-repudiation, accountability, authenticity, resistance)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 4
  partial: 7
  fail: 0
  na: 17
  applicable: 11
  score_pct: 68.2
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 5
  p3_improvement: 2

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: pending
---

# Security Audit — Frontend (React / TypeScript / CRA)

> **Score**: 68.2% · Adequate
> **Results**: 4 pass · 7 partial · 0 fail · 17 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 5
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Security; OWASP Top 10 2021; ISO/IEC 5055:2021

---

## Summary

The frontend has solid **client-side security fundamentals**: no `dangerouslySetInnerHTML`, HTTPS-only asset loading, session-only auth tokens in `sessionStorage` (with legacy localStorage migration), a Bearer-token API client that clears the session on 401, a secret-scan step in CI, and a baseline `public/_headers` file. The API layer performs the actual authorization (`RequireAdmin` in the SPA is documented UI-only). The main gaps are **hardening**: `_headers` is missing `Content-Security-Policy` (frame-src, script-src, connect-src) and `Strict-Transport-Security`; `yarn audit` is `continue-on-error`; and `.env.example` does not document `REACT_APP_RADAR_API_URL`. Dependabot is already configured (`.github/dependabot.yml`). No P0/P1 blockers were found for the frontend layer.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | React 17 / CRA HashRouter SPA hosted on GitHub Pages, consuming a Netlify Functions + Supabase API (`src/App.tsx`, `src/navigation/AppNav.tsx`, `package.json` homepage `https://drrtechradar.org`). |
| Interfaces | Client-only routes. Outbound: `fetch` via `src/helpers/apiClient.ts` to `REACT_APP_RADAR_API_URL` (default `https://undp-drr-radar-api.netlify.app/api`). Bearer tokens attached from `getAccessToken()`. |
| Data contracts | UI-only. Auth session stored in `sessionStorage` (`components/shared/helpers/auth.ts`); catalog cache in `localStorage`. No client-side database. |
| AI/ML behavior | None at runtime (product taxonomy uses AI branding; runtime is visualization only). AI checks are N/A. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (4 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in source control | `develop.yml` runs a working-tree `grep -RInE` for `AKIA…`, `AWSAccessKeyId=`, and `BEGIN … PRIVATE KEY`. No tracked `.env` files (`.env.local` is untracked). No API/service keys in `src/`. |
| SEC-004 | HTTPS enforcement | GH Pages / Netlify serve TLS; `public/index.html` sets `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`; all Leaflet / Google Fonts / API assets are `https://` URLs. |
| SEC-009 | XSS prevention | Zero occurrences of `dangerouslySetInnerHTML` across `src/`. All user input is rendered via React's auto-escaping JSX; no `innerHTML` writes. |
| SEC-010 | Authentication implementation | `src/pages/users/signIn/SignIn.tsx` calls `POST /auth/sign-in`; `src/components/shared/helpers/auth.ts` stores the JWT in `sessionStorage`; `apiClient` attaches `Authorization: Bearer` and calls `clearSession()` on 401. API enforces JWT server-side (per project-context). |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-002 | Dependency vulnerability scanning | `develop.yml` runs `yarn audit --level high --groups dependencies`; `.github/dependabot.yml` covers npm (weekly) + github-actions (monthly). | Step has `continue-on-error: true` (does not block merge). | high |
| SEC-003 | Environment variable management | Uses `process.env.REACT_APP_*`; no hardcoded secrets; `.env` files gitignored. | Per project-context, `REACT_APP_RADAR_API_URL` is used in code but not documented in `.env.example`. No runtime validation of required vars. | high |
| SEC-005 | Security headers | `public/_headers` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. | No `Content-Security-Policy` (only `upgrade-insecure-requests` via meta tag), no `Strict-Transport-Security`. GH Pages does not serve `_headers`; only effective if fronted by a Netlify/Cloudflare proxy. | high |
| SEC-011 | Authorization & RBAC | `RequireAdmin` gates admin UI; API enforces `user_roles.admin` server-side (per project-context). | Client-only admin gating is advisory — an unauthenticated user with browser dev-tools can render admin pages; the API is the enforcement point. No object-level ownership checks on the client. | high |
| SEC-013 | Input validation | React form inputs use `type="email"`/`type="password"` and controlled state; server validates on the API. | No systematic client-side schema validation (no Zod/Yup/react-hook-form); `SignIn.tsx` accepts empty submissions and only surfaces `alert()` failures from the API. | high |
| SEC-027 | Dependency pinning | `yarn.lock` is committed; `package.json` uses caret ranges anchored by lockfile. | GitHub Actions steps use mutable tags (`actions/checkout@v2`, `actions/setup-node@v1`), not SHA pins. Some deps use very loose ranges (e.g. `@react-leaflet/core` uses OR-clauses). | medium |
| SEC-028 | Branch protection | CI runs on `pull_request` to `master`/`develop`; secret-scan + lint + build + test steps. | No `CODEOWNERS`; branch protection rules are not visible in repo (require GH settings). Publish workflow (`publish.yml`) can run on direct push to `master` without lint. | medium |

### FAIL (0 items)

_No FAIL findings in this layer for this domain._

### N/A (17 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-006 | CORS configuration | Server-side concern (Netlify Functions); frontend does not configure CORS. |
| SEC-007 | CSRF protection | SPA uses Bearer JWT tokens in `Authorization` header, not cookies — CSRF is moot per the check's own guidance. |
| SEC-008 | SQL injection prevention | Frontend has no direct database access. |
| SEC-012 | Rate limiting | API/edge-layer concern. |
| SEC-014 | Cookie security | Auth uses `sessionStorage`, not cookies. |
| SEC-015 | File upload security | No file-upload endpoints in the frontend. |
| SEC-016 | API authentication | API-layer concern. |
| SEC-017 | API input sanitization | API-layer concern. |
| SEC-018 | API response data filtering | API-layer concern. |
| SEC-019 | Docker security | No Dockerfile — SPA is deployed as static assets to GH Pages. |
| SEC-020 | Container secrets management | No containers in the frontend deployment. |
| SEC-021 | Network segmentation | No container network in the frontend deployment. |
| SEC-022 | Prompt injection prevention | No AI/ML at runtime (skipped per project-context). |
| SEC-023 | LLM API key protection | No AI/ML at runtime. |
| SEC-024 | Model access control | No AI/ML at runtime. |
| SEC-025 | Data leakage prevention (AI) | No AI/ML at runtime. |
| SEC-026 | CI/CD secrets management | Not on the frontend layer tag list (`github_actions` is a project-wide concern; covered in the project-wide docs audit). |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| SEC-002 | Dependency vulnerability scanning | Remove `continue-on-error: true` from the `dependency audit` step in `develop.yml` (or keep soft-fail but surface a summary annotation). Dependabot already present — no action needed there. | Quick win |
| SEC-003 | Environment variable management | Add `REACT_APP_RADAR_API_URL=` to `.env.example`. Consider a small `src/config.ts` that fails fast (throws at bootstrap) when required env vars are missing in production builds. | Quick win |
| SEC-005 | Security headers | Add `Content-Security-Policy` and `Strict-Transport-Security` to `public/_headers`. Minimum CSP: `default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://undp-drr-radar-api.netlify.app https://*.supabase.co; frame-ancestors 'none';`. Note: `_headers` only takes effect on Netlify/Cloudflare — for GH Pages, add equivalents as `<meta http-equiv="Content-Security-Policy">` in `public/index.html`. | Short |
| SEC-011 | Authorization & RBAC | Document `RequireAdmin` as UI-only advisory in `SECURITY.md` (or a JSDoc block on the component). Keep the API as sole source of truth; ensure admin routes render an "Access denied" state if the API returns 403 rather than blank UI. | Quick win |
| SEC-013 | Input validation | Adopt a lightweight schema layer (Zod or Yup) for the sign-in and admin CRUD forms; surface field-level errors instead of `alert()`. Even without a form library, add `required` and `minLength` attributes and a submit-button disabled-until-valid state. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| SEC-027 | Dependency pinning | Pin GitHub Actions to full commit SHAs (`actions/checkout@8ade135…`). Regenerate `yarn.lock` on a schedule via Dependabot. Tighten OR-clause ranges (`@react-leaflet/core`). | Short |
| SEC-028 | Branch protection | Add `.github/CODEOWNERS`; enable required PR reviews and required status checks on `master`/`develop` (repo settings — not code); add the lint step to `publish.yml`. | Quick win |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved or risk-accepted with sign-off (none present)
- [ ] Quality attribute score >= 50% (currently 68.2% — met)
- [ ] No critical-severity items in FAIL state (none present)
- [ ] `Content-Security-Policy` and `Strict-Transport-Security` added in both `_headers` and the `<meta>` fallback before public re-launch
- [ ] `yarn audit` step no longer swallows failures on `--level high` findings
