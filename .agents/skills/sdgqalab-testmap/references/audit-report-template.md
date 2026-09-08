<!-- 
  Audit Report Template — used by sdgqalab-testmap to generate output.
  The agent reads this template and fills in the actual data.
  Produces one report per layer (backend-coverage-audit.md, frontend-coverage-audit.md).
-->

---
schema: sdgqalab/testmap@3
layer: "{LAYER}"
project: "{PROJECT_NAME}"
audited_at: "{ISO_TIMESTAMP}"
config_version: 3

coverage:
  total_source_files: 0
  unit:
    test_files: 0
    file_coverage_pct: 0.0
    file_coverage_rating: "{RATING}"
  integration:
    test_files: 0
    file_coverage_pct: 0.0
    file_coverage_rating: "{RATING}"
  e2e:
    journeys_identified: 0
    journeys_covered: 0
    gaps: 0
  security:
    areas_identified: 0
    areas_covered: 0
    gaps: 0
  accessibility:
    components_identified: 0
    components_covered: 0
    gaps: 0
  line_coverage_pct: 0.0
  line_coverage_rating: "{RATING}"
  test_count: null

by_scope:
  "{SCOPE_NAME}":
    source_files: 0
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0

delta:
  previous_audit: null
  unit_file_coverage_change: null
  integration_file_coverage_change: null
  line_coverage_change: null
  e2e_gaps_change: null
  security_gaps_change: null
  accessibility_gaps_change: null
---

# {LAYER_TITLE} Test Audit

> **Unit File Coverage**: {UNIT_FILE_COV}% ({UNIT_TEST_FILES}/{SOURCE_FILES} files) · {UNIT_FILE_RATING}
> **Integration File Coverage**: {INT_FILE_COV}% ({INT_TEST_FILES}/{SOURCE_FILES} files) · {INT_FILE_RATING}
> **Line Coverage**: {LINE_COVERAGE}% · {LINE_RATING}
> **Tests**: {TEST_COUNT}
> **Audited**: {DATE}

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: models, serializers, validators, utilities, hooks, guards, formatters.

### Unit Coverage by {SCOPE_LABEL}

| {Scope Label} | Source Files | Unit Test Files | Unit File Coverage |
|----------------|-------------|-----------------|-------------------|
| {scope_1}      | N           | N               | N.N%              |
| {scope_2}      | N           | N               | N.N%              |
| ...            | ...         | ...             | ...               |
| **Total**      | **N**       | **N**           | **N.N%**          |

### Existing Unit Tests

| {Scope Label} | Test File | Approx. Tests | Modules Covered |
|---------------|-----------|---------------|-----------------|
| {scope} | test_file.ext | ~N | Brief list of what's tested |
| ... | ... | ... | ... |

### Unit Tests Needed

| File | {Scope Label} | What to Test |
|------|---------------|--------------|
| `path/to/file.ext` | {scope} | Brief description of what needs unit testing |
| ... | ... | ... |

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by {SCOPE_LABEL}

| {Scope Label} | Source Files | Integration Test Files | Integration File Coverage |
|----------------|-------------|----------------------|--------------------------|
| {scope_1}      | N           | N                    | N.N%                     |
| {scope_2}      | N           | N                    | N.N%                     |
| ...            | ...         | ...                  | ...                      |
| **Total**      | **N**       | **N**                | **N.N%**                 |

### Existing Integration Tests

| {Scope Label} | Test File | Approx. Tests | Boundaries Covered |
|---------------|-----------|---------------|--------------------|
| {scope} | test_file.ext | ~N | Brief list of what's tested |
| ... | ... | ... | ... |

### Integration Tests Needed

| File | {Scope Label} | What to Test |
|------|---------------|--------------|
| `path/to/file.ext` | {scope} | Brief description of what needs integration testing |
| ... | ... | ... |

---

<!-- Sections below are layer-dependent. Omit any section that does not
     apply to this layer (e.g., Accessibility for a pure backend). -->

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.
Tools: Cypress, Playwright, Selenium, etc.

> **{N}** of **{M}** critical journeys covered · **{GAPS}** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `path/to/spec.ext` | Description of the user flow tested |
| ... | ... |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| {journey description} | P1/P2/P3 | Key steps and assertions needed |
| ... | ... | ... |

> If no E2E framework is configured, note this as a gap and recommend
> setup as part of Recommendations.

---

## Security Tests

Tests that verify authentication, authorization, input validation,
and protection against common vulnerabilities (OWASP Top 10).

> **{N}** of **{M}** security-sensitive areas covered · **{GAPS}** gaps

### Existing Security Tests

| {Scope Label} | Test File | What's Tested |
|---------------|-----------|---------------|
| {scope} | test_file.ext | e.g., permission checks, auth flow, input sanitization |
| ... | ... | ... |

### Security Tests Needed

| Area | {Scope Label} | What to Test |
|------|---------------|--------------|
| {area} | {scope} | e.g., SQL injection on endpoint X, missing CSRF on form Y |
| ... | ... | ... |

> Look for: permission/guard tests, auth endpoint tests, input validation
> tests, CSRF/XSS protection, rate limiting, role-based access tests.

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.
Tools: jest-axe, pa11y, axe-core, Lighthouse accessibility audits.

> **{N}** of **{M}** interactive components covered · **{GAPS}** gaps

### Existing Accessibility Tests

| {Scope Label} | Test File | What's Tested |
|---------------|-----------|---------------|
| {scope} | test_file.ext | e.g., axe checks on login page, aria-label assertions |
| ... | ... | ... |

### Accessibility Tests Needed

| Component / Page | {Scope Label} | What to Test |
|-----------------|---------------|--------------|
| {component} | {scope} | e.g., keyboard navigation, screen reader labels, color contrast |
| ... | ... | ... |

> Look for: jest-axe/axe-core assertions, aria-* attribute tests,
> keyboard navigation tests, focus management tests, color contrast checks.
> If no a11y testing tooling is configured, note this as a gap.

---

## Test Health Observations

Qualitative flags noted during structural analysis. These are not scored
metrics — they highlight tests that exist but may provide weak coverage.

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `path/to/test_file.ext` | e.g., No assertions — calls 3 endpoints but never checks response | Coverage inflated for {scope} |
| `path/to/test_file.ext` | e.g., Happy path only — tests create but not create-with-invalid-data | Edge cases unprotected |
| ... | ... | ... |

> Only flag clear anti-patterns. If all tests are healthy, write
> "No issues observed" and omit the table.

---

## Recommendations

1. **[P1]** Highest priority gap — explain why and impact
2. **[P2]** Next priority — explain why
3. **[P3]** Lower priority improvement
...

## Acceptance Criteria

- [ ] Every {scope_label} has a dedicated test module
- [ ] All API endpoints have at least one positive and one negative test
- [ ] Critical business logic has unit tests
- [ ] Key user journeys have E2E coverage
- [ ] Authentication and authorization paths have security tests
- [ ] Core interactive components have accessibility checks
- [ ] All tests pass: `{test_command}`