---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: performance-efficiency
quality_attribute_name: Performance Efficiency
iso_characteristic: "ISO/IEC 25010:2023 Performance Efficiency (time behaviour, resource utilization, capacity)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 3
  partial: 4
  fail: 1
  na: 14
  applicable: 8
  score_pct: 62.5
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 1
  p3_improvement: 4

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: corrected
---

# Performance Efficiency Audit — Frontend (React / TypeScript / CRA)

> **Score**: 62.5% · Adequate
> **Results**: 3 pass · 4 partial · 1 fail · 14 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 0
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Performance Efficiency; ISO/IEC 5055:2021; ISO/IEC 25023

---

## Summary

Performance is **serviceable but unoptimised**. Static assets and API calls all use HTTPS + a CDN (GitHub Pages edge), the API client has an explicit 30s timeout, and the app never blocks on synchronous I/O in render paths. The single FAIL is bundle strategy: **no route-level `React.lazy` code splitting and two competing component libraries loaded eagerly** (`@chakra-ui/react` + `@mui/material` + `@mui/icons-material` + `framer-motion@4` + `leaflet` + `react-leaflet`), which produces a heavy first-load JS bundle for a mostly read-only radar. Image optimisation, pagination coverage, browser cache headers, and list virtualization are all partially in place.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Client-side rendered SPA — every kB counts on first load. |
| Interfaces | GH Pages static CDN → user browser; browser → Netlify Functions API. |
| Data contracts | JSON REST; catalog cached in `localStorage` to defer re-fetch. |
| AI/ML behavior | None at runtime. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| PER-005 | Async processing | All API calls in `apiRequest` are `async`/`await` on `fetch`; nothing blocks the main thread synchronously. Chakra/MUI render paths are `Suspense`-free but non-blocking. |
| PER-009 | CDN configuration | GH Pages serves the built assets from GitHub's edge (Fastly-backed); the API runs on Netlify's CDN. All external assets (Google Fonts, Leaflet CSS, carto tiles) are HTTPS CDN-served. |
| PER-018 | Static file serving | No application server in the SPA — GH Pages serves all bundles, images, and manifests. `DEBUG=true` is not relevant to CRA production builds. |

### PARTIAL (4 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| PER-004 | Pagination implementation | Search results (`src/pages/search/`) implement pagination; catalog list rendering is bounded by dataset size (~hundreds). | Admin list pages (`ProjectsList`, `Disasters`, `Technologies`) render full datasets without page-size caps; there is no shared pagination primitive. | medium |
| PER-008 | Image optimization | All images use HTTPS; assets referenced from `src/assets/` are size-appropriate for the radar use-case. | No `loading="lazy"` on `<img>` tags below the fold; no WebP/AVIF conversion in the build; no responsive `srcset`. Legacy CSVs in `src/assets/csv/` are shipped in the bundle path (dead data, per Maintainability audit). | medium |
| PER-010 | Browser caching headers | GH Pages sets default long-cache headers on hashed CRA output (`static/js/main.<hash>.js`); `_headers` is present. | `_headers` does not set explicit `Cache-Control: public, max-age=31536000, immutable` for fingerprinted assets or `no-cache` for `index.html`. GH Pages ignores `_headers` — only takes effect if proxied. | medium |
| PER-011 | Frontend rendering performance | Some pages use memoization patterns; Chakra/MUI internal virtualization for select components; no obvious re-render storms in the audited flows. | No `react-window`/`react-virtualized` on long admin lists; `react-hooks/exhaustive-deps` is **off** in ESLint (`package.json`), which lets stale-closure bugs / redundant renders slip in. | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| PER-007 | Bundle size optimization | No `React.lazy(() => import(...))` anywhere in `src/`; no dynamic imports; no `webpack-bundle-analyzer` config. Two full UI kits (`@chakra-ui/react` 1.8 + `@mui/material` 5 + `@mui/icons-material` 5), plus `framer-motion@4`, `leaflet`, `react-leaflet`, `react-responsive-carousel`, `react-csv`, `papaparse`, `country-list`, and `rc-slider`/`rc-tooltip` all load in the initial chunk. `bcryptjs` (unused) and `crypto-browserify` are still bundled. | medium | P2 |

### N/A (14 items)

| Check ID | Item | Reason |
|----------|------|--------|
| PER-001 | N+1 query prevention | No client-side ORM/database. |
| PER-002 | Database query optimization | No client-side database. |
| PER-003 | Caching strategy | No `redis`/`memcached`/`any_database` tag on the frontend; catalog `localStorage` cache is a client-side heuristic covered informally. |
| PER-006 | Connection pooling | Browser `fetch` handles HTTP/1.1 keep-alive natively; no pool to configure. |
| PER-012 | API response compression | No `nginx`/`django`/`express`/`any_api` tag on the frontend; server concern. |
| PER-013 | Efficient serialization | Server concern. |
| PER-014 | Request/response size limits | Server concern; the SPA sends small JSON bodies. |
| PER-015 | Database query logging | No client-side database. |
| PER-016 | Container resource allocation | No containers. |
| PER-017 | Horizontal scaling configuration | Static hosting is inherently horizontal. |
| PER-019 | LLM response streaming | No AI/ML at runtime. |
| PER-020 | Embedding batch processing | No AI/ML at runtime. |
| PER-021 | Vector search optimization | No AI/ML at runtime. |
| PER-022 | LLM token usage optimization | No AI/ML at runtime. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

#### PER-007: Bundle size optimization

**Current state:** Single eager bundle carrying two UI libraries plus dead deps.
**Fix:**
1. Pick one UI kit as the primary and migrate the other over time; treat the mixed stack as a debt to burn down (documented in Maintainability audit).
2. Split routes with `React.lazy` in `src/navigation/AppNav.tsx`:
```tsx
const Search = React.lazy(() => import('pages/search/Search'));
const ProjectsList = React.lazy(() => import('pages/projects/ProjectsList'));
// ...
<Suspense fallback={<Loader />}>
  <Routes>{/* ... */}</Routes>
</Suspense>
```
3. Remove unused deps: `bcryptjs`, `@types/bcryptjs`, `crypto-browserify` (see Maintainability MNT-006), `react-lorem-ipsum` if not used in prod.
4. Add `source-map-explorer` to `devDependencies` and a `yarn analyze` script; publish the report as a CI artifact on `develop.yml`.

**Effort:** Medium (largest win from route-splitting Chakra/MUI-heavy pages; UI-kit consolidation is Large).

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| PER-004 | Pagination implementation | Introduce a shared `usePagination` hook or `<Pagination>` primitive; apply to admin list pages with a 25/50/100 page-size selector. | Short |
| PER-008 | Image optimization | Add `loading="lazy"` to all below-the-fold `<img>` tags; run `sharp`/`imagemin` on `src/assets/images/*` at build; consider `.webp` variants with `<picture>`. | Short |
| PER-010 | Browser caching headers | Extend `public/_headers` (Netlify) with `/static/*` immutable long-cache and `/index.html` `no-cache`; add equivalent behaviour if migrating off GH Pages. | Quick win |
| PER-011 | Frontend rendering performance | Turn `react-hooks/exhaustive-deps` back on (see Maintainability MNT-015) and fix flagged sites; adopt `react-window` for admin lists >200 rows. | Short |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved or risk-accepted (none present)
- [ ] Quality attribute score >= 50% (currently 62.5% — met)
- [ ] Route-level code splitting lands before the next major UI-kit change
- [ ] Bundle size trend published in CI (regressions visible per PR)
