---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-07T15:13:00Z"
config_version: 3

coverage:
  total_source_files: 120
  unit:
    test_files: 14
    file_coverage_pct: 12.5
    file_coverage_rating: "Critical"
  integration:
    test_files: 5
    file_coverage_pct: 4.2
    file_coverage_rating: "Critical"
  e2e:
    journeys_identified: 11
    journeys_covered: 4
    gaps: 7
  security:
    areas_identified: 7
    areas_covered: 0
    gaps: 7
  accessibility:
    components_identified: 10
    components_covered: 0
    gaps: 10
  line_coverage_pct: 24.41
  line_coverage_rating: "Critical"
  test_count: 77

by_scope:
  components:
    source_files: 53
    unit_test_files: 14
    unit_file_coverage_pct: 28.3
    integration_test_files: 1
    integration_file_coverage_pct: 1.9
  pages:
    source_files: 46
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 3
    integration_file_coverage_pct: 6.5
  helpers:
    source_files: 7
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 0
    integration_file_coverage_pct: 0
  radar:
    source_files: 6
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 0
    integration_file_coverage_pct: 0
  ui:
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 0
    integration_file_coverage_pct: 0
  layouts:
    source_files: 2
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 0
    integration_file_coverage_pct: 0
  navigation:
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 0
    integration_file_coverage_pct: 33.3

delta:
  previous_audit: null
  unit_file_coverage_change: null
  integration_file_coverage_change: null
  line_coverage_change: null
  e2e_gaps_change: null
  security_gaps_change: null
  accessibility_gaps_change: null
---

# Frontend Test Audit

> **Unit File Coverage**: 12.5% (15/120 files) · Critical
> **Integration File Coverage**: 4.2% (5/120 files) · Critical
> **Line Coverage**: 24.41% · Critical
> **Tests**: 77
> **Audited**: 2026-09-07

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: models, serializers, validators, utilities, hooks, guards, formatters.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|----------------|-------------|-----------------|-------------------|
| components | 53 | 14 | 28.3% |
| pages | 46 | 0 | 0% |
| helpers | 7 | 0 | 0% |
| radar | 6 | 0 | 0% |
| ui | 3 | 0 | 0% |
| layouts | 2 | 0 | 0% |
| navigation | 3 | 0 | 0% |
| **Total** | **120** | **14** | **12.5%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|---------------|-----------|---------------|-----------------|
| components | `src/components/drawers/filter/AppRanderSlider.test.tsx` | ~1 | AppRanderSlider.tsx |
| components | `src/components/header/AppMobileHeader.test.tsx` | ~4 | AppMobileHeader.tsx, UNLogo.tsx, UNDPLogo.tsx |
| components | `src/components/lists/components/BlipList.test.tsx` | ~3 | BlipList.tsx |
| components | `src/components/lists/components/ScrollableDiv.test.tsx` | ~6 | ScrollableDiv.tsx, ScrollableDiv.tsx |
| components | `src/components/lists/components/Title.test.tsx` | ~4 | Title.tsx |
| components | `src/components/lists/quadrant/QuadrantHorizonList.test.tsx` | ~1 | QuadrantHorizonList.tsx |
| components | `src/components/lists/quadrant/ShowIcon.test.tsx` | ~7 | ShowIcon.tsx |
| components | `src/components/navbar/AppBottomNav.test.tsx` | ~2 | AppBottomNav.tsx, MenuItem.tsx |
| components | `src/components/navbar/components/CloseIcon.test.tsx` | ~1 | CloseIcon.tsx |
| components | `src/components/navbar/components/MenuItem.test.tsx` | ~4 | MenuItem.tsx |
| components | `src/components/navbar/MenuToggle.test.tsx` | ~3 | MenuToggle.tsx |
| components | `src/components/shared/helpers/HelperUtils.test.ts` | ~16 | HelperUtils.ts |
| components | `src/components/shared/helpers/HelperUtils_2.test.ts` | ~5 | HelperUtils.ts |
| components | `src/components/shared/helpers/HelperUtils_3.test.ts` | ~10 | HelperUtils.ts |

