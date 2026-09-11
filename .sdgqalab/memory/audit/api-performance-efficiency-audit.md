---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "performance-efficiency"
quality_attribute_name: "Performance Efficiency"
iso_characteristic: "Performance Efficiency (time behaviour, resource utilization, capacity)"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 1
  partial: 5
  fail: 4
  na: 12
  applicable: 10
  score_pct: 35.0
  rating: "Low"

priority_summary:
  p0_blockers: 0
  p1_critical: 2
  p2_important: 6
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

# Performance Efficiency Audit — API

> **Score**: 35% · Low
> **Results**: 1 pass · 5 partial · 4 fail · 12 n/a
> **Blockers**: 0 | **Critical**: 2 | **Important**: 6
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify `netlify/functions/`)
> **ISO Grounding**: Performance Efficiency

---

## Summary

Request body size is capped at 16 KiB, and public GETs set CDN-friendly `Cache-Control`, but most list endpoints return unbounded `select('*')` payloads with no pagination. Index strategy and slow-query monitoring are invisible in-repo. Admin `relatedProjectUpdates` performs per-row updates in a loop.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Read-heavy public API + admin CRUD over Supabase |
| Hot paths | `PUBLIC_RESOURCES` / `PUBLIC_DETAIL_RESOURCES`; admin project/info/event mutations |
| Caching | Response `Cache-Control: public, max-age=300, s-maxage=600, stale-while-revalidate=86400` on public GETs |
| Checkpoint status | skipped_unattended |

**N/A:** Frontend bundle/image/CDN/browser/render checks; Docker/K8s resource/HPA; static file serving; AI/ML PERs.

---

## Results

### PASS (1)

| Check ID | Item | Evidence |
|----------|------|----------|
| PER-014 | Request/Response Size Limits | `MAX_BODY_BYTES = 16 * 1024`; `parseBody` rejects oversized bodies (`api.js:3`, `159–164`) |

### PARTIAL (5)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| PER-001 | N+1 Query Prevention | Most reads are single PostgREST queries | `relatedProjectUpdates` loops per-uuid `update` (`api.js:418–428`) | high |
| PER-003 | Caching Strategy | Public GET Cache-Control / SWR headers | No Redis/server cache; admin/auth `no-store` only | high |
| PER-005 | Async Processing | Workload is short CRUD; no email/PDF pipelines in handler | No worker queue if admin batch work grows; multi-insert stays sync | medium |
| PER-006 | Connection Pooling | Managed Supabase HTTP API (not raw pg per request) | No app-level pool sizing/docs | high |
| PER-012 | API Response Compression | Netlify edge typically gzip/brotli | Not configured/asserted in `netlify.toml` | medium |

### FAIL (4)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| PER-002 | Database Query Optimization | No migrations/`CREATE INDEX` in repo; filter columns (`slug`, `uuid`, `approved`) unverified | high | P1 |
| PER-004 | Pagination Implementation | Unbounded lists: `projects`, `locations`, `themes`, `radar-csv`, etc.; only `home-*` use `limit` | medium | P2 |
| PER-013 | Efficient Serialization | Widespread `select: '*'` / `.select()`; nested `project_data(*)` on lists | medium | P2 |
| PER-015 | Database Query Logging | No slow-query log, APM, or query-count tests for API | medium | P2 |

### N/A (12)

| Check ID | Reason |
|----------|--------|
| PER-007–PER-011 | Frontend triggers |
| PER-016–PER-017 | docker/k8s |
| PER-018 | django/flask/nginx/`any_web_framework` |
| PER-019–PER-022 | AI/ML |

---

## Remediation Roadmap

### P1 — Critical

| Check | Effort | Action |
|-------|--------|--------|
| PER-002 | Medium | Export schema; add indexes on `slug`, `uuid`, `approved`, FKs used in filters/joins |
| PER-001 | Short | Batch `relatedProjectUpdates` (single RPC or fewer upserts) |

### P2 — Important

| Check | Effort | Action |
|-------|--------|--------|
| PER-004 | Medium | Add `limit`/`offset` or cursor params; hard max page size on all list resources |
| PER-013 | Short | Explicit column lists; slim nested selects for list vs detail |
| PER-003 / PER-012 | Short | Keep public Cache-Control; document Netlify compression; optional short CDN cache for `/api/public/*` |
| PER-015 | Medium | Enable Supabase/Postgres `log_min_duration_statement` in staging; add query-budget tests |
| PER-005 / PER-006 | Short | Document sync-CRUD assumption; document managed pool limits |

---

## Priority Classification

| Tier | Checks |
|------|--------|
| P0 | — |
| P1 | PER-002, PER-001 (high PARTIAL) |
| P2 | PER-004, PER-013, PER-015, PER-003, PER-006, PER-012 |
| P3 | PER-005 |
