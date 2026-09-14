---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: flexibility
quality_attribute_name: Flexibility
iso_characteristic: "ISO/IEC 25010:2023 Flexibility (adaptability, scalability, installability, replaceability)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 3
  partial: 5
  fail: 1
  na: 9
  applicable: 9
  score_pct: 61.1
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 2
  p3_improvement: 4

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: pending
---

# Flexibility Audit — Frontend (React / TypeScript / CRA)

> **Score**: 61.1% · Adequate
> **Results**: 3 pass · 5 partial · 1 fail · 9 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 2
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Flexibility; ISO/IEC 25023

---

## Summary

The SPA is **inherently stateless and horizontally scalable** (GitHub Pages / CDN edge), the API client is a clean abstraction over `fetch`, and configuration is env-driven at build time via CRA's `REACT_APP_*` convention. The main flexibility gaps are (a) **no feature flags**, so behavior changes require a rebuild + redeploy; (b) `.env.example` is incomplete; (c) no IaC captures the GH Pages / Netlify DNS / GlitchTip setup; and (d) staging vs. production separation is informal (README says `develop`, `deploy.yml` uses `staging`, per project-context). Docker/K8s checks are N/A per user guidance because the SPA ships as static assets.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Static SPA delivered from GH Pages CDN; runtime configuration is compiled in at build time. |
| Interfaces | Build-time env: `REACT_APP_RADAR_API_URL`, `REACT_APP_GLITCHTIP_DSN`; runtime: none. |
| Data contracts | JSON REST to a single API host; swap-in-place would require rebuild. |
| AI/ML behavior | None at runtime — no LLM providers to abstract. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| FLX-005 | Stateless application design | The SPA has no server-side state; auth session is per-tab in `sessionStorage`; there is no filesystem write path. |
| FLX-006 | Horizontal scaling readiness | GH Pages serves the same bundle to any client from the edge; no sticky sessions; no cron on the client. |
| FLX-014 | Dependency abstraction | `src/helpers/apiClient.ts` wraps `fetch` behind `apiRequest<T>` + `ApiError`, centralising timeout, 401 handling, and header composition. Swapping HTTP libraries touches one file. |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| FLX-003 | Environment-based configuration | Uses `process.env.REACT_APP_*`; no hardcoded secrets; `.env` gitignored. | `.env.example` does not document `REACT_APP_RADAR_API_URL`; no config validation at bootstrap; no `.env.development` / `.env.production` split. | high |
| FLX-004 | Multi-environment support | `publish.yml` builds prod with `REACT_APP_GLITCHTIP_DSN`; `develop.yml` builds without it; `deploy.yml` deploys `staging`. | README states staging branch is `develop`, but `deploy.yml` uses `staging` — mismatch per project-context. No explicit `NODE_ENV=production` vs `staging` env-var switching in the bundle. | high |
| FLX-011 | Plugin / extension architecture | React Router + provider composition in `src/App.tsx`; theme providers (Chakra + MUI); middleware-like patterns via context. | No formal plugin registry; the third-party radar viz `@undp_sdg_ai_lab/undp-radar` is directly imported (no adapter) — replacing it means editing many call sites. | low |
| FLX-013 | Setup documentation | README exists with CRA-standard `yarn start` / `yarn build` instructions. | Staging-branch inconsistency (README vs `deploy.yml`); `REACT_APP_RADAR_API_URL` undocumented; no CONTRIBUTING; no one-command "docker compose up"-equivalent (though not required for a SPA). | medium |
| FLX-015 | Infrastructure as code | GitHub Actions workflows codify deploy steps (`publish.yml`, `deploy.yml`); heartbeat cron is committed. | No Terraform/Pulumi for the domain (DNS), GH Pages settings, Netlify site, Supabase project, or GlitchTip project. Manual re-creation of infra during DR is undocumented. | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| FLX-010 | Feature flags | No feature-flag library (LaunchDarkly / Unleash / Flagsmith) and no env-var-based flag convention in the code. Any UI change or gated experiment requires a full rebuild + redeploy. | low | P3 |

### N/A (9 items)

| Check ID | Item | Reason |
|----------|------|--------|
| FLX-001 | Containerization | Per project scope: SPA deploys as static assets to GH Pages; no Dockerfile is required for the frontend layer. |
| FLX-002 | Docker Compose for local dev | No `docker` tag on the frontend. |
| FLX-007 | Database scalability | No client-side database. |
| FLX-008 | Async task queue | No client-side worker queue; browser-side operations complete inline. |
| FLX-009 | Load balancer configuration | GH Pages edge network is transparent; no user-managed LB. |
| FLX-012 | API contract stability | Covered on the API layer. |
| FLX-016 | CI/CD pipeline portability | `github_actions` is not on the frontend tag list; covered project-wide. |
| FLX-017 | LLM provider abstraction | No AI/ML at runtime. |
| FLX-018 | Model configuration flexibility | No AI/ML at runtime. |

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
| FLX-003 | Environment-based configuration | Add `REACT_APP_RADAR_API_URL` to `.env.example`; create a `src/config.ts` module that validates required env vars at bootstrap and throws with an actionable message if missing. | Quick win |
| FLX-004 | Multi-environment support | Reconcile the README staging-branch text with `deploy.yml` (`staging`); introduce a `REACT_APP_ENV` (`development` / `staging` / `production`) and use it in `initGlitchTip` so GlitchTip issues are tagged correctly. | Quick win |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| FLX-010 | Feature flags | Start with env-var flags in `src/config.ts` (`REACT_APP_FEATURE_*`) and a `useFeature()` hook. Adopt a service (Flagsmith / GrowthBook) only if the operator cadence justifies it. | Short |
| FLX-011 | Plugin / extension architecture | Wrap `@undp_sdg_ai_lab/undp-radar` behind a `<RadarViewport>` adapter component so the viz can be swapped without touching pages. | Short |
| FLX-013 | Setup documentation | Rewrite the README quickstart in one section; add a `docs/CONTRIBUTING.md`; align staging branch naming across README, `deploy.yml`, and operator playbooks. | Short |
| FLX-015 | Infrastructure as code | Capture the DNS records, GH Pages settings, Netlify site config, GlitchTip project, and Supabase project as Terraform (or at minimum, a `docs/infrastructure.md`). | Medium |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved (none present)
- [ ] Quality attribute score >= 50% (currently 61.1% — met)
- [ ] Staging vs. production branch/env story reconciled in README, CI, and runbooks
- [ ] `.env.example` is exhaustive and validated at app bootstrap
