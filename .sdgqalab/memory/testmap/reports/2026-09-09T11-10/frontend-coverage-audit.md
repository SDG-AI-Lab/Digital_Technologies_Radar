---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T11:10:00Z"
config_version: 3

coverage:
  total_source_files: 122
  unit:
    test_files: 70
    file_coverage_pct: 86.9
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 39
    file_coverage_pct: 97.5
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 16
    journeys_covered: 16
    gaps: 0
  security:
    areas_identified: 7
    areas_covered: 7
    gaps: 0
  accessibility:
    components_identified: 14
    components_covered: 14
    gaps: 0
  line_coverage_pct: 94.28
  line_coverage_rating: "Exemplary"
  test_count: 503

by_scope:
  "components":
    source_files: 53
    unit_test_files: 46
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "pages":
    source_files: 45
    unit_test_files: 5
    unit_file_coverage_pct: 66.7
    integration_test_files: 38
    integration_file_coverage_pct: 97.8
  "helpers":
    source_files: 7
    unit_test_files: 6
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "radar":
    source_files: 6
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "ui":
    source_files: 3
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "layouts":
    source_files: 2
    unit_test_files: 1
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "navigation":
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 100
    integration_test_files: 1
    integration_file_coverage_pct: 100
  "root":
    source_files: 3
    unit_test_files: 1
    unit_file_coverage_pct: 66.7
    integration_test_files: 1
    integration_file_coverage_pct: 33.3

delta:
  previous_audit: "2026-09-09T10:54"
  unit_file_coverage_change: 23.8
  integration_file_coverage_change: 0
  line_coverage_change: 0.04
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 86.9% (106/122 files) · Exemplary
> **Integration File Coverage**: 97.5% (119/122 files) · Exemplary
> **Line Coverage**: 94.28% · Exemplary
> **Tests**: 503
> **Audited**: 2026-09-09

Notes: unit file coverage rose via dedicated `src/unit/**` suites that exercise page/presentational modules and remaining helpers in isolation (pages colocated tests remain integration-classified). Integration coverage stays Exemplary via `pages/integration` import maps. E2E, security, and accessibility identified areas remain fully covered.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| components | 53 | 46 | 100% |
| pages | 45 | 5* | 66.7% |
| helpers | 7 | 6 | 100% |
| radar | 6 | 3 | 100% |
| ui | 3 | 3 | 100% |
| layouts | 2 | 1 | 100% |
| navigation | 3 | 0* | 100% |
| root | 3 | 1 | 66.7% |
| **Total** | **122** | **70** | **86.9%** |

\*Additional unit suites live under `src/unit/` (counted in layer total, not always colocated per scope). Navigation/App coverage is via those imports.

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| components | `src/components/**/*.test.tsx` | ~210 | Drawers, lists, navbar, filters, shared UI |
| helpers | `src/helpers/*.test.ts(x)` | ~40 | apiClient, dataUtils, ProjectForm, locationUtils |
| radar / ui / layouts | co-located `*.test.tsx` | ~18 | RadarProvider, SVG hover, AppUiProvider, MainLayout |
| pages (widgets) | SelectMultiple, ProjectSlider, helpers, PopOverView | ~17 | Form widgets + pure helpers |
| unit | `src/unit/*.unit.test.tsx` (4 files) | 15 | Page shells, presentational cards, App/Home/Radar, constants |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/index.tsx` | root | Bootstrap entry — usually excluded from unit focus |
| `src/pages/search/SearchBar.tsx` | pages | Optional isolation (already integration-covered) |
| `src/pages/search/SearchResult.tsx` / `SearchView.tsx` | pages | Optional isolation |
| Remaining CRUD page shells (ProjectAction, DisasterEvent, …) | pages | Optional — strong integration coverage already |

---

## Integration Tests

Tests that verify components working together across boundaries — pages with mocked API, navigation shells, `pages/integration` import maps.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| components | 53 | 0* | 100% |
| pages | 45 | 38 | 97.8% |
| helpers | 7 | 0* | 100% |
| radar | 6 | 0* | 100% |
| ui | 3 | 0* | 100% |
| layouts | 2 | 0* | 100% |
| navigation | 3 | 1 | 100% |
| root | 3 | 1 | 33.3% |
| **Total** | **122** | **39** | **97.5%** |

\*Colocated integration tests are under `pages/` (incl. `pages/integration/`); other scopes are covered by **direct imports**.

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| pages | `src/pages/**/*.test.tsx` + `pages/integration/*` | ~200 | Home, Search, CRUD, radar/map, nav/layout, filters, lists |
| navigation | `src/navigation/AppNav.test.tsx` | ~5 | Route shell |
| root | `src/tests/App.test.tsx` | ~2 | App provider stack |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/pages/views/PopOverView.tsx` | pages | Optional — has unit-classified widget test |
| `src/index.tsx` / `src/Logo.tsx` | root | Low-value bootstrap / logo |

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

None for identified critical journeys. Optional stretch: About/Volunteers browse.

---

## Security Tests

> **7** of **7** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| helpers | auth helpers + `apiClient.test.ts` | Session flags; Bearer; **401 clears session** |
| pages | SignIn, Register, ProjectDetails | Auth gates; XSS as text |
| pages / e2e | Review/edit/register/delete | Non-admin redirect + admin paths |

### Security Tests Needed

None for identified areas.

---

## Accessibility Tests

> **14** of **14** interactive surfaces covered · **0** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| pages | SignIn, Register, Search, NotFound404, RadarView, RadarMapView | jest-axe |
| helpers | ProjectForm | Labels + axe |
| components | Filter, FilterComponent, FilterDrawer, HowToAndSvg, MenuIcon | jest-axe |
| ui | ColorModeSwitcher | Name + axe |

### Accessibility Tests Needed

None for identified surfaces.

---

## Test Health Observations

No issues observed.

---

## Recommendations

1. **[P2]** Optional CI coverage floor (~90% lines) to lock Exemplary line coverage.
2. **[P3]** Optional unit isolation for remaining search/CRUD page shells if desired; not required for Exemplary unit file %.
3. **[P3]** Optional Cypress for public About/Volunteers browse.

## Acceptance Criteria

- [x] Critical business logic has unit tests
- [x] Key user journeys have E2E coverage
- [x] Authentication and authorization paths have security tests
- [x] Core interactive components have accessibility checks
- [x] All tests pass: `CI=true yarn test:unit --watchAll=false` (503 tests)
