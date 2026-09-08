---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-08T20:29:00Z"
config_version: 3

coverage:
  total_source_files: 120
  unit:
    test_files: 63
    file_coverage_pct: 65.8
    file_coverage_rating: "Adequate"
  integration:
    test_files: 28
    file_coverage_pct: 35.8
    file_coverage_rating: "Low"
  e2e:
    journeys_identified: 16
    journeys_covered: 14
    gaps: 2
  security:
    areas_identified: 7
    areas_covered: 5
    gaps: 2
  accessibility:
    components_identified: 14
    components_covered: 10
    gaps: 4
  line_coverage_pct: 90.13
  line_coverage_rating: "Exemplary"
  test_count: 442

by_scope:
  "components":
    source_files: 51
    unit_test_files: 46
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 3.9
  "pages":
    source_files: 45
    unit_test_files: 4
    unit_file_coverage_pct: 20.0
    integration_test_files: 26
    integration_file_coverage_pct: 77.8
  "helpers":
    source_files: 7
    unit_test_files: 6
    unit_file_coverage_pct: 85.7
    integration_test_files: 0
    integration_file_coverage_pct: 28.6
  "radar":
    source_files: 6
    unit_test_files: 3
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "ui":
    source_files: 3
    unit_test_files: 3
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "layouts":
    source_files: 2
    unit_test_files: 1
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "navigation":
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 66.7
    integration_test_files: 1
    integration_file_coverage_pct: 100.0
  "root":
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 1
    integration_file_coverage_pct: 33.3

delta:
  previous_audit: "2026-09-08T16:45"
  unit_file_coverage_change: -1.7
  integration_file_coverage_change: -26.0
  line_coverage_change: 6.29
  e2e_gaps_change: -5
  security_gaps_change: -2
  accessibility_gaps_change: -8
---

# Frontend Test Audit

> **Unit File Coverage**: 65.8% (79/120 files) · Adequate
> **Integration File Coverage**: 35.8% (43/120 files) · Low
> **Line Coverage**: 90.13% · Exemplary
> **Tests**: 442
> **Audited**: 2026-09-08

Notes on integration %: overall integration file coverage is pulled down by component modules that correctly have **unit** tests but no separate page/route integration harness. Pages alone are **77.8%** integration-covered. Line coverage is the strongest signal of exercised code and is now Exemplary.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| components | 51 | 46 | 100.0% |
| pages | 45 | 4 | 20.0% |
| helpers | 7 | 6 | 85.7% |
| radar | 6 | 3 | 100.0% |
| ui | 3 | 3 | 100.0% |
| layouts | 2 | 1 | 100.0% |
| navigation | 3 | 0 | 66.7% |
| root | 3 | 0 | 0.0% |
| **Total** | **120** | **63** | **65.8%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| components | `src/components/**/*.test.tsx` (46 files) | ~200 | Drawers, filters, lists, navbar, badges, views |
| helpers | `src/helpers/*.test.ts(x)` (6 files) | ~40 | apiClient, dataUtils, locationUtils, ProjectForm* |
| radar | `src/radar/**/*.test.tsx` (3 files) | ~15 | RadarProvider, RadarShell, TechDescription |
| ui | `src/ui/*.test.tsx` (3 files) | ~8 | AppUiProvider, ColorModeSwitcher, MainLayout |
| pages | `helpers.test` / `HomeCards.test` (4 files) | ~15 | Page helpers and home cards |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/helpers/databaseClient.tsx` | helpers | DATA_VERSION refresh / localStorage purge behavior |
| `src/navigation/AppNav.tsx` | navigation | Route table composition (beyond AppNav integration smoke) |
| `src/App.tsx` / `src/index.tsx` | root | Bootstrap wiring smoke (low priority) |

---

## Integration Tests

Tests that verify components working together across boundaries.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| components | 51 | 0 | 3.9% |
| pages | 45 | 26 | 77.8% |
| helpers | 7 | 0 | 28.6% |
| radar | 6 | 0 | 0.0% |
| ui | 3 | 0 | 0.0% |
| layouts | 2 | 0 | 0.0% |
| navigation | 3 | 1 | 100.0% |
| root | 3 | 1 | 33.3% |
| **Total** | **120** | **28** | **35.8%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| pages | `src/pages/**/*.test.tsx` (~26 files) | ~180 | Page/API workflows with mocks |
| navigation | `src/navigation/AppNav.test.tsx` | ~5 | Route mounting |
| root | `src/tests/App.test.tsx`, `src/Logo.test.tsx` | ~4 | App shell |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/pages/disasters/DisasterEvent.tsx` | pages | Event detail load/edit entry |
| `src/pages/projectsRadar/ProjectsRadar.tsx` | pages | Radar launch page shell |
| `src/pages/Home.tsx` | pages | Legacy home vs HomePage routing (if still mounted) |

