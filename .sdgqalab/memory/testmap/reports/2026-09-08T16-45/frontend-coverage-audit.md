---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-08T16:45:00Z"
config_version: 3

coverage:
  total_source_files: 123
  unit:
    test_files: 54
    file_coverage_pct: 67.5
    file_coverage_rating: "Adequate"
  integration:
    test_files: 33
    file_coverage_pct: 61.8
    file_coverage_rating: "Adequate"
  e2e:
    journeys_identified: 11
    journeys_covered: 4
    gaps: 7
  security:
    areas_identified: 7
    areas_covered: 3
    gaps: 4
  accessibility:
    components_identified: 12
    components_covered: 0
    gaps: 12
  line_coverage_pct: 83.84
  line_coverage_rating: "Solid"
  test_count: 419

by_scope:
  "components":
    source_files: 53
    unit_test_files: 41
    unit_file_coverage_pct: 90.6
    integration_test_files: 0
    integration_file_coverage_pct: 32.1
  "pages":
    source_files: 45
    unit_test_files: 0
    unit_file_coverage_pct: 26.7
    integration_test_files: 30
    integration_file_coverage_pct: 97.8
  "helpers":
    source_files: 7
    unit_test_files: 6
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 71.4
  "radar":
    source_files: 6
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 33.3
  "ui":
    source_files: 3
    unit_test_files: 3
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 33.3
  "layouts":
    source_files: 2
    unit_test_files: 1
    unit_file_coverage_pct: 100
    integration_test_files: 0
    integration_file_coverage_pct: 100
  "navigation":
    source_files: 3
    unit_test_files: 0
    unit_file_coverage_pct: 66.7
    integration_test_files: 1
    integration_file_coverage_pct: 100
  "root":
    source_files: 4
    unit_test_files: 0
    unit_file_coverage_pct: 75
    integration_test_files: 2
    integration_file_coverage_pct: 50

delta:
  previous_audit: "2026-09-07T15:39"
  unit_file_coverage_change: 55
  integration_file_coverage_change: 57.6
  line_coverage_change: 59.43
  e2e_gaps_change: 0
  security_gaps_change: -3
  accessibility_gaps_change: 2
---

# Frontend Test Audit

