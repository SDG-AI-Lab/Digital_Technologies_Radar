---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "ISO 25010 Reliability.Availability + Maintainability.Analysability"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 1
  partial: 4
  fail: 11
  na: 4
  applicable: 16
  score_pct: 18.8
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 8
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

# Observability Audit — API

> **Score**: 18.8% · Critical
> **Results**: 1 pass · 4 partial · 11 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 8 | **Important**: 6
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify `netlify/functions/`)
> **ISO Grounding**: Availability / Analysability

---

## Summary

API observability is almost entirely absent beyond a single `console.error` in the global catch and Netlify’s default function logs. There is no structured logging, request/access logging, metrics, tracing, or `@sentry/node` / GlitchTip on the function. The daily Supabase heartbeat is a keep-alive, not API uptime monitoring with team alerts or runbooks.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Function API → Supabase (`netlify/functions/api.js`) |
| Interfaces | `/api/health`, `/api/public/*`, `/api/auth/*`, `/api/admin/*` |
| Observability elsewhere | Frontend GlitchTip `@sentry/react` only (`src/helpers/glitchtip.ts`); not used in `netlify/` |
| Heartbeat | `.github/workflows/supabase-heartbeat.yml` daily curl to Supabase REST |
| Checkpoint status | skipped_unattended |

**N/A:** OBS-011 (docker/k8s), OBS-016–018 (AI/ML).

---

## Results

### PASS (1)

| Check ID | Item | Evidence |
|----------|------|----------|
| OBS-006 | Sensitive Data Filtering in Logs | Handler does not log request bodies/headers/passwords; auth errors return generic messages; only `console.error('API request failed', error)` |

### PARTIAL (4)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-004 | Error Logging with Context | Errors reach `console.error` with Error object/stack | No method/path/user/request-id structured fields | high |
| OBS-005 | Log Aggregation | Netlify captures function stdout/stderr | No retention/query/shipping config as-code; ops access undocumented | high |
| OBS-009 | Unhandled Exception Capture | Handler `try/catch` covers main path; clients get generic 500 | No `uncaughtException`/`unhandledRejection`; no error-tracking SDK hooks | high |
| OBS-013 | Uptime Monitoring | `/api/health` probes DB; Origin-less allowed | Heartbeat pings Supabase REST (not API); cron daily (not ≤5m); no team alert channel | high |

### FAIL (11)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-001 | Structured Logging | No pino/winston; bare `console.error` only (`api.js:468`) | high | P1 |
| OBS-002 | Log Level Configuration | No `LOG_LEVEL` / env-based levels | medium | P2 |
| OBS-003 | Request/Response Logging | No morgan/pino-http or per-request method/path/status/duration logs | medium | P2 |
| OBS-007 | Error Tracking Service | No `@sentry/node` in API; only `@sentry/react` in `package.json` | high | P1 |
| OBS-008 | Error Alerting | No alert rules as-code for API/GlitchTip | high | P1 |
| OBS-010 | Application Metrics | No prom-client/`/metrics`/RED metrics | medium | P2 |
| OBS-012 | Database Monitoring | No pool/slow-query telemetry; heartbeat is keep-alive only | medium | P2 |
| OBS-014 | Request Correlation IDs | No `X-Request-Id` / `traceparent` generation or response header | medium | P2 |
| OBS-015 | Distributed Tracing | No OpenTelemetry/X-Ray/dd-trace | medium | P2 |
| OBS-019 | Alerting Rules | No Prometheus/CloudWatch/Netlify alert config for API error/latency | high | P1 |
| OBS-020 | Runbook Links | No runbooks; alerts (if any) have no linked procedures | medium | P2 |

### N/A (4)

| Check ID | Reason |
|----------|--------|
| OBS-011 | docker/k8s triggers only |
| OBS-016–OBS-018 | AI/ML triggers only |

---

## Remediation Roadmap

### P1 — Critical

| Check | Effort | Action |
|-------|--------|--------|
| OBS-001 / OBS-004 | Short | JSON logger (pino) with method, path, status, duration, requestId on every invocation |
| OBS-007 / OBS-008 | Short | Init `@sentry/node` (or GlitchTip-compatible) in function cold start; DSN from env; alert on new errors |
| OBS-013 / OBS-019 | Short | External monitor of `https://…/api/health` ≤5m; Slack/email on failure |
| OBS-005 | Short | Document Netlify log retention + who can query; optional log drain |

### P2 — Important

| Check | Effort | Action |
|-------|--------|--------|
| OBS-002 / OBS-003 | Short | `LOG_LEVEL` env; access log line per request |
| OBS-010 | Medium | Emit RED counters (Netlify Analytics or custom) |
| OBS-012 | Medium | Rely on Supabase dashboard alerts + document thresholds |
| OBS-014 / OBS-015 | Medium | Generate `X-Request-Id`; optional OTel when multi-service grows |
| OBS-020 | Short | Runbook: health fail, Supabase pause, Netlify deploy rollback |

---

## Priority Classification

| Tier | Checks |
|------|--------|
| P0 | — |
| P1 | OBS-001, OBS-004, OBS-005, OBS-007, OBS-008, OBS-009, OBS-013, OBS-019 |
| P2 | OBS-002, OBS-003, OBS-010, OBS-012, OBS-014, OBS-015, OBS-020 |
