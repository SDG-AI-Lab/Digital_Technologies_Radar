---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T10:54:00Z"
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
    journeys_identified: 0
    journeys_covered: 0
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
  previous_audit: "2026-09-09T09:36"
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

Notes: `netlify/functions/api.js` is an HTTP handler — integration taxonomy is the correct primary coverage. Unit file % is Critical by rating band but not a practical gap (no isolated pure modules in this layer). Accessibility N/A for API.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| api | 1 | 0 | 0.0% |
| **Total** | **1** | **0** | **0.0%** |

### Existing Unit Tests

None — handler logic is exercised via integration tests with mocked Supabase.

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| — | api | None required; extract pure helpers first if unit coverage is desired |

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| api | 1 | 1 | 100.0% |
| **Total** | **1** | **1** | **100.0%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| api | `tests/api/api.test.js` | 36 | Public reads, auth, admin CRUD, role gates, error paths |

### Integration Tests Needed

None.

---

## End-to-End (E2E) Tests

API workflows are covered by frontend Cypress journeys that hit the deployed/functions surface. No separate API-only E2E suite is required for this layer.

> **0** of **0** API-only journeys identified · **0** gaps

### E2E Tests Needed

None.

---

## Security Tests

> **6** of **6** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| api | `tests/api/api.test.js` | Admin JWT required; non-admin denied; invalid payloads 400; role insert rollback |

### Security Tests Needed

None for identified areas.

---

## Accessibility Tests

Not applicable for this API layer.

---

## Test Health Observations

No issues observed.

---

## Recommendations

1. **[P3]** Keep `yarn test:api:coverage` in CI; line coverage already Exemplary.
2. **[P3]** If the handler grows, extract pure validators for dedicated unit tests.

## Acceptance Criteria

- [x] All API endpoints have positive and negative tests (via `tests/api/api.test.js`)
- [x] Authentication and authorization paths have security tests
- [x] All tests pass: `yarn test:api` (36 tests)
