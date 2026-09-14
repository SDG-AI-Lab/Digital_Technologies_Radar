---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: reliability
quality_attribute_name: Reliability
iso_characteristic: "ISO 25010 Reliability (faultlessness, availability, fault tolerance, recoverability)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 2
  partial: 5
  fail: 6
  na: 9
  applicable: 13
  score_pct: 34.6
  rating: "Low"

priority_summary:
  p0_blockers: 1
  p1_critical: 2
  p2_important: 8
  p3_improvement: 0

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Reliability Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 34.6% · Low
> **Results**: 2 pass · 5 partial · 6 fail · 9 n/a
> **Blockers**: 1 | **Critical**: 2 | **High**: 8
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Reliability · ISO/IEC 5055:2021 · ISO/IEC 25023

---

## Summary

The API layer relies almost entirely on the Netlify + Supabase platforms for reliability posture and has taken very few explicit steps of its own. Global error handling and a real (dependency-probing) health endpoint plus a daily heartbeat cron are in place — those are the two clear wins. Everything else is gap: no retry/backoff for the Supabase client, no circuit breaker, no explicit timeouts on the outbound calls, no in-repo backup or disaster-recovery documentation for Supabase, and no migration framework at all (so schema rollback is effectively impossible). Multi-step admin writes span two tables (`tr_projects` + `project_data`) without a transactional boundary, and write endpoints have no idempotency keys, so any retry safely propagates duplicates. Backup posture (`REL-013`) is the single P0 blocker for launch.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Serverless CRUD API in `netlify/functions/api.js`; every operation is a short-lived HTTP → Supabase round trip. |
| Interfaces | `/api/health`, `/api/public/*`, `/api/auth/*`, `/api/admin/*`. External uptime probe: `.github/workflows/supabase-heartbeat.yml` (daily). |
| Data contracts | Supabase Postgres tables (`tr_projects`, `project_data`, `disaster_events`, `technologies`, `disaster_types`, `dataset_version`, `user_roles`, etc.). No migrations, no ORM schema in repo. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. |

---

## Results

### PASS (2 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| REL-001 | Error Handling Strategy | Global `try { ... } catch (error) { console.error('API request failed', error); return response(500, ...) }` wraps the entire handler (api.js lines 192–470). No bare catches, no empty catches. All Supabase errors bubble up to the same 500 path with a safe message. |
| REL-003 | Health Check Endpoints | `GET /api/health` (api.js lines 197–200) executes `supabase.from('dataset_version').select('id').limit(1)` — a real dependency probe, not a bare 200. `.github/workflows/supabase-heartbeat.yml` polls it daily via `curl` and fails the workflow on non-2xx. |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| REL-006 | Timeout Configuration | Netlify Function invocation has a platform-imposed 10 s wall-clock cap (26 s for background); `parseBody` rejects bodies >16 KB immediately. | No explicit per-call timeout is passed to Supabase JS calls — Supabase's default `fetch` timeout applies and can hold up to the full function budget on slow queries. No client-side statement timeout. | high |
| REL-007 | Database Connection Pooling | Supabase runs PgBouncer server-side (transaction pooling on port 6543). `configuredClient` sets `{ auth: { autoRefreshToken: false, persistSession: false } }`, minimising client overhead. | `configuredClient` is called anew inside the try block on every invocation (line 194) — a fresh `SupabaseClient` (and inside auth flows a second one — line 150, 290) is constructed per request. No module-scope client reuse across warm Netlify invocations, and no explicit `pool_size`/`max_conn` configuration in code. | high |
| REL-009 | Transaction Management | User provisioning has a manual rollback: if `user_roles` insert fails, `supabase.auth.admin.deleteUser(data.user.id)` is called before throwing (api.js lines 290–297). | Multi-step writes across `tr_projects` and `project_data` are **not** atomic. `POST /admin/projects` inserts the parent, then inserts N cycle rows; a failure of the second insert leaves an orphaned `tr_projects` row (line 336–355). Same non-atomic pattern in `PUT /admin/projects/:uuid` (lines 361–378) and `DELETE /admin/projects/:uuid` (lines 380–397). Supabase JS has no client-side transactions; a Postgres RPC (`plpgsql` function) is required. | high |
| REL-017 | Rollback Capability | Netlify retains prior function deploys — a bad function can be rolled back from the Netlify UI or the CLI (`netlify deploys:restore <deploy_id>`). | The rollback path is undocumented (no runbook, no CI target); DB migration rollback is **impossible** because there is no migration framework (see MNT-020 / REL-016). No image/deploy immutability strategy noted. | high |
| REL-021 | Input Data Validation | `parseBody` caps body size at 16 KB; `allowedFields(payload, INFO_FIELDS/EVENT_FIELDS)` allowlist strips extraneous keys on info and disaster-event writes; auth/sign-in and auth/users do type checks. | `POST /admin/projects` and `PUT /admin/projects/:uuid` pass the caller's payload almost verbatim into `.insert()/.update()` on `tr_projects` and `project_data`. No schema validation, no field-type checks, no bounded string lengths. See SEC-013 for details. | high |

