---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-08T21:53:00Z"
config_version: 3

coverage:
  total_source_files: 122
  unit:
    test_files: 65
    file_coverage_pct: 63.1
    file_coverage_rating: "Adequate"
  integration:
    test_files: 27
    file_coverage_pct: 36.9
    file_coverage_rating: "Low"
  e2e:
    journeys_identified: 16
    journeys_covered: 16
    gaps: 0
  security:
    areas_identified: 7
    areas_covered: 6
    gaps: 1
  accessibility:
    components_identified: 14
    components_covered: 11
    gaps: 3
  line_coverage_pct: 90.21
  line_coverage_rating: "Exemplary"
  test_count: 447

by_scope:
  "components":
    source_files: 53
    unit_test_files: 46
    unit_file_coverage_pct: 96.2
    integration_test_files: 0
    integration_file_coverage_pct: 3.8
  "pages":
    source_files: 45
    unit_test_files: 5
    unit_file_coverage_pct: 13.3
    integration_test_files: 25
    integration_file_coverage_pct: 82.2
  "helpers":
    source_files: 7
    unit_test_files: 6
    unit_file_coverage_pct: 85.7
    integration_test_files: 0
    integration_file_coverage_pct: 28.6
  "radar":
    source_files: 6
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 0
  "ui":
    source_files: 3
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 0
  "layouts":
    source_files: 2
    unit_test_files: 1
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 0
  "navigation":
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 66.7
    integration_test_files: 1
    integration_file_coverage_pct: 100
  "root":
    source_files: 3
    unit_test_files: 1
    unit_file_coverage_pct: 33.3
    integration_test_files: 1
    integration_file_coverage_pct: 33.3

delta:
  previous_audit: "2026-09-08T20:29"
  unit_file_coverage_change: -2.7
  integration_file_coverage_change: 1.1
  line_coverage_change: 0.08
  e2e_gaps_change: -2
  security_gaps_change: -1
  accessibility_gaps_change: -1
---

# Frontend Test Audit

> **Unit File Coverage**: 63.1% (77/122 files) · Adequate
> **Integration File Coverage**: 36.9% (45/122 files) · Low
> **Line Coverage**: 90.21% · Exemplary
> **Tests**: 447
> **Audited**: 2026-09-08

Notes on integration %: overall integration file coverage is pulled down by component modules that correctly have **unit** tests but no separate page/route integration harness. Pages alone are **82.2%** integration-covered. Line coverage remains Exemplary. E2E journeys are now fully covered (register + delete closed).

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| components | 53 | 46 | 96.2% |
| pages | 45 | 5 | 13.3% |
| helpers | 7 | 6 | 85.7% |
| radar | 6 | 3 | 100% |
| ui | 3 | 3 | 100% |
| layouts | 2 | 1 | 100% |
| navigation | 3 | 0 | 66.7% |
| root | 3 | 1 | 33.3% |
| **Total** | **122** | **65** | **63.1%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| components | `src/components/**/*.test.tsx` (46 files) | ~204 | Drawers, lists, navbar, filters, shared UI |
| helpers | `src/helpers/*.test.ts(x)` + auth | ~35 | apiClient, dataUtils, locationUtils, Loader, ProjectForm, auth |
| radar / ui / layouts | co-located `*.test.tsx` | ~18 | RadarProvider, SVG hover, AppUiProvider, MainLayout |
| pages (helpers/widgets) | SelectMultiple, ProjectSlider, page helpers | ~17 | Form widgets + pure page helpers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/constants/app.ts` | components | Constants / color tokens — optional low-value unit checks |
| `src/components/drawers/tech/colors.ts` | components | Constants / color tokens — optional low-value unit checks |
| `src/helpers/databaseClient.tsx` | helpers | Database/supabase client wiring in isolation |
| `src/index.tsx` | root | Bootstrap entry — usually excluded from unit focus |

---

## Integration Tests

Tests that verify components working together across boundaries — pages with mocked API, navigation shells.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| components | 53 | 0 | 3.8% |
| pages | 45 | 25 | 82.2% |
| helpers | 7 | 0 | 28.6% |
| radar | 6 | 0 | 0% |
| ui | 3 | 0 | 0% |
| layouts | 2 | 0 | 0% |
| navigation | 3 | 1 | 100% |
| root | 3 | 1 | 33.3% |
| **Total** | **122** | **27** | **36.9%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| pages | `src/pages/**/*.test.tsx` (25 files) | ~164 | Home, search, CRUD forms, details, auth pages, radar views |
| navigation | `src/navigation/AppNav.test.tsx` | ~5 | Route shell + nav wiring |
| root | `src/tests/App.test.tsx` | ~2 | App provider stack |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/pages/disasters/DisasterEvent.tsx` | pages | Single disaster event detail view |
| `src/pages/Home.tsx` | pages | Route wrapper → HomePage render |
| `src/pages/projectsRadar/ProjectsRadar.tsx` | pages | Projects radar page load + filters |

