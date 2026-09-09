---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "reliability"
quality_attribute_name: "Reliability"
iso_characteristic: "Reliability (faultlessness, availability, fault_tolerance, recoverability)"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 1
  partial: 4
  fail: 7
  na: 10
  applicable: 12
  score_pct: 25.0
  rating: "Critical"

priority_summary:
  p0_blockers: 1
  p1_critical: 4
  p2_important: 5
  p3_improvement: 1

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Reliability Audit — API

> **Score**: 25% · Critical
> **Results**: 1 pass · 4 partial · 7 fail · 10 n/a
> **Blockers**: 1 | **Critical**: 4 | **Important**: 5
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify `netlify/functions/`)
> **ISO Grounding**: Reliability

---

## Summary

The Netlify Function handler has a solid top-level error boundary and a dependency-probing `/api/health`, but lacks timeouts, retries, circuit breaking, and transactional multi-step writes. There is no in-repo backup, migration, or DR evidence for the Supabase Postgres dependency. Heartbeat workflow keeps Supabase awake daily but does not monitor the API health endpoint.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Single handler `netlify/functions/api.js` behind `/api/*` (`netlify.toml`) |
| Interfaces | Public GET resources, auth sign-in/user create, admin CRUD; Supabase JS service role |
| Data contracts | Ad-hoc field allowlists (`INFO_FIELDS`, `EVENT_FIELDS`); no OpenAPI/Zod; no in-repo SQL migrations |
| AI/ML behavior | None |
| Checkpoint status | skipped_unattended (focused API domain audit) |

**Tech tags:** `nodejs`, `netlify-functions`, `supabase`, `postgresql`, `any_api`, `any_database`

**Trigger overrides:** REL-002 → N/A (request-scoped Netlify Functions; no long-lived process for SIGTERM drain). Docker/K8s/AI/message-broker/`any_web_framework`/`any_ci_cd` checks → N/A.

---

## Results

### PASS (1)

| Check ID | Item | Evidence |
|----------|------|----------|
| REL-001 | Error Handling Strategy | Top-level `try/catch` in `exports.handler` returns structured `{ error }` JSON; `console.error('API request failed', error)`; no empty catch blocks (`netlify/functions/api.js` ~167–470) |

### PARTIAL (4)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| REL-003 | Health Check Endpoints | `GET …/health` selects `dataset_version` limit 1; Origin-less requests allowed | No probe timeout; heartbeat hits Supabase REST not `/api/health`; not wired to Netlify health checks | high |
| REL-007 | Database Connection Pooling | Uses managed PostgREST via `@supabase/supabase-js` (no raw `pg` per-request sockets in app) | No documented/app-configured pool bounds; `createClient` per request with defaults only | high |
| REL-021 | Input Data Validation | Auth/admin paths check types, password length, role enum, `allowedFields` for info/events; `MAX_BODY_BYTES` | No schema library; `admin/projects` inserts largely unvalidated `projectPayload` | high |
| REL-022 | Idempotent Operations | Approve is naturally idempotent; user create compensates role failure with `deleteUser` | No `Idempotency-Key`; project create / related updates can duplicate on retry | medium |

### FAIL (7)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| REL-004 | Retry Logic with Backoff | No `p-retry`/`async-retry`/backoff around Supabase calls | medium | P2 |
| REL-005 | Circuit Breaker Pattern | No `opossum`/`cockatiel` or custom breaker | medium | P2 |
| REL-006 | Timeout Configuration | `createClient` has no `db`/`global` fetch timeout; only platform function timeout | high | P1 |
| REL-009 | Transaction Management | Multi-step writes without `rpc`/transaction: project+`project_data` insert; delete radar then project; `relatedProjectUpdates` loop (`api.js` ~329–429) | high | P1 |
| REL-013 | Data Backup Configuration | No `pg_dump`/backup workflow/docs; Supabase backups not evidenced in repo | critical | P0 |
| REL-014 | Disaster Recovery Plan | No runbook/DR/incident docs under `docs/` or repo | high | P1 |
| REL-016 | Database Migration Safety | Zero `.sql` / migration folders in repo; schema unmanaged in VCS | high | P1 |

### N/A (10)

| Check ID | Reason |
|----------|--------|
| REL-002 | Override: serverless request-scoped lifecycle |
| REL-008 | No server sessions (JWT Bearer); no `any_web_framework` tag |
| REL-010 | No message broker |
| REL-011, REL-012, REL-015 | docker/k8s not in layer tags |
| REL-017 | `any_ci_cd`/docker/k8s not in layer tags |
| REL-018–REL-020 | No AI/ML |

---

## Remediation Roadmap

### P0 — Blocker

| Check | Effort | Action |
|-------|--------|--------|
| REL-013 | Short | Document Supabase PITR/daily backup settings (retention, region) and a tested restore procedure; add link in `docs/ops/backup.md` |

### P1 — Critical

| Check | Effort | Action |
|-------|--------|--------|
| REL-006 | Short | Set Supabase client fetch timeout (custom `fetch` with `AbortSignal`) ≤ Netlify function limit |
| REL-009 | Medium | Wrap multi-table writes in a Postgres function/`rpc` transaction; fail atomic |
| REL-014 | Medium | Write API+DB DR runbook: restore DB, redeploy Netlify, env secrets, RTO/RPO |
| REL-016 | Medium | Export schema to repo (`supabase/migrations` or SQL dumps) with reversible changes |

### P2 — Important

| Check | Effort | Action |
|-------|--------|--------|
| REL-003 | Short | Point heartbeat/uptime at `GET /api/health`; add timeout; alert on non-200 |
| REL-004 / REL-005 | Medium | Retry transient PostgREST 5xx/network with exponential backoff+jitter; optional breaker for sustained outages |
| REL-007 | Short | Document Supabase connection limits; reuse client within warm invocation where safe |
| REL-021 / REL-022 | Medium | Add Zod/JSON Schema for admin payloads; support `Idempotency-Key` on creates |

---

## Priority Classification

| Tier | Checks |
|------|--------|
| P0 | REL-013 |
| P1 | REL-006, REL-009, REL-014, REL-016 |
| P2 | REL-003, REL-004, REL-005, REL-007, REL-021 |
| P3 | REL-022 |
