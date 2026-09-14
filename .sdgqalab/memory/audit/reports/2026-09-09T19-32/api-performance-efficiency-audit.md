---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: performance-efficiency
quality_attribute_name: Performance Efficiency
iso_characteristic: "ISO 25010 Performance Efficiency (time behaviour, resource utilization, capacity)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 3
  partial: 5
  fail: 2
  na: 12
  applicable: 10
  score_pct: 55.0
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 6
  p3_improvement: 1

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Performance Efficiency Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 55.0% · Adequate
> **Results**: 3 pass · 5 partial · 2 fail · 12 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 6
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Performance Efficiency · ISO/IEC 5055:2021 · ISO/IEC 25023

---

## Summary

The API benefits from Netlify's edge CDN and correctly applies HTTP cache-control on public reads (`public, max-age=300, s-maxage=600, stale-while-revalidate=86400`), which is the single most impactful performance decision in the codebase — most reads should never reach the function or Supabase under normal load. The 16 KB body cap and automatic edge compression also help. The unresolved concerns are: (a) no pagination on any of the larger list endpoints (`projects`, `locations`, `radar-csv`, `disaster-events`, etc.), so payload size scales linearly with dataset growth; (b) per-invocation Supabase client construction (no module-scope pooling); (c) an inability to verify index coverage because no migrations are checked in; (d) an admin PUT loop that fires one UPDATE per related project record. None of these are blockers today given the modest content size but all will bite as the catalog grows or a spider hits the CSV endpoint.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Function serving cacheable public reads and admin writes against Supabase Postgres. |
| Interfaces | `PUBLIC_RESOURCES` (14 read endpoints), `PUBLIC_DETAIL_RESOURCES` (6 detail endpoints), `admin/*` writes. |
| Data contracts | Supabase tables — sizes unknown from repo; likely tens to low hundreds of rows in catalog tables, growing in `disaster_events` and `tr_projects`. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. |

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| PER-010 | Browser Caching Headers | `response()` accepts a `cacheControl` argument; public reads pass `'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'` (api.js lines 216, 236); mutating and admin routes default to `'no-store'`. `Vary: Origin` is always set. Fingerprinted static assets are the SPA's concern, not the API's. |
| PER-012 | API Response Compression | Netlify's edge automatically compresses `application/json` responses with brotli/gzip based on `Accept-Encoding` — no explicit config needed. Because responses use the `response()` helper which sets `Content-Type: application/json`, all API traffic is eligible. |
| PER-014 | Request/Response Size Limits | `MAX_BODY_BYTES = 16 * 1024`; `parseBody` throws `Request body is too large` when the incoming body exceeds it (api.js lines 3, 160–164). This is well below Netlify's 6 MB function payload cap and sensible for the write endpoints (no file uploads exist). |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| PER-001 | N+1 Query Prevention | Public reads use PostgREST embedded selects, so `projects` returns `*, project_data(*)` in a single round trip (line 15). `disaster-events` embeds `locations(id, country, region)` similarly (line 25). No per-row loops in the read paths. | The admin `PUT /admin/info/(technology|disaster-type)/:slug` handler iterates over `body.relatedProjectUpdates` and issues one `UPDATE tr_projects ... WHERE uuid = ?` per item (api.js lines 418–429). For a taxonomy rename touching hundreds of projects, this is a genuine N+1. | high |
| PER-002 | Database Query Optimization | Primary keys are auto-indexed by Supabase/Postgres; embedded selects use FK relationships which are typically indexed. | No migrations are checked into the repo (see MNT-020), so custom indexes on hot filter columns — `tr_projects.approved` (used in `excludeFalse` for `projects` and in `admin/projects/pending`), `disaster_events.help_needed` (used in `home-help-needed`), `disaster_events.uuid`, `technologies.slug`, `disaster_types.slug`, `user_roles.user_id` — cannot be verified. Index coverage is entirely a live-database concern with no repo evidence. | high |
| PER-003 | Caching Strategy | HTTP-layer caching (via the CDN + `s-maxage`) provides an implicit shared cache: most catalog reads under `/api/public/*` are answered by Netlify's edge for 10 minutes with stale-while-revalidate for a day. `bumpDataVersion` (line 84–90) bumps `dataset_version.data_version` on every write so the client can decide when to re-fetch. | No application-level cache backend (Redis, in-memory LRU inside the function) — every cache miss still fires a Supabase query. No `Surrogate-Key`/`Cache-Tag` header for targeted purges after a write, so `bumpDataVersion` bumps the client version but cannot immediately invalidate the edge cache (which naturally expires within 300 s). | high |
| PER-006 | Connection Pooling | Supabase manages the server-side pool (PgBouncer). Client is created with `{ auth: { autoRefreshToken: false, persistSession: false } }` which avoids extra background timers. | `configuredClient()` is called inside the handler on every invocation, and again for the role-lookup after `signInWithPassword` — a fresh `SupabaseClient` (which internally holds `fetch` connections) is instantiated for each request. On warm invocations the module-level cache is not used. | high |
| PER-013 | Efficient Serialization | Explicit column lists exist for a subset of resources: `technologies` (`name, description, img_url, slug, source`), `disaster_types` (`id, name, description, img_url, slug, source`), `dataset-version` (`data_version`). Sign-in response is scoped to `{ id, email, role }`. | Many list endpoints still use `select: '*'` (`locations`, `themes`, `data_types`, `use_cases`, `partners`, `un_hosts`, `tr_projects` for `projects` and `home-projects`, `disaster_events`, `project_data` for `radar-csv`, `disaster_types_projects`, `tech_projects`). Any column added later inflates every list response silently. | medium |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| PER-004 | Pagination Implementation | `PUBLIC_RESOURCES` for `projects`, `disaster-projects`, `disaster-events`, `radar-csv`, `tech-projects`, `locations`, `themes`, `data-types`, `use-cases`, `partners`, `un-hosts`, and admin `admin/projects/pending` all execute unbounded SELECTs. `radar-csv` (line 27–32) returns the full `project_data` table as CSV in a single call. Only `home-projects` (`limit: 4`), `home-technologies` (`limit: 3`), and `home-disaster-types` (`limit: 3`) bound their output. Payload size scales linearly with data growth and cannot be capped by the client. | medium | P2 |
| PER-015 | Database Query Logging | No slow-query log configuration in `api.js` or `jest.api.config.js`. Tests do not assert query counts (mocks a query builder without shape verification). Supabase's own logs are not surfaced in the runbook. | medium | P2 |