### Unit Tests Needed

| File | Scope | What to Test |
|------|---------------|--------------|
| `src/components/constants/app.ts` | components | Component render props, conditional UI branches |
| `src/components/drawers/components/LittleDrawer.tsx` | components | Component render props, conditional UI branches |
| `src/components/drawers/components/LittleDrawerIconButton.tsx` | components | Component render props, conditional UI branches |
| `src/components/drawers/filter/CustomFilter.tsx` | components | Filter state transforms and option rendering |
| `src/components/drawers/filter/FilterConstants.ts` | components | Pure helpers / constants edge cases |
| `src/components/drawers/filter/FilterUtilities.tsx` | components | Filter state transforms and option rendering |
| `src/components/drawers/filter/HandleRender.tsx` | components | Component render props, conditional UI branches |
| `src/components/drawers/FilterDrawer.tsx` | components | Filter state transforms and option rendering |
| `src/components/drawers/tech/colors.ts` | components | Pure helpers / constants edge cases |
| `src/components/drawers/tech/components/TechItem.tsx` | components | Component render props, conditional UI branches |
| `src/components/drawers/tech/TechList.tsx` | components | Component render props, conditional UI branches |
| `src/components/infoCard/InfoCard.tsx` | components | Component render props, conditional UI branches |
| `src/components/lists/components/BlipListMui.tsx` | components | Component render props, conditional UI branches |
| `src/components/lists/quadrant/HorizonItem.tsx` | components | Component render props, conditional UI branches |
| `src/components/lists/quadrant/HorizonItemMui.tsx` | components | Component render props, conditional UI branches |
| `src/components/lists/quadrant/Item.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/AppLeftNav.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/components/Logo.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/components/MenuIcon.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/components/UNDPLogo.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/components/UNLogo.tsx` | components | Component render props, conditional UI branches |
| `src/components/navbar/MenuLinks.tsx` | components | Component render props, conditional UI branches |
| `src/components/pageDetails/PageDetails.tsx` | components | Component render props, conditional UI branches |
| `src/components/PopOver.tsx` | components | Component render props, conditional UI branches |
| `src/components/projectPreview/ProjectPreviewCard.tsx` | components | Component render props, conditional UI branches |
| `src/components/projectsCollection/ProjectsCollection.tsx` | components | Component render props, conditional UI branches |
| `src/components/radar/HowToPopup.tsx` | components | Component render props, conditional UI branches |
| `src/components/shared/filter/Filter.tsx` | components | Filter state transforms and option rendering |
| `src/components/shared/filter/FilterComponent.tsx` | components | Filter state transforms and option rendering |
| `src/components/shared/filter/FilterItems.tsx` | components | Filter state transforms and option rendering |
| `src/components/shared/filter/MultiSelectFilter.tsx` | components | Filter state transforms and option rendering |
| `src/components/shared/genericButton/GenericButton.tsx` | components | Component render props, conditional UI branches |
| `src/components/shared/helpers/auth.ts` | components | Session flag helpers and clearSession side effects |
| `src/components/shared/image/Image.tsx` | components | Component render props, conditional UI branches |
| `src/components/shared/projectBadges/ProjectBadges.tsx` | components | Component render props, conditional UI branches |
| `src/components/views/blip/BlipView.tsx` | components | Component render props, conditional UI branches |
| `src/components/views/ContentView.tsx` | components | Component render props, conditional UI branches |
| `src/components/views/FilterTechNavView.tsx` | components | Filter state transforms and option rendering |
| `src/helpers/apiClient.ts` | helpers | Pure helpers / constants edge cases |
| `src/helpers/databaseClient.tsx` | helpers | Pure helpers / constants edge cases |
| `src/helpers/dataUtils.ts` | helpers | Pure helpers / constants edge cases |
| `src/helpers/Loader.tsx` | helpers | Pure helpers / constants edge cases |
| `src/helpers/locationUtils.ts` | helpers | Pure helpers / constants edge cases |
| `src/helpers/ProjectForm.tsx` | helpers | Pure helpers / constants edge cases |
| `src/helpers/ProjectFormFields.tsx` | helpers | Pure helpers / constants edge cases |
| `src/radar/components/BackButton.tsx` | radar | Component render props, conditional UI branches |
| `src/radar/components/svg-hover/HorizonsNameComp.tsx` | radar | Component render props, conditional UI branches |
| `src/radar/components/svg-hover/QuadrantNameComp.tsx` | radar | Component render props, conditional UI branches |
| `src/radar/components/WaitingForRadar.tsx` | radar | Component render props, conditional UI branches |
| `src/radar/RadarProvider.tsx` | radar | Component render props, conditional UI branches |
| `src/radar/tech/TechDescription.tsx` | radar | Component render props, conditional UI branches |
| `src/ui/AppUiProvider.tsx` | ui | Component render props, conditional UI branches |
| `src/ui/ColorModeSwitcher.tsx` | ui | Component render props, conditional UI branches |
| `src/ui/MainLayout.tsx` | ui | Component render props, conditional UI branches |
| `src/layouts/MapViewLayout.tsx` | layouts | Component render props, conditional UI branches |
| `src/layouts/RadarLayout.tsx` | layouts | Component render props, conditional UI branches |
| `src/navigation/AppNav.tsx` | navigation | Component render props, conditional UI branches |
| `src/navigation/context.tsx` | navigation | Component render props, conditional UI branches |
| `src/navigation/routes.ts` | navigation | Component render props, conditional UI branches |

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|----------------|-------------|----------------------|--------------------------|
| components | 53 | 1 | 1.9% |
| pages | 46 | 3 | 6.5% |
| helpers | 7 | 0 | 0% |
| radar | 6 | 0 | 0% |
| ui | 3 | 0 | 0% |
| layouts | 2 | 0 | 0% |
| navigation | 3 | 0 | 33.3% |
| **Total** | **120** | **5** | **4.2%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|---------------|-----------|---------------|--------------------|
| components | `src/components/infoCard/InfoCard.test.tsx` | ~1 | InfoCard.tsx |
| pages | `src/pages/map-view/mapview.test.tsx` | ~1 | RadarMapView.tsx, context.tsx |
| pages | `src/pages/views/QudrantView.test.tsx` | ~2 | QuadrantView.tsx |
| pages | `src/pages/views/RadarView.test.tsx` | ~4 | RadarView.tsx, context.tsx |
| tests | `src/tests/App.test.tsx` | ~2 | App.tsx |

