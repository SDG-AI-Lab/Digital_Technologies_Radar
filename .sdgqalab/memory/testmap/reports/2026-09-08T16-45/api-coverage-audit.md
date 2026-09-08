---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-08T16:45:00Z"
config_version: 3

coverage:
  total_source_files: 1
  unit:
    test_files: 0
    file_coverage_pct: 0
    file_coverage_rating: "Critical"
  integration:
    test_files: 1
    file_coverage_pct: 100
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 5
    journeys_covered: 5
    gaps: 0
  security:
    areas_identified: 6
    areas_covered: 6
    gaps: 0
  accessibility:
    components_identified: 0
    components_covered: 0
    gaps: 0
  line_coverage_pct: 100
  line_coverage_rating: "Exemplary"
  test_count: 36

by_scope:
  "api":
    source_files: 1
    unit_test_files: 0
    unit_file_coverage_pct: 0
    integration_test_files: 1
    integration_file_coverage_pct: 100

delta:
  previous_audit: "2026-09-07T15:39"
  unit_file_coverage_change: 0
  integration_file_coverage_change: 0
  line_coverage_change: 0
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# API Test Audit

> **Unit File Coverage**: 0% (0/1 files) · Critical
> **Integration File Coverage**: 100% (1/1 files) · Exemplary
> **Line Coverage**: 100% · Exemplary
> **Tests**: 36
> **Audited**: 2026-09-08

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------|-----------------|-------------------|
| api | 1 | 0 | 0% |
| **Total** | **1** | **0** | **0%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| — | — | 0 | — |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `netlify/functions/api.js` | root | Isolate pure logic / component behavior |

---

## Integration Tests

Tests that verify components working together across boundaries.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------|----------------------|--------------------------|
| api | 1 | 1 | 100% |
| **Total** | **1** | **1** | **100%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| api | `tests/api/api.test.js` | ~36 | Page/API workflows with mocks |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| — | — | No high-priority integration gaps |

---

## End-to-End (E2E) Tests

> **5** of **5** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `tests/api/api.test.js` | Covered as API journey suites (CORS, auth, CRUD) |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| — | — | No E2E gaps for this layer |

---

## Security Tests

> **6** of **6** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| api | `tests/api/api.test.js` | CORS origin gate, admin Bearer auth, body size, field allowlist, role checks |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| — | — | No open security gaps |

---

## Test Health Observations

No issues observed

---

## Recommendations

1. **[P1]** Maintain API suite; add targeted branch tests for remaining uncovered statement lines in `api.js` (currently 100% lines / ~89% statements).
2. **[P2]** Keep CORS/admin auth regressions in CI on every PR touching `netlify/functions`.
3. **[P3]** Optional: split `api.test.js` into domain suites for maintainability as handlers grow.

## Acceptance Criteria

- [ ] Critical business logic has unit tests
- [ ] Key user journeys have E2E coverage
- [ ] Authentication and authorization paths have security tests
- [ ] All tests pass: `yarn test:api`
