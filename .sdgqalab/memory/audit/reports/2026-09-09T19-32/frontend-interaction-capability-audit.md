---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: interaction-capability
quality_attribute_name: Interaction Capability
iso_characteristic: "ISO/IEC 25010:2023 Interaction Capability (appropriateness recognizability, learnability, operability, user error protection, user engagement, inclusivity, user assistance, self-descriptiveness); WCAG 2.2 / ISO 40500"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 8
  partial: 5
  fail: 1
  na: 4
  applicable: 14
  score_pct: 75.0
  rating: "Solid"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 3
  p3_improvement: 3

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: pending
---

# Interaction Capability Audit — Frontend (React / TypeScript / CRA)

> **Score**: 75.0% · Solid
> **Results**: 8 pass · 5 partial · 1 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 3
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Interaction Capability; WCAG 2.2 / ISO 40500

---

## Summary

Accessibility and UX fundamentals are in **good shape**: a skip link is present in the layout, `jest-axe` gates unit tests, Chakra + MUI supply semantic primitives and ARIA scaffolding, most images and icon buttons have accessible labels, empty states are handled on list pages, and the layout is responsive. The main gaps are (a) **no i18n framework** despite a global user base; (b) the **`SignIn` form** uses `FormLabel` without `htmlFor`/`id` on `Input` (screen readers can't associate); (c) several destructive admin actions rely on `window.confirm` or the browser's native `alert()`, and errors bubble via `alert()` rather than a toast; (d) some component `_focus={{}}` overrides remove Chakra's default focus rings. No AI-interaction checks are applicable (no AI at runtime).

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Public-facing SPA — users include disaster-risk practitioners globally, including screen-reader users. |
| Interfaces | User inputs via forms, dropdowns, map interactions, radar clicks; output via Chakra/MUI components and Leaflet map. |
| Data contracts | JSON REST for CRUD; localised display is browser-locale-driven. |
| AI/ML behavior | None at runtime — INT-015/016/017/018 do not apply. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (8 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| INT-001 | Semantic HTML | Layout uses `<header>`/`<nav>`/`<main>` via Chakra + `src/navigation/AppNav.tsx`; Chakra/MUI wrap interactive primitives as `<button>`/`<a>`; no widespread `<div onClick>` in the audited paths. |
| INT-002 | Alt text for images | `src/components/shared/image/Image.tsx` enforces an `alt` prop; the UNDP + UN logos and project preview cards carry descriptive `alt`; `ProjectForm` uses `htmlFor` on image-related fields. |
| INT-004 | Color contrast | Chakra + MUI defaults meet AA for the built-in palette; `jest-axe` is installed (`devDependencies: "jest-axe": "8.0.0", "@types/jest-axe": "3.5.9"`) and referenced from unit tests, catching contrast regressions in tested components. |
| INT-006 | ARIA attributes | Many `aria-label` uses across nav, icon buttons, and menus (e.g. `MenuToggle`, `AppBottomNav`, `MenuIcon`, `AppMobileHeader`); no obvious redundant roles on semantic tags. |
| INT-008 | Loading states | `SignIn` renders `<Spinner>` while `loading`; async pages consume `isLoading` from the API hooks; `WaitingForRadar` acts as the radar fallback. |
| INT-010 | Responsive design | `public/index.html` sets `<meta name="viewport" content="width=device-width, initial-scale=1">`; `AppMobileHeader`/`AppBottomNav`/`FilterDrawer` provide mobile-specific patterns; Chakra breakpoints used throughout. |
| INT-011 | Consistent navigation | Shared layout via `src/navigation/AppNav.tsx` with `MenuLinks` + `MenuItem` primitives across desktop and mobile; active-link styling handled by react-router-dom `NavLink` patterns. |
| INT-012 | Empty states | List pages render empty-state UX (per project-context "empty states on list pages"); search returns friendly "no results" messaging. |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| INT-003 | Keyboard navigation | Skip link exists (grep hit in `src/navigation/AppNav.scss` + `.tsx`); Chakra components provide keyboard handling; no positive `tabindex`. | Some components use `_focus={{}}` to suppress Chakra's default focus ring without a replacement indicator; SPA route changes do not explicitly move focus to the new page title; modal focus trapping relies on Chakra defaults (verify per-modal). | high |
| INT-005 | Form labels and validation | `ProjectForm` (admin CRUD) uses `htmlFor` on inputs. | `src/pages/users/signIn/SignIn.tsx` `FormLabel` has no `htmlFor` and `Input`s lack `id`; the label is only visually associated. `handleSignIn` uses `alert()` for both success and failure, which is not screen-reader-friendly. `SelectMultiple` in admin flows may lack `aria-describedby` on error hints. | high |
| INT-007 | Screen reader compatibility | Chakra `useToast` provides `role="status"` when used; page titles are set for major routes via React helpers. | No global `aria-live` region for API errors surfaced via `alert()`/`console.error`; page title updates on route change are not consistent across all pages; some visually-hidden text (screen-reader-only) is inconsistent. | medium |
| INT-009 | Error state UX | Root `ErrorBoundary` renders a user-friendly fallback with a Reload button; API errors are caught in `apiClient`. | `SignIn` uses `alert('Incorrect credentials, please check and try again')` and `alert('Successfully Signed In')` — poor UX and inaccessible; admin CRUD pages log to `console.error` without user-visible messaging (see Reliability REL-001). No custom 404 page beyond `NotFound404.tsx` — verify it's routed. | high |
| INT-013 | Confirmation for destructive actions | Some CRUD flows include modal-style confirmation. | Some admin actions rely on `window.confirm` (not styled, not localisable) or execute deletion via a single click; there is no "type to confirm" for high-blast-radius actions (delete disaster event, delete project). | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| INT-014 | i18n framework | No i18n library in `package.json` (no `react-i18next`, `react-intl`, `i18next`, `next-intl`); all user-facing strings are hardcoded in components. Given the FTR4DRR audience (global disaster-risk practitioners), single-language delivery is a real inclusivity gap. | low | P3 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| INT-015 | AI transparency | No AI/ML at runtime. |
| INT-016 | AI response controllability | No AI/ML at runtime. |
| INT-017 | AI error communication | No AI/ML at runtime. |
| INT-018 | AI output feedback mechanism | No AI/ML at runtime. |

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
| INT-003 | Keyboard navigation | Remove `_focus={{}}` overrides that hide the ring; if a bespoke ring is required, define it in the Chakra theme (`focusVisibleRing`). On SPA navigation, move focus to the new `<h1>` or main landmark via a `useFocusOnRouteChange()` hook. | Short |
| INT-005 | Form labels and validation | In `SignIn.tsx`, add `id="signin-email"` and `htmlFor="signin-email"` (same for password); replace `alert()` with an in-form error `<Text color="red.500" role="alert">`. Audit `SelectMultiple` for `aria-describedby` links to help text. | Quick win |
| INT-009 | Error state UX | Replace all `alert()` calls with Chakra `useToast` (status `error`/`success`) — role is set correctly by Chakra. Ensure `NotFound404` is wired as the react-router catch-all. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| INT-007 | Screen reader compatibility | Add a single top-level `aria-live="polite"` toast anchor (Chakra's `ToastContainer` handles this); introduce a `useDocumentTitle(title)` hook and call it in every page's `useEffect`. | Short |
| INT-013 | Confirmation for destructive actions | Replace `window.confirm` with a Chakra `AlertDialog` component (`ConfirmDialog`) with an explicit "Delete" destructive button; add a "type the item name to confirm" pattern for bulk / high-blast deletes. | Short |
| INT-014 | i18n framework | Adopt `react-i18next` with `en` as the default namespace; extract strings incrementally starting with nav, buttons, and empty states. Ship first with `en` + one pilot locale (e.g. `es` or `fr`) aligned with UNDP mission priorities. | Medium |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved (none present)
- [ ] Quality attribute score >= 50% (currently 75.0% — met)
- [ ] `SignIn` form is screen-reader-associable and `alert()` is replaced with toast
- [ ] Focus visibility is preserved (no un-replaced `_focus={{}}` in shipped components)
