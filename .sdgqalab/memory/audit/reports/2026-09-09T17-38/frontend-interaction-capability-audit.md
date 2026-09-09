---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "react-typescript"
quality_attribute: "interaction-capability"
quality_attribute_name: "Interaction Capability"
iso_characteristic: "Interaction Capability"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:39:00Z"
config_version: 3

score:
  pass: 2
  partial: 10
  fail: 2
  na: 4
  applicable: 14
  score_pct: 50.0
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 1
  p3_improvement: 11

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Interaction Capability Audit — Frontend

> **Score**: 50.0% · Adequate
> **Results**: 2 pass · 10 partial · 2 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 1 (INT-007 medium FAIL → P3; INT-014 low FAIL → P3; form/a11y PARTIALs dominate)
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: Interaction Capability (WCAG 2.2 / ISO 40500)

---

## Summary

Known a11y remediations landed (skip link, BackButton `aria-label`, image alts, `:focus-visible`). Loading and responsive shells are strong. Remaining gaps: generic alt text, div-as-button patterns, nav `_focus: outline none`, no `aria-live`/route titles, form validation ARIA, no i18n, and confirm/alert UX.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Public radar/map browse + admin CRUD SPA |
| Interfaces | Shared shell `NavApp` + Chakra/MUI UI |
| AI/ML behavior | None — INT-015..018 N/A |
| Checkpoint status | Unattended |

**Known remediations verified:** `AppNav.tsx` skip link; `BackButton.tsx` aria-label; project `alt` attributes; `index.css` focus-visible.

---

## Results

### PASS (2 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| INT-008 | Loading States | Widespread `loading` + `Loader`/`Spinner`/`WaitingForRadar` (e.g. `HomePage.tsx`, `RadarView.tsx`, `SignIn.tsx`) |
| INT-010 | Responsive Design | `public/index.html` viewport; Chakra breakpoints in `AppUiProvider.tsx`; `@media` in SCSS; `AppMobileHeader` + `AppBottomNav` |

### PARTIAL (10 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| INT-001 | Semantic HTML | Skip target `#main-content`; some `<h1>` (`Title.tsx`, ErrorBoundary) | `main-content` is a `div` not `<main>`; several `<div onClick>` (e.g. `Item.tsx`, `BlipList.tsx`, `Logo.tsx`) | high |
| INT-002 | Alt Text | Shared `Image` defaults `alt`; logos/project imgs have alt | Pervasive generic `alt='Project image'` (not descriptive of content) | high |
| INT-003 | Keyboard Navigation | Skip link; global `:focus-visible` in `index.css`; no positive tabindex | Nav buttons `_focus={{ outline: 'none' }}` in `MenuLinks.tsx`; clickable divs lack key handlers; no SPA focus move on route change | high |
| INT-004 | Color Contrast | Chakra/MUI themes; UNDP focus `#0062ac`; `jest-axe` in multiple tests | No `eslint-plugin-jsx-a11y`; dual themes; no systematic contrast tokens | medium |
| INT-005 | Form Labels and Validation | Chakra `FormLabel` on SignIn/Register/InfoAction | No `aria-invalid`/`aria-describedby`/`FormErrorMessage`; SignIn submit is `Button`+`onClick` not `type="submit"`; errors via `alert()` | high |
| INT-006 | ARIA Attributes | Icon buttons with `aria-label` (ColorModeSwitcher, BackButton, map markers); `role='alert'` on ErrorBoundary | No disclosure `aria-expanded` audit completeness; no `aria-live` | medium |
| INT-009 | Error State UX | Root `ErrorBoundary`; `ApiError` friendly messages; `NotFound404` | Only root boundary; many flows use `alert()`/`confirm()` | high |
| INT-011 | Consistent Navigation | Shared `AppLeftNav`/`AppBottomNav`/`AppMobileHeader` in `AppNav.tsx` | `MenuItem` is plain `Link` — no active route styling; mobile header logos only (nav via bottom bar) | medium |
| INT-012 | Empty States | "No projects found" / "No Projects to review" etc. | Mostly text-only; few CTAs | low |
| INT-013 | Destructive Confirmation | `confirm()` before deletes (`ProjectDetails`, `PageDetails`, `InfoDetails`) | Generic "Are you sure…"; browser dialog not styled danger CTA | medium |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| INT-007 | Screen Reader Compatibility | No `aria-live` in `src/`; static `<title>FTR4DRR</title>`; no `document.title` updates; no `.sr-only` utility usage found | medium | P3 |
| INT-014 | i18n Framework | No i18n library in `package.json`; all UI strings hardcoded English | low | P3 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| INT-015 | AI Transparency | any_ai_ml — no runtime AI |
| INT-016 | AI Response Controllability | any_ai_ml |
| INT-017 | AI Error Communication | any_ai_ml |
| INT-018 | AI Output Feedback | any_ai_ml |

---

## Remediation Roadmap

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| INT-001/003 | Semantics & keyboard | Replace div-onClick with `button`; use `<main id="main-content">`; remove Chakra `_focus outline:none` or replace with focus-visible ring | Short |
| INT-005 | Forms | Wire `htmlFor`/ids; `aria-invalid` + inline errors; prefer `type="submit"` | Short |
| INT-002 | Alts | Pass project/disaster title into `alt` instead of `'Project image'` | Quick win |
| INT-009 | Errors | Replace `alert()` with toast/`role=alert` regions | Short |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| INT-007 | SR | Add `aria-live` for search/load status; update `document.title` per route; add `.sr-only` | Short |
| INT-011 | Nav active | Use `NavLink` + `aria-current="page"` | Quick win |
| INT-013 | Confirm | Chakra `AlertDialog` with specific copy + danger button | Short |
| INT-004 | Contrast | Add jsx-a11y; document contrast-checked palette | Medium |
| INT-012 | Empty CTA | Add clear-filter / browse CTAs | Quick win |
| INT-014 | i18n | Only if multi-language required (UNDP often needs it later) | Large |

---

## Acceptance Criteria

- [ ] INT-001/003/005 high PARTIALs addressed for WCAG keyboard/forms
- [ ] INT-007 fail resolved or risk-accepted
- [x] Score >= 50% — met (borderline Adequate)
