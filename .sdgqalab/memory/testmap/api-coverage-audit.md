---
schema: sdgqalab/testmap@3
layer: "api"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-07T15:39:00Z"
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
  line_coverage_pct: 100.0
  line_coverage_rating: "Exemplary"
  test_count: 36

by_scope:
  api:
    source_files: 1
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 1
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-09-07T15:13"
  unit_file_coverage_change: 0.0
  integration_file_coverage_change: 100.0
  line_coverage_change: 81.53
  e2e_gaps_change: -5
  security_gaps_change: -6
  accessibility_gaps_change: 0
---

# API Test Audit

> **Unit File Coverage**: 0.0% (0/1 files) · Critical
> **Integration File Coverage**: 100.0% (1/1 files) · Exemplary
> **Line Coverage**: 100.0% · Exemplary
> **Tests**: 36
> **Audited**: 2026-09-07

> Refresh of the api layer only. Frontend metrics unchanged (see prior snapshot).
> Coverage via `yarn test:api:coverage` (Jest + Istanbul). Statements ~88.9%, branches ~83.6%, lines 100%, functions 100%.

---

## Unit Tests

Pure helpers inside the Netlify handler (`allowedOrigin`, `allowedFields`, `parseBody`) are exercised indirectly through handler integration tests. There is no dedicated unit-test file for extracted modules.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|----------------|-------------|-----------------|-------------------|
| api | 1 | 0 | 0.0% |
| **Total** | **1** | **0** | **0.0%** |

### Existing Unit Tests

None (helpers remain inlined in `api.js`).

### Unit Tests Needed

| File | Scope | What to Test |
|------|---------------|--------------|
| `netlify/functions/api.js` (optional extract) | api | Isolate `allowedOrigin`, `allowedFields`, `parseBody` for micro-benchmarks — optional; already covered via integration |

---

## Integration Tests

Handler-level tests against mocked `@supabase/supabase-js`, invoking `exports.handler` with synthetic Netlify events.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|----------------|-------------|----------------------|--------------------------|
| api | 1 | 1 | 100.0% |
| **Total** | **1** | **1** | **100.0%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|---------------|-----------|---------------|--------------------|
| api | `tests/api/api.test.js` | ~36 | CORS/origin, health, public list/detail, sign-in, requireAdmin, body size, field allowlist, auth/users, project CRUD/approve, info CRUD, disaster-events CRUD, 404s |

### Integration Tests Needed

None for the single source file — `api.js` is covered by `api.test.js`.

Optional follow-ups (branch gaps only):

| File | Scope | What to Test |
|------|---------------|--------------|
| `netlify/functions/api.js` | api | Per-query Supabase `error` throw arms (health DB fail, public query fail, mutation fail) to raise branch coverage above ~84% |

---

## End-to-End (E2E) Tests

API workflow journeys exercised at the handler boundary (mocked Supabase). Not live Netlify Dev / deployed API E2E.

> **5** of **5** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `tests/api/api.test.js` (health) | Health check GET `/api/health` |
| `tests/api/api.test.js` (public) | Public list + detail resources |
| `tests/api/api.test.js` (projects) | Admin create / update / delete / approve project |
| `tests/api/api.test.js` (info + events) | Admin technology / disaster-type / disaster-event mutations |
| `tests/api/api.test.js` (CORS + auth) | Rejected origin and unauthorized admin |

### E2E Tests Needed

None at the handler-contract level. Optional: contract tests against Netlify Dev with a real Supabase test project.

---

## Security Tests

> **6** of **6** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|---------------|-----------|---------------|
| api | `tests/api/api.test.js` | Disallowed Origin 403; OPTIONS allow/deny |
| api | `tests/api/api.test.js` | Missing Bearer 401; invalid token 401; non-admin 403 |
| api | `tests/api/api.test.js` | Oversized body rejected |
| api | `tests/api/api.test.js` | Unknown write fields stripped (`allowedFields`) |
| api | `tests/api/api.test.js` | Public GET without auth; admin mutations require admin |
| api | `tests/api/api.test.js` | Safe 500 on config/role-insert failures; create-user validation |

### Security Tests Needed

None for the previously identified areas. Optional: more granular DB-error leakage checks per route.

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `tests/api/api.test.js` | Heavy mocking of Supabase query builder | High line coverage without proving live DB contracts |
| `tests/api/api.test.js` | Helpers not extracted — unit file coverage stays 0% by methodology | Unit rating remains Critical despite Exemplary line/integration coverage |

---

## Recommendations

1. **[P2]** Optionally extract `allowedOrigin` / `allowedFields` / `parseBody` into a small module with pure unit tests — improves unit file rating without changing behavior.
2. **[P2]** Add focused tests for Supabase `error` return arms to lift branch coverage (~84% → 90%+).
3. **[P3]** Optional Netlify Dev + test-project contract suite for confidence beyond mocks.
4. **[P3]** Frontend layer remains Critical on file/line coverage — next testmap focus.

## Acceptance Criteria

- [x] API scope has a dedicated test module (`api.test.js`)
- [x] Critical public and admin routes have positive and negative tests
- [x] Auth and CORS paths have security tests
- [x] Critical API journeys covered at handler level
- [x] Coverage command runs in CI-capable script: `yarn test:api:coverage`
- [ ] (Optional) Branch coverage ≥ 90%
- [ ] (Optional) Live contract tests against Netlify Dev