---

## End-to-End (E2E) Tests

> **14** of **16** critical journeys covered · **2** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `cypress/e2e/sign-in.cy.ts` | Sign-in success/failure, session, sign-out |
| `cypress/e2e/search-project-detail.cy.ts` | Search → modal → project detail |
| `cypress/e2e/radar-navigation.cy.ts` | Radar stages/blip + quadrant back |
| `cypress/e2e/map-view-browse.cy.ts` | Map markers + popup |
| `cypress/e2e/review-approve-project.cy.ts` | Admin review queue approve |
| `cypress/e2e/home-browse.cy.ts` | Home sections + Launch Radar |
| `cypress/e2e/create-project.cy.ts` | Create project |
| `cypress/e2e/edit-project.cy.ts` | Edit project |
| `cypress/e2e/create-disaster.cy.ts` | Create disaster type |
| `cypress/e2e/edit-disaster.cy.ts` | Edit disaster type |
| `cypress/e2e/create-technology.cy.ts` | Create technology |
| `cypress/e2e/edit-technology.cy.ts` | Edit technology |
| `cypress/e2e/create-disaster-event.cy.ts` | Create disaster event |
| `cypress/e2e/edit-disaster-event.cy.ts` | Edit disaster event |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Admin register user | P2 | Admin opens register, creates user, asserts API |
| Delete project / info / event | P3 | Admin delete confirm + API intercept |

---

## Security Tests

> **5** of **7** security-sensitive areas covered · **2** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| helpers | `src/components/shared/helpers/auth.test.ts` | isSignedIn / isAdmin / clearSession edges |
| helpers | `src/helpers/apiClient.test.ts` | Bearer attach, body passthrough, ApiError |
| pages | `src/pages/users/signIn/SignIn.test.tsx` | Auth client + session storage |
| pages | `src/pages/users/register/Register.test.tsx` | Admin-only register gate |
| pages / e2e | Review/edit specs | Non-admin redirect + admin success paths |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| XSS in rendered descriptions | components/pages | Untrusted HTML/markdown not executed |
| Token expiry UX | helpers/pages | Stale token clears session / re-auth prompt |

---

## Accessibility Tests

> **10** of **14** interactive surfaces covered · **4** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| pages | `SignIn.test.tsx`, `Register.test.tsx`, `Search.test.tsx`, `NotFound404.test.tsx` | jest-axe smoke |
| components | `Filter.test.tsx`, `FilterComponent.test.tsx`, `FilterDrawer.test.tsx` | jest-axe on filter UI |
| components | `HowToAndSvg.test.tsx`, `MenuIcon.test.tsx` | Trigger/name a11y |
| ui | `ColorModeSwitcher.test.tsx` | Accessible name + axe |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| Radar tabs (Stages/Tech/Project) | pages | Tab roles and keyboard |
| ProjectForm fields | helpers | Label association |
| SearchView / review modals | pages | Focus trap + Escape |
| Map markers / popups | pages | Accessible names |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/components/lists/components/Title.test.tsx` | No it() blocks detected | Inflates file coverage |
| `src/components/lists/quadrant/QuadrantHorizonList.test.tsx` | No it() blocks detected | Inflates file coverage |
| `src/components/lists/quadrant/ShowIcon.test.tsx` | No it() blocks detected | Inflates file coverage |
| `src/components/navbar/components/MenuItem.test.tsx` | No it() blocks detected | Inflates file coverage |
| `src/pages/views/RadarView.test.tsx` | No it() blocks detected | Inflates file coverage |
| `src/components/navbar/components/CloseIcon.test.tsx` | Smoke-only / trivial render | Limited behavioral coverage |

---

## Recommendations

1. **[P1]** Keep line coverage Exemplary — protect regressions in CI (`yarn test:unit --coverage` thresholds optional).
2. **[P2]** Add Cypress for admin register + delete flows; fill empty stub unit tests (`Title`, `MenuItem`, `RadarView`, etc.).
3. **[P3]** Extend jest-axe to radar tabs, ProjectForm, and SearchView modal; add XSS rendering guards.

## Acceptance Criteria

- [x] Critical business logic has unit tests
- [x] Key user journeys have E2E coverage
- [x] Authentication and authorization paths have security tests
- [x] Core interactive components have accessibility checks
- [x] All tests pass: `CI=true yarn test:unit --watchAll=false`