### N/A (12 items)

| Check ID | Item | Reason |
|----------|------|--------|
| PER-005 | Async Processing | No long-running work in the API — no email sending, no PDF generation, no external HTTP calls beyond Supabase. Every request is a short DB round-trip. |
| PER-007 | Bundle Size Optimization | Frontend concern. |
| PER-008 | Image Optimization | Frontend concern. |
| PER-009 | CDN Configuration | No static assets served by the API; the JSON responses are already cached at Netlify's edge (see PER-010). |
| PER-011 | Frontend Rendering Performance | Frontend concern. |
| PER-016 | Container Resource Allocation | Netlify sets function memory (default 1024 MB) and CPU limit; not tenant-configurable. |
| PER-017 | Horizontal Scaling Configuration | Netlify Functions scale horizontally by default; the code is stateless (see FLX-005). |
| PER-018 | Static File Serving | The API does not serve static files; SPA is on GH Pages / Netlify Edge. |
| PER-019 | LLM Response Streaming | No LLM. |
| PER-020 | Embedding Batch Processing | No embeddings. |
| PER-021 | Vector Search Optimization | No vector store. |
| PER-022 | LLM Token Usage Optimization | No LLM. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

#### PER-004: Pagination Implementation

**Current state:** `GET /api/public/projects`, `.../disaster-events`, `.../radar-csv`, `.../locations`, and every other non-home list returns the full table.

**Required state:** Default page size (e.g., 50) with `?limit` and `?offset` (or cursor) query params, and a hard maximum (e.g., 200). Return a paging envelope `{ data, count, next }`. `radar-csv` should either stream chunked or require a `?limit` param.

**Fix:**

```javascript
// netlify/functions/api.js — inside the public/ read branch, before executing the query
const searchParams = new URLSearchParams((event.rawQuery || '').split('&').filter(Boolean).join('&'));
const requestedLimit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

let query = supabase.from(resource.table).select(resource.select, { count: 'exact' });
if (resource.excludeFalse) query = query.neq(resource.excludeFalse, false);
if (resource.equals) Object.entries(resource.equals).forEach(([c, v]) => { query = query.eq(c, v); });
if (resource.order) query = query.order(resource.order, { ascending: resource.ascending });

const effectiveLimit = resource.limit ?? requestedLimit;
query = query.range(offset, offset + effectiveLimit - 1);
if (resource.csv) query = query.csv();

const { data, count, error } = await query;
if (error) throw error;
return response(200, {
  data,
  count,
  next: (offset + effectiveLimit) < count
    ? `${event.path}?offset=${offset + effectiveLimit}&limit=${effectiveLimit}`
    : null
}, origin, 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
```

