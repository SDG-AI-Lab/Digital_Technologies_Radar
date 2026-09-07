---
domain_id: observability
domain_name: Observability
check_prefix: OBS

iso:
  quality_characteristic: "ISO 25010 Reliability.Availability + Maintainability.Analysability"
  sub_characteristics:
    - availability
    - analysability
  grounding_standards:
    - id: "ISO/IEC 25010:2023"
      focus: "Reliability.Availability — system uptime monitoring; Maintainability.Analysability — diagnosability"
    - id: "ISO/IEC 25023"
      focus: "Measurement of analysability and availability metrics"

applicability:
  always_include: true
  triggers: []
  description: "Every layer needs observability for production operation"

scope: per-layer
---

# Observability

> **Why it matters:** If you can't see it, you can't fix it. Observability is the difference
> between "users are complaining" and "we caught the regression before it hit production."
> This domain covers structured logging, error tracking, metrics, distributed tracing,
> AI/ML-specific telemetry, and alerting — everything an on-call engineer needs to diagnose
> and resolve issues fast.

---

## Logging

### OBS-001: Structured Logging

| Field | Value |
|---|---|
| **What to Look For** | All log output uses structured format (JSON or key-value pairs) instead of free-text print statements. No raw `print()`, `console.log()` (without a logging wrapper), or `System.out.println()` in production code paths. |
| **How to Check** | 1. Search the codebase for a logging library import (e.g., `winston`, `pino`, `structlog`, `serilog`, `log4j`, `zerolog`, Python `logging`). 2. Grep for bare `print(`, `console.log(`, `System.out.print` in `src/` or application directories — exclude test files and scripts. 3. Verify the logging configuration outputs JSON or structured key-value format (check logger initialization, formatter config). 4. Confirm log calls include contextual fields (e.g., `logger.info("request processed", { userId, duration })` not just `logger.info("done")`). |
| **Pass** | A structured logging library is configured project-wide. Zero bare print statements in production code. Log entries include contextual metadata. |
| **Partial** | Logging library exists but some modules still use `print()`/`console.log()`. Or structured format is configured but contextual fields are inconsistently attached. |
| **Fail** | No logging library configured. Production code relies on print statements. Log output is unstructured plain text. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-002: Log Level Configuration

| Field | Value |
|---|---|
| **What to Look For** | Log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) are configurable per environment via environment variables or config files, not hardcoded. |
| **How to Check** | 1. Search for log level configuration: grep for `LOG_LEVEL`, `log_level`, `logging.level`, `setLevel`, `minimumLevel` in config files and environment variable references. 2. Check that the value is read from an environment variable or config file (e.g., `process.env.LOG_LEVEL`, `os.environ.get('LOG_LEVEL')`, `appsettings.json`). 3. Verify different environments have different defaults — dev should default to DEBUG or INFO; production should default to INFO or WARNING. 4. Check that the log level can be changed at runtime or deploy-time without a code change. |
| **Pass** | Log level is environment-configurable. Dev defaults to DEBUG/INFO, production defaults to INFO/WARNING. Changing the level requires no code changes. |
| **Partial** | Log level is configurable but only one default across all environments. Or configurable but the mechanism is buried/undocumented. |
| **Fail** | Log level is hardcoded. No environment-based configuration exists. All environments log at the same verbosity. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### OBS-003: Request/Response Logging

| Field | Value |
|---|---|
| **What to Look For** | HTTP request logging middleware that captures method, path, status code, response time, and request ID for every inbound request. |
| **How to Check** | 1. Look for HTTP logging middleware in the application bootstrap (e.g., `morgan`, `express-pino-logger`, Django `django.middleware.common`, ASP.NET `UseHttpLogging`, Go `httplog`). 2. Verify the middleware logs at minimum: HTTP method, request path, response status code, and duration in milliseconds. 3. Check that the middleware is registered globally (not just on specific routes). 4. For APIs, verify that request/response body logging is either disabled or redacts sensitive fields to prevent PII leakage. 5. Confirm log entries include a request/correlation ID for traceability. |
| **Pass** | Global HTTP logging middleware captures method, path, status, duration, and request ID on every request. Response bodies are not logged or are redacted. |
| **Partial** | Logging middleware exists but is missing key fields (e.g., no duration, no request ID). Or middleware is only on some routes. |
| **Fail** | No HTTP request logging middleware. Requests are not logged at the application level. |
| **Severity** | medium |
| **Tech Triggers** | [any_web_framework, any_api] |