> **Unit File Coverage**: 67.5% (83/123 files) · Adequate
> **Integration File Coverage**: 61.8% (76/123 files) · Adequate
> **Line Coverage**: 83.84% · Solid
> **Tests**: 419
> **Audited**: 2026-09-08

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| components | 53 | 41 | 90.6% |
| pages | 45 | 0 | 26.7% |
| helpers | 7 | 6 | 100% |
| radar | 6 | 3 | 100% |
| ui | 3 | 3 | 100% |
| layouts | 2 | 1 | 100% |
| navigation | 3 | 0 | 66.7% |
| root | 4 | 0 | 75% |
| **Total** | **123** | **54** | **67.5%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| components | `src/components/PopOver.test.tsx` | ~5 | Colocated / imported modules |
| components | `src/components/drawers/FilterDrawer.test.tsx` | ~2 | Colocated / imported modules |
| components | `src/components/drawers/components/LittleDrawer.test.tsx` | ~5 | Colocated / imported modules |
| components | `src/components/drawers/filter/AppRanderSlider.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/drawers/filter/CustomFilter.test.tsx` | ~19 | Colocated / imported modules |
| components | `src/components/drawers/filter/FilterDrawer.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/drawers/filter/FilterUtilities.test.ts` | ~13 | Colocated / imported modules |
| components | `src/components/drawers/filter/HandleRender.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/drawers/tech/TechList.test.tsx` | ~7 | Colocated / imported modules |
| components | `src/components/drawers/tech/components/ScrollableDiv.test.tsx` | ~2 | Colocated / imported modules |
| components | `src/components/drawers/tech/components/TechItem.test.tsx` | ~7 | Colocated / imported modules |
| components | `src/components/header/AppMobileHeader.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/infoCard/InfoCard.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/lists/components/BlipList.test.tsx` | ~3 | Colocated / imported modules |
| components | `src/components/lists/components/ScrollableDiv.test.tsx` | ~6 | Colocated / imported modules |
| components | `src/components/lists/components/Title.test.tsx` | ~0 | Colocated / imported modules |
| components | `src/components/lists/quadrant/HorizonItem.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/lists/quadrant/Item.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/lists/quadrant/QuadrantHorizonList.test.tsx` | ~0 | Colocated / imported modules |
| components | `src/components/lists/quadrant/ShowIcon.test.tsx` | ~0 | Colocated / imported modules |
| components | `src/components/navbar/AppBottomNav.test.tsx` | ~2 | Colocated / imported modules |
| components | `src/components/navbar/AppLeftNav.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/navbar/MenuToggle.test.tsx` | ~3 | Colocated / imported modules |
| components | `src/components/navbar/components/CloseIcon.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/navbar/components/Logos.test.tsx` | ~5 | Colocated / imported modules |
| components | `src/components/navbar/components/MenuItem.test.tsx` | ~0 | Colocated / imported modules |
| components | `src/components/pageDetails/PageDetails.test.tsx` | ~6 | Colocated / imported modules |
| components | `src/components/projectPreview/ProjectPreviewCard.test.tsx` | ~3 | Colocated / imported modules |
| components | `src/components/projectsCollection/ProjectsCollection.test.tsx` | ~2 | Colocated / imported modules |
| components | `src/components/radar/HowToAndSvg.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/shared/filter/FilterItems.test.tsx` | ~4 | Colocated / imported modules |
| components | `src/components/shared/genericButton/GenericButton.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/shared/helpers/HelperUtils.test.ts` | ~16 | Colocated / imported modules |
| components | `src/components/shared/helpers/HelperUtils_2.test.ts` | ~5 | Colocated / imported modules |
| components | `src/components/shared/helpers/HelperUtils_3.test.ts` | ~10 | Colocated / imported modules |
| components | `src/components/shared/helpers/auth.test.ts` | ~5 | Colocated / imported modules |
| components | `src/components/shared/image/Image.test.tsx` | ~2 | Colocated / imported modules |
| components | `src/components/shared/projectBadges/ProjectBadges.test.tsx` | ~3 | Colocated / imported modules |
| components | `src/components/views/ContentView.test.tsx` | ~1 | Colocated / imported modules |
| components | `src/components/views/FilterTechNavView.test.tsx` | ~1 | Colocated / imported modules |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/lists/components/BlipListMui.tsx` | components | Isolate pure logic / component behavior |
| `src/components/lists/quadrant/HorizonItemMui.tsx` | components | Isolate pure logic / component behavior |
| `src/components/navbar/components/MenuIcon.tsx` | components | Isolate pure logic / component behavior |
| `src/components/shared/filter/FilterComponent.tsx` | components | Isolate pure logic / component behavior |
| `src/navigation/AppNav.tsx` | navigation | Isolate pure logic / component behavior |

---

## Integration Tests

Tests that verify components working together across boundaries.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| components | 53 | 0 | 32.1% |
| pages | 45 | 30 | 97.8% |
| helpers | 7 | 0 | 71.4% |
| radar | 6 | 0 | 33.3% |
| ui | 3 | 0 | 33.3% |
| layouts | 2 | 0 | 100% |
| navigation | 3 | 1 | 100% |
| root | 4 | 2 | 50% |
| **Total** | **123** | **33** | **61.8%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| root | `src/Logo.test.tsx` | ~2 | Page/API workflows with mocks |
| navigation | `src/navigation/AppNav.test.tsx` | ~5 | Page/API workflows with mocks |
| pages | `src/pages/NotFound404.test.tsx` | ~1 | Page/API workflows with mocks |
| pages | `src/pages/Radar.test.tsx` | ~2 | Page/API workflows with mocks |
| pages | `src/pages/about/About.test.tsx` | ~4 | Page/API workflows with mocks |
| pages | `src/pages/disasters/DisasterEvents.test.tsx` | ~5 | Page/API workflows with mocks |
| pages | `src/pages/disasters/Disasters.test.tsx` | ~9 | Page/API workflows with mocks |
| pages | `src/pages/eventAction/EventAction.test.tsx` | ~10 | Page/API workflows with mocks |
| pages | `src/pages/homePage/HomePage.test.tsx` | ~7 | Page/API workflows with mocks |
| components | `src/pages/homePage/components/HomeCards.test.tsx` | ~7 | Page/API workflows with mocks |
| pages | `src/pages/homePage/helpers.test.ts` | ~1 | Page/API workflows with mocks |
| pages | `src/pages/infoAction/InfoAction.test.tsx` | ~10 | Page/API workflows with mocks |
| pages | `src/pages/infoDetails/InfoDetails.test.tsx` | ~11 | Page/API workflows with mocks |
| pages | `src/pages/map-view/ProjectSlider.test.tsx` | ~2 | Page/API workflows with mocks |
| pages | `src/pages/map-view/RadarMapView.test.tsx` | ~5 | Page/API workflows with mocks |
| pages | `src/pages/map-view/helpers.test.tsx` | ~8 | Page/API workflows with mocks |
| pages | `src/pages/projectAction/ProjectAction.test.tsx` | ~8 | Page/API workflows with mocks |
| pages | `src/pages/projectAction/SelectMultiple.test.tsx` | ~2 | Page/API workflows with mocks |
| pages | `src/pages/projectAction/helpers.test.ts` | ~4 | Page/API workflows with mocks |
| pages | `src/pages/projects/ProjectsList.test.tsx` | ~12 | Page/API workflows with mocks |
| pages | `src/pages/projects/projectComponent/Project.test.tsx` | ~5 | Page/API workflows with mocks |
| pages | `src/pages/projects/projectDetails/ProjectDetails.test.tsx` | ~10 | Page/API workflows with mocks |
| pages | `src/pages/projects/projectOverlay/projectOverlay.test.tsx` | ~11 | Page/API workflows with mocks |
| pages | `src/pages/projects/reviewProjects/ReviewProjects.test.tsx` | ~6 | Page/API workflows with mocks |
| pages | `src/pages/search/Search.test.tsx` | ~7 | Page/API workflows with mocks |
| pages | `src/pages/technologies/Technologies.test.tsx` | ~9 | Page/API workflows with mocks |
| pages | `src/pages/users/register/Register.test.tsx` | ~5 | Page/API workflows with mocks |
| pages | `src/pages/users/signIn/SignIn.test.tsx` | ~4 | Page/API workflows with mocks |
| pages | `src/pages/views/PopOverView.test.tsx` | ~1 | Page/API workflows with mocks |
| pages | `src/pages/views/QuadrantView.test.tsx` | ~3 | Page/API workflows with mocks |
| pages | `src/pages/views/RadarView.test.tsx` | ~0 | Page/API workflows with mocks |
| pages | `src/pages/volunteers/Volunteers.test.tsx` | ~2 | Page/API workflows with mocks |
| root | `src/tests/App.test.tsx` | ~2 | Page/API workflows with mocks |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/drawers/FilterDrawer.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/components/LittleDrawer.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/components/LittleDrawerIconButton.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/filter/AppRanderSlider.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/filter/CustomFilter.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/filter/FilterConstants.ts` | components | Cross-module / route-level behavior |
| `src/components/drawers/filter/FilterUtilities.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/filter/HandleRender.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/tech/TechList.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/tech/components/ScrollableDiv.tsx` | components | Cross-module / route-level behavior |
| `src/components/drawers/tech/components/TechItem.tsx` | components | Cross-module / route-level behavior |
| `src/components/lists/components/BlipList.tsx` | components | Cross-module / route-level behavior |
| `src/components/lists/components/BlipListMui.tsx` | components | Cross-module / route-level behavior |
| `src/components/lists/components/ScrollableDiv.tsx` | components | Cross-module / route-level behavior |
| `src/components/lists/quadrant/HorizonItem.tsx` | components | Cross-module / route-level behavior |
| `src/components/lists/quadrant/HorizonItemMui.tsx` | components | Cross-module / route-level behavior |
| `src/components/navbar/MenuLinks.tsx` | components | Cross-module / route-level behavior |
| `src/components/navbar/MenuToggle.tsx` | components | Cross-module / route-level behavior |
| `src/components/navbar/components/MenuItem.tsx` | components | Cross-module / route-level behavior |
| `src/components/pageDetails/PageDetails.tsx` | components | Cross-module / route-level behavior |
| `src/components/projectPreview/ProjectPreviewCard.tsx` | components | Cross-module / route-level behavior |
| `src/components/radar/HowToPopup.tsx` | components | Cross-module / route-level behavior |
| `src/components/shared/filter/FilterItems.tsx` | components | Cross-module / route-level behavior |
| `src/components/shared/filter/MultiSelectFilter.tsx` | components | Cross-module / route-level behavior |
| `src/components/views/ContentView.tsx` | components | Cross-module / route-level behavior |
| `src/components/views/FilterTechNavView.tsx` | components | Cross-module / route-level behavior |
| `src/components/views/blip/BlipView.tsx` | components | Cross-module / route-level behavior |
| `src/radar/RadarProvider.tsx` | radar | Cross-module / route-level behavior |
| `src/radar/components/svg-hover/HorizonsNameComp.tsx` | components | Cross-module / route-level behavior |
| `src/radar/components/svg-hover/QuadrantNameComp.tsx` | components | Cross-module / route-level behavior |
| `src/radar/tech/TechDescription.tsx` | radar | Cross-module / route-level behavior |
| `src/ui/AppUiProvider.tsx` | ui | Cross-module / route-level behavior |
| `src/ui/ColorModeSwitcher.tsx` | ui | Cross-module / route-level behavior |

