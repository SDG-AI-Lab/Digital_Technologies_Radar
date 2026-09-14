---
schema: sdgqalab/audit@3
layer: api
layer_type: nodejs-netlify
quality_attribute: observability
quality_attribute_name: Observability
iso_characteristic: "ISO 25010 Reliability.Availability + Maintainability.Analysability"
project: "UNDP Digital Technologies Radar (FTR4DRR)"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 0
  partial: 4
  fail: 12
  na: 4
  applicable: 16
  score_pct: 12.5
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 5
  p2_important: 10
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

# Observability Audit — API Layer (Netlify Functions + Supabase)

> **Score**: 12.5% · Critical
> **Results**: 0 pass · 4 partial · 12 fail · 4 n/a
> **Blockers**: 0 | **Critical**: 5 | **High**: 10
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: ISO/IEC 25010 Reliability.Availability + Maintainability.Analysability · ISO/IEC 25023

---

## Summary

Observability on the API layer is effectively unimplemented — the API layer inherits only what Netlify's platform provides. The sole in-code telemetry is `console.error('API request failed', error)` on the 500 path (api.js line 468). There is no structured logging, no error tracking (`@sentry/node` is not imported anywhere in `netlify/functions/`; GlitchTip is confirmed live but only for the React SPA build), no metrics, no correlation IDs, no distributed tracing, no alerting rules, and no runbooks. The health endpoint plus daily heartbeat cron is the only signal the operations team has today; every diagnosis of a real incident would begin from the Netlify Function logs UI with no context beyond the raw exception. This is a Critical rating and the single highest-leverage area to invest in before scaling users, though none of the individual checks reach the P0 severity bar (P0 requires *critical* severity + FAIL, and every observability check is high or medium).

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Netlify Function `netlify/functions/api.js`. Only outbound is Supabase (PostgREST + Auth). |
| Interfaces | HTTP endpoints under `/api/*`. Only external observability surface: `/api/health`. |
| Data contracts | 500 errors returned as `{ error: 'The request could not be completed' }`; success responses vary per endpoint. |
| AI/ML behavior | N/A. |
| Checkpoint status | Confirmed. Specifically: GlitchTip DSN (`REACT_APP_GLITCHTIP_DSN`) is live in `publish.yml` for the SPA — **not** wired into the API. |

---

## Results

### PASS (0 items)

_None._

### PARTIAL (4 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-004 | Error Logging with Context | Errors reach `console.error` with the full Error object (stack included) on the 500 path (line 468); no bare/silent catches; no PII in the current log line. | No request context (method, path, correlation ID, user ID/role, origin) is attached. Investigators cannot correlate a stack trace to the failing request. | high |
| OBS-005 | Log Aggregation | Netlify captures function `stdout`/`stderr` in the platform log stream (retention per Netlify plan). Devs with team access can search there. | Logs are not shipped anywhere durable (no ELK/Loki/Datadog/CloudWatch drain). Retention is short (default 24 h for Free, 7 d for Pro), and there is no long-term audit trail. | high |
| OBS-006 | Sensitive Data Filtering in Logs | Because only the error branch logs, and it logs the Error object rather than the full request, no passwords, tokens, or PII are currently emitted. Auth handlers never `console.log` the credential payload. | No formal sanitization layer exists — a well-intentioned future `console.log(event.headers)` or `console.log(payload)` would immediately leak Authorization headers or `contacts` PII into platform logs. | high |
| OBS-013 | Uptime Monitoring | `/api/health` exists with a real dependency probe (queries `dataset_version`). `.github/workflows/supabase-heartbeat.yml` polls it via GitHub-hosted `curl` and fails the workflow on non-2xx. | Polling cadence is **daily** (cron `0 12 * * *`), whereas the check requires ≤ 5-minute intervals. There is no external uptime service (UptimeRobot, Better Stack, Statuspage), no public status page, no alert routing on failure other than the workflow failure email. | high |

