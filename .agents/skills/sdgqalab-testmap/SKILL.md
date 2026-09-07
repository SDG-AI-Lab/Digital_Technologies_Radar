---
name: sdgqalab-testmap
description: >
  Run test coverage audit. Performs structural analysis and runs coverage
  tools to produce per-layer audit reports with numeric coverage, gap
  lists (unit, integration, E2E, security, accessibility), and ratings.
  Part of the sdgqalab.
metadata:
  author: SDG AI Lab
  version: "3.0"
---

# SDG AI Lab QA Kit — Coverage Audit

Analyze test coverage and produce actionable audit reports with numeric
coverage percentages and categorized gap lists.

> **Related skill**: `sdgqalab-audit` provides complementary production
> readiness checks across 11 quality attribute domains. Run both for a
> complete quality picture — they share `.sdgqalab/config.yml` but
> write to separate report directories and do not conflict.

## Prerequisites

- `.sdgqalab/config.yml` must exist (run `sdgqalab-init` first)
- Coverage tools installed for each layer (see config `coverage_command`)
- Test environment available (Docker running if commands use Docker)

## Workflow

### Step 0: Ensure working branch

If on a protected branch (`main`, `develop`), create and switch to
`sdgqalab-testmap/YYYY-MM-DDTHH-MM` (UTC). Always create fresh.

### Step 1: Load configuration

Read `.sdgqalab/config.yml` for layer definitions (scopes, patterns,
test/coverage commands, ignore patterns). Process each layer independently.

### Step 2: Structural analysis (per layer)

For each layer, for each scope:

1. **Enumerate source files** — glob `source_patterns` within
   `{root}/{scope}/`, exclude `ignore` patterns
2. **Enumerate test files** — glob `test_patterns` within the same tree
3. **Classify test files by type** — for each test file, determine if it
   is a **unit** test or an **integration** test using the signals in
   `references/gap-classification.md`:
   - Unit: tests models, utils, hooks, validators, formatters in isolation
   - Integration: tests views, endpoints, pages, workflows, pipelines
   - If ambiguous, classify as integration (broader scope)
4. **Map coverage per type** — for each source file, determine if a
   corresponding test exists in each type:
   - Direct match: `foo.ext` → `test_foo.ext` or `foo.test.ext`
   - Import match: test file imports `foo` module → covers it
   - Directory match: `feature/foo.ext` → `feature/__tests__/foo.test.ext`
   - Monolithic test files: read imports to determine actual coverage
5. **Flag test health observations** — note anti-patterns:
   - No assertions, happy path only, over-mocking, trivial tests
   Record file + observation. Qualitative, not scored.
6. **Compute metrics** — per scope and per layer:
   - `unit_file_coverage_pct = (unit_covered / source_files) × 100`
   - `integration_file_coverage_pct = (integration_covered / source_files) × 100`

### Step 3: Run coverage tools (MANDATORY)

Run `coverage_command` from config for each layer. Parse output for
line-level coverage percentages per module.

**If coverage tools fail**: stop and report the error. Do NOT proceed
with `line_coverage_pct: null`. Fix the tooling issue first.

### Step 4: Rate coverage

Read `references/coverage-ratings.md` for rating bands. Assign a rating
to each metric independently — unit file coverage, integration file
coverage, and line coverage — per layer. Do NOT aggregate into a single
overall rating.

### Step 5: Classify gaps and count identified items

For each uncovered source file, classify test type(s) needed. Read
`references/gap-classification.md` for rules.

**Test types:** Unit, Integration, E2E, Security, Accessibility

**Layer applicability** — skip inapplicable sections:
- Accessibility: skip for layers with no UI
- E2E: for backend layers, scope to API workflow journeys only
- Security: always include

### Step 6: Generate audit reports

Produce **one report per layer** using `references/audit-report-template.md`.
Name: `{layer}-coverage-audit.md`.

Write to two locations:
1. **Latest**: `.sdgqalab/memory/testmap/{layer}-coverage-audit.md`
2. **Historical**: `.sdgqalab/memory/testmap/reports/YYYY-MM-DDTHH-MM/{layer}-coverage-audit.md`

### Step 7: Validate reports

Verify: file paths exist, coverage counts add up, ratings match bands,
no duplicates, gap counts = identified − covered, test health
observations cite real files. Fix and re-validate if any check fails.

### Step 8: Update metrics history

Append a snapshot to `.sdgqalab/memory/testmap/metrics.yml`:

```yaml
snapshots:
  - date: "YYYY-MM-DDTHH:MM"
    layers:
      {layer}:
        total_source_files: N
        unit_file_coverage_pct: N.N
        integration_file_coverage_pct: N.N
        line_coverage_pct: N.N
        e2e_gaps: N
        security_gaps: N
        accessibility_gaps: N
        test_count: N
```

### Step 9: Output summary

```
SDG AI Lab QA Kit — Coverage Audit Complete
═══════════════════════════════════════════

  backend:  40.2% unit Low | 15.1% integ Critical | 68.2% line Adequate
            E2E: 3/10 journeys | Security: 5/12 areas | A11y: n/a
  frontend: 30.3% unit Critical | 10.5% integ Critical | 42.1% line Low
            E2E: 0/6 journeys | Security: 2/9 areas | A11y: 0/14 components

Reports:
  .sdgqalab/memory/testmap/backend-coverage-audit.md   (latest)
  .sdgqalab/memory/testmap/frontend-coverage-audit.md  (latest)
  .sdgqalab/memory/testmap/reports/2026-04-14T14-30/   (historical)
  .sdgqalab/memory/testmap/metrics.yml                 (snapshot appended)
```

## Important Notes

- **Monolithic test files**: Check imports — count as covering every
  module they import, not just the module they sit next to.
- **Re-export / barrel files**: Exclude from source counts.
- **Mock / fixture files**: Test infrastructure, not test coverage.
- **Coverage tool path mapping**: Map tool output paths back to config
  scope paths carefully.
- **No config.yml**: Instruct user to run `sdgqalab-init` first.