### Integration Tests Needed

| File | Scope | What to Test |
|------|---------------|--------------|
| `src/pages/about/About.tsx` | pages | Page render with router + mocked API data |
| `src/pages/about/AboutContent.ts` | pages | Page render with router + mocked API data |
| `src/pages/about/AboutOrganization.tsx` | pages | Page render with router + mocked API data |
| `src/pages/disasters/DisasterEvent.tsx` | pages | Page render with router + mocked API data |
| `src/pages/disasters/DisasterEvents.tsx` | pages | Page render with router + mocked API data |
| `src/pages/disasters/Disasters.tsx` | pages | Page render with router + mocked API data |
| `src/pages/eventAction/EventAction.tsx` | pages | Page render with router + mocked API data |
| `src/pages/Home.tsx` | pages | Page render with router + mocked API data |
| `src/pages/homePage/components/HomeCard.tsx` | pages | Page render with router + mocked API data |
| `src/pages/homePage/components/HomeCardMini.tsx` | pages | Page render with router + mocked API data |
| `src/pages/homePage/components/RecentDisasterCardMini.tsx` | pages | Page render with router + mocked API data |
| `src/pages/homePage/components/RecentDisasters.tsx` | pages | Page render with router + mocked API data |
| `src/pages/homePage/helpers.ts` | pages | Page render with router + mocked API data |
| `src/pages/homePage/HomePage.tsx` | pages | Page render with router + mocked API data |
| `src/pages/infoAction/InfoAction.tsx` | pages | Page render with router + mocked API data |
| `src/pages/infoDetails/InfoDetails.tsx` | pages | Page render with router + mocked API data |
| `src/pages/map-view/helpers.tsx` | pages | Page render with router + mocked API data |
| `src/pages/map-view/ProjectSlider.tsx` | pages | Page render with router + mocked API data |
| `src/pages/NotFound404.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projectAction/helpers.ts` | pages | Page render with router + mocked API data |
| `src/pages/projectAction/ProjectAction.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projectAction/SelectMultiple.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projects/projectComponent/Project.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projects/projectDetails/ProjectDetails.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projects/projectOverlay/projectOverlay.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projects/ProjectsList.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projects/reviewProjects/ReviewProjects.tsx` | pages | Page render with router + mocked API data |
| `src/pages/projectsRadar/ProjectsRadar.tsx` | pages | Page render with router + mocked API data |
| `src/pages/Radar.tsx` | pages | Page render with router + mocked API data |
| `src/pages/search/Pagination.tsx` | pages | Page render with router + mocked API data |
| `src/pages/search/Search.tsx` | pages | Page render with router + mocked API data |
| `src/pages/search/SearchBar.tsx` | pages | Page render with router + mocked API data |
| `src/pages/search/SearchResult.tsx` | pages | Page render with router + mocked API data |
| `src/pages/search/SearchView.tsx` | pages | Page render with router + mocked API data |
| `src/pages/technologies/Technologies.tsx` | pages | Page render with router + mocked API data |
| `src/pages/users/register/Register.tsx` | pages | Page render with router + mocked API data |
| `src/pages/users/signIn/SignIn.tsx` | pages | Page render with router + mocked API data |
| `src/pages/views/OutletContext.ts` | pages | Page render with router + mocked API data |
| `src/pages/views/PopOverView.tsx` | pages | Page render with router + mocked API data |
| `src/pages/volunteers/VolunteerContent.ts` | pages | Page render with router + mocked API data |
| `src/pages/volunteers/VolunteerOrganization.tsx` | pages | Page render with router + mocked API data |
| `src/pages/volunteers/Volunteers.tsx` | pages | Page render with router + mocked API data |
| `src/helpers/apiClient.ts` | helpers | HTTP/cache boundaries with mocked fetch |
| `src/helpers/databaseClient.tsx` | helpers | HTTP/cache boundaries with mocked fetch |
| `src/helpers/dataUtils.ts` | helpers | HTTP/cache boundaries with mocked fetch |
| `src/helpers/ProjectForm.tsx` | helpers | Form submit wiring to apiClient |
| `src/helpers/ProjectFormFields.tsx` | helpers | Form submit wiring to apiClient |
| `src/radar/RadarProvider.tsx` | radar | Provider/router integration with child views |
| `src/navigation/AppNav.tsx` | navigation | Provider/router integration with child views |
| `src/navigation/routes.ts` | navigation | Provider/router integration with child views |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.
Tools: Cypress.