---

## End-to-End (E2E) Tests

> **4** of **11** critical journeys covered · **7** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `cypress/e2e/create-project.cy.ts` | Create project flow |
| `cypress/e2e/create-disaster.cy.ts` | Create disaster type flow |
| `cypress/e2e/create-disaster-event.cy.ts` | Create disaster event flow |
| `cypress/e2e/create-technology.cy.ts` | Create technology flow |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Sign in / session persistence | P1 | Login, failed login, signed-in nav |
| Search and open project detail | P1 | Query, results, modal/detail |
| Radar quadrant navigation | P1 | Open radar, select quadrant/blip |
| Map view browse projects | P2 | Map markers and slider |
| Review and approve project | P1 | Admin review queue approve path |
| Edit project / info / event | P2 | Edit forms save successfully |
| Home page browse cards | P3 | Recent disasters and project cards |

---

## Security Tests

> **3** of **7** security-sensitive areas covered · **4** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| helpers | `src/components/shared/helpers/auth.test.ts` | isSignedIn / isAdmin / session helpers |
| pages | `src/pages/users/signIn/SignIn.test.tsx` | Sign-in form and auth client calls |
| pages | `src/pages/users/register/Register.test.tsx` | Register validation and submit |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Token expiry / clearSession edge cases | helpers | Expired tokens, malformed storage |
| Admin-only UI gating | pages | Review/edit/delete hidden for non-admin |
| XSS in rich text / descriptions | components | Sanitize rendered HTML fields |
| Client payload allowlist awareness | helpers | apiClient does not send unexpected fields |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.

