---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T09:36:00Z"
config_version: 3

coverage:
  total_source_files: 122
  unit:
    test_files: 65
    file_coverage_pct: 63.1
    file_coverage_rating: "Adequate"
  integration:
    test_files: 30
    file_coverage_pct: 39.3
    file_coverage_rating: "Low"
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
  line_coverage_pct: 92.45
  line_coverage_rating: "Exemplary"
  test_count: 457

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
    integration_test_files: 28
    integration_file_coverage_pct: 88.9
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
  previous_audit: "2026-09-08T21:53"
  unit_file_coverage_change: 0
  integration_file_coverage_change: 2.4
  line_coverage_change: 2.24
  e2e_gaps_change: 0
  security_gaps_change: -1
  accessibility_gaps_change: -3
---

# Frontend Test Audit

> **Unit File Coverage**: 63.1% (77/122 files) · Adequate
> **Integration File Coverage**: 39.3% (48/122 files) · Low
> **Line Coverage**: 92.45% · Exemplary
> **Tests**: 457
> **Audited**: 2026-09-09

Notes: overall integration file % is still pulled down by component modules that correctly have **unit** tests only. Pages alone are **88.9%** integration-covered. E2E, security, and accessibility identified areas are fully covered.

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
| components | `src/components/**/*.test.tsx` (46 files) | ~206 | Drawers, lists, navbar, filters, shared UI, badges |
| helpers | `src/helpers/*.test.ts(x)` + auth | ~37 | apiClient (incl. 401 session clear), dataUtils, ProjectForm, auth |
| radar / ui / layouts | co-located `*.test.tsx` | ~18 | RadarProvider, SVG hover, AppUiProvider, MainLayout |
| pages (helpers/widgets) | SelectMultiple, ProjectSlider, page helpers | ~17 | Form widgets + pure page helpers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/helpers/databaseClient.tsx` | helpers | Supabase/database client wiring in isolation |
| `src/components/constants/app.ts` | components | Optional — low-value constants |
| `src/components/drawers/tech/colors.ts` | components | Optional — color token map |
| `src/index.tsx` | root | Bootstrap entry — usually excluded from unit focus |

---

## Integration Tests

Tests that verify components working together across boundaries — pages with mocked API, navigation shells.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| components | 53 | 0 | 3.8% |
| pages | 45 | 28 | 88.9% |
| helpers | 7 | 0 | 28.6% |
| radar | 6 | 0 | 0% |
| ui | 3 | 0 | 0% |
| layouts | 2 | 0 | 0% |
| navigation | 3 | 1 | 100% |
| root | 3 | 1 | 33.3% |
| **Total** | **122** | **30** | **39.3%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| pages | `src/pages/**/*.test.tsx` (28 files) | ~170 | Home, Search, CRUD, details, auth, radar/map, ProjectsRadar, DisasterEvent |
| navigation | `src/navigation/AppNav.test.tsx` | ~5 | Route shell + nav wiring |
| root | `src/tests/App.test.tsx` | ~2 | App provider stack |

### Integration Tests Needed

No critical page-shell gaps remaining. Remaining uncovered page modules are helpers/widgets already unit-tested (`ProjectSlider`, `SelectMultiple`, page helpers) or thin type/context files (`OutletContext.ts`).

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

None for identified critical journeys. Optional stretch: volunteer/about public browse, delete disaster-event.

---

## Security Tests

> **7** of **7** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| helpers | `auth.test.ts` | isSignedIn / isAdmin / clearSession edges |
| helpers | `apiClient.test.ts` | Bearer attach, ApiError, **401 clears session** |
| pages | `SignIn.test.tsx` | Auth client + session storage |
| pages | `Register.test.tsx` | Admin-only register gate |
| pages | `ProjectDetails.test.tsx` | XSS: script markup rendered as text |
| pages / e2e | Review/edit/register/delete specs | Non-admin redirect + admin success paths |

### Security Tests Needed

None for identified areas.

---

## Accessibility Tests

> **14** of **14** interactive surfaces covered · **0** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| pages | SignIn, Register, Search (+ modal), NotFound404, RadarView | jest-axe |
| pages | RadarMapView | Marker names + axe |
| helpers | ProjectForm | Label association + axe |
| components | Filter, FilterComponent, FilterDrawer, HowToAndSvg, MenuIcon | jest-axe |
| ui | ColorModeSwitcher | Accessible name + axe |

### Accessibility Tests Needed

None for identified surfaces.

---

## Test Health Observations

No issues observed.

---

## Recommendations

1. **[P2]** Optional CI coverage threshold to lock Exemplary line coverage (`yarn test:unit --coverage`).
2. **[P3]** Thin unit coverage for `databaseClient.tsx` if you want helper unit % at 100%.
3. **[P3]** Optional Cypress for public About/Volunteers browse journeys.

## Acceptance Criteria

- [x] Critical business logic has unit tests
- [x] Key user journeys have E2E coverage
- [x] Authentication and authorization paths have security tests
- [x] Core interactive components have accessibility checks
- [x] All tests pass: `CI=true yarn test:unit --watchAll=false`