For the CSV endpoint, either keep it unpaginated behind an admin gate (bulk export) or require `?limit`. If it remains unbounded, at least add a `Content-Disposition: attachment; filename="radar.csv"` header and document the intended consumer.

**Effort:** Short (1–2 days including client updates and pagination envelope test coverage).

#### PER-015: Database Query Logging

**Current state:** No slow-query visibility.

**Fix:**

1. Enable `pg_stat_statements` and `log_min_duration_statement = 500ms` in Supabase (Settings → Database → Custom Postgres config).
2. Add a per-request timing log in the same pino call added for OBS-003:

```javascript
const start = Date.now();
// ...handler body...
logger.info({ method: event.httpMethod, path: event.path, status, durationMs: Date.now() - start });
```

3. Add a jest.api regression covering "list projects with 500 rows returns within N ms" once real fixtures exist.

**Effort:** Quick win (config change + log line).

#### PER-001: N+1 Query Prevention (relatedProjectUpdates loop)

**Current state:** `PUT /admin/info/(technology|disaster-type)/:slug` issues one UPDATE per related project.

**Fix:** Batch the updates into a single query per (technology|disaster_type) value using an `IN` clause on `tr_projects.uuid`, or move the operation into a Postgres RPC that performs a single UPDATE:

```sql
-- supabase/migrations/<ts>_reassign_projects.sql
create or replace function reassign_projects(
  p_uuids uuid[],
  p_technology text default null,
  p_disaster_type text default null
) returns void language sql as $$
  update tr_projects
  set
    technology    = coalesce(p_technology, technology),
    disaster_type = coalesce(p_disaster_type, disaster_type)
  where uuid = any(p_uuids);
$$;
```

Call via `supabase.rpc('reassign_projects', { p_uuids: uuids, p_technology, p_disaster_type })` from the handler.

**Effort:** Short.

#### PER-002: Database Query Optimization (indexes)

**Fix:** Once the migration framework lands (MNT-020 / REL-016), add explicit indexes for filter columns actually used:

```sql
-- supabase/migrations/<ts>_add_hot_indexes.sql
create index if not exists idx_tr_projects_approved  on tr_projects (approved);
create index if not exists idx_tr_projects_uuid       on tr_projects (uuid);
create index if not exists idx_disaster_events_help   on disaster_events (help_needed);
create index if not exists idx_disaster_events_uuid   on disaster_events (uuid);
create index if not exists idx_technologies_slug      on technologies (slug);
create index if not exists idx_disaster_types_slug    on disaster_types (slug);
create index if not exists idx_user_roles_user_id     on user_roles (user_id);
create index if not exists idx_project_data_tr_id     on project_data (tr_projects_id);
```

**Effort:** Quick win (after REL-016).

#### PER-003: Caching Strategy (surrogate keys for targeted purge)

**Fix:** Set `Cache-Tag`/`Netlify-CDN-Cache-Control` headers keyed by resource on public reads, then call the Netlify [Cache Purge API](https://docs.netlify.com/platform/caching/#on-demand-purge) inside `bumpDataVersion` for the affected tag. Optionally add a small in-function LRU (e.g., `lru-cache`) for the shortest-lived dictionaries (`dataset_version`, `themes`) — but the CDN-tag approach is preferred.

**Effort:** Short.

#### PER-006: Connection Pooling (module-scope client)

**Fix:** Hoist `configuredClient()` to module scope so warm invocations reuse the same `SupabaseClient` + underlying `fetch` connection pool:

```javascript
// Top of api.js, outside the handler
let cachedClient = null;
function configuredClient() {
  if (cachedClient) return cachedClient;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error('Server configuration is incomplete');
  cachedClient = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  return cachedClient;
}
```

Note the interaction with the sign-in flow: the second `configuredClient()` call in `getRole` (line 150) and after user creation (line 290) is deliberate — it's a **fresh** client to avoid the sign-in-mutated session leaking into the role lookup. With module-scope caching that comment becomes wrong because the "fresh" client would be the same cached instance. Fix by having `configuredClient()` return the cached instance for the general handler but have the sign-in path build a one-off client explicitly:

```javascript
async function serverOnlyClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
// use serverOnlyClient() where a session-isolated client is needed (getRole after signInWithPassword)
```

**Effort:** Short (needs unit-test updates in `tests/api/api.test.js`).

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| PER-013 | Efficient Serialization | Replace every `select: '*'` in `PUBLIC_RESOURCES`/`PUBLIC_DETAIL_RESOURCES` with an explicit column list. Coordinates with SEC-018 (data leakage) and DQ-013 (PII on `disaster_events.contacts`). | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off *(none)*
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **55.0%** ✓
- [ ] No critical-severity items in FAIL state ✓
