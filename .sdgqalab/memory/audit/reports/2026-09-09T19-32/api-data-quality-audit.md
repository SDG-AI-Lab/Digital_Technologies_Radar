---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: data-quality
quality_attribute_name: Data Quality
iso_characteristic: "ISO 25012 Data Quality (accuracy, completeness, consistency, credibility, currentness, accessibility, compliance, confidentiality, traceability, understandability)"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 0
  partial: 5
  fail: 6
  na: 7
  applicable: 11
  score_pct: 22.7
  rating: "Critical"

priority_summary:
  p0_blockers: 1
  p1_critical: 2
  p2_important: 5
  p3_improvement: 3

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: confirmed
---

# Data Quality Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 22.7% · Critical
> **Results**: 0 pass · 5 partial · 6 fail · 7 n/a
> **Blockers**: 1 | **Critical**: 2 | **High**: 5
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25012 · ISO/IEC 5259 (skipped: no AI/ML)

---

## Summary

Data quality is the most concerning axis of this audit and the reason production readiness is currently blocked. Three findings compound to a P0:

1. **PII exposure on a public endpoint (DQ-013).** `disaster_events.contacts` is stored as a free-text `EVENT_FIELDS` value that admins populate — real names, phone numbers, and emails of on-the-ground volunteers. Because the public reads `PUBLIC_RESOURCES['disaster-events']`, `PUBLIC_DETAIL_RESOURCES['disaster-event']`, `home-help-needed`, and `home-recent-events` all use `select: '*'`, that PII is served to any browser on the internet with no auth. The `.env.example`'s `ALLOWED_ORIGINS` includes `http://localhost:3000` so even the CORS allowlist is loose. This is the P0 blocker.
2. **Service-role key for every query (DQ-014).** `SUPABASE_SECRET_KEY` (Postgres `service_role`) is used unconditionally in `configuredClient()` — including for public reads that could safely run under `anon`. Row-Level Security is bypassed on every request; a single logic bug (e.g., a path traversal into an admin route) has full DB privileges. There are no in-repo RLS policies, no separate read-only role, and no least-privilege split.
3. **No schema as code (DQ-001, DQ-005).** Absent migrations mean database constraints (NOT NULL, UNIQUE, CHECK, FK ON DELETE) cannot be verified from the repository. The audit rates this as FAIL for both schema integrity and migration completeness — the actual live database may be well-constrained, but the review cannot confirm it, and drift is invisible.

Everything else on this axis (validation, referential integrity, defaults, denormalization) is PARTIAL — evidence exists in code but is not backed by any datastore-as-code artefact.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Function `api.js` performing all Supabase writes and reads on behalf of the SPA. |
| Interfaces | `PUBLIC_RESOURCES`, `PUBLIC_DETAIL_RESOURCES`, `ADMIN_INFO_RESOURCES`, `INFO_FIELDS`, `EVENT_FIELDS` in `api.js`. |
| Data contracts | Supabase Postgres tables. No migrations, no RLS policies, no seed data in the repository. |
| AI/ML behavior | N/A. Data-quality ML checks (DQ-008 to DQ-012, DQ-018) not applicable. |
| Checkpoint status | Confirmed — no RLS/migrations in repo; service-role in use; `contacts` PII in EVENT_FIELDS. |

---

## Results

### PASS (0 items)