### OBS-004: Error Logging with Context

| Field | Value |
|---|---|
| **What to Look For** | Errors are logged with full stack traces, request context (URL, method, user ID), and enough metadata to reproduce the issue. User identifiers are anonymized or hashed. |
| **How to Check** | 1. Find error handling code — look for `catch` blocks, error middleware, `@ExceptionHandler`, `rescue`, `except` clauses in application code. 2. Verify that caught errors are logged (not swallowed silently) with `logger.error()` or equivalent. 3. Check that error logs include: the error message, stack trace, request context (path, method), and a user identifier. 4. Verify user identifiers are anonymized — look for hashing or pseudonymization of user IDs, emails, or IP addresses before logging. 5. Check that errors are not just `console.error(err)` but include structured context fields. |
| **Pass** | All error handlers log errors with stack traces, request context, and anonymized user identifiers. No silent catch blocks in production code paths. |
| **Partial** | Errors are logged but missing context (e.g., no stack trace, no request info). Or some catch blocks swallow errors silently. |
| **Fail** | Errors are not logged consistently. Silent catch blocks exist. No contextual information attached to error logs. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-005: Log Aggregation

| Field | Value |
|---|---|
| **What to Look For** | Logs are shipped to a centralized log aggregation service (ELK/OpenSearch, CloudWatch Logs, Datadog, Splunk, Grafana Loki) rather than only existing on local disk or stdout. |
| **How to Check** | 1. Check for log shipping configuration: look for Fluentd/Fluent Bit configs, CloudWatch log agent setup, Datadog agent, Logstash pipeline, or application-level log transports (e.g., `winston-cloudwatch`, `serilog-sinks-elasticsearch`). 2. In containerized environments, verify logs go to stdout/stderr AND a log driver or sidecar ships them (check `docker-compose.yml` logging driver, Kubernetes Fluentd DaemonSet, ECS log configuration). 3. Verify the aggregation service has retention policies configured (not just infinite or default). 4. Check that log queries/search is available to the development team (not locked behind ops-only access). |
| **Pass** | Logs are shipped to a centralized service with defined retention. Search/query access is available to developers. |
| **Partial** | Logs are shipped but retention is undefined or default. Or log aggregation exists but only for some services/layers. |
| **Fail** | No log aggregation. Logs exist only on local disk or container stdout with no shipping mechanism. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-006: Sensitive Data Filtering in Logs

| Field | Value |
|---|---|
| **What to Look For** | Passwords, API keys, tokens, PII (email, phone, SSN), and credit card numbers are never written to logs. Log sanitization or redaction is in place. |
| **How to Check** | 1. Search for logging of request bodies, headers, or authentication data — grep for patterns like `logger.*req.body`, `logger.*headers`, `logger.*password`, `logger.*token`, `logger.*authorization`. 2. Check if a log sanitization middleware or filter exists that strips sensitive fields before logging (e.g., field blocklists, regex redaction of card numbers, masking of Authorization headers). 3. Verify that authentication endpoints (login, signup, password reset) do not log request payloads containing credentials. 4. Check for PII in log format strings — look for email, phone, or address fields being logged without redaction. 5. If using a logging library, check for redaction plugins (e.g., `pino-noir`, `structlog` processors, Serilog destructuring policies). |
| **Pass** | Log sanitization is configured. Sensitive fields (passwords, tokens, PII) are redacted or excluded. Auth endpoints do not log credentials. |
| **Partial** | Some sanitization exists but is incomplete — e.g., passwords are filtered but Authorization headers are logged, or PII redaction is inconsistent across services. |
| **Fail** | No log sanitization. Sensitive data (passwords, tokens, PII) appears in log output. Request bodies are logged wholesale without filtering. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