### FAIL (12 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-001 | Structured Logging | No `pino`, `winston`, `bunyan`, or `structlog` import in `netlify/functions/`. The only log call is `console.error('API request failed', error)`. Output is unstructured free text. | high | P1 |
| OBS-002 | Log Level Configuration | No `LOG_LEVEL` env var, no logger with `setLevel`. The single `console.error` fires unconditionally. Cannot dial verbosity per environment. | medium | P2 |
| OBS-003 | Request/Response Logging | No `morgan`, no HTTP access-log middleware. Netlify's platform log line captures the HTTP status externally but the API contributes no request-scoped structured log. | medium | P2 |
| OBS-007 | Error Tracking Service | `@sentry/node`, `@bugsnag/js`, `rollbar` are absent from `package.json`. GlitchTip DSN is wired only to the React SPA (`src/helpers/glitchtip.ts` via `@sentry/react`); nothing in `netlify/functions/` initializes an error tracker. Production API exceptions vanish into the Netlify log stream. | high | P1 |
| OBS-008 | Error Alerting | With no error-tracking service (OBS-007), no alerting rules exist. Netlify's built-in "function invocation" alerts fire on error-rate crossings only for paid plans and are not configured here. | high | P1 |
| OBS-009 | Unhandled Exception Capture | The handler's own try/catch covers most exceptions, but `process.on('unhandledRejection')` and `process.on('uncaughtException')` are not registered. A rejected promise from a fire-and-forget path (e.g., a background `bumpDataVersion` call if refactored to non-awaited) would silently disappear. | high | P1 |
| OBS-010 | Application Metrics | No `prom-client`, no `/metrics` endpoint, no StatsD/Datadog push. Request rate, error rate, and duration histograms are unavailable outside Netlify's aggregate function metrics. | medium | P2 |
| OBS-012 | Database Monitoring | No slow-query log configuration in code (would be in Supabase settings). No `pg_stat_statements` reference. Connection pool metrics are Supabase-managed but not surfaced in-app. | medium | P2 |
| OBS-014 | Request Correlation IDs | No middleware generates `X-Request-Id` / `traceparent`. The `response` helper does not include a correlation ID in the response headers or body. Cross-invocation debugging requires reading raw Netlify logs by timestamp. | medium | P2 |
| OBS-015 | Distributed Tracing | No `@opentelemetry/*`, no `dd-trace`, no `@sentry/opentelemetry-node`. Given the two-hop architecture (client → Function → Supabase), tracing would give immediate value on the Supabase-call latency. | medium | P2 |
| OBS-019 | Alerting Rules | No alerting rules exist for the API (see OBS-007, OBS-008). Error spikes, slow endpoints, `dataset_version` probe failures, or 500-rate regressions do not page anyone. | high | P1 |
| OBS-020 | Runbook Links | No `docs/runbooks/`, no incident templates, no post-mortem log. Alerts do not exist yet (OBS-019), so runbook coverage is 0 %. | medium | P2 |

### N/A (4 items)

| Check ID | Item | Reason |
|----------|------|--------|
| OBS-011 | Infrastructure Monitoring | Netlify manages the function runtime; host-level metrics are not exposed to the tenant. |
| OBS-016 | LLM Call Logging | No LLM calls. |
| OBS-017 | AI Pipeline Monitoring | No AI/ML pipeline. |
| OBS-018 | LLM Cost Tracking | No LLM usage. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None (no critical-severity items in FAIL state — all observability checks are high or medium)._

---

### P1 — Critical (fix before production)

#### OBS-007 & OBS-008: Error Tracking Service + Alerting

**Current state:** API-side exceptions are only visible in Netlify Function logs. GlitchTip receives frontend errors but no backend errors. Nobody is paged on a 500-rate spike.

**Required state:** Every API exception (handled 500s and any unhandled rejection) is captured in GlitchTip with request context, and the ops channel is alerted on rate spikes and new regressions.

**Fix:** Wire `@sentry/serverless` into the Netlify Function. GlitchTip is Sentry-protocol-compatible so the existing DSN works.

```bash
yarn add @sentry/serverless
```

Add a server-side DSN (separate from `REACT_APP_GLITCHTIP_DSN` so the projects can be routed to different GlitchTip projects) as `GLITCHTIP_API_DSN` in Netlify env.

```javascript
// netlify/functions/api.js — top of file
const Sentry = require('@sentry/serverless');

Sentry.AWSLambda.init({
  dsn: process.env.GLITCHTIP_API_DSN,
  environment: process.env.CONTEXT || 'production',          // Netlify's CONTEXT
  release: process.env.COMMIT_REF,                           // Netlify commit SHA
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Strip authorization headers before shipping
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.Authorization;
    }
    return event;
  }
});

// wrap the existing exports.handler
const rawHandler = async (event) => { /* ...existing body... */ };
exports.handler = Sentry.AWSLambda.wrapHandler(rawHandler);
```

Configure GlitchTip alert rules:

* New issue → post to `#drr-radar-ops` (Slack/Teams webhook).
* Issue frequency: >10 events in 5 min → page on-call.
* Regression (previously resolved issue reappears) → post to `#drr-radar-ops`.

**Effort:** Short (half-day + alert-rule tuning).

#### OBS-001: Structured Logging

**Current state:** Only `console.error` is used, unstructured.

**Fix:** Add `pino` (small, fast, JSON output — well suited to serverless).

```bash
yarn add pino
```

```javascript
// netlify/functions/logger.js (new)
const pino = require('pino');
module.exports = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'drr-radar-api', release: process.env.COMMIT_REF },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['headers.authorization', 'headers.Authorization', 'body.password'],
    censor: '[redacted]'
  }
});
```