> **4** of **11** critical journeys covered · **7** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `cypress/e2e/create-project.cy.ts` | Admin creates a new project (form + intercepted API) |
| `cypress/e2e/create-technology.cy.ts` | Admin creates a technology info item |
| `cypress/e2e/create-disaster.cy.ts` | Admin creates a disaster type |
| `cypress/e2e/create-disaster-event.cy.ts` | Admin creates a disaster event |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Sign in with valid and invalid credentials | P1 | Assert redirect, error states, token storage |
| Register new user | P2 | Happy path and validation errors |
| Browse radar and open quadrant/blip details | P1 | Core visualization journey |
| Explore map view and open project slider | P1 | Map markers and project preview |
| Search projects/technologies | P2 | Query, results, pagination |
| Admin review / approve projects | P1 | RBAC-gated review workflow |
| View home page and project details as anonymous user | P2 | Public read journeys |

---

## Security Tests

Tests that verify authentication, authorization, input validation,
and protection against common vulnerabilities (OWASP Top 10).

> **0** of **7** security-sensitive areas covered · **7** gaps

### Existing Security Tests

No dedicated security assertions found in unit/integration suites (no deny-path auth tests, no XSS/validation security cases).

### Security Tests Needed

| Area | Scope | What to Test |
|------|---------------|--------------|
| Client session helpers (isAdmin / isSignedIn / clearSession) | components | Unit tests for auth.ts; deny UI when token missing |
| Sign-in flow | pages | Valid/invalid credentials; no token leakage in errors |
| Register flow | pages | Input validation; password handling |
| Admin-only pages (EventAction, InfoAction, ReviewProjects) | pages | Redirect/deny when non-admin |
| apiClient Authorization header | helpers | Attaches Bearer token; handles 401/403 |
| ProjectForm / ProjectFormFields input validation | helpers | Reject oversized/malicious payloads client-side |
| localStorage cache poisoning resistance | helpers | dataUtils JSON parse failures |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.
Tools: jest-axe, pa11y, axe-core, Lighthouse accessibility audits.

