---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: observability
quality_attribute_name: Observability
iso_characteristic: "ISO/IEC 25010:2023 Reliability.Availability + Maintainability.Analysability"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 1
  partial: 6
  fail: 6
  na: 7
  applicable: 13
  score_pct: 30.8
  rating: "Low"

priority_summary:
  p0_blockers: 0
  p1_critical: 3
  p2_important: 8
  p3_improvement: 1

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: pending
---

# Observability Audit — Frontend (React / TypeScript / CRA)

> **Score**: 30.8% · Low
> **Results**: 1 pass · 6 partial · 6 fail · 7 n/a
> **Blockers**: 0 | **Critical**: 3 | **High**: 8
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Reliability.Availability + Maintainability.Analysability; ISO/IEC 25023

---

## Summary

Frontend observability is **error-tracking-only**: GlitchTip (via `@sentry/react`) captures unhandled exceptions and `ErrorBoundary` failures when `REACT_APP_GLITCHTIP_DSN` is set at build time. Beyond that, there is no structured logging (`console.error` is scattered across ~47 files), no configurable log level, no explicit alerting rules, no request/correlation IDs on outbound `apiRequest` calls, no runbook links, and Web Vitals is only `console.debug`-ed in development. The applicable-check surface is broad (13 checks) because most observability checks apply universally or to `any_web_framework`, and the failure density is what drives the Low rating. Three P1s stand out: structured logging, alerting rules, and error alerting on the GlitchTip project.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Client-side React SPA; observability signals must be shipped from the browser to remote services. |
| Interfaces | GlitchTip HTTPS ingest via `@sentry/react` (`src/helpers/glitchtip.ts`); `reportWebVitals` no-op wired to `console.debug` in dev. |
| Data contracts | Sentry-compatible error payloads (`captureException`); Web Vitals reported as `console.debug` only. |
| AI/ML behavior | None at runtime. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (1 item)

| Check ID | Item | Evidence |
|----------|------|----------|
| OBS-009 | Unhandled exception capture | `ErrorBoundary` (`src/components/ErrorBoundary.tsx`) implements `getDerivedStateFromError` + `componentDidCatch` and reports via `captureException`; `Sentry.init` in `src/helpers/glitchtip.ts` also auto-installs global `error` / `unhandledrejection` handlers when DSN is set. Users see a friendly "Something went wrong / Reload page" fallback, not a stack trace. |

### PARTIAL (6 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-004 | Error logging with context | `ErrorBoundary.componentDidCatch` logs with `componentStack` via `captureException`. | ~47 files use bare `console.error(err)` in `catch` blocks without request/route/user context; none forward to GlitchTip. | high |
| OBS-005 | Log aggregation | GlitchTip aggregates errors; DSN sourced from build-time env. | Only errors are aggregated — no info/warn logs, no Web Vitals, no user actions. Retention is whatever the GlitchTip project defines (not documented). | high |
| OBS-006 | Sensitive data filtering | Sentry SDK ships default PII scrubbing (headers, credit-card patterns). | No custom `beforeSend`/`beforeBreadcrumb` filter; `apiClient` errors could include the request path (safe) but no explicit denylist for query params or bodies. Log statements don't sanitize. | high |
| OBS-007 | Error tracking service | GlitchTip via `@sentry/react`; DSN from `REACT_APP_GLITCHTIP_DSN` (env-loaded); `environment: process.env.NODE_ENV` set; disabled in `test`. | No `release` tag (Sentry `release` unset → poor issue grouping across deploys); source maps not uploaded to GlitchTip in `publish.yml`; `tracesSampleRate: 0.01` is very low. | high |
| OBS-010 | Application metrics | `reportWebVitals.ts` present; wired to `console.debug` in `src/index.tsx` during development. | Web Vitals are not shipped anywhere in production (no analytics/beacon), so LCP/FID/CLS/INP regressions are invisible. No custom user-action metrics. | medium |
| OBS-013 | Uptime monitoring | `.github/workflows/supabase-heartbeat.yml` daily-crons `GET /api/health` (probes Supabase). | The heartbeat targets the **API**, not the SPA hosted on GH Pages; no external uptime monitor pings `https://drrtechradar.org`. No public status page. | high |

### FAIL (6 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-001 | Structured logging | No logging library configured (no `winston`, `pino`, `loglevel`, etc.). ~47 files call `console.error` directly with free-text messages and no structured fields (`{ route, userId, requestId }`). | high | P1 |
| OBS-002 | Log level configuration | No `LOG_LEVEL` / `REACT_APP_LOG_LEVEL` env var; verbosity cannot be changed without a code change. | medium | P2 |
| OBS-008 | Error alerting | No evidence of GlitchTip alert rules (Slack/email/webhook) being provisioned; the DSN is the only integration touchpoint. | high | P1 |
| OBS-014 | Request correlation IDs | `apiClient.ts` sends no `X-Request-Id` / `X-Correlation-Id` header; responses (if any) are not surfaced. Errors cannot be tied back to a specific API log line. | medium | P2 |
| OBS-019 | Alerting rules | No app-level alert rules for error rate, JS exception spikes, or performance regressions. Uptime is heartbeat-based, not thresholded. | high | P1 |
| OBS-020 | Runbook links | No `docs/runbooks/`; alerts (where they exist) do not link to procedures. | medium | P2 |

