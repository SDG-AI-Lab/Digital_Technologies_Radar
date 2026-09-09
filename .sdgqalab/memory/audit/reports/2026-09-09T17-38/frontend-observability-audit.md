---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "react-typescript"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "ISO 25010 Reliability.Availability + Maintainability.Analysability"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:38:00Z"
config_version: 3

score:
  pass: 0
  partial: 5
  fail: 9
  na: 6
  applicable: 14
  score_pct: 17.9
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 6
  p2_important: 6
  p3_improvement: 2

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "no_feedback"
---

# Observability Audit — Frontend

> **Score**: 17.9% · Critical
> **Results**: 0 pass · 5 partial · 9 fail · 6 n/a
> **Blockers**: 0 | **Critical**: 6 | **Important**: 6
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript CRA SPA `src/`)
> **ISO Grounding**: Availability + Analysability

---

## Summary

GlitchTip (`@sentry/react`) and a root `ErrorBoundary` are present but incomplete (optional DSN, no release/source maps, no alert/runbook as-code). Logging is unstructured `console.*`, web-vitals only print in development, and there is no SPA uptime monitor or request correlation IDs.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Browser SPA; observability = client errors, vitals, optional GlitchTip |
| Interfaces | `initGlitchTip` in `src/index.tsx`; `captureException` from ErrorBoundary |
| Quality signals | `publish.yml` injects `REACT_APP_GLITCHTIP_DSN`; `.env.example` documents DSN |
| Checkpoint status | no_feedback |

---

## Results

### PASS (0)

_None._

### PARTIAL (5)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-004 | Error Logging with Context | Boundary logs stack + `captureException` | Most data/API catches are `console.error` only | high |
| OBS-006 | Sensitive Data Filtering | Sign-in does not log password payloads | No redaction library / filter policy | high |
| OBS-007 | Error Tracking Service | `src/helpers/glitchtip.ts` + env DSN + early init | No `release`; no source-map upload; no-op without DSN | high |
| OBS-009 | Unhandled Exception Capture | Root `ErrorBoundary` + Sentry when DSN set | No explicit `unhandledrejection` handler; silent without DSN | high |
| OBS-010 | Application Metrics | `reportWebVitals` wired in `index.tsx` | Metrics only `console.debug` in development — not exported | medium |

### FAIL (9)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-001 | Structured Logging | No pino/winston; widespread `console.error` in `src/` | high | P1 |
| OBS-002 | Log Level Configuration | No `LOG_LEVEL` / env-driven verbosity | medium | P2 |
| OBS-003 | Request/Response Logging | `apiRequest` does not log method/path/status/duration | medium | P2 |
| OBS-005 | Log Aggregation | Browser console only; no shipper | high | P1 |
| OBS-008 | Error Alerting | No GlitchTip/Sentry alert rules in repo | high | P1 |
| OBS-013 | Uptime Monitoring | Heartbeat pings Supabase only (`.github/workflows/supabase-heartbeat.yml`); no check of `drrtechradar.org` | high | P1 |
| OBS-014 | Request Correlation IDs | No `X-Request-Id` / `traceparent` on `apiClient` | medium | P2 |
| OBS-019 | Alerting Rules | No app/error-rate alert config for frontend | high | P1 |
| OBS-020 | Runbook Links | No runbooks | medium | P2 |

### N/A (6)

| Check ID | Item | Reason |
|----------|------|--------|
| OBS-011 | Infrastructure Monitoring | docker/k8s |
| OBS-012 | Database Monitoring | `any_database` |
| OBS-015 | Distributed Tracing | `any_api`/docker/k8s — not on frontend tags |
| OBS-016–OBS-018 | AI/ML observability | no AI runtime |

---

## Remediation Roadmap

### P1 — Critical

#### OBS-007 / OBS-008 / OBS-019: Complete GlitchTip ops

**Fix:** Ensure prod DSN secret set; add `release` (git SHA); upload source maps; configure GlitchTip alerts to team channel.
**Effort:** Short–Medium

#### OBS-001 / OBS-005: Client logging strategy

**Fix:** Prefer GlitchTip breadcrumbs + structured `captureMessage` over ad-hoc console; ship vitals to analytics/GlitchTip.
**Effort:** Medium

#### OBS-013: SPA uptime

**Fix:** External monitor (or workflow curl) against `https://drrtechradar.org/` with alert on non-200.
**Effort:** Quick win

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-002 | Log levels | Gate console/debug behind `NODE_ENV` / feature flag | Quick win |
| OBS-003 | API client logging | Log status + duration (no bodies/tokens) in `apiRequest` | Short |
| OBS-004 / OBS-009 | Capture breadth | `captureException` in shared helpers; Sentry global handlers | Short |
| OBS-014 | Correlation | Generate UUID per request; send header; tag GlitchTip | Short |
| OBS-020 | Runbooks | Document GlitchTip triage + GH Pages rollback | Short |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-006 | Redaction | Explicit denylist for Authorization/password in any future logs | Quick win |
| OBS-010 | Vitals export | Send web-vitals to GlitchTip/analytics in production | Short |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