> **0** of **10** interactive components covered · **10** gaps

### Existing Accessibility Tests

None — `jest-axe` / `axe-core` not installed; no aria/keyboard-focused assertions found in test suite.

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|---------------|--------------|
| SignIn / Register forms | pages | Labels, errors, keyboard submit; axe smoke |
| SearchBar / SearchView | pages | Combobox/listbox roles, keyboard |
| FilterDrawer / CustomFilter / MultiSelectFilter | components | Keyboard, focus trap, aria-expanded |
| AppLeftNav / MenuToggle / MenuLinks | components | Landmark roles, escape to close |
| ProjectForm / ProjectAction | pages/helpers | Field labels, error association |
| Map view controls / ProjectSlider | pages | Keyboard operable controls |
| InfoCard / BlipView modals/drawers | components | Focus management, dismiss |
| HomePage cards and carousels | pages | Accessible names, contrast |
| ColorModeSwitcher | ui | Accessible name for theme toggle |
| RadarView / QuadrantView | pages | Non-color-only status; SVG text alternatives |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/tests/App.test.tsx` | Smoke-only — asserts container defined / has text, little behavioral coverage | Inflates integration file coverage for App without exercising routes |
| `src/pages/map-view/mapview.test.tsx` | Heavy Leaflet/DOM setup; limited assertions relative to map complexity | Map edge cases unprotected |
| `src/components/infoCard/InfoCard.test.tsx` | Classified as integration; shallow render coverage | Card states/branches may be under-tested |
| Cypress create-* specs | Admin token injected via localStorage; API fully stubbed | Does not exercise real auth or Netlify handler security |

---

## Recommendations

1. **[P1]** Raise unit coverage on `helpers/` (`apiClient`, `dataUtils`, `auth.ts`) and filter utilities — highest reuse, currently near-zero dedicated tests.
2. **[P1]** Add API-mocked integration tests for SignIn, ProjectAction, SearchView, and admin review pages.
3. **[P1]** Expand Cypress beyond create-* forms: sign-in, radar browse, map explore, admin deny paths.
4. **[P2]** Introduce `jest-axe` smoke tests on forms, nav, filters, and map controls.
5. **[P2]** Fix worker teardown leaks (`detectOpenHandles`) after coverage runs force-exit.
6. **[P3]** Rename/remove `src/pages/map-view/projectslider.dtest.tsx` (non-standard source name).

## Acceptance Criteria

- [ ] Every scope has a dedicated test module
- [ ] All API client paths have at least one positive and one negative test
- [ ] Critical business logic has unit tests
- [ ] Key user journeys have E2E coverage
- [ ] Authentication and authorization paths have security tests
- [ ] Core interactive components have accessibility checks
- [ ] All tests pass: `CI=true yarn test:unit --watchAll=false`