---

## End-to-End (E2E) Tests

> **16** of **16** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `cypress/e2e/create-disaster-event.cy.ts` | Create disaster event |
| `cypress/e2e/create-disaster.cy.ts` | Create disaster type |
| `cypress/e2e/create-project.cy.ts` | Create project |
| `cypress/e2e/create-technology.cy.ts` | Create technology |
| `cypress/e2e/delete-flows.cy.ts` | Admin delete project + disaster type |
| `cypress/e2e/edit-disaster-event.cy.ts` | Edit disaster event |
| `cypress/e2e/edit-disaster.cy.ts` | Edit disaster type |
| `cypress/e2e/edit-project.cy.ts` | Edit project |
| `cypress/e2e/edit-technology.cy.ts` | Edit technology |
| `cypress/e2e/home-browse.cy.ts` | Home sections + Launch Radar |
| `cypress/e2e/map-view-browse.cy.ts` | Map markers + popup |
| `cypress/e2e/radar-navigation.cy.ts` | Radar stages/blip + quadrant back |
| `cypress/e2e/register-user.cy.ts` | Admin register user |
| `cypress/e2e/review-approve-project.cy.ts` | Admin review queue approve |
| `cypress/e2e/search-project-detail.cy.ts` | Search → project detail |
| `cypress/e2e/sign-in.cy.ts` | Sign-in success + session |

### E2E Tests Needed

No critical journey gaps remaining. Optional stretch: delete disaster-event, volunteer/about public browse.

---

## Security Tests

> **6** of **7** security-sensitive areas covered · **1** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| helpers | `src/components/shared/helpers/auth.test.ts` | isSignedIn / isAdmin / clearSession edges |
| helpers | `src/helpers/apiClient.test.ts` | Bearer attach, body passthrough, ApiError |
| pages | `src/pages/users/signIn/SignIn.test.tsx` | Auth client + session storage |
| pages | `src/pages/users/register/Register.test.tsx` | Admin-only register gate |
| pages | `src/pages/projects/projectDetails/ProjectDetails.test.tsx` | XSS: script markup rendered as text |
| pages / e2e | Review/edit/register/delete specs | Non-admin redirect + admin success paths |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Token expiry UX | helpers/pages | Stale token clears session / re-auth prompt |

---

## Accessibility Tests

> **11** of **14** interactive surfaces covered · **3** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| pages | `SignIn`, `Register`, `Search`, `NotFound404`, `RadarView` | jest-axe smoke (+ radar tabs) |
| components | `Filter`, `FilterComponent`, `FilterDrawer`, `HowToAndSvg`, `MenuIcon` | jest-axe on interactive UI |
| ui | `ColorModeSwitcher.test.tsx` | Accessible name + axe |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| ProjectForm fields | helpers | Label association |
| SearchView / review modals | pages | Focus trap + Escape |
| Map markers / popups | pages | Accessible names |

---

## Test Health Observations

No issues observed — prior stub/empty `it()` suites (QuadrantHorizonList, CloseIcon, RadarView, etc.) now assert behavior.

---

## Recommendations

1. **[P1]** Keep line coverage Exemplary — optional CI threshold on `yarn test:unit --coverage`.
2. **[P2]** Close remaining a11y gaps (ProjectForm, SearchView/review modals, map popups) and token-expiry security UX.
3. **[P3]** Add thin integration coverage for `Home.tsx`, `ProjectsRadar.tsx`, and `DisasterEvent.tsx` route shells.

## Acceptance Criteria

- [x] Critical business logic has unit tests
- [x] Key user journeys have E2E coverage
- [x] Authentication and authorization paths have security tests
- [x] Core interactive components have accessibility checks
- [x] All tests pass: `CI=true yarn test:unit --watchAll=false`