```javascript
// netlify/functions/api.js
const logger = require('./logger');
// ...
} catch (error) {
  logger.error({
    err: error,
    method: event.httpMethod,
    path: event.path,
    origin: event.headers.origin,
    requestId
  }, 'api_request_failed');
  return response(500, { error: 'The request could not be completed' }, origin);
}
```

Also add an `info`-level log at the top of the handler for every request with `{ method, path, statusCode, durationMs }` after the response is built. This addresses OBS-001, OBS-002, and OBS-003 in one pass.

**Effort:** Short (half-day).

#### OBS-009: Unhandled Exception Capture

**Fix:** Register process-level handlers alongside the Sentry initialization. `Sentry.AWSLambda.init` already installs a `uncaughtException` and `unhandledRejection` bridge, so completing OBS-007 completes most of OBS-009 automatically. Verify with a deliberate rejected promise in a staging deploy.

**Effort:** Rolled into OBS-007.

#### OBS-019: Alerting Rules

**Fix:** Once OBS-007 lands, configure the following alerts in GlitchTip / Netlify:

| Alert | Trigger | Route |
|---|---|---|
| API error-rate spike | 5xx-rate > 2 % over 10 min | Slack + PagerDuty |
| New API issue | first-seen issue on `drr-radar-api` project | Slack |
| Heartbeat failure | `supabase-heartbeat` workflow failure | Slack (already fires as a GitHub Actions notification) |
| Function invocation cap | Netlify function invocations approaching plan quota | Slack |

**Effort:** Quick win (configuration only).

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-002 | Log Level Configuration | Included in OBS-001 fix — `LOG_LEVEL` env var, default `info` in prod, `debug` in preview deploys. | Rolled in |
| OBS-003 | Request/Response Logging | Add a request-scoped info log line per invocation (see OBS-001 fix). Include `method`, `path`, `status`, `durationMs`, and the request ID from OBS-014. | Rolled in |
| OBS-004 | Error Logging with Context | Attach `method`, `path`, `requestId`, hashed `userId` (`sha256(user.id).slice(0, 12)`), and `origin` to every error log. Include the same in the Sentry event via `Sentry.setContext`. | Quick win |
| OBS-005 | Log Aggregation | Enable Netlify Log Drains (Pro+) to Datadog / Better Stack / Grafana Loki; OR ship logs from Sentry via GlitchTip Grafana integration. Set retention ≥ 30 days. | Short |
| OBS-006 | Sensitive Data Filtering in Logs | `pino` `redact` (shown above) covers `authorization` + `password`. Add an ESLint rule (`no-console`) and a code-review checklist item to prevent regressions. | Quick win |
| OBS-010 | Application Metrics | Push a small metric event per request into an APM (Datadog StatsD, or `@sentry/node` `metrics` API which GlitchTip supports). Minimum: request rate, error rate, p95 duration, tagged by route pattern. | Short |
| OBS-012 | Database Monitoring | Enable `pg_stat_statements` in Supabase and configure a slow-query log threshold (>500 ms). Surface the Supabase Reports dashboard in the runbook. | Quick win |
| OBS-014 | Request Correlation IDs | Generate a UUID at the top of the handler if `X-Request-Id` is not present, thread it through the logger, and echo it in the response header. | Quick win |

```javascript
// api.js — early in handler
const { randomUUID } = require('crypto');
const requestId = event.headers['x-request-id'] || randomUUID();
const reqLogger = logger.child({ requestId });
// pass reqLogger down; include requestId in response()
```

| OBS-015 | Distributed Tracing | Add `@sentry/node` performance tracing (`tracesSampleRate: 0.1`) — GlitchTip renders spans in the Performance tab. This gives request → Supabase-call breakdown for free. | Rolled into OBS-007 |
| OBS-020 | Runbook Links | Create `docs/runbooks/` with one page per alert defined in OBS-019. Link each GlitchTip alert to the runbook URL via the `alert_rule.description` field. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-013 | Uptime Monitoring | Replace / augment the daily GitHub Actions heartbeat with a 5-minute external check (Better Stack / UptimeRobot free tier, or Netlify's built-in uptime). Configure alerts to `#drr-radar-ops`. Add a public status page. | Quick win |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved *(none)*
- [ ] All P1 critical items resolved or risk-accepted with sign-off (OBS-001, OBS-007, OBS-008, OBS-009, OBS-019)
- [ ] Quality attribute score >= 50% (Adequate minimum for launch) — currently **12.5%** ✗
- [ ] No critical-severity items in FAIL state ✓ (all failures are high/medium severity, but domain rating is Critical because of the sheer breadth of gaps)