_None._

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DQ-002 | Data Validation at Input | Auth flows validate types + password length; `admin/info/*` requires every `INFO_FIELDS` value to be a non-empty string; `admin/disaster-events` filters through `allowedFields(payload, EVENT_FIELDS)`; `parseBody` caps body size at 16 KB. | `POST /admin/projects` accepts a raw payload (only `title` validated); `PUT /admin/projects/:uuid` strips only 5 keys before pushing the caller's JSON into `tr_projects` and `project_data`. No schema library. Same finding as SEC-013 / REL-021. | high |
| DQ-003 | Referential Integrity | The admin DELETE path manually cascades: it deletes `project_data` rows before deleting the parent `tr_projects` row (api.js lines 380–397), implying awareness of the FK. Nested reads (`tr_projects` embed `project_data(*)`, `disaster_events` embed `locations`) require the FK to exist in the DB. | Because migrations are absent, the actual `ON DELETE` rules (CASCADE / SET NULL / RESTRICT) cannot be verified. If any relationship uses the Postgres default (`NO ACTION`), the manual cascade in `api.js` is the only barrier to orphan rows. | high |
| DQ-004 | Data Type Enforcement | Supabase columns default to `timestamptz` for `now()`/`created_at`; UUIDs typed as `uuid`. Response projections include typed fields like `id`, `data_version`. | Fields like `disaster_cycles` are stored/parsed as a `{a,b}` string (api.js lines 341–346) — a text column holding a Postgres array literal instead of a `text[]`. `role` is a text field compared against `['admin','user']` in code with no CHECK. `help_needed` is filtered as `1` in `home-help-needed` (integer used where a boolean would be idiomatic). Without migrations these choices are undocumented. | medium |
| DQ-006 | Default Values | `bumpDataVersion` writes `Date.now()` into `dataset_version.data_version`, so the value is always present after the first insert. Admin-created users get `email_confirm: true`, `approved` on `tr_projects` is either the caller-supplied value or (per SEC-013) any value the caller passes. | Cannot verify DB-level defaults for `created_at`, `updated_at`, `approved`, `help_needed`, or role columns — no schema in repo. Non-nullable columns without defaults would fail insert on any endpoint that omits them. | medium |
| DQ-007 | Data Normalization | `tr_projects` is the canonical project record; `project_data` denormalizes it per `disaster_cycle` for the radar visualisation (deliberate — one radar row per lifecycle stage). `bumpDataVersion` invalidates client caches after every write. | The `POST /admin/projects` handler literally spreads `projectPayload` into every `project_data` row (line 347) — every editable project field is duplicated. The synchronization strategy is implemented (admin PUT propagates project field changes into `project_data`), but not documented in an ADR. No refresh mechanism if data drifts between the tables due to a partial write (which is possible — REL-009 flags the missing transaction). | medium |

### FAIL (6 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| DQ-001 | Database Schema Constraints | No migration files in the repository. Constraint coverage on `tr_projects.approved`, `disaster_events.help_needed`, `user_roles.role`, and every text field is unverifiable from code review. Application logic compensates in a few places (`['admin','user'].includes(role)` in api.js line 271; `typeof title === 'string' && !!title` in line 331) but application-only enforcement is not what this check asks for. | high | P1 |
| DQ-005 | Migration Completeness | No `supabase/migrations/`, no Alembic, no Prisma, no `db/schema.rb`. There is no way to check "pending" or "drift" — the concept doesn't exist here. Same underlying finding as MNT-020 / REL-016. | medium | P2 |
| DQ-013 | PII Handling | `disaster_events.contacts` is an editable admin field (`EVENT_FIELDS` line 74). The public reads `PUBLIC_RESOURCES['disaster-events']` (line 22–26), `PUBLIC_DETAIL_RESOURCES['disaster-event']` (line 66), `home-help-needed` (line 43–48), and `home-recent-events` (line 49–55) all use `select: '*'`, so any browser can fetch the full events list including contacts. `.env.example` sets `ALLOWED_ORIGINS=https://drrtechradar.org,http://localhost:3000` so the CORS allowlist doesn't gate the exposure (it only stops cross-origin fetch from other domains). There is no encryption at rest for PII, no field masking in the response, no GDPR export/erasure endpoint, no privacy notice reference. | **critical** | **P0** |
| DQ-014 | Data Access Controls | `configuredClient()` (api.js lines 113–122) uses `process.env.SUPABASE_SECRET_KEY` (the Postgres `service_role`) for **every** query, including all public reads. Service role bypasses RLS entirely. No `anon`-keyed client for public reads, no `read_only` role for reports, no per-tenant scoping, no in-repo RLS policies at all. A path-parsing bug that let an untrusted caller reach an admin route would already be running as superuser. | high | P1 |
| DQ-015 | Data Retention Policy | No retention documentation, no scheduled deletion job. `disaster_events` accumulates indefinitely — resolved events remain queryable via `home-recent-events`. No lifecycle rule on Supabase Storage (if used). No log retention policy for API logs (see OBS-005). | medium | P2 |
| DQ-017 | Data Quality Monitoring | No Great Expectations, no dbt tests, no `pandera` schemas, no assertion suites on Supabase views. Bad data (e.g., a `disaster_events` row with `help_needed = 3` instead of `0`/`1`, or a `tr_projects` row with `disaster_cycle = 'unknown'`) will surface only when a user notices. | medium | P2 |