### FAIL (6 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| REL-004 | Retry Logic with Backoff | Grep of `api.js` for `retry`, `backoff`, `p-retry`, `tenacity` returns nothing. Any transient Supabase blip (network hiccup, replica lag on `dataset_version`, a single 5xx from PostgREST) surfaces to the caller as a 500. | medium | P2 |
| REL-005 | Circuit Breaker Pattern | No `opossum`, `cockatiel`, or hand-rolled breaker anywhere. A degraded Supabase instance will produce serial 500s for the whole traffic wave. | medium | P2 |
| REL-013 | Data Backup Configuration | No backup script, no scheduled backup job, no `pg_dump` workflow, no reference to Supabase PITR settings in the repo. `docs/` (if any) contains no runbook for backup/restore. Backup posture is entirely dependent on the Supabase plan tier — undocumented and unverified. This is the same finding that surfaces project-wide in the documentation report. | critical | **P0** |
| REL-014 | Disaster Recovery Plan | No `runbooks/`, `docs/dr/`, `RECOVERY.md`, or equivalent. No RTO/RPO targets, no communication plan, no restore procedure. | high | P1 |
| REL-016 | Database Migration Safety | No `migrations/`, `supabase/migrations/`, `alembic/`, `prisma/`, or SQL migration files in the repo. Schema changes are performed ad-hoc through the Supabase Studio. Reversibility is undefined; there is no downgrade path. | high | P1 |
| REL-022 | Idempotent Operations | No `Idempotency-Key` header handling anywhere in `api.js`. `POST /admin/projects`, `POST /admin/disaster-events`, and `POST /auth/users` will happily create duplicates on retry. `POST /admin/projects/approve` and simple UPDATEs are idempotent by nature; DELETEs are idempotent; but the create paths are not. | medium | P2 |

### N/A (9 items)

| Check ID | Item | Reason |
|----------|------|--------|
| REL-002 | Graceful Shutdown | Serverless function has no persistent process to receive SIGTERM; Netlify manages instance lifecycle. |
| REL-008 | Session Persistence | No server-side sessions (bearer JWT only). |
| REL-010 | Dead Letter Queue | No message broker in the API layer. |
| REL-011 | Container Restart Policy | Managed serverless; no container to restart. |
| REL-012 | Resource Limits | Netlify sets function memory (default 1024 MB) and 10 s CPU cap; no custom limits are declarable. |
| REL-015 | Zero-Downtime Deployment | Netlify Function deploys are atomic (new version becomes live once uploaded); no in-repo config to audit. |
| REL-018 | LLM Fallback Handling | No LLM calls. |
| REL-019 | Model Version Pinning | No models. |
| REL-020 | Embedding Store Resilience | No embedding store. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

#### REL-013: Data Backup Configuration