## Error Tracking

### OBS-007: Error Tracking Service

| Field | Value |
|---|---|
| **What to Look For** | A dedicated error tracking service (Sentry, Bugsnag, Rollbar, Datadog Error Tracking, Azure Application Insights) is integrated and configured with correct DSN/API keys. |
| **How to Check** | 1. Search for error tracking SDK imports: `@sentry/node`, `@sentry/react`, `sentry-sdk`, `bugsnag`, `rollbar`, `applicationinsights`. 2. Verify the SDK is initialized early in the application lifecycle (before routes/handlers are registered). 3. Check that the DSN/API key is loaded from environment variables, not hardcoded. 4. Verify environment and release/version tags are set in the SDK config (e.g., `Sentry.init({ environment: 'production', release: '1.2.3' })`). 5. For frontend apps, check that source maps are uploaded to the error tracking service for readable stack traces. |
| **Pass** | Error tracking SDK is initialized with correct DSN from env vars. Environment and release tags are configured. Source maps uploaded for frontend. |
| **Partial** | SDK is installed but misconfigured (e.g., DSN hardcoded, no environment tag, no source maps for frontend). |
| **Fail** | No error tracking service integrated. Errors are only visible in logs or console output. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-008: Error Alerting

| Field | Value |
|---|---|
| **What to Look For** | The error tracking service has alerting rules configured — notifications fire on high error rates, new error types, or error regressions. Alerts go to a team channel (Slack, Teams, PagerDuty, email). |
| **How to Check** | 1. Check the error tracking service configuration (Sentry alert rules, Bugsnag notify settings, Rollbar rate limits) for defined alert conditions. 2. Verify alert thresholds: at minimum, there should be alerts for (a) new/unseen errors, (b) error rate spikes (e.g., >5% error rate), and (c) error regressions (previously resolved errors reappearing). 3. Confirm alerts are routed to a team channel (Slack webhook, Teams connector, PagerDuty integration, email distribution list) — not just the service's web UI. 4. If config-as-code exists (e.g., Terraform, Sentry YAML config), review the alert rule definitions. Otherwise, document that this is a manual check in the service UI. |
| **Pass** | Alerting rules are defined for new errors, error spikes, and regressions. Alerts route to a team communication channel. |
| **Partial** | Some alerting exists but is incomplete — e.g., only email alerts, no spike detection, or alerts only go to one person instead of a team channel. |
| **Fail** | No alerting configured. Error tracking service is passive — errors are only visible if someone manually checks the dashboard. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-009: Unhandled Exception Capture

