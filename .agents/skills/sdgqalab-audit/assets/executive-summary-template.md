# Executive Summary Template

Use this template to produce `.sdgqalab/memory/audit/executive-summary.md`.
Replace all `{PLACEHOLDERS}` with actual values from the audit run.

---

```markdown
---
schema: sdgqalab/executive-summary/v1
project: "{PROJECT_NAME}"
audit_date: "{YYYY-MM-DDTHH:MM} UTC"
overall_score_pct: {N.N}
overall_rating: "{RATING}"
verdict: "{VERDICT}"
layers_audited: {N}
quality_attributes_audited: {N}
total_checks: {N}
context_checkpoints:
  completed: {N}
  corrected: {N}
  skipped: {N}
---

# Production Readiness — Executive Summary

**Project**: {PROJECT_NAME}
**Audit date**: {YYYY-MM-DDTHH:MM} UTC
**Overall score**: {N.N}% {RATING}
**Verdict**: {VERDICT}

---

## Project Context Basis

| Area | Audit Understanding | Evidence |
|------|---------------------|----------|
| Product purpose | {Brief purpose inferred from code/docs} | {file paths} |
| Primary workflows | {Main user/system workflows audited} | {file paths} |
| Interfaces | {APIs, jobs, CLIs, queues, integrations} | {file paths} |
| Data contracts | {Schemas, validators, models, migrations, specs} | {file paths} |
| AI/ML behavior | {Task type, structured input/output contracts, prompts, evals, providers, or N/A} | {file paths} |

### Human Checkpoints

| Scope | Status | Correction Applied |
|-------|--------|--------------------|
| {layer or project-wide scope} | {confirmed/corrected/no feedback/skipped} | {summary or N/A} |
{... one row per checkpoint ...}

---

## Scorecard

### Per-Layer Quality Attribute Scores

| Layer | Quality Attribute | Score | Rating | Pass | Partial | Fail | N/A |
|-------|-------------------|-------|--------|------|---------|------|-----|
| {layer} | {domain_name} | {N.N}% | {RATING} | {n} | {n} | {n} | {n} |
{... one row per layer × quality attribute combination ...}

### Layer Totals

| Layer | Type | Score | Rating | Checks |
|-------|------|-------|--------|--------|
| {layer} | {type_label} | {N.N}% | {RATING} | {n} |
{... one row per layer ...}

### Quality Attribute Totals (Across All Layers)

| Quality Attribute | Avg Score | Rating |
|-------------------|-----------|--------|
| {domain_name} | {N.N}% | {RATING} |
{... one row per quality attribute ...}

---

## Production Readiness Verdict

| Criterion | Status |
|-----------|--------|
| Overall score >= 60% | {PASS/FAIL} |
| Zero P0 blockers | {PASS/FAIL} ({n} remaining) |
| All critical-severity checks pass | {PASS/FAIL} ({n} failing) |

**Verdict**: **{VERDICT}**

{If NOT RECOMMENDED: "The following blockers must be resolved before production deployment."}

---

## Blockers (P0)

{If none: "No P0 blockers found."}

| # | Check ID | Layer | Finding | Severity |
|---|----------|-------|---------|----------|
| 1 | {PREFIX-NNN} | {layer} | {description} | {severity} |
{... all P0 items ...}

---

## Top 10 Priorities

| # | Check ID | Layer | Finding | Severity | Effort |
|---|----------|-------|---------|----------|--------|
| 1 | {PREFIX-NNN} | {layer} | {description} | {severity} | {effort} |
{... top 10 most impactful items ...}

---

## Remediation Effort Estimate

| Category | Count | Examples |
|----------|-------|---------|
| Quick wins (< 1 hour) | {n} | {brief list} |
| Short tasks (1–4 hours) | {n} | {brief list} |
| Medium tasks (4–16 hours) | {n} | {brief list} |
| Large tasks (> 16 hours) | {n} | {brief list} |

**Estimated total effort**: {N} items, approximately {N}–{N} hours

---

## Delta from Previous Audit

{If no previous audit: "First audit — no comparison available."}

{If previous audit exists:}

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Overall score | {N.N}% | {N.N}% | {↑/↓} {N.N}% |
| Blockers | {n} | {n} | {↑/↓} {n} |
| Critical issues | {n} | {n} | {↑/↓} {n} |
| High issues | {n} | {n} | {↑/↓} {n} |

---

## Reports Index

| Report | Path |
|--------|------|
| {Layer — Quality Attribute} | `.sdgqalab/memory/audit/{filename}` |
{... one row per generated report ...}
| Metrics history | `.sdgqalab/memory/audit/metrics.yml` |
```
