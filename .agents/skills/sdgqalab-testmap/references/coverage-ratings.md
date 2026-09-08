# Coverage Rating Bands

Reference material for sdgqalab-testmap Step 4.
Load this file when rating coverage metrics.

## Rating Scale

File coverage has a higher bar than line coverage because it measures
a coarser, lower-effort metric (does any test exist for this file?)
versus line coverage (how thoroughly is the file exercised?).

| Rating        | Line Coverage | File Coverage |
|---------------|---------------|---------------|
| Critical      | < 40%         | < 30%         |
| Low           | 40-59%        | 30-49%        |
| Adequate      | 60-74%        | 50-69%        |
| Solid         | 75-89%        | 70-84%        |
| Exemplary     | >= 90%        | >= 85%        |

## How to Apply

1. Compute `unit_file_coverage_pct`, `integration_file_coverage_pct`, and
   `line_coverage_pct` per layer
2. Look up each percentage in the corresponding column above:
   - Unit file coverage → **File Coverage** column
   - Integration file coverage → **File Coverage** column
   - Line coverage → **Line Coverage** column
3. Include each rating label independently in:
   - Report header (e.g., `> **Unit File Coverage**: 40.2% · Low`)
   - YAML frontmatter (`unit.file_coverage_rating`, etc.)
   - Terminal summary output
4. Do NOT aggregate into a single overall rating — each metric is rated separately