**Current state:** The repository contains no backup, restore, or PITR reference for the Supabase database. RPO/RTO are undefined, and there is no scripted way to reconstruct the database if the Supabase project is deleted, corrupted, or its plan is downgraded past PITR.

**Required state:** A scheduled logical backup, an offsite retention target, a documented restore procedure with a tested drill, and an explicit statement of Supabase-managed PITR retention.

**Fix (three complementary layers):**

1. **Verify + document Supabase-managed backups.** Confirm the current plan's daily backup + PITR window (Pro tier: 7-day PITR, 24 h base) and record it in a new `docs/runbooks/backup-and-restore.md`.
2. **Add a scheduled logical dump to offsite storage.** GitHub Actions workflow example (weekly, uses a read-only Postgres role, no service-role key):

```yaml
# .github/workflows/supabase-backup.yml
name: Supabase Weekly Backup

on:
  schedule:
    - cron: '17 3 * * 0'          # Sunday 03:17 UTC
  workflow_dispatch:

jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - name: Install pg client
        run: sudo apt-get update && sudo apt-get install -y postgresql-client-15

      - name: Dump schema + data
        env:
          PGPASSWORD: ${{ secrets.SUPABASE_BACKUP_PASSWORD }}
        run: |
          FILE="supabase-$(date -u +%Y-%m-%dT%H%M).sql.gz"
          pg_dump \
            --host="${{ secrets.SUPABASE_HOST }}" \
            --port=5432 \
            --username="${{ secrets.SUPABASE_BACKUP_USER }}" \
            --dbname=postgres \
            --no-owner --no-privileges --format=plain \
            | gzip -9 > "$FILE"
          echo "FILE=$FILE" >> $GITHUB_ENV

      - name: Upload to S3 (or Backblaze/R2)
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.BACKUP_S3_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.BACKUP_S3_SECRET }}
        run: |
          aws s3 cp "$FILE" "s3://${{ secrets.BACKUP_S3_BUCKET }}/supabase/$FILE" \
            --sse AES256
```

Create a `backup_reader` Postgres role in Supabase with `pg_read_all_data` (or per-schema `SELECT`) and use its password as `SUPABASE_BACKUP_PASSWORD`. Never reuse the service role for backups.

3. **Runbook + quarterly drill.** In `docs/runbooks/backup-and-restore.md`, document (a) how to restore into a fresh Supabase project (`psql < dump.sql`), (b) how to swap the Netlify env vars to the restored URL, (c) how to verify (`GET /api/health` + a sample list endpoint), and (d) schedule a quarterly restore drill (record the last drill date at the top).

**Effort:** Medium (2–3 days including workflow, role provisioning, runbook, and first drill).

---

### P1 — Critical (fix before production)

#### REL-014: Disaster Recovery Plan

**Current state:** No DR documentation in the repository.

**Fix:** Create `docs/runbooks/disaster-recovery.md` covering: RTO (e.g., 4 h) and RPO (e.g., 24 h with weekly cold + Supabase 7-day PITR); scenarios (Supabase project deleted, Netlify site suspended, DNS provider outage, secret leak); step-by-step restore procedures cross-referencing REL-013; on-call rota + escalation contacts; communication template for users on `drrtechradar.org`. Link the runbook from the top-level README and from every `SECURITY.md`/`SUPPORT.md`.

**Effort:** Short (1 day) — much of the content can be authored alongside the REL-013 runbook.

#### REL-016: Database Migration Safety

**Current state:** No migration framework in the repo. Schema drift is invisible to code review; rollbacks are impossible.

**Fix:** Adopt the **Supabase CLI** migration workflow. The CLI produces plain SQL migration files that can be reviewed, tested, and applied in CI.

```bash
# One-time setup
supabase init
supabase link --project-ref <ref>

# Capture the current live schema into a baseline migration
supabase db pull

# Going forward, every change is a migration
supabase migration new add_projects_status_column
# edit supabase/migrations/<timestamp>_add_projects_status_column.sql
supabase db push          # applies to remote after local test
```

