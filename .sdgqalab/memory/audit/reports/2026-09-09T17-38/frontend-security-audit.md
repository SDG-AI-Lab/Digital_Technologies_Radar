---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "react-typescript"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security (confidentiality, integrity, non-repudiation, accountability, authenticity)"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:38:00Z"
config_version: 3

score:
  pass: 5
  partial: 6
  fail: 1
  na: 16
  applicable: 12
  score_pct: 66.7
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
  checkpoint_status: "corrected"
---

# Security Audit — Frontend

> **Score**: 66.7% · Adequate
> **Results**: 5 pass · 6 partial · 1 fail · 16 n/a
> **Blockers**: 0 | **Critical**: 0 | **Important**: 5
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript CRA SPA `src/`)
> **ISO Grounding**: Security

---

## Summary

Frontend security posture is Adequate. Secrets stay out of the SPA source, CI runs `yarn audit` with Dependabot, HTTPS is assumed via GitHub Pages, React JSX auto-escaping covers XSS, and cookie CSRF is moot under Bearer JWT in `sessionStorage`. The remaining FAIL is SEC-005 (full HTTP security headers ineffective on GH Pages) — **accepted residual risk** per operator (meta tags only). Gaps remain in env-doc completeness, client-side auth/RBAC depth, input validation schemas, lockfile pinning discipline, and branch-protection evidence.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | React CRA HashRouter SPA for FTR4DRR (`src/App.tsx`); prod on GitHub Pages (`publish.yml`) |
| Interfaces | Outbound HTTPS to Netlify API via `src/helpers/apiClient.ts`; admin routes gated by `RequireAdmin` |
| Data contracts | Ad-hoc form validators; no Zod/Yup at SPA boundary |
| AI/ML behavior | None at runtime |
| Checkpoint status | **corrected** — GlitchTip DSN confirmed in GitHub Secrets; SEC-005 accepted residual risk (meta tags only; no CDN/Netlify SPA move for headers) |

**Trigger filter:** `universal`, `any_web_framework`, `react`, `typescript`. API/DB/Docker/AI checks → N/A for this layer.

---

## Results

### PASS (5)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | No SPA secrets in tracked source; `.env` gitignored; CI secret scan in `develop.yml`; GlitchTip/API keys via env/secrets |
| SEC-002 | Dependency Vulnerability Scanning | `yarn audit --level high` in `.github/workflows/develop.yml`; Dependabot configured |
| SEC-004 | HTTPS Enforcement | Prod SPA on `https://drrtechradar.org/` (GH Pages); API client defaults to `https://undp-drr-radar-api.netlify.app/api` |
| SEC-007 | CSRF Protection | Bearer JWT in `sessionStorage` (`src/components/shared/helpers/auth.ts`) — cookie CSRF not applicable |
| SEC-009 | XSS Prevention | React JSX escaping; no unguarded `dangerouslySetInnerHTML` in production `src/` |

### PARTIAL (6)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-003 | Environment Variable Management | Secrets via `process.env.REACT_APP_*`; `.env` gitignored | `.env.example` thin / misses `REACT_APP_RADAR_API_URL` docs | high |
| SEC-010 | Authentication Implementation | Login + `RequireAdmin` + sessionStorage JWT | Client-only gate; no token expiry/refresh rotation in SPA | critical |
| SEC-011 | Authorization & RBAC | Admin role stored + `RequireAdmin` | Role is client-trustable until API re-check; no fine-grained object ACLs in UI | high |
| SEC-013 | Input Validation | Form helpers validate some project/tech fields | No schema library (Zod/Yup); inconsistent coverage | high |
| SEC-027 | Dependency Pinning | `yarn.lock` present | Mixed ranges in `package.json`; soft audit (non-blocking) | medium |
| SEC-028 | Branch Protection | Protected-branch workflow assumed for `master`/`develop` | No in-repo CODEOWNERS / protection-as-code evidence | medium |

### FAIL (1)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| SEC-005 | Security Headers | GH Pages does not honor `public/_headers` / Netlify `[[headers]]`; only `referrer` + `upgrade-insecure-requests` meta in `public/index.html`. **Operator accepted residual risk** (no CDN move). | high | P2 (risk-accepted) |

### N/A (16)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-006 | CORS Configuration | Browser SPA does not set CORS; owned by API |
| SEC-008 | SQL Injection Prevention | No DB access from frontend |
| SEC-012 | Rate Limiting | API concern |
| SEC-014 | Cookie Security | Auth uses `sessionStorage`, not cookies |
| SEC-015 | File Upload Security | No SPA file-upload surface to local disk |
| SEC-016 | API Authentication | Audited under API layer |
| SEC-017 | API Input Sanitization | Audited under API layer |
| SEC-018 | API Response Data Filtering | Audited under API layer |
| SEC-019 | Docker Security | No Docker for frontend |
| SEC-020 | Container Secrets Management | No containers |
| SEC-021 | Network Segmentation | No Docker networks |
| SEC-022 | Prompt Injection Prevention | No AI/ML |
| SEC-023 | API Key Protection for LLM Services | No AI/ML |
| SEC-024 | Model Access Control | No AI/ML |
| SEC-025 | Data Leakage Prevention | No AI/ML |
| SEC-026 | CI/CD Secrets Management | Covered project-wide via workflows; no frontend-specific CI secret bake |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

None for this layer. SEC-005 risk-accepted by operator.

---

### P1 — Critical (fix before production)

None open after checkpoint correction (DSN confirmed; headers accepted).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-005 | Security Headers | Keep meta-only posture documented in ops notes; revisit if host changes off GH Pages | Short (docs) |
| SEC-003 | Env Var Management | Document all `REACT_APP_*` in `.env.example` including `REACT_APP_RADAR_API_URL` | Quick win |
| SEC-010 | Authentication | Surface token expiry; clear session on 401; avoid trusting role alone in UI | Short |
| SEC-011 | Authorization | Treat UI gates as UX only; ensure every mutation hits API `requireAdmin` | Short |
| SEC-013 | Input Validation | Add Zod (or similar) for project/tech forms before submit | Medium |

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-027 | Dependency Pinning | Prefer exact versions for critical deps; fail CI on high audit findings | Short |
| SEC-028 | Branch Protection | Export/document required reviews + status checks for `master`/`develop` | Quick win |

---

## Delta from Previous Audit

First audit — no comparison available.

---

## Acceptance Criteria

- [x] All P0 blockers resolved (none)
- [x] SEC-005 risk-accepted with operator sign-off
- [x] Quality attribute score >= 50% (Adequate)
- [ ] No high-severity PARTIAL items open (SEC-003/011/013 remain)
