---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-08T20:29:00Z"
config_version: 3

coverage:
  total_source_files: 1
  unit:
    test_files: 0
    file_coverage_pct: 0.0
    file_coverage_rating: "Critical"
  integration:
    test_files: 1
    file_coverage_pct: 100.0
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 8
    journeys_covered: 8
    gaps: 0
  security:
    areas_identified: 6
    areas_covered: 6
    gaps: 0
  accessibility:
    components_identified: 0
    components_covered: 0
    gaps: 0
  line_coverage_pct: 100.0
  line_coverage_rating: "Exemplary"
  test_count: 36

by_scope:
  "api":
    source_files: 1
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 1
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-09-08T16:45"
  unit_file_coverage_change: 0
  integration_file_coverage_change: 0
  line_coverage_change: 0
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# API Test Audit

> **Unit File Coverage**: 0.0% (0/1 files) · Critical
> **Integration File Coverage**: 100.0% (1/1 files) · Exemplary
> **Line Coverage**: 100.0% · Exemplary
> **Tests**: 36
> **Audited**: 2026-09-08

The Netlify handler is exercised as an **integration** suite (`tests/api/api.test.js`). Unit file coverage remains 0 by classification (no isolated pure-unit module tests), which is expected for a single handler entrypoint.

---

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| api | 1 | 0 | 0.0% |
| **Total** | **1** | **0** | **0.0%** |

### Existing Unit Tests

No dedicated unit-only tests for `netlify/functions/api.js` (handler is integration-tested).

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| — | api | Optional: extract pure validators (payload allowlist, CORS origin match) into unit-testable helpers |

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| api | 1 | 1 | 100.0% |
| **Total** | **1** | **1** | **100.0%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| api | `tests/api/api.test.js` | 36 | CORS, public reads, admin authz, CRUD, body limits, field allowlisting |

### Integration Tests Needed

No gaps — suite covers public, auth, and admin mutation paths.

---

## End-to-End (E2E) Tests

> **8** of **8** API workflow journeys covered · **0** gaps

API workflows are covered in the Jest integration suite (not Cypress). Journeys: CORS gate, public list/detail, sign-in, admin pending/approve, project CRUD, info CRUD, disaster-event CRUD, unknown-route 404.

---

## Security Tests

> **6** of **6** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| api | `tests/api/api.test.js` | Origin allowlist, Bearer/session checks, admin role 403, body size limit, field stripping |

### Security Tests Needed

None outstanding for the current handler surface.

---

## Accessibility Tests

Not applicable for the API layer.

---

## Test Health Observations

No issues observed.

---

## Recommendations

1. **[P3]** Optionally extract CORS/allowlist helpers for true unit tests (cosmetic for ratings).
2. **[P3]** Keep API suite in CI (`yarn test:api:coverage`) alongside frontend.

## Acceptance Criteria

- [x] All API endpoints have positive and negative tests
- [x] Authentication and authorization paths have security tests
- [x] All tests pass: `yarn test:api`