### N/A (7 items)

| Check ID | Item | Reason |
|----------|------|--------|
| OBS-003 | Request/response logging | Server-side middleware concern; API layer audit covers it. |
| OBS-011 | Infrastructure monitoring | No containers/hosts to monitor — GH Pages static hosting. |
| OBS-012 | Database monitoring | No client-side database. |
| OBS-015 | Distributed tracing | Frontend does not participate in a multi-service tracing mesh; API/`docker`/`kubernetes` triggers absent. |
| OBS-016 | LLM call logging | No AI/ML at runtime. |
| OBS-017 | AI pipeline monitoring | No AI/ML at runtime. |
| OBS-018 | LLM cost tracking | No AI/ML at runtime. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

#### OBS-001: Structured logging

**Current state:** Bare `console.error(...)` scattered across the SPA; no consistent shape, no context, no forwarding.
**Fix:** Introduce a tiny logger (either `loglevel` or a hand-rolled wrapper) that (a) respects `REACT_APP_LOG_LEVEL`, (b) emits objects (`{ msg, route, extra }`), and (c) forwards `warn`/`error` to `captureException` with the same `extra` object.
```ts
// src/helpers/logger.ts
import { captureException } from './glitchtip';
const LEVELS = ['debug','info','warn','error'] as const;
type Level = typeof LEVELS[number];
const threshold = (process.env.REACT_APP_LOG_LEVEL as Level) ?? 'info';
const allow = (l: Level) => LEVELS.indexOf(l) >= LEVELS.indexOf(threshold);

export const log = {
  debug: (msg: string, extra?: Record<string, unknown>) =>
    allow('debug') && console.debug(msg, extra),
  info: (msg: string, extra?: Record<string, unknown>) =>
    allow('info') && console.info(msg, extra),
  warn: (msg: string, extra?: Record<string, unknown>) => {
    if (allow('warn')) console.warn(msg, extra);
    captureException(new Error(msg), extra);
  },
  error: (msg: string, err: unknown, extra?: Record<string, unknown>) => {
    if (allow('error')) console.error(msg, err, extra);
    captureException(err, { msg, ...extra });
  }
};
```
**Effort:** Short (helper + codemod-style search-and-replace of ~47 `console.error` call sites).

#### OBS-008: Error alerting

**Current state:** GlitchTip receives errors but no alert rules are provisioned; no on-call channel is notified when a regression fires.
**Fix:** In the GlitchTip project, add at least: (a) email/webhook alert on any **new** issue, (b) alert on error count > N/hour, (c) route to a shared inbox or team Slack via Incoming Webhook. Document rule IDs in the DR runbook.
**Effort:** Quick win (out-of-band configuration in GlitchTip UI).

#### OBS-019: Alerting rules

**Current state:** No thresholded alerts anywhere. The Supabase heartbeat only checks liveness of the API, not error rate or performance.
**Fix:** Combine with OBS-008 in GlitchTip for error-rate alerts. Add an external synthetic (UptimeRobot / Better Stack free tier) that pings `https://drrtechradar.org` every 5 minutes and posts to the same channel.
**Effort:** Quick win.

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| OBS-002 | Log level configuration | Add `REACT_APP_LOG_LEVEL` to `.env.example` (default `warn` in prod). Wire into the logger from OBS-001. | Quick win |
| OBS-004 | Error logging with context | Adopt the logger everywhere `catch { console.error(...) }` is used today, always passing route + operation name. | Short |
| OBS-005 | Log aggregation | Ship the logger's `warn`/`error` frames to GlitchTip (already covered by OBS-001) and document GlitchTip retention. | Quick win |
| OBS-006 | Sensitive data filtering | Add a `beforeSend` in `Sentry.init` that strips query strings and any `Authorization` header from breadcrumbs. | Quick win |
| OBS-007 | Error tracking service | Pass `release: process.env.REACT_APP_RELEASE` (git SHA) to `Sentry.init`; add a `sentry-cli sourcemaps upload` step to `publish.yml`; bump `tracesSampleRate` to 0.1 initially. | Short |
| OBS-013 | Uptime monitoring | Add an external synthetic ping on `https://drrtechradar.org` (see OBS-019). | Quick win |
| OBS-014 | Request correlation IDs | Generate a per-request `crypto.randomUUID()` in `apiClient.ts`, send as `X-Request-Id`; log on error. Coordinate with API layer to echo/propagate. | Short |
| OBS-020 | Runbook links | Create `docs/runbooks/` with one-page-per-alert; link URLs in the GlitchTip alert rule descriptions. | Short |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| OBS-010 | Application metrics | Send Web Vitals to a lightweight analytics endpoint (or Sentry's `Sentry.metrics` API) instead of `console.debug`. | Short |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] OBS-001, OBS-008, OBS-019 addressed before production re-launch
- [ ] Quality attribute score >= 50% (currently 30.8% — **NOT met**; drives Low rating)
- [ ] No critical-severity items in FAIL state (none present)
- [ ] GlitchTip alerts route to a shared team channel with a runbook link