| Field | Value |
|---|---|
| **What to Look For** | Global error boundaries and unhandled exception handlers are in place so that no crash goes unrecorded. React error boundaries, Node.js `uncaughtException`/`unhandledRejection` handlers, Python `sys.excepthook`, .NET global exception filters. |
| **How to Check** | 1. **Frontend (React):** Search for `ErrorBoundary` components wrapping the app root or major route segments. Verify the boundary reports to the error tracking service (e.g., `Sentry.captureException` in `componentDidCatch`). 2. **Node.js:** Check for `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers — or verify the error tracking SDK registers these automatically (Sentry does by default). 3. **Python:** Check for `sys.excepthook` override or WSGI/ASGI error middleware. Verify the error tracking SDK hooks into the framework (e.g., Sentry Django/Flask integration). 4. **General:** Verify that unhandled errors result in (a) the error being captured/reported, (b) a graceful response to the user (not a raw stack trace), and (c) the process recovering or restarting cleanly. |
| **Pass** | Global error boundaries/handlers are in place for all entry points. Unhandled exceptions are captured by the error tracking service. Users see graceful error pages, not stack traces. |
| **Partial** | Handlers exist for some entry points but not all (e.g., React error boundary exists but no `unhandledRejection` handler in Node). |
| **Fail** | No global error handlers. Unhandled exceptions crash the process silently or show raw stack traces to users. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

## Metrics & Monitoring

### OBS-010: Application Metrics

| Field | Value |
|---|---|
| **What to Look For** | Application-level metrics are collected and exposed — at minimum the RED metrics: Request rate, Error rate, and Duration (latency). Uses Prometheus, StatsD, Datadog, CloudWatch custom metrics, or Application Insights. |
| **How to Check** | 1. Search for metrics library imports: `prom-client`, `prometheus_client`, `micrometer`, `statsd`, `datadog-metrics`, `applicationinsights`. 2. Check for a `/metrics` endpoint (Prometheus-style) or metrics push configuration (StatsD/Datadog agent). 3. Verify the following metrics exist: (a) HTTP request count by method/path/status, (b) HTTP request duration histogram/summary, (c) error count or error rate. 4. Check for custom business metrics if applicable (e.g., `orders_processed_total`, `ai_requests_total`). 5. Verify metrics have appropriate labels/tags (service name, environment, endpoint) for filtering and aggregation. |
| **Pass** | Metrics library is configured. RED metrics (rate, errors, duration) are collected with appropriate labels. Metrics are exposed or pushed to a collection system. |
| **Partial** | Metrics library exists but coverage is incomplete — e.g., only request count, no latency histogram. Or metrics exist but lack useful labels. |
| **Fail** | No application metrics collection. No `/metrics` endpoint or metrics push. Performance data is only available from infrastructure-level monitoring. |
| **Severity** | medium |
| **Tech Triggers** | [any_web_framework, any_api] |

### OBS-011: Infrastructure Monitoring

| Field | Value |
|---|---|
| **What to Look For** | Container or host-level resource monitoring is in place — CPU usage, memory usage, disk I/O, network I/O. Alerts fire when resources approach thresholds. |
| **How to Check** | 1. For Docker/Kubernetes: check for monitoring agent deployment (Prometheus node-exporter, Datadog agent DaemonSet, CloudWatch Container Insights, cAdvisor). 2. Review Kubernetes resource definitions for `resources.requests` and `resources.limits` — these establish the baseline for resource monitoring. 3. Check for alerting rules on resource usage: CPU > 80%, memory > 85%, disk > 90%, OOMKill events. 4. For cloud-hosted services, verify the cloud provider's native monitoring is enabled (CloudWatch, Azure Monitor, GCP Cloud Monitoring). 5. Verify dashboards exist that show resource utilization trends over time, not just current values. |
| **Pass** | Infrastructure monitoring agent is deployed. Resource alerts are configured with reasonable thresholds. Dashboards show utilization trends. |
| **Partial** | Monitoring agent exists but alerting thresholds are not defined. Or monitoring covers compute but not disk/network. |
| **Fail** | No infrastructure monitoring. Resource usage is not tracked. No alerts for resource exhaustion. |
| **Severity** | medium |
| **Tech Triggers** | [docker, kubernetes] |

### OBS-012: Database Monitoring

| Field | Value |
|---|---|
| **What to Look For** | Database health is monitored — connection pool metrics, slow query detection, replication lag (if applicable), and storage utilization. |
| **How to Check** | 1. Check for database connection pool metrics: pool size, active connections, idle connections, wait time. Look for pool configuration and monitoring in ORM/driver setup (e.g., `pg-pool` metrics, HikariCP metrics, SQLAlchemy pool events). 2. Check for slow query logging — verify the database or ORM is configured to log queries exceeding a duration threshold (e.g., `slow_query_log` in MySQL, `log_min_duration_statement` in PostgreSQL, Sequelize `benchmark: true`). 3. For managed databases (RDS, Cloud SQL, Azure SQL), verify cloud-native monitoring and alerting is enabled. 4. If the database uses replication, check for replication lag monitoring and alerting. 5. Verify storage/disk utilization alerts are set for the database volume. |
| **Pass** | Connection pool metrics are tracked. Slow query logging is enabled. Storage and replication (if applicable) are monitored with alerts. |
| **Partial** | Some database monitoring exists but gaps remain — e.g., slow query logging is on but no connection pool metrics, or cloud monitoring is enabled but no custom alerts. |
| **Fail** | No database-specific monitoring. Connection pool health, query performance, and storage are unmonitored. |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

### OBS-013: Uptime Monitoring

| Field | Value |
|---|---|
| **What to Look For** | External uptime monitoring pings the application's health endpoint from outside the infrastructure. Uses Pingdom, UptimeRobot, StatusCake, Better Uptime, or an internal health-check polling system. |
| **How to Check** | 1. Verify a health check endpoint exists (e.g., `/health`, `/healthz`, `/api/health`) that returns HTTP 200 when the service is healthy and checks critical dependencies (database, cache, external APIs). 2. Search for uptime monitoring configuration — look for Terraform/Pulumi resources (e.g., `aws_route53_health_check`), monitoring service config files, or documentation referencing an uptime monitor. 3. Check that the health endpoint does more than return 200 — it should verify database connectivity, cache availability, and critical third-party service reachability. 4. Verify the monitoring interval is reasonable (≤ 5 minutes) and alerts are sent to a team channel on downtime. 5. Check if a public status page exists (e.g., Statuspage.io, Instatus, Cachet). |
| **Pass** | Health endpoint exists with dependency checks. External uptime monitor polls at ≤ 5-minute intervals. Downtime alerts go to a team channel. |
| **Partial** | Health endpoint exists but only returns static 200 (no dependency checks). Or uptime monitoring is internal-only (no external perspective). |
| **Fail** | No health endpoint. No uptime monitoring. Downtime is discovered by user complaints. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework, any_api] |

---

## Distributed Tracing

### OBS-014: Request Correlation IDs

| Field | Value |
|---|---|
| **What to Look For** | Every request gets a unique correlation/trace ID that is propagated across service boundaries and included in all log entries for that request. |
| **How to Check** | 1. Check for correlation ID middleware — look for middleware that generates a UUID/ULID on incoming requests (e.g., `X-Request-Id`, `X-Correlation-Id`, `traceparent` header). 2. Verify the correlation ID is added to the logging context so all log entries for a request share the same ID (e.g., `cls-hooked`, `AsyncLocalStorage` in Node, `contextvars` in Python, MDC in Java). 3. Check that outbound HTTP calls propagate the correlation ID to downstream services (look for the header being forwarded in HTTP client configuration). 4. Verify the correlation ID is included in error tracking context (Sentry tags, Bugsnag metadata). 5. Check that API responses include the correlation ID in a response header for client-side debugging. |
| **Pass** | Correlation IDs are generated for every request, attached to all log entries, propagated to downstream services, and returned in response headers. |
| **Partial** | Correlation IDs are generated but not consistently propagated — e.g., present in logs but not forwarded to downstream calls, or not returned in response headers. |
| **Fail** | No correlation ID mechanism. Log entries cannot be grouped by request. Cross-service request tracing is impossible. |
| **Severity** | medium |
| **Tech Triggers** | [any_api, any_web_framework] |

### OBS-015: Distributed Tracing

| Field | Value |
|---|---|
| **What to Look For** | For multi-service architectures, distributed tracing is implemented using OpenTelemetry, Jaeger, Zipkin, AWS X-Ray, or Datadog APM. Traces span across service boundaries. |
| **How to Check** | 1. Search for tracing SDK imports: `@opentelemetry/sdk-trace-node`, `opentelemetry`, `jaeger-client`, `aws-xray-sdk`, `dd-trace`. 2. Verify the tracer is initialized at application startup with the correct service name, environment, and exporter endpoint. 3. Check that HTTP client and server instrumentation is enabled (auto-instrumentation or manual spans). 4. For critical code paths (database queries, external API calls, queue operations), verify custom spans are created with meaningful names and attributes. 5. Confirm traces are exported to a backend (Jaeger, Tempo, Datadog, X-Ray) and a trace visualization UI is accessible to developers. 6. If using OpenTelemetry, check for `W3C Trace Context` propagation (`traceparent` header). |
| **Pass** | Distributed tracing SDK is configured. HTTP auto-instrumentation is enabled. Custom spans exist for critical operations. Traces are visualized in a backend accessible to the team. |
| **Partial** | Tracing SDK is installed but not fully configured — e.g., auto-instrumentation only, no custom spans, or traces are collected but no visualization backend is set up. |
| **Fail** | No distributed tracing. Multi-service request flows cannot be visualized or debugged end-to-end. |
| **Severity** | medium |
| **Tech Triggers** | [any_api, docker, kubernetes] |

---

## AI/ML Observability

### OBS-016: LLM Call Logging

| Field | Value |
|---|---|
| **What to Look For** | Every LLM API call (OpenAI, Anthropic, Azure OpenAI, local models) is logged with: model name, prompt token count, completion token count, total tokens, latency, and estimated cost. |
| **How to Check** | 1. Search for LLM client wrappers or middleware — look for a centralized function/class that wraps `openai.chat.completions.create`, `anthropic.messages.create`, or LangChain LLM calls. 2. Verify the wrapper logs: (a) model name/version, (b) prompt tokens, (c) completion tokens, (d) total tokens, (e) latency in ms, (f) estimated cost (or token counts sufficient to calculate cost). 3. Check that the logging includes the request context (which feature/endpoint triggered the call, user/session ID). 4. Verify prompt/completion content is NOT logged in production (privacy + cost) — or if logged, is stored separately with access controls. 5. Look for LLM observability tools: LangSmith, Helicone, PromptLayer, Weights & Biases, or custom instrumentation. |
| **Pass** | All LLM calls are logged with model, token usage, latency, and cost. Request context is included. Prompt/completion content is not logged in production or is stored with access controls. |
| **Partial** | LLM calls are logged but missing key fields (e.g., no token counts, no cost estimation). Or logging is inconsistent across different LLM integrations. |
| **Fail** | LLM API calls are not logged. Token usage and costs are unknown. No visibility into LLM call patterns or performance. |
| **Severity** | high |
| **Tech Triggers** | [openai, anthropic, langchain, any_ai_ml] |

### OBS-017: AI Pipeline Monitoring

| Field | Value |
|---|---|
| **What to Look For** | AI/ML pipeline stages are monitored — embedding generation latency, vector search performance (query time, result count, relevance scores), retrieval-augmented generation (RAG) pipeline metrics. |
| **How to Check** | 1. Identify AI pipeline stages: document ingestion, embedding generation, vector store indexing, similarity search, LLM generation, post-processing. 2. Check that each stage has timing instrumentation (start/end timestamps or duration metrics). 3. For vector search: verify that query latency, number of results, and similarity scores are logged or tracked as metrics. 4. For RAG pipelines: check that the retrieval step logs which documents/chunks were retrieved, their relevance scores, and whether the context window was truncated. 5. Verify pipeline-level metrics: end-to-end latency, success/failure rate, retry counts. 6. Check for drift detection or quality monitoring on embeddings if applicable. |
| **Pass** | All AI pipeline stages are instrumented with timing and quality metrics. Vector search performance is tracked. RAG retrieval metadata is logged. |
| **Partial** | Some pipeline stages are monitored but coverage is incomplete — e.g., LLM calls are tracked but embedding generation and vector search are not. |
| **Fail** | No AI pipeline monitoring. Embedding generation, vector search, and retrieval steps are black boxes with no performance visibility. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

### OBS-018: LLM Cost Tracking

| Field | Value |
|---|---|
| **What to Look For** | Token usage and estimated cost are tracked per request, per user, and per feature — enabling cost attribution, budget alerts, and abuse detection. |
| **How to Check** | 1. Verify token usage is recorded with dimensional tags: (a) per-request (which API call), (b) per-user or per-tenant (who triggered it), (c) per-feature (which application feature used the LLM). 2. Check for cost calculation logic — either a pricing lookup table mapping model names to per-token costs, or integration with a cost tracking service (Helicone, LangSmith, custom). 3. Look for budget/quota enforcement: daily/monthly token limits per user or per feature, with alerts or hard caps when thresholds are approached. 4. Verify cost data is aggregated in a dashboard or report accessible to the team (not just raw logs). 5. Check for anomaly detection on token usage — sudden spikes may indicate prompt injection, infinite loops, or abuse. |
| **Pass** | Token usage is tracked per request/user/feature. Cost estimation is calculated. Budget alerts or quotas are in place. Cost dashboard exists. |
| **Partial** | Token usage is tracked but not attributed to users/features. Or costs are calculated but no alerting or budgets are defined. |
| **Fail** | No cost tracking. Token usage is not recorded. LLM costs are discovered only from the provider's billing dashboard at end of month. |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

---

## Alerting & Dashboards

### OBS-019: Alerting Rules

| Field | Value |
|---|---|
| **What to Look For** | Defined alert thresholds on critical operational metrics: error rate, latency percentiles (P95/P99), disk space, memory usage, queue depth, and LLM cost spikes. |
| **How to Check** | 1. Search for alerting configuration: Prometheus alerting rules (`alert:` in YAML), Grafana alert definitions, CloudWatch alarms, Datadog monitors, PagerDuty service integrations. 2. Verify alerts exist for at minimum: (a) error rate > threshold (e.g., > 1% of requests returning 5xx), (b) latency P99 > threshold (e.g., > 2s), (c) disk usage > 90%, (d) memory usage > 85% or OOMKill events, (e) health check failures. 3. Check alert routing — alerts should go to a team channel (Slack, Teams, PagerDuty) with appropriate severity levels (page for critical, notify for warning). 4. Verify alert de-duplication and cooldown periods are configured to prevent alert storms. 5. For AI/ML services, check for alerts on token usage spikes, LLM error rates, and embedding pipeline failures. |
| **Pass** | Alerting rules cover error rate, latency, resource usage, and health checks. Alerts route to team channels with severity-based escalation. De-duplication is configured. |
| **Partial** | Some alerts exist but coverage is incomplete — e.g., only infrastructure alerts, no application-level error rate or latency alerts. Or alerts exist but all go to email with no severity differentiation. |
| **Fail** | No alerting rules defined. Operational issues are discovered manually or by user reports. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### OBS-020: Runbook Links

| Field | Value |
|---|---|
| **What to Look For** | Every alert links to a runbook or troubleshooting guide that tells the on-call engineer what the alert means, how to diagnose the root cause, and what remediation steps to take. |
| **How to Check** | 1. Review alerting rule definitions for runbook URLs or documentation links — most alerting systems support an `annotations.runbook_url` or `description` field (Prometheus, Grafana, PagerDuty, Datadog). 2. Verify the linked runbooks actually exist and are up to date (not 404s or stale docs). 3. Check that runbooks contain at minimum: (a) what the alert means, (b) likely root causes, (c) diagnostic commands or queries to run, (d) remediation steps, (e) escalation contacts. 4. For critical alerts (P1/P2), verify runbooks include rollback procedures and communication templates. 5. Check that runbooks are stored in an accessible location (wiki, docs repo, Notion, Confluence) — not in someone's personal notes. |
| **Pass** | All alerts link to runbooks. Runbooks are accessible, up to date, and contain diagnostic steps, remediation procedures, and escalation paths. |
| **Partial** | Some alerts have runbook links but coverage is incomplete. Or runbooks exist but are outdated or missing key sections (e.g., no remediation steps). |
| **Fail** | No runbooks. Alerts fire with no guidance on diagnosis or remediation. On-call engineers must figure it out from scratch every time. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |
