---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T09:36:00Z"
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
  previous_audit: "2026-09-08T21:53"
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
> **Audited**: 2026-09-09

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
| `netlify/functions/api.js` helpers | api | Optional: extract `allowedOrigin` / `allowedFields` / `parseBody` for pure unit tests (taxonomy only) |

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
| api | `tests/api/api.test.js` | 36 | CORS, auth gatekeeping, public GETs, admin CRUD, body size, field allowlist, sign-in |

### Integration Tests Needed

None — handler paths are covered at 100% lines.

---

## End-to-End (E2E) Tests

> **8** of **8** API workflow journeys covered · **0** gaps

API journeys are covered via the integration harness calling `exports.handler` (not Cypress). Frontend Cypress also exercises admin/public API contracts with intercepts.

---

## Security Tests

> **6** of **6** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| api | `tests/api/api.test.js` | Disallowed Origin 403, OPTIONS CORS, admin Bearer required, non-admin 403, oversized body, field allowlist |

### Security Tests Needed

None.

---

## Accessibility Tests

N/A — API layer has no UI.

---

## Test Health Observations

No issues observed.

---

## Recommendations

1. **[P3]** Optional helper extraction if you want the unit-file rating to move off Critical (taxonomy only).
2. **[P3]** Keep API suite in CI (`yarn test:api`) alongside frontend.

## Acceptance Criteria

- [x] All API endpoints have positive and negative tests
- [x] Authentication and authorization paths have security tests
- [x] All tests pass: `yarn test:api`
