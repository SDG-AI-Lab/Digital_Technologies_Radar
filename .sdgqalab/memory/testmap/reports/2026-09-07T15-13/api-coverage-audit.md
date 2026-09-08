---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-07T15:13:00Z"
config_version: 3

coverage:
  total_source_files: 1
  unit:
    test_files: 0
    file_coverage_pct: 0
    file_coverage_rating: "Critical"
  integration:
    test_files: 0
    file_coverage_pct: 0
    file_coverage_rating: "Critical"
  e2e:
    journeys_identified: 5
    journeys_covered: 0
    gaps: 5
  security:
    areas_identified: 6
    areas_covered: 0
    gaps: 6
  accessibility:
    components_identified: 0
    components_covered: 0
    gaps: 0
  line_coverage_pct: 18.47
  line_coverage_rating: "Critical"
  test_count: 0

by_scope:
  api:
    source_files: 1
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

# API Test Audit

> **Unit File Coverage**: 0.0% (0/1 files) · Critical
> **Integration File Coverage**: 0.0% (0/1 files) · Critical
> **Line Coverage**: 18.47% · Critical
> **Tests**: 0
> **Audited**: 2026-09-07

> Note: `coverage_command` was empty in config. Line coverage was measured by loading `netlify/functions/api.js` under `c8` (module load only — no handler invocations). Config should gain a real test+coverage command.

---

## Unit Tests

Pure helpers inside the Netlify handler module (allowlists, origin checks, field filters) are candidates for extraction and unit testing.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|----------------|-------------|-----------------|-------------------|
| api | 1 | 0 | 0.0% |
| **Total** | **1** | **0** | **0.0%** |

### Existing Unit Tests

None.

### Unit Tests Needed

| File | Scope | What to Test |
|------|---------------|--------------|
| `netlify/functions/api.js` (`allowedOrigin`, `allowedFields`, `parseBody`) | api | Origin allowlist; field allowlist; body size/JSON errors — extract to testable module if needed |

---

## Integration Tests

Handler-level tests against mocked Supabase client covering HTTP method/path routing.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|----------------|-------------|----------------------|--------------------------|
| api | 1 | 0 | 0.0% |
| **Total** | **1** | **0** | **0.0%** |

### Existing Integration Tests

None.

### Integration Tests Needed

| File | Scope | What to Test |
|------|---------------|--------------|
| `netlify/functions/api.js` | api | GET public resources, detail routes, OPTIONS CORS, admin mutations with mocked Supabase |

---

## End-to-End (E2E) Tests

API workflow journeys (backend-scoped). No dedicated API test harness; Cypress stubs the API rather than hitting the handler.

> **0** of **5** critical journeys covered · **5** gaps

### Existing E2E Tests

None against the live Netlify function.

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Health check GET /api/health | P1 | Returns ok when Supabase reachable |
| Public list + detail resources | P1 | technologies, projects, disaster-events happy paths |
| Admin create/update/delete project | P1 | Auth required; persists via Supabase |
| Admin create technology / disaster / event | P2 | Parity with Cypress UI flows at API boundary |
| Rejected origin and unauthorized admin | P1 | Security-negative API journeys |

---

## Security Tests

> **0** of **6** security-sensitive areas covered · **6** gaps

### Existing Security Tests

None.

### Security Tests Needed

| Area | Scope | What to Test |
|------|---------------|--------------|
| Bearer auth + requireAdmin | api | 401 without token; 401 invalid token; 403 non-admin; 200 admin |
| CORS allowlist (ALLOWED_ORIGINS) | api | Allowed origin echoed; disallowed origin 403; no Origin health OK |
| Body size limit (MAX_BODY_BYTES) | api | Reject oversized POST/PUT bodies |
| Field allowlisting on writes | api | Unknown fields stripped; only INFO_FIELDS/EVENT_FIELDS applied |
| Public vs admin route matrix | api | Public GET resources work without auth; mutating routes require admin |
| Supabase error handling | api | DB failures return safe 500 without leaking secrets |

---

## Test Health Observations

No issues observed — no tests exist yet for this layer.

---

## Recommendations

1. **[P1]** Add a Jest/Node test suite for `netlify/functions/api.js` with mocked `@supabase/supabase-js`; set `test_command` / `coverage_command` in `.sdgqalab/config.yml`.
2. **[P1]** Cover `requireAdmin`, CORS, and body-size limits first (security-critical).
3. **[P2]** Extract pure helpers (`allowedOrigin`, `allowedFields`) for fast unit tests.
4. **[P2]** Add a Netlify Dev or contract-test path so Cypress can optionally hit the real handler.
5. **[P3]** Replace load-only `c8` smoke with handler-invoking coverage in CI.

## Acceptance Criteria

- [ ] API scope has a dedicated test module
- [ ] All API endpoints have at least one positive and one negative test
- [ ] Auth and CORS paths have security tests
- [ ] Critical journeys have API-level E2E/contract coverage
- [ ] Coverage command runs in CI and reports line coverage