### N/A (7 items)

| Check ID | Item | Reason |
|----------|------|--------|
| DQ-008 | Training Data Documentation | No AI/ML in the API. |
| DQ-009 | Data Lineage | No ETL/pipeline framework. |
| DQ-010 | Bias Detection | No AI/ML. |
| DQ-011 | Data Versioning | No ML training data. |
| DQ-012 | Feature Store / Data Schema | No ML features. |
| DQ-016 | ETL/Pipeline Error Handling | No Airflow/dbt/Celery pipeline. |
| DQ-018 | Embedding Quality Checks | No vector store. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

#### DQ-013: PII Handling — `disaster_events.contacts` publicly exposed

**Current state:** The unauthenticated `GET /api/public/disaster-events` (and its four siblings — details, `home-help-needed`, `home-recent-events`, and `home-projects`' `radar-csv`) returns every column on `disaster_events`, including `contacts` — a free-text field admins populate with names, phone numbers, and emails of volunteers or affected persons.

**Required state:** No PII field leaves the public API surface. `contacts` is served only to authenticated admins or is split into a separate `disaster_event_contacts` table gated by RLS.

**Fix (immediate — deploy-blocking):**

1. **Constrain the projection.** Replace every `select: '*'` on `disaster_events` in `PUBLIC_RESOURCES` and `PUBLIC_DETAIL_RESOURCES` with an explicit column list that **excludes** `contacts` (and any other PII field the team identifies — `how_to_help` and `resources` may contain contact info too; review with the events editor):

```javascript
// netlify/functions/api.js
const DISASTER_EVENT_PUBLIC_SELECT =
  'uuid, title, overview, img_url, impact, source, summary, solutions, ' +
  'help_needed, countries, slug, created_at, updated_at, locations(id, country, region)';

const PUBLIC_RESOURCES = {
  // ...
  'disaster-events': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT
  },
  'home-help-needed': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT,
    order: 'id',
    ascending: false,
    equals: { help_needed: 1 }
  },
  'home-recent-events': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT,
    order: 'id',
    ascending: false,
    equals: { help_needed: 0 }
  }
};

const PUBLIC_DETAIL_RESOURCES = {
  // ...
  'disaster-event': {
    table: 'disaster_events',
    select: DISASTER_EVENT_PUBLIC_SELECT,
    column: 'uuid',
    single: true
  }
};
```

2. **Add an admin-only detail route** that includes `contacts` for the admin UI's edit page:

```javascript
if (event.httpMethod === 'GET' && path.startsWith('admin/disaster-events/')) {
  const admin = await requireAdmin(supabase, event, origin);
  if (admin.error) return admin.error;
  const uuid = decodeURIComponent(path.split('/').pop());
  const { data, error } = await supabase
    .from('disaster_events')
    .select('*, locations(id, country, region)')
    .eq('uuid', uuid)
    .single();
  if (error) throw error;
  return response(200, { data }, origin);
}
```

3. **Verify historical exposure.** Assume `contacts` was scraped and treat the current values as compromised. Coordinate with the events editors to (a) get consent to store contacts at all, (b) purge or rotate any personal details of individuals who did not consent to public disclosure.

4. **Move contacts into a dedicated table with RLS**, ideally in the same release:

```sql
-- supabase/migrations/<ts>_isolate_disaster_event_contacts.sql
create table disaster_event_contacts (
  id            bigserial primary key,
  event_id     bigint not null references disaster_events(id) on delete cascade,
  name          text,
  role          text,
  email         text,
  phone         text,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table disaster_event_contacts enable row level security;

-- Admins only
create policy admin_read on disaster_event_contacts for select
  using (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'
  ));

create policy admin_write on disaster_event_contacts for all
  using (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'
  ))
  with check (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'
  ));

-- Migrate current data
insert into disaster_event_contacts (event_id, notes)
select id, contacts
from disaster_events
where contacts is not null and contacts <> '';

alter table disaster_events drop column contacts;
```

Then remove `contacts` from `EVENT_FIELDS` in api.js and add a small `admin/disaster-events/:uuid/contacts` sub-route.

5. **Add a regression test** in `tests/api/api.test.js` asserting that the public disaster-events response never contains a `contacts` key.

**Effort:** Short (1 day for steps 1–3 as an urgent hotfix; add step 4's migration in the following sprint).

---

### P1 — Critical (fix before production)

#### DQ-014: Data Access Controls — service role used for everything

**Current state:** `SUPABASE_SECRET_KEY` (Postgres `service_role`) is used for every query in `configuredClient()`. Public reads run as superuser; RLS is bypassed entirely.

**Required state:** Public reads use the `anon` key. Admin writes and role lookups continue to use `service_role`. Every table that should not be world-readable has an RLS policy.

**Fix:**

1. **Add `SUPABASE_ANON_KEY` to Netlify env and `.env.example`.**

```dotenv
# .env.example
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=sb_anon_replace_me         # public reads (RLS-gated)
SUPABASE_SECRET_KEY=sb_secret_replace_me     # admin + auth-admin (bypasses RLS)
ALLOWED_ORIGINS=https://drrtechradar.org,http://localhost:3000
```

2. **Split the client factory** so callers pick their privilege level:

```javascript
// netlify/functions/api.js
function anonClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
function serviceClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
// Old configuredClient() -> use serviceClient() only in admin/auth flows
```

Use `anonClient()` for `/api/public/*` and for the health probe; use `serviceClient()` inside `requireAdmin`, `getRole`, the sign-in role lookup, and every `admin/*` write.

3. **Author RLS baseline migrations.** Once MNT-020 lands, add:

```sql
-- supabase/migrations/<ts>_rls_baseline.sql
alter table technologies             enable row level security;
alter table disaster_types           enable row level security;
alter table tr_projects              enable row level security;
alter table project_data             enable row level security;
alter table disaster_events          enable row level security;
alter table user_roles               enable row level security;
alter table locations                enable row level security;
alter table themes                   enable row level security;
alter table data_types               enable row level security;
alter table use_cases                enable row level security;
alter table partners                 enable row level security;
alter table un_hosts                 enable row level security;
alter table disaster_types_projects  enable row level security;
alter table tech_projects            enable row level security;
alter table dataset_version          enable row level security;

-- Public read of catalog tables (no auth required)
create policy public_read on technologies    for select using (true);
create policy public_read on disaster_types  for select using (true);
create policy public_read on locations        for select using (true);
create policy public_read on themes           for select using (true);
create policy public_read on data_types       for select using (true);
create policy public_read on use_cases        for select using (true);
create policy public_read on partners         for select using (true);
create policy public_read on un_hosts         for select using (true);
create policy public_read on dataset_version  for select using (true);

-- Projects: only approved rows publicly visible
create policy public_read_approved on tr_projects for select
  using (approved = true);

create policy public_read on project_data for select
  using (exists (select 1 from tr_projects p where p.id = tr_projects_id and p.approved = true));

-- Disaster events (contacts already isolated per DQ-013)
create policy public_read on disaster_events for select using (true);

-- user_roles: users can read their own row; admins can read all
create policy self_read on user_roles for select using (user_id = auth.uid());
create policy admin_read on user_roles for select
  using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- All writes require admin (service_role bypasses RLS, so admin API continues to work as-is)
-- No INSERT/UPDATE/DELETE policies granted to anon; service_role bypasses.
```

4. **Regression tests.** Add an integration test that hits the deployed staging with only the anon key and asserts:
   - `GET /api/public/technologies` → 200
   - Direct `supabase.from('user_roles').select('*')` (via anon) returns 0 rows or only the caller's row
   - Direct `supabase.from('tr_projects').select('*').eq('approved', false)` returns 0 rows

**Effort:** Medium (2 days including staging validation).

#### DQ-001: Database Schema Constraints

**Fix:** Same underlying resolution as MNT-020 / REL-016 — adopt the Supabase CLI, pull the current live schema into a baseline migration, and audit that baseline for missing NOT NULL / UNIQUE / CHECK / FK constraints. Concrete additions to layer in on top of the baseline:

```sql
-- supabase/migrations/<ts>_tighten_constraints.sql
alter table user_roles
  alter column role set not null,
  add constraint user_roles_role_check check (role in ('admin', 'user'));

alter table tr_projects
  alter column uuid set not null,
  alter column title set not null,
  alter column approved set default false,
  alter column approved set not null,
  add constraint tr_projects_uuid_unique unique (uuid);

alter table disaster_events
  alter column uuid set not null,
  add constraint disaster_events_uuid_unique unique (uuid),
  add constraint disaster_events_help_needed_check check (help_needed in (0, 1));
  -- (consider migrating help_needed to boolean in a follow-up)

alter table technologies
  alter column slug set not null,
  add constraint technologies_slug_unique unique (slug);

alter table disaster_types
  alter column slug set not null,
  add constraint disaster_types_slug_unique unique (slug);

alter table project_data
  add constraint project_data_tr_projects_fk foreign key (tr_projects_id)
    references tr_projects(id) on delete cascade;
```

**Effort:** Medium (needs one careful pass through the live schema with the Supabase Studio to inventory current constraints).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DQ-002 | Data Validation at Input | Same fix as SEC-013 — introduce Zod (or Joi) schemas at every write boundary; replace the raw `admin/projects` payload with an explicit allowlist schema. | Medium |
| DQ-005 | Migration Completeness | Adopt the Supabase CLI (rolled into MNT-020 / REL-016). Add `supabase db lint` and `supabase db diff` to CI so drift becomes visible. | Rolled into MNT-020 |
| DQ-015 | Data Retention Policy | Author `docs/data-retention.md` covering (a) admin audit log retention (via OBS-005), (b) disaster event lifecycle (e.g., archive after 2 years, purge after 7), (c) Supabase Storage lifecycle if any, (d) user account deletion (GDPR erasure endpoint). Implement archival with a scheduled Postgres cron (`pg_cron`) or a nightly Netlify Function. | Short |
| DQ-017 | Data Quality Monitoring | Add a lightweight validation Netlify Function (`netlify/functions/data-quality-check.js`) that runs on cron via `netlify-scheduled-functions` and asserts invariants (e.g., every `tr_projects.approved = true` row has at least one `project_data` row; every `user_roles.role` is in `('admin','user')`; no `disaster_events.contacts IS NOT NULL AND contacts <> ''` after the DQ-013 migration). Report failures to GlitchTip. | Short |
| DQ-003 | Referential Integrity | After MNT-020 lands, audit every FK's `ON DELETE` rule and set explicit values (`CASCADE` for `project_data → tr_projects`, `RESTRICT` for `tr_projects.technology → technologies.slug` if you want to prevent taxonomy deletion when in use). Add a soft-delete convention (`deleted_at`) if hard deletes are undesirable for events. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DQ-004 | Data Type Enforcement | Convert `disaster_cycles` from a `{a,b}`-encoded text field to a real `text[]` column (or a separate `tr_project_cycles` junction table); convert `disaster_events.help_needed` from `int` to `boolean`; add ENUM/CHECK constraints on `user_roles.role`. Do this in a single migration once the schema is in code. | Short |
| DQ-006 | Default Values | Add DB-level defaults for `created_at`/`updated_at` (`timestamptz default now()`), `approved` (`default false`), and a trigger to keep `updated_at` fresh on UPDATE. Same migration cycle as DQ-004. | Quick win |
| DQ-007 | Data Normalization | Write an ADR (`docs/adr/0001-project-data-denormalization.md`) explaining why `project_data` duplicates `tr_projects` fields per cycle and how they are kept in sync (admin PUT propagates changes, `bumpDataVersion` invalidates client caches). Alternatively refactor to have `project_data` reference `tr_projects` only for cycle-specific state. | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (DQ-013)
- [ ] All P1 critical items resolved or risk-accepted with sign-off (DQ-001, DQ-014)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **22.7%** ✗
- [ ] No critical-severity items in FAIL state ✗ (DQ-013 open)