Commit `supabase/migrations/*.sql` and add a CI step to `develop.yml`:

```yaml
- name: Verify Supabase migrations parse
  run: |
    npx supabase db reset --debug --no-seed
```

Pair the migration framework with `supabase/config.toml` and a starter RLS baseline (see DQ-014).

**Effort:** Medium (2–3 days including baseline pull and team ramp-up).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| REL-004 | Retry Logic with Backoff | Wrap Supabase calls in a small helper that retries on transient errors (network, 5xx, timeout) with exponential backoff + jitter, bounded to 2 retries and total wall-clock ≤ 3 s (well within the 10 s function budget). Exclude 4xx codes from retry. Example: use [`p-retry`](https://github.com/sindresorhus/p-retry) or a hand-rolled `retry(fn, { retries: 2, minDelay: 100 })`. | Short |
| REL-005 | Circuit Breaker Pattern | Adopt `cockatiel` or a lightweight in-memory breaker keyed by dependency name (e.g., `supabase-postgrest`). Given serverless statelessness the breaker will be per-instance — pair it with the retry helper above so a single warm instance doesn't hammer a failing Supabase. | Short |
| REL-006 | Timeout Configuration | Pass an explicit `AbortSignal` (`AbortSignal.timeout(3000)`) into Supabase requests via the `fetch` option: `createClient(url, key, { global: { fetch: (u, o) => fetch(u, { ...o, signal: AbortSignal.timeout(3000) }) } })`. Add a Postgres `statement_timeout` in `postgresql.conf` via Supabase settings (e.g., 5 s for the anon/backup role). | Short |
| REL-007 | Database Connection Pooling | Move `configuredClient()` and the second privileged client to module scope so warm invocations reuse the same underlying `fetch` connection pool. Use Supabase's PgBouncer transaction pool (`?pgbouncer=true` on the connection string) for any direct Postgres access, if introduced. | Short |
| REL-009 | Transaction Management | Convert multi-table admin writes into Supabase RPC functions (Postgres `plpgsql`) so they run in a single implicit transaction. Example: create `create_project_with_cycles(payload jsonb, cycles text[])` returning `tr_projects.id`, invoked via `supabase.rpc('create_project_with_cycles', ...)`. Same for update/delete. | Medium |
| REL-017 | Rollback Capability | Document the Netlify rollback command in the runbook (`netlify deploys:restore <deploy_id>`); pin function deploys to the release-tag commit SHA (see SEC-027); wire the migration-rollback story once REL-016 is implemented. | Quick win |
| REL-021 | Input Data Validation | Add schema validation (Zod) at every write boundary — this is the same fix as SEC-013. | Rolled into SEC-013 |
| REL-022 | Idempotent Operations | Introduce an `Idempotency-Key` header on POST create endpoints. Store `(key, response_hash)` in a small table with a 24 h TTL; short-circuit repeat submissions. Example: |

```javascript
// Inside POST /admin/projects (after requireAdmin)
const idempotencyKey = event.headers['idempotency-key'];
if (idempotencyKey) {
  const { data: prior } = await supabase
    .from('idempotency_records')
    .select('response_status, response_body')
    .eq('key', idempotencyKey)
    .maybeSingle();
  if (prior) {
    return response(prior.response_status, JSON.parse(prior.response_body), origin);
  }
}
// ...perform create...
if (idempotencyKey) {
  await supabase.from('idempotency_records').insert({
    key: idempotencyKey,
    response_status: 201,
    response_body: JSON.stringify({ data: project })
  });
}
```

**Effort:** Short (1–2 days).

---

### P3 — Improvements (backlog)

_None._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (REL-013)
- [ ] All P1 critical items resolved or risk-accepted with sign-off (REL-014, REL-016)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **34.6%** ✗
- [ ] No critical-severity items in FAIL state ✗ (REL-013 open)
