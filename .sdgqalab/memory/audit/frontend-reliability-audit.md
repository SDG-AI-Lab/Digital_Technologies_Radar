---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: reliability
quality_attribute_name: Reliability
iso_characteristic: "ISO/IEC 25010:2023 Reliability (faultlessness, availability, fault tolerance, recoverability)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 1
  partial: 1
  fail: 2
  na: 18
  applicable: 4
  score_pct: 37.5
  rating: "Low"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 2
  p3_improvement: 0

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: corrected
---

# Reliability Audit — Frontend (React / TypeScript / CRA)

> **Score**: 37.5% · Low
> **Results**: 1 pass · 1 partial · 2 fail · 18 n/a
> **Blockers**: 0 | **Critical**: 1 | **High**: 2
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Reliability; ISO/IEC 5055:2021; ISO/IEC 25023

---

## Summary

Reliability for the SPA is anchored by two solid guarantees: a **root `ErrorBoundary`** that reports to GlitchTip and a **30-second `AbortController` timeout** with 401 session clearing in the API client. Beyond that, the frontend has no retry/backoff on API calls, no offline handling, and **no disaster-recovery documentation** — most `catch` blocks fall back to `console.error` (~47 files) without user-facing recovery UX on the admin CRUD pages. The applicable-check surface is small (browser SPA — many container/DB/message-broker checks are N/A), so the two FAILs weigh heavily on the score. The single P1 is DR documentation, which is a project-wide gap surfaced here.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | React 17 CRA SPA on GitHub Pages; user-facing browser runtime. |
| Interfaces | Sole outbound integration is `apiRequest` in `src/helpers/apiClient.ts` calling the Netlify Functions API; no message brokers, no databases, no background workers on the client. |
| Data contracts | JSON over HTTPS; catalog cached in `localStorage`, auth in `sessionStorage`. |
| AI/ML behavior | None at runtime. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (1 item)

| Check ID | Item | Evidence |
|----------|------|----------|
| REL-006 | Timeout configuration | `src/helpers/apiClient.ts` builds a `createTimeoutSignal` (`DEFAULT_TIMEOUT_MS = 30_000`) via `AbortController`, cleaned up in `finally`, translating timeouts to `ApiError('The request timed out', 408)`. |

### PARTIAL (1 item)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| REL-001 | Error handling strategy | Root `ErrorBoundary` (`src/components/ErrorBoundary.tsx`) with `componentDidCatch` + `captureException`; GlitchTip auto-hooks unhandled promise rejections via `@sentry/react`. | ~47 files use `console.error` inside `catch` blocks without user-visible recovery UX on admin pages (`ProjectAction`, `EventAction`, `InfoAction`, `Disasters`, etc.). `SignIn` uses `alert()` as the only failure UX. No consistent toast/error surface. | high |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| REL-004 | Retry logic with backoff | `apiClient.ts` calls `fetch` once with no retry wrapper; no `p-retry`, `axios-retry`, or in-house exponential backoff. Transient 5xx / network errors surface to the user immediately. | medium | P2 |
| REL-014 | Disaster recovery plan | Per project-context, there is no `SECURITY.md`, `RUNBOOK.md`, `DR.md`, or `docs/runbooks/`. No RTO/RPO targets, no backup/restore procedure documented for the SPA-hosted assets or the Supabase data the SPA depends on. | high | P1 |

### N/A (18 items)

| Check ID | Item | Reason |
|----------|------|--------|
| REL-002 | Graceful shutdown | Browser SPA — no server-side signal handling. |
| REL-003 | Health check endpoints | Server-side concern; the API layer exposes `/api/health`. |
| REL-005 | Circuit breaker | No `any_api` tag on the frontend layer; the SPA has a single API dependency where a client-side breaker would add little value. |
| REL-007 | Database connection pooling | No client-side database. |
| REL-008 | Session persistence | `sessionStorage`/`localStorage` are client-side; the check targets server-side sessions in multi-instance deployments. |
| REL-009 | Transaction management | No client-side transactional storage. |
| REL-010 | Dead letter queue | No message brokers on the frontend. |
| REL-011 | Container restart policy | No containers — GH Pages static hosting. |
| REL-012 | Resource limits | No containers. |
| REL-013 | Data backup configuration | No client-side database. |
| REL-015 | Zero-downtime deployment | GH Pages atomic asset publishes; no `docker`/`kubernetes` tag on the frontend. |
| REL-016 | Database migration safety | No client-side database. |
| REL-017 | Rollback capability | No `docker`/`kubernetes`/`any_ci_cd` tag on the frontend layer (GH Pages retains history via git). |
| REL-018 | LLM fallback handling | No AI/ML at runtime. |
| REL-019 | Model version pinning | No AI/ML at runtime. |
| REL-020 | Embedding store resilience | No AI/ML at runtime. |
| REL-021 | Input data validation | No client-side database or AI pipeline. |
| REL-022 | Idempotent operations | No `any_api`/`any_database` tag on the frontend layer; API idempotency is audited on the API layer. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

#### REL-014: Disaster recovery plan

**Current state:** No documented DR procedure. If GH Pages or the Netlify API become unavailable, or Supabase data is corrupted, the team has no rehearsed runbook.
**Required state:** A `docs/runbooks/disaster-recovery.md` covering: (a) GH Pages rebuild-and-republish from `master`, (b) Netlify Functions rollback via the Netlify dashboard, (c) Supabase point-in-time restore (or an accepted "no PITR" risk statement + weekly export), (d) DNS/CDN failover contacts, (e) RTO/RPO targets, (f) communication plan.
**Fix:**
```markdown
# Disaster Recovery Runbook (FTR4DRR)

## RTO / RPO Targets
- Frontend (GH Pages): RTO 30 min, RPO 0 (assets in git)
- API (Netlify Functions): RTO 30 min, RPO 0 (code in git)
- Supabase data: RTO 4h, RPO 24h (relies on Supabase daily backups)

## Playbooks
1. Frontend outage — re-run `publish.yml`; if branch is broken, re-tag last-good commit.
2. API outage — Netlify → Deploys → "Publish deploy" on prior known-good.
3. Data corruption — Supabase Studio → Database → Backups → Restore to new project → swap `SUPABASE_URL`.
```
**Effort:** Short (2–4 hours to draft; ongoing quarterly rehearsal).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| REL-001 | Error handling strategy | Introduce a toast/notification helper (Chakra `useToast`) and replace `console.error` + `alert()` in admin CRUD pages with user-visible failure messages; keep GlitchTip reporting via `captureException`. | Short |
| REL-004 | Retry logic with backoff | Wrap `apiRequest` with bounded exponential backoff on 5xx / network errors (skip 4xx). Example: 3 attempts, base 300 ms, jitter ±100 ms, max 2 s. Do not retry non-idempotent `POST`s to `/auth/sign-in`. | Short |

---

### P3 — Improvements (backlog)

_None at this tier._

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] REL-014 disaster recovery runbook drafted and reviewed
- [ ] Quality attribute score >= 50% (currently 37.5% — **NOT met**; drives Low rating)
- [ ] No critical-severity items in FAIL state (none present)
- [ ] User-visible error UX replaces `alert()` in `SignIn` and admin CRUD flows
