---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "data-quality"
quality_attribute_name: "Data Quality"
iso_characteristic: "Data Quality (ISO 25012 / ISO 5259 applicable aspects)"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:38:00Z"
config_version: 3

score:
  pass: 0
  partial: 3
  fail: 8
  na: 7
  applicable: 11
  score_pct: 13.6
  rating: "Critical"

priority_summary:
  p0_blockers: 2
  p1_critical: 3
  p2_important: 5
  p3_improvement: 1

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "no_feedback"
---

# Data Quality Audit — API

> **Score**: 13.6% · Critical
> **Results**: 0 pass · 3 partial · 8 fail · 7 n/a
> **Blockers**: 2 | **Critical**: 3 | **Important**: 5
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify + Supabase Postgres)
> **ISO Grounding**: Data Quality

---

## Summary

Data quality is **Critical**. There are **no in-repo migrations, schema dumps, or RLS policies** — the API talks to Supabase with the **service role**, so application code is the only visible control plane. Input validation is partial (`allowedFields` / body size), but project writes remain weakly typed. PII handling and least-privilege DB access fail hard (DQ-013/014). No retention policy or automated DQ monitoring exists. AI/ETL checks are N/A.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Functions → Supabase Postgres via service role (`configuredClient` in `api.js`) |
| Interfaces | Public radar GETs; admin CRUD for projects/info; heartbeat against `dataset_version` |
| Data contracts | Resource→table maps (`PUBLIC_RESOURCES`, field allowlists); **no** SQL migrations / OpenAPI in repo |
| AI/ML behavior | None — DQ-008–012, DQ-016, DQ-018 N/A |
| Checkpoint status | **no_feedback** |

**Trigger filter:** `any_database`, `any_api`. AI/ETL/embedding triggers → N/A.

---

## Results

### PASS (0)

_None._

### PARTIAL (3)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DQ-002 | Data Validation at Input | Body size limit; `allowedFields` on some info routes | Project payloads not schema-validated before insert/update | high |
| DQ-004 | Data Type Enforcement | Supabase/Postgres types exist remotely | No in-repo schema to verify enums/dates/CHECK; app treats JSON loosely | medium |
| DQ-007 | Data Normalization | Separate `tr_projects` + `project_data` tables | Relationship rules undocumented; dual writes without transaction evidence | medium |

### FAIL (8)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| DQ-001 | Database Schema Constraints | No migrations/`schema.sql` in repo; constraints not verifiable or enforced in app | high | P1 |
| DQ-003 | Referential Integrity | No FK/ON DELETE evidence in repo; multi-table project writes can orphan | high | P1 |
| DQ-005 | Migration Completeness | Zero migration history in repository | medium | P2 |
| DQ-006 | Default Values | No schema defaults documented; inserts rely on client-supplied fields | medium | P2 |
| DQ-013 | PII Handling | User emails/roles/project contact-like fields with no PII inventory, encryption-at-rest docs, or log scrubbing | critical | **P0** |
| DQ-014 | Data Access Controls | App uses `SUPABASE_SECRET_KEY` (service role) for all queries — bypasses RLS; not least-privilege | high | **P0** |
| DQ-015 | Data Retention Policy | No retention/archival docs or cleanup jobs | medium | P2 |
| DQ-017 | Data Quality Monitoring | No Great Expectations/dbt tests/assertions on tables | medium | P2 |

### N/A (7)

| Check ID | Item | Reason |
|----------|------|--------|
| DQ-008 | Training Data Documentation | No AI/ML |
| DQ-009 | Data Lineage | AI/ETL trigger |
| DQ-010 | Bias Detection | No AI/ML |
| DQ-011 | Data Versioning | AI/ML trigger |
| DQ-012 | Feature Store / Data Schema | No AI/ML |
| DQ-016 | ETL/Pipeline Error Handling | No Airflow/dbt/celery ETL |
| DQ-018 | Embedding Quality Checks | No vector store |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

#### DQ-013: PII Handling

**Current state:** No PII inventory; service-role access to user/project data; no scrubbing/export/deletion runbook.
**Required state:** Document PII fields; encrypt/restrict; scrub logs; GDPR-style export/delete path where required.
**Fix:** Inventory columns (email, names, contacts); enable Supabase encryption/access controls; add admin deletion/export procedure in `docs/ops/privacy.md`.
**Effort:** Medium–Large

#### DQ-014: Data Access Controls

**Current state:** Single service-role client for all API operations.
**Required state:** Least-privilege keys (anon + RLS for public reads; restricted role for writes) or documented compensating controls.
**Fix:** Prefer RLS policies + anon/authenticated keys for public reads; reserve service role for admin bypass only; rotate keys.
**Effort:** Medium–Large

---

### P1 — Critical (fix before production)

#### DQ-001: Database Schema Constraints

**Fix:** Export Supabase schema to `supabase/migrations/` (or `schema.sql`); ensure PK/NOT NULL/UNIQUE/CHECK on critical columns.
**Effort:** Medium

#### DQ-003: Referential Integrity

**Fix:** Declare FKs between `tr_projects` and `project_data` (and related tables) with explicit ON DELETE; wrap multi-step writes in RPC/transaction.
**Effort:** Medium

#### DQ-002: Data Validation at Input (PARTIAL → target PASS)

**Fix:** Schema-validate all write payloads before Supabase calls.
**Effort:** Medium

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DQ-005 | Migration Completeness | Adopt Supabase CLI migrations as source of truth | Medium |
| DQ-006 | Default Values | DB defaults for timestamps/flags; document NULL semantics | Short |
| DQ-015 | Retention Policy | Document retention + optional cleanup job | Short |
| DQ-017 | DQ Monitoring | Periodic SQL assertions or Supabase checks on critical tables | Medium |
| DQ-004 | Type Enforcement | Align app validators with DB types; avoid free-text enums | Short |

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DQ-007 | Normalization | Document intentional denormalization / sync rules for radar rows | Short |

---

## Delta from Previous Audit

First audit — no comparison available.

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (DQ-013, DQ-014)
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
