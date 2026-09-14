# Backup and recovery — Supabase

This runbook covers persistent data for the UNDP Digital Technologies Radar API
(`netlify/functions/api.js` → Supabase Postgres project).

## What is backed up

| Asset | Where it lives | Backup owner |
|-------|----------------|--------------|
| Application database (projects, technologies, disaster events, auth, roles, …) | Supabase Postgres | Supabase managed + optional export |
| Public images / storage objects | Supabase Storage buckets (e.g. `project-images`) | Supabase Storage |
| API secrets (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS`) | Netlify environment variables | Netlify (not in git) |
| Frontend build secrets (`REACT_APP_GLITCHTIP_DSN`, …) | GitHub Actions secrets / Netlify | CI host |

## Supabase Point-in-Time Recovery (PITR)

1. Open the Supabase dashboard for project ref used in production.
2. Go to **Database → Backups** (or **Settings → Add-ons** depending on plan).
3. Confirm **Point-in-Time Recovery** is enabled for production.
4. Record here (keep this table updated by the ops owner):

| Item | Value |
|------|-------|
| PITR enabled | _fill in_ |
| Retention window | _e.g. 7 days_ |
| Last restore drill | _YYYY-MM-DD_ |
| Ops owner | _name / team_ |

> Free-tier projects may only offer daily backups without PITR. If PITR is
> unavailable, schedule a weekly logical dump (below) to offsite storage.

## Weekly logical dump (recommended)

Use a **read-only** database role — never the `service_role` key — and store
dumps outside the application repo (encrypted object storage).

Example (operator workstation or scheduled CI with secrets):

```bash
# Requires DATABASE_URL for a read-only role (set in a secure vault, not git)
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --file="radar-$(date -u +%Y%m%d).dump"
```

Upload the dump to the agreed offsite bucket and retain at least **4 weekly**
and **3 monthly** copies.

## Restore procedure

### A. PITR restore (preferred when available)

1. Pause writes to the live site if possible (disable admin routes / Netlify
   deploys) to avoid split-brain during restore.
2. In Supabase **Database → Backups**, choose **Restore** to a point before the
   incident.
3. Follow Supabase prompts (may create a new project or overwrite — confirm
   with the ops owner).
4. Update Netlify `SUPABASE_URL` / `SUPABASE_SECRET_KEY` if the project URL or
   keys changed.
5. Hit `GET https://undp-drr-radar-api.netlify.app/api/health` and spot-check
   public catalog endpoints.
6. Re-enable admin access and record the incident.

### B. Logical dump restore

```bash
pg_restore --clean --if-exists --no-owner \
  --dbname="$DATABASE_URL" \
  "radar-YYYYMMDD.dump"
```

Then re-run the health check and a sample admin sign-in.

## Recovery testing

- Schedule a **quarterly** restore drill into a disposable Supabase project.
- Verify: `/api/health` returns 200; public projects list loads; one admin
  mutation works; storage images still resolve.
- Update the “Last restore drill” field above.

## Related monitoring

- Daily keepalive: `.github/workflows/supabase-heartbeat.yml` → `/api/health`
- Frontend errors: GlitchTip via `REACT_APP_GLITCHTIP_DSN` (prod builds)

## Gaps / follow-ups

- Automate weekly `pg_dump` in GitHub Actions once a read-only DB URL secret
  exists.
- Prefer RLS + anon key for public reads so a leaked service role is less
  catastrophic (see audit DQ-014).
