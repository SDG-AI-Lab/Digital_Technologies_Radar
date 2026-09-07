<!--
  Audit Report Template — used by sdgqalab-audit to generate reports.
  The agent reads this template and fills in actual data.
  Produces one report per quality attribute per layer
  (and one per project-wide quality attribute).
-->

---
schema: sdgqalab/audit@3
layer: "{LAYER}"
layer_type: "{LAYER_TYPE}"
quality_attribute: "{DOMAIN_ID}"
quality_attribute_name: "{DOMAIN_NAME}"
iso_characteristic: "{ISO_CHARACTERISTIC}"
project: "{PROJECT_NAME}"
audited_at: "{ISO_TIMESTAMP}"
config_version: 2

score:
  pass: 0
  partial: 0
  fail: 0
  na: 0
  applicable: 0
  score_pct: 0.0
  rating: "{RATING}"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 0
  p3_improvement: 0

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "{confirmed | corrected | no_feedback | skipped_unattended}"
---

# {DOMAIN_NAME} Audit — {LAYER_TITLE}

> **Score**: {SCORE_PCT}% · {RATING_LABEL}
> **Results**: {PASS} pass · {PARTIAL} partial · {FAIL} fail · {NA} n/a
> **Blockers**: {P0_COUNT} | **Critical**: {P1_COUNT} | **High**: {P2_COUNT}
> **Audited**: {DATE}
> **Layer**: {LAYER} ({LAYER_TYPE})
> **ISO Grounding**: {ISO_CHARACTERISTIC}

---

## Summary

{2-3 sentence executive summary of quality attribute findings. Highlight
the most critical issues and overall posture.}

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | {What this layer does, with file/config/doc evidence} |
| Interfaces | {Routes, jobs, queues, CLIs, webhooks, or integrations inspected} |
| Data contracts | {Schemas, validators, models, migrations, fixtures, or API specs inspected} |
| AI/ML behavior | {If applicable: task type, prompt/schema/provider/eval evidence; otherwise N/A} |
| Checkpoint status | {User confirmed/corrected/no feedback/skipped for unattended execution} |

---

## Results

### PASS ({PASS_COUNT} items)

| Check ID | Item | Evidence |
|----------|------|----------|
| {ID} | {Name} | {Brief evidence: file path, config value, or observation} |
| ... | ... | ... |

### PARTIAL ({PARTIAL_COUNT} items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| {ID} | {Name} | {What's done} | {What's still needed} | {Severity} |
| ... | ... | ... | ... | ... |

### FAIL ({FAIL_COUNT} items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| {ID} | {Name} | {What was found (or not found)} | {Severity} | {P0/P1/P2/P3} |
| ... | ... | ... | ... | ... |

### N/A ({NA_COUNT} items)

| Check ID | Item | Reason |
|----------|------|--------|
| {ID} | {Name} | {Why not applicable: tech trigger not matched / excluded by config} |
| ... | ... | ... |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

#### {CHECK_ID}: {Item Name}

**Current state:** {What was found}
**Required state:** {What should be}
**Fix:**
```{language}
{Code example or configuration change}
```
**Effort:** {Quick win / Short / Medium / Large}

---

### P1 — Critical (fix before production)

#### {CHECK_ID}: {Item Name}

**Current state:** {What was found}
**Fix:** {Description with code if applicable}
**Effort:** {Estimate}

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| {ID} | {Name} | {Brief fix description} | {Estimate} |
| ... | ... | ... | ... |

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| {ID} | {Name} | {Brief fix description} | {Estimate} |
| ... | ... | ... | ... |

---

## Delta from Previous Audit

<!-- Include this section only if a previous snapshot exists in metrics.yml -->

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| Score | {PREV}% | {CURR}% | {DELTA} |
| Pass | {PREV} | {CURR} | {DELTA} |
| Fail | {PREV} | {CURR} | {DELTA} |
| Blockers | {PREV} | {CURR} | {DELTA} |

**New passes since last audit:** {list of check IDs that flipped to PASS}
**New fails since last audit:** {list of check IDs that flipped to FAIL}

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
