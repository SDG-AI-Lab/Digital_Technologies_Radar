---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: compatibility
quality_attribute_name: Compatibility
iso_characteristic: "ISO/IEC 25010:2023 Compatibility (co-existence, interoperability)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 1
  partial: 2
  fail: 0
  na: 13
  applicable: 3
  score_pct: 66.7
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 0
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

# Compatibility Audit — Frontend (React / TypeScript / CRA)

> **Score**: 66.7% · Adequate
> **Results**: 1 pass · 2 partial · 0 fail · 13 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 0
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Compatibility; ISO/IEC 25023

---

## Summary

The frontend has an **explicit browser support policy** (`browserslist` in `package.json` targeting `>0.2%, not dead, not op_mini all`), and CRA transpiles/polyfills accordingly. GitHub Pages compatibility drove the choice of `HashRouter`, which sidesteps deep-link issues. The two remaining gaps are (a) **no SSR / server-side fallback** for progressive enhancement (the shell is `<div id="root">` + a `<noscript>` line — expected for a CRA SPA, but not zero-JS-friendly) and (b) **client timezone handling** relies on the browser's `Date` and does not normalise around UTC. Most compatibility checks fall to the API layer (schema/versioning/CORS/health) — those are N/A here.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Public-facing SPA — users span the range of modern desktop and mobile browsers. |
| Interfaces | Consumes a single REST API; produces DOM. No message brokers or shared caches on the client. |
| Data contracts | JSON REST; ISO date strings expected from the API. |
| AI/ML behavior | None at runtime. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (1 item)

| Check ID | Item | Evidence |
|----------|------|----------|
| CMP-012 | Browser support policy | `package.json` `browserslist`: `[">0.2%", "not dead", "not op_mini all"]`. `react-scripts@4` uses Babel `preset-env` targeted against this list, and `core-js` polyfills are auto-applied. |

### PARTIAL (2 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| CMP-008 | Timezone handling | The client displays timestamps in local time via native `Date`; API is expected to return ISO strings. | No timezone library (`dayjs` UTC plugin, Luxon, `date-fns-tz`); no explicit UTC normalisation for filters/sorts; no `Intl.DateTimeFormat` usage documented for date rendering, meaning display format varies by locale. | medium |
| CMP-013 | Progressive enhancement | `public/index.html` contains a `<noscript>` line ("You need to enable JavaScript to run this app."); `ErrorBoundary` renders a friendly fallback; viewport meta is set; loading states exist on async pages. | No SSR / SSG fallback — the shell is `<div id="root">`, so JS-disabled users only see the `<noscript>` message. Feature detection is inconsistent (`window.setTimeout` is used freely — fine in browsers, but `window.crypto.randomUUID` would need a fallback if introduced). | low |

### FAIL (0 items)

_No FAIL findings._

### N/A (13 items)

| Check ID | Item | Reason |
|----------|------|--------|
| CMP-001 | API schema documentation | API-layer concern. |
| CMP-002 | API versioning | API-layer concern. |
| CMP-003 | Standard response format | API-layer concern. |
| CMP-004 | Content negotiation | API-layer concern. |
| CMP-005 | CORS configuration | Server-side; the frontend does not configure CORS. |
| CMP-006 | Standard data formats | API-layer concern (naming convention, ISO 8601 in payloads). |
| CMP-007 | Database character encoding | No client-side database. |
| CMP-009 | Port conflict prevention | No `docker` tag on the frontend. |
| CMP-010 | Shared resource management | No `redis`/`any_database` tag on the frontend. |
| CMP-011 | Message queue compatibility | No message brokers. |
| CMP-014 | Service health dependency checks | API-layer concern; the SPA does not expose a health endpoint. |
| CMP-015 | Backwards compatibility (API/DB migrations) | API-layer concern. |
| CMP-016 | External service contract testing | Consumer-side tests belong on the API layer where the contract producer lives. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

_None._

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| CMP-008 | Timezone handling | Adopt `dayjs` + `utc` plugin (or `date-fns-tz`) for all date rendering; render via `Intl.DateTimeFormat` with an explicit `timeZone: 'UTC'` for admin tables and user-local for display where preferred. Document the convention. | Short |
| CMP-013 | Progressive enhancement | (Longer-term) migrate off CRA to a framework that supports SSG/SSR (Next.js/Vite + `vite-plugin-ssr`) for a meaningful zero-JS fallback of the About / Home content. Short-term: enrich the `<noscript>` message with a link to a static "About" page. | Medium–Large |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved (none present)
- [ ] Quality attribute score >= 50% (currently 66.7% — met)
- [ ] Timezone convention documented and applied consistently in admin CRUD views
