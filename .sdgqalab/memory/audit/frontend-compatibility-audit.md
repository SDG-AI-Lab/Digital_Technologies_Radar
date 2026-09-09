---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "react-typescript"
quality_attribute: "compatibility"
quality_attribute_name: "Compatibility"
iso_characteristic: "Compatibility"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:39:00Z"
config_version: 3

score:
  pass: 2
  partial: 2
  fail: 0
  na: 12
  applicable: 4
  score_pct: 75.0
  rating: "Solid"

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
  checkpoint_status: "skipped_unattended"
---

# Compatibility Audit — Frontend

> **Score**: 75.0% · Solid
> **Results**: 2 pass · 2 partial · 0 fail · 12 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 0
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: Compatibility

---

## Summary

Frontend compatibility posture is Solid for a CRA SPA: browserslist is declared, HashRouter targets GH Pages, HTTPS Carto tiles, noscript + ErrorBoundary + loading states. Most CMP checks are API/DB/infra and correctly N/A. Remaining gaps: CORS ownership is API-side (FE is consumer), and progressive enhancement is limited by SPA architecture.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Static SPA → GH Pages; API on Netlify |
| Integrations | `apiClient` → Netlify API; Leaflet/Carto tiles |
| Known remediations | HashRouter; HTTPS `basemaps.cartocdn.com` tiles |
| Checkpoint status | Unattended |

---

## Results

### PASS (2 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| CMP-008 | Timezone Handling | FE uses year filters via `new Date().getFullYear()` only (`FilterUtilities.tsx`); timestamps displayed as API strings — no naive local business timezone logic |
| CMP-012 | Browser Support Policy | `package.json` `"browserslist": [">0.2%", "not dead", "not op_mini all"]`; CRA/babel consume it |

### PARTIAL (2 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| CMP-005 | CORS Configuration | FE sends `Accept`/`Content-Type` (`apiClient.ts`); origins documented for API in `.env.example` `ALLOWED_ORIGINS` | CORS headers enforced in `netlify/functions/api.js` (API layer), not FE; FE cannot alone prove prod origin allowlist | medium |
| CMP-013 | Progressive Enhancement | `<noscript>` in `public/index.html`; `ErrorBoundary`; loading UI; HashRouter for GH Pages; HTTPS tiles in `RadarMapView.tsx` | Blank app without JS (CRA SPA); no SSR | low |

### FAIL (0 items)

None.

### N/A (12 items)

| Check ID | Item | Reason |
|----------|------|--------|
| CMP-001 | API Schema Documentation | any_api |
| CMP-002 | API Versioning | any_api |
| CMP-003 | Standard Response Format | any_api |
| CMP-004 | Content Negotiation | any_api |
| CMP-006 | Standard Data Formats | any_api |
| CMP-007 | Database Character Encoding | any_database |
| CMP-009 | Port Conflict Prevention | docker |
| CMP-010 | Shared Resource Management | redis/any_database |
| CMP-011 | Message Queue Compatibility | message broker |
| CMP-014 | Service Health Dependency Checks | any_api/docker |
| CMP-015 | Backwards Compatibility | any_api/any_database |
| CMP-016 | External Service Contract Testing | any_api |

**Trigger note:** Cypress/Jest API mocks exist on FE but CMP-016 triggers `any_api` only — covered under API layer.

---

## Remediation Roadmap

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| CMP-005 | CORS | Keep allowlist on API; ensure FE homepage origins stay in `ALLOWED_ORIGINS` for all deploy targets | Quick win |
| CMP-013 | PE | Optional: richer noscript message linking to docs; keep ErrorBoundary coverage | Quick win |

---

## Acceptance Criteria

- [x] No FAIL on applicable frontend compatibility checks
- [x] Score >= 50% — met (75%)
