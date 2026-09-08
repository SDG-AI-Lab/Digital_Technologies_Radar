# Scoring & Ratings Reference

Reference material for sdgqalab-audit. Load this file when computing scores,
assigning ratings, and classifying findings by priority.

---

## Score Computation

For each quality attribute audit:

```
pass_count     = count of PASS results
partial_count  = count of PARTIAL results
fail_count     = count of FAIL results
applicable     = pass_count + partial_count + fail_count  (exclude N/A)

score_pct = ((pass_count + 0.5 × partial_count) / applicable) × 100
```

Partial results count as half credit — they indicate progress but not
completion.

---

## Rating Bands

| Rating | Score Range | Meaning |
|--------|-------------|---------|
| Critical | 0-29% | Production blocker — immediate action required |
| Low | 30-49% | Significant gaps — not recommended for production |
| Adequate | 50-69% | Minimum viable — launch with documented risk acceptance |
| Solid | 70-84% | Good posture — minor improvements recommended |
| Exemplary | 85-100% | Industry best practice — ready for production |

### How to Apply

1. Compute `score_pct` per quality attribute using the formula above
2. Look up the percentage in the table
3. Include the rating label in:
   - Quality attribute report header (e.g., `> **Score**: 45% · Low`)
   - YAML frontmatter (`rating: "Low"`)
   - Terminal summary output
   - Executive summary scorecard

---

## Weighted Overall Score

When computing the overall project score, severity weights apply:

| Item Severity | Weight |
|--------------|--------|
| Critical | 3× |
| High | 2× |
| Medium | 1× |
| Low | 0.5× |

```
weighted_score = Σ(item_score × severity_weight) / Σ(severity_weight)
```

Where `item_score` is: PASS=1.0, PARTIAL=0.5, FAIL=0.0, N/A=excluded.

Do NOT aggregate quality attributes into a single overall rating using
simple averaging — always use weighted scoring.

---

## Priority Classification

Group all FAIL and PARTIAL items into priority tiers:

| Tier | Criteria | Action |
|------|----------|--------|
| **P0 — Blocker** | Critical severity + FAIL | Must fix before any deployment |
| **P1 — Critical** | High severity + FAIL, or Critical + PARTIAL | Fix before production |
| **P2 — Important** | Medium severity + FAIL, or High + PARTIAL | Fix within first sprint |
| **P3 — Improvement** | Low severity, or Medium + PARTIAL | Plan for backlog |

---

## Production Readiness Verdict

The overall audit scores collectively determine production readiness.
There is no separate "production readiness" domain — the verdict IS the
aggregation of all quality attribute scores.

### Verdict Logic

1. If ANY quality attribute has a Critical rating → **NOT PRODUCTION READY**
2. If ANY P0 blocker exists → **NOT PRODUCTION READY**
3. If more than 2 quality attributes are Low → **NOT RECOMMENDED** (launch at risk)
4. If all quality attributes are Adequate or above → **CONDITIONALLY READY**
   (document accepted risks)
5. If all quality attributes are Solid or above → **PRODUCTION READY**
6. If all quality attributes are Exemplary → **EXEMPLARY — PRODUCTION READY**

Include the verdict prominently in the executive summary and terminal output.