> **0** of **12** interactive components covered · **12** gaps

### Existing Accessibility Tests

No jest-axe / dedicated a11y assertions detected in unit or integration suites.

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| SignIn / Register forms | pages | Labels, errors, keyboard submit |
| Filter drawer controls | components | Focus trap, aria on drawer |
| Search results and pagination | pages | Roles, keyboard pagination |
| Radar tabs (Stages/Tech/Project) | pages | Tab semantics and focus |
| Project forms | helpers | Label association for all fields |
| Nav menus (left/bottom/mobile) | components | Keyboard nav and expanded state |
| Modals (SearchView, HowTo) | components | Focus trap and Escape |
| Map markers / popups | pages | Accessible names for markers |
| PageDetails actions | components | Button names and confirm dialogs |
| Home cards links | pages | Meaningful link names |
| ColorModeSwitcher | ui | Announced state change |
| NotFound404 | pages | Landmark and heading structure |

> Recommend adding `jest-axe` smoke checks on key interactive surfaces.

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/components/lists/components/Title.test.tsx` | No it() blocks detected | May be empty or use nonstandard test APIs |
| `src/components/lists/quadrant/QuadrantHorizonList.test.tsx` | No it() blocks detected | May be empty or use nonstandard test APIs |
| `src/components/lists/quadrant/ShowIcon.test.tsx` | No it() blocks detected | May be empty or use nonstandard test APIs |
| `src/components/lists/quadrant/ShowIcon.test.tsx` | Smoke-only / trivial render checks dominate | Limited behavioral coverage |
| `src/components/navbar/components/CloseIcon.test.tsx` | Smoke-only / trivial render checks dominate | Limited behavioral coverage |
| `src/components/navbar/components/MenuItem.test.tsx` | No it() blocks detected | May be empty or use nonstandard test APIs |
| `src/pages/views/RadarView.test.tsx` | No it() blocks detected | May be empty or use nonstandard test APIs |

---

## Recommendations

1. **[P1]** Add Cypress journeys for sign-in, search→detail, radar navigation, and admin review/approve — largest remaining user-risk gaps.
2. **[P2]** Introduce jest-axe on auth forms, filter drawer, search, and radar tabs to start accessibility coverage (0/${a11yIdentified}).
3. **[P3]** Unstick Jest hangs for `Filter.tsx` / `FilterComponent.tsx` and cover remaining MUI list variants (`BlipListMui`, `HorizonItemMui`).

## Acceptance Criteria

- [ ] Critical business logic has unit tests
- [ ] Key user journeys have E2E coverage
- [ ] Authentication and authorization paths have security tests
- [ ] Core interactive components have accessibility checks
- [ ] All tests pass: `CI=true yarn test:unit --watchAll=false`
