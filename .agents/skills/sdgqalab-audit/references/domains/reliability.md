---
domain_id: reliability
domain_name: Reliability
check_prefix: REL

iso:
  quality_characteristic: Reliability
  sub_characteristics:
    - faultlessness
    - availability
    - fault_tolerance
    - recoverability
  grounding_standards:
    - id: "ISO/IEC 5055:2021"
      focus: "Automated reliability weakness patterns from source code"
    - id: "ISO/IEC 25023"
      focus: "Reliability measurement — availability, mean time between failures"

applicability:
  always_include: true
  triggers: []
  description: "Every layer must be reliability-audited"

scope: per-layer
---

# Reliability

Reliability measures the degree to which a system performs its required functions under
stated conditions for a specified period of time. This domain audits fault tolerance,
recovery mechanisms, graceful degradation, and operational resilience across every layer
of the stack.

---

## Universal Checks

### REL-001: Error Handling Strategy

| Field | Value |
|---|---|
| **What to Look For** | A consistent, project-wide error handling strategy — global exception handlers, structured error middleware, and no silently swallowed exceptions. |
| **How to Check** | 1. **Python**: Search for bare `except:` or `except Exception: pass` — run `grep -rn "except:" --include="*.py"` and flag any bare except or pass-only handlers. Check for a global exception handler in Django (`MIDDLEWARE` list for custom exception middleware in `settings.py`) or Flask (`@app.errorhandler`). 2. **Node/Express**: Search for `.catch(() => {})` empty catch blocks and verify `app.use((err, req, res, next) => ...)` error middleware exists in the main app file. 3. **General**: Grep for `TODO`, `FIXME`, or `HACK` near catch/except blocks — these indicate known-broken error handling. Verify errors are logged (not just printed) with context (stack trace, request ID). |
| **Pass** | Global error handler exists. No bare/empty catch blocks. Errors are logged with context and return structured error responses to callers. |
| **Partial** | Global handler exists but some modules have bare catch blocks or swallowed exceptions. |
| **Fail** | No global error handler. Multiple bare `except:` / empty `.catch()` blocks. Errors are silently swallowed or only printed to stdout. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### REL-002: Graceful Shutdown

| Field | Value |
|---|---|
| **What to Look For** | Signal handlers for SIGTERM and SIGINT that drain in-flight requests, close database connections, flush queues, and exit cleanly. |
| **How to Check** | 1. Search the entrypoint files (`main.py`, `manage.py`, `app.py`, `server.js`, `index.js`, `main.go`) for signal handling: `signal.signal(signal.SIGTERM`, `process.on('SIGTERM'`, `signal.Notify(`. 2. In Docker setups, check that the app runs as PID 1 or uses `tini`/`dumb-init` as the init process (search `Dockerfile` for `ENTRYPOINT` and `CMD`). 3. Verify the handler closes resources: database pool `.close()`, HTTP server `.shutdown()`, message broker connection `.close()`. 4. Check `docker-compose.yml` for `stop_grace_period` on critical services. |
| **Pass** | SIGTERM/SIGINT handlers registered. Handlers drain connections, close pools, and flush buffers before exit. Container runs with proper init. |
| **Partial** | Signal handler exists but does not close all resources (e.g., closes HTTP server but not DB pool). |
| **Fail** | No signal handling. Process is killed abruptly on deploy, risking data corruption and orphaned connections. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### REL-003: Health Check Endpoints

| Field | Value |
|---|---|
| **What to Look For** | A `/health` or `/healthz` endpoint that returns 200 when the service is operational and checks critical dependencies (database, cache, external APIs). |
| **How to Check** | 1. Search route definitions for `health` — `grep -rn "health" --include="*.py" --include="*.js" --include="*.ts" --include="*.go"`. 2. Verify the endpoint does more than return `{"status": "ok"}` — it should query the database (`SELECT 1`), ping Redis, and verify any critical external service is reachable. 3. Check `docker-compose.yml` or Kubernetes manifests for `healthcheck` / `livenessProbe` / `readinessProbe` configuration that points to this endpoint. 4. Confirm the health check has a timeout (not waiting forever for a dependency). |
| **Pass** | Health endpoint exists, checks all critical dependencies, is wired into container orchestration health checks, and has its own timeout. |
| **Partial** | Health endpoint exists but is a shallow check (returns 200 without probing dependencies) or is not wired into orchestration. |
| **Fail** | No health check endpoint. Orchestration has no way to detect an unhealthy instance. |
| **Severity** | high |
| **Tech Triggers** | [any_api, any_web_framework] |

### REL-004: Retry Logic with Backoff

| Field | Value |
|---|---|
| **What to Look For** | Retry wrappers on all external calls (HTTP requests, database queries, message broker publishes) using exponential backoff with jitter — not naive fixed-delay retries. |
| **How to Check** | 1. **Python**: Search for `tenacity`, `retrying`, `backoff`, or `urllib3.util.retry` imports. Check decorator usage: `@retry(stop=stop_after_attempt(`, `@backoff.on_exception(`. 2. **Node**: Search for `axios-retry`, `p-retry`, `async-retry`, or custom retry loops. 3. **General**: Grep for `retry`, `backoff`, `max_retries` in config files and source. 4. Verify retries use exponential backoff (delay doubles) and add jitter (randomized offset). Flag any `time.sleep(5)` / `setTimeout(5000)` in a retry loop — that's fixed delay without backoff. 5. Check that retries are bounded — there must be a max attempt count. |
| **Pass** | External calls use retry with exponential backoff and jitter. Max attempts are bounded. Non-retryable errors (4xx) are excluded from retry. |
| **Partial** | Retry exists but uses fixed delay, or retries all errors including non-retryable ones (e.g., 400 Bad Request). |
| **Fail** | No retry logic. External call failures propagate immediately with no recovery attempt. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### REL-005: Circuit Breaker Pattern

| Field | Value |
|---|---|
| **What to Look For** | Circuit breaker implementation that stops calling a failing external service after repeated failures, allowing it time to recover before retrying. |
| **How to Check** | 1. **Python**: Search for `pybreaker`, `circuitbreaker`, or custom state-machine implementations with states like `OPEN`, `CLOSED`, `HALF_OPEN`. 2. **Node**: Search for `opossum`, `cockatiel`, `brakes`, or equivalent libraries. 3. **General**: Grep for `circuit`, `breaker`, `half.open`, `failure_threshold` across the codebase. 4. Verify configuration: failure threshold (how many failures before opening), recovery timeout (how long before half-open), and success threshold (how many successes to close). 5. Check that the circuit breaker wraps calls to external APIs, not internal logic. |
| **Pass** | Circuit breaker wraps external service calls with sensible thresholds. Fallback behavior is defined (cached response, degraded mode, user-friendly error). |
| **Partial** | Circuit breaker library is imported but only wraps some external calls, or fallback behavior is missing. |
| **Fail** | No circuit breaker. A single failing dependency can cascade and bring down the entire service. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

### REL-006: Timeout Configuration

| Field | Value |
|---|---|
| **What to Look For** | Explicit timeouts on every external call — HTTP clients, database connections, cache connections, external API calls. No operation should block indefinitely. |
| **How to Check** | 1. **HTTP clients**: Search for `requests.get(`, `httpx.`, `axios(`, `fetch(`, `http.Get(` — verify each has a `timeout=` parameter. Flag any call without a timeout. 2. **Database**: Check connection config for `connect_timeout`, `statement_timeout` (PostgreSQL), `wait_timeout` (MySQL), `socketTimeoutMS` (MongoDB). 3. **Redis**: Check for `socket_timeout`, `socket_connect_timeout` in Redis client config. 4. **ORM config**: In Django check `DATABASES` → `OPTIONS` → `connect_timeout`. In SQLAlchemy check `pool_timeout`, `connect_args`. 5. **gRPC/WebSocket**: Search for `deadline`, `timeout`, `ping_interval` configuration. |
| **Pass** | All external calls have explicit timeouts. Database connections have connect and statement timeouts. Values are reasonable (not 300s for an API call). |
| **Partial** | Most calls have timeouts but some (especially background tasks or internal service calls) are missing them. |
| **Fail** | No explicit timeouts. Client defaults (often infinite or very long) are relied upon. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

## Web Application Checks

### REL-007: Database Connection Pooling

| Field | Value |
|---|---|
| **What to Look For** | Connection pool configuration with bounded max connections, idle timeouts, and overflow handling — not one-connection-per-request without pooling. |
| **How to Check** | 1. **Django**: Check `settings.py` for `CONN_MAX_AGE` (should be > 0 or `None` for persistent). Look for `django-db-connection-pool` or `pgbouncer` in the stack. 2. **SQLAlchemy**: Search for `create_engine(` and verify `pool_size`, `max_overflow`, `pool_timeout`, `pool_recycle` parameters. 3. **Node (pg)**: Search for `new Pool(` and check `max`, `idleTimeoutMillis`, `connectionTimeoutMillis`. 4. **Go**: Search for `sql.Open(` followed by `SetMaxOpenConns`, `SetMaxIdleConns`, `SetConnMaxLifetime`. 5. Check that pool size is appropriate for the deployment (not 100 connections for a service with 2 replicas hitting a DB with `max_connections = 100`). |
| **Pass** | Connection pooling configured with explicit max connections, idle timeout, and pool recycle. Pool size is proportional to expected concurrency and DB limits. |
| **Partial** | Pooling exists but uses defaults (e.g., SQLAlchemy default pool_size=5 without tuning) or is missing idle timeout / recycle. |
| **Fail** | No connection pooling. Each request opens and closes a new database connection. |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### REL-008: Session Persistence

| Field | Value |
|---|---|
| **What to Look For** | Session storage backed by a shared store (Redis, database, memcached) rather than in-memory or filesystem — critical for multi-instance deployments. |
| **How to Check** | 1. **Django**: Check `settings.py` for `SESSION_ENGINE`. Flag `django.contrib.sessions.backends.cache` without a shared cache or `django.contrib.sessions.backends.file`. Acceptable: `django.contrib.sessions.backends.cached_db`, `redis`. 2. **Flask**: Search for `SESSION_TYPE` in config — flag `filesystem` or `null`. Acceptable: `redis`, `sqlalchemy`, `mongodb`. 3. **Express**: Search for `express-session` middleware config. Check `store:` — flag `MemoryStore` (the default). Acceptable: `connect-redis`, `connect-mongo`, `connect-pg-simple`. 4. If the app is JWT-only with no server-side sessions, mark as N/A with a note. |
| **Pass** | Sessions backed by Redis, database, or another shared store. Session configuration includes TTL/expiry. |
| **Partial** | Shared session store configured but missing TTL, or some session data is still stored in-memory alongside the shared store. |
| **Fail** | In-memory or filesystem session store in a multi-instance deployment. Sessions are lost on restart or not shared across instances. |
| **Severity** | medium |
| **Tech Triggers** | [django, flask, express, any_web_framework] |

### REL-009: Transaction Management

| Field | Value |
|---|---|
| **What to Look For** | Database transactions wrapping multi-step write operations with proper rollback on failure — not auto-commit on each statement. |
| **How to Check** | 1. **Django**: Search for `@transaction.atomic`, `with transaction.atomic():`, or `ATOMIC_REQUESTS = True` in settings. Check that views performing multiple writes use atomic blocks. 2. **SQLAlchemy**: Verify `session.begin()` / `session.commit()` / `session.rollback()` pattern. Check for `try/except` around commits with rollback in the except. 3. **Node (pg/knex)**: Search for `BEGIN`, `COMMIT`, `ROLLBACK` in raw SQL or `knex.transaction(`. 4. **General**: Identify multi-step operations (e.g., create user + create profile + send email) and verify they're wrapped in a transaction. Flag any `save()` / `INSERT` sequences outside a transaction block. |
| **Pass** | Multi-step writes are wrapped in transactions. Rollback is handled on exception. Transaction isolation level is explicitly set where needed. |
| **Partial** | Some operations use transactions but others (especially in background tasks) do not. |
| **Fail** | No transaction management. Multi-step writes use auto-commit, risking partial data on failure. |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### REL-010: Dead Letter Queue

| Field | Value |
|---|---|
| **What to Look For** | A mechanism to capture and retain failed asynchronous jobs/messages for inspection and replay — not silent discard after max retries. |
| **How to Check** | 1. **Celery**: Check `celeryconfig.py` or `settings.py` for `task_reject_on_worker_lost`, `task_acks_late`, and a DLQ routing config. Search for `on_failure` handler or custom `Task` base class with failure handling. 2. **RabbitMQ**: Search for `x-dead-letter-exchange`, `x-dead-letter-routing-key` in queue declarations. 3. **Redis (rq)**: Check for `FailedJobRegistry` handling or custom exception handlers. 4. **Bull/BullMQ (Node)**: Search for `attempts`, `backoff`, and `failed` event handlers in queue configuration. 5. **General**: Verify that failed jobs are persisted somewhere (database table, separate queue, logging) and there is a mechanism to inspect and replay them. |
| **Pass** | Failed jobs route to a DLQ or failure table. Alerting is configured on DLQ depth. A replay mechanism exists. |
| **Partial** | Failed jobs are logged but not persisted to a queryable store. No replay mechanism. |
| **Fail** | Failed jobs are silently discarded after max retries. No DLQ, no failure logging. |
| **Severity** | medium |
| **Tech Triggers** | [celery, rabbitmq, redis, any_message_broker] |

---

## Infrastructure Checks

### REL-011: Container Restart Policy

| Field | Value |
|---|---|
| **What to Look For** | Restart policies on all critical service containers ensuring they recover automatically from crashes. |
| **How to Check** | 1. Open `docker-compose.yml` (or `docker-compose.*.yml` variants). For every service, check for `restart:` key. 2. Critical services (web, api, worker, database) should have `restart: always` or `restart: unless-stopped`. 3. One-shot containers (migrations, seed scripts) should have `restart: "no"` or `restart: on-failure` — flag if they have `restart: always`. 4. For Kubernetes, check `Deployment` manifests for `restartPolicy: Always` (the default for pods in a Deployment). 5. Verify that containers that crash-loop have resource limits (REL-012) to prevent resource exhaustion during rapid restarts. |
| **Pass** | All critical services have `restart: always` or `restart: unless-stopped`. One-shot containers have appropriate restart policies. |
| **Partial** | Some critical services have restart policies but others rely on the default (`restart: "no"` in docker-compose). |
| **Fail** | No restart policies defined. A crashed container stays down until manual intervention. |
| **Severity** | high |
| **Tech Triggers** | [docker] |

### REL-012: Resource Limits

| Field | Value |
|---|---|
| **What to Look For** | Memory and CPU limits on containers preventing a single runaway process from consuming all host resources. |
| **How to Check** | 1. **Docker Compose**: Check each service for `deploy.resources.limits.memory` and `deploy.resources.limits.cpus` (Compose v3) or `mem_limit` / `cpus` (Compose v2). 2. **Kubernetes**: Check `Deployment` / `Pod` specs for `resources.limits.memory` and `resources.limits.cpu` on every container. Also check `resources.requests` for scheduling. 3. Flag any service without limits — especially workers, ML inference containers, or anything that processes untrusted input. 4. Verify limits are reasonable: a web API should not have 16GB memory limit; an ML worker should not have 256MB. |
| **Pass** | All containers have memory and CPU limits. Limits are tuned to workload (not copy-pasted defaults). Requests are set for Kubernetes scheduling. |
| **Partial** | Limits set on some containers but missing on workers or sidecar containers. |
| **Fail** | No resource limits. A memory leak or CPU spike in one container can take down the host. |
| **Severity** | medium |
| **Tech Triggers** | [docker, kubernetes] |

### REL-013: Data Backup Configuration

| Field | Value |
|---|---|
| **What to Look For** | Automated, scheduled database backups with retention policy and verified restore procedure. |
| **How to Check** | 1. Search for backup scripts: `grep -rn "pg_dump\|mysqldump\|mongodump\|backup" --include="*.sh" --include="*.py" --include="*.yml"`. 2. Check for cron jobs or scheduled tasks: search `crontab`, `docker-compose.yml` for backup service, GitHub Actions / CI for backup workflows. 3. For cloud deployments, check for managed backup configuration (AWS RDS automated backups, Azure SQL backup policy, GCP Cloud SQL backups). 4. Verify backup retention policy is defined (not just "latest backup" overwriting previous). 5. Check for backup verification — is there a restore test script or CI job that periodically restores from backup? 6. Check for backup encryption if backups are stored offsite. |
| **Pass** | Automated backups run on schedule. Retention policy keeps multiple generations. Restore procedure is documented and tested. Backups are encrypted at rest. |
| **Partial** | Backups exist but are manual, or no retention policy (only latest backup kept), or restore has never been tested. |
| **Fail** | No backup configuration found. Data loss from hardware failure, accidental deletion, or corruption would be unrecoverable. |
| **Severity** | critical |
| **Tech Triggers** | [any_database] |

### REL-014: Disaster Recovery Plan

| Field | Value |
|---|---|
| **What to Look For** | Documented recovery procedures covering data restoration, service rebuilding, and communication protocols for major outages. |
| **How to Check** | 1. Search for DR documentation: `find . -iname "*disaster*" -o -iname "*recovery*" -o -iname "*runbook*" -o -iname "*incident*"` in the repo and any linked documentation. 2. Check for a `docs/` or `runbooks/` directory containing operational procedures. 3. Verify the DR plan covers: (a) database restore procedure, (b) infrastructure rebuild steps, (c) DNS/CDN failover, (d) communication plan (who to notify), (e) RTO/RPO targets. 4. Check if the recovery procedure has been tested (look for post-mortem documents, DR drill records). 5. For cloud deployments, check for multi-region or multi-AZ configuration in infrastructure-as-code files. |
| **Pass** | DR plan documented with specific restore procedures, RTO/RPO targets, and communication plan. DR drills have been conducted. Multi-AZ or failover infrastructure exists. |
| **Partial** | Some documentation exists but is incomplete (e.g., covers DB restore but not full infrastructure rebuild) or has never been tested. |
| **Fail** | No disaster recovery documentation or procedures. Team would be improvising during an outage. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

## Deployment & Recovery Checks

### REL-015: Zero-Downtime Deployment

| Field | Value |
|---|---|
| **What to Look For** | Deployment strategy that serves traffic continuously during updates — rolling updates, blue-green, or canary deployments. |
| **How to Check** | 1. **Docker Compose**: Check for `deploy.update_config.order: start-first` or a blue-green setup with a reverse proxy (nginx, traefik) switching between containers. 2. **Kubernetes**: Check `Deployment` spec for `strategy.type: RollingUpdate` with `maxUnavailable: 0` and `maxSurge` configured. 3. **CI/CD**: Review deployment scripts/workflows for zero-downtime patterns — search for `rolling`, `blue-green`, `canary`, `--update-delay` in deployment files. 4. Check that health checks (REL-003) are used to gate traffic to new instances — the load balancer should not route to an instance that hasn't passed its health check. 5. Flag any `docker-compose down && docker-compose up` pattern — that's a full-stop deployment. |
| **Pass** | Zero-downtime deployment strategy configured and verified. New instances are health-checked before receiving traffic. Old instances drain before shutdown. |
| **Partial** | Rolling update configured but health check gating is missing, or `maxUnavailable > 0` allowing brief downtime. |
| **Fail** | Deployment requires stopping the old version before starting the new one. Every deploy causes downtime. |
| **Severity** | medium |
| **Tech Triggers** | [docker, kubernetes] |

### REL-016: Database Migration Safety

| Field | Value |
|---|---|
| **What to Look For** | Database migrations that are backward-compatible, reversible, and do not hold exclusive locks on large tables for extended periods. |
| **How to Check** | 1. **Django**: Check migration files in `*/migrations/` for operations. Flag `RunSQL` without a `reverse_sql`. Flag `AlterField` on large tables without checking if it requires a table rewrite. Check for `atomic = False` on data migrations that should not be atomic. 2. **SQLAlchemy/Alembic**: Check `alembic/versions/` for `downgrade()` functions — they should not be empty or `pass`. 3. **General**: Flag any migration that adds a `NOT NULL` column without a default (requires table rewrite on some databases). Flag `CREATE INDEX` without `CONCURRENTLY` on PostgreSQL for large tables. 4. Check if migrations are run before or after code deployment — ideally migrations run first and are backward-compatible with the old code. 5. Verify a rollback strategy: can you run `migrate <previous>` safely? |
| **Pass** | Migrations are reversible with working downgrade paths. No long-locking operations on large tables. Migrations are backward-compatible with the previous code version. |
| **Partial** | Most migrations are reversible but some lack downgrade. No evidence of lock-awareness for large table operations. |
| **Fail** | Migrations are not reversible (empty downgrade functions). Migrations include table-locking operations with no mitigation. No rollback strategy. |
| **Severity** | high |
| **Tech Triggers** | [django, sqlalchemy, any_database] |

### REL-017: Rollback Capability

| Field | Value |
|---|---|
| **What to Look For** | The ability to quickly revert a bad deployment to the previous known-good state — via container image tags, git revert, or infrastructure-as-code rollback. |
| **How to Check** | 1. **Container images**: Verify images are tagged with specific versions or commit SHAs — not just `latest`. Check `docker-compose.yml` and CI/CD for image tag strategy. 2. **Kubernetes**: Check for `kubectl rollout undo` capability — `Deployment` revision history is kept by default. Verify `revisionHistoryLimit` is not set to 0. 3. **CI/CD**: Search deployment workflows for rollback steps or a dedicated rollback workflow/script. 4. **Database**: If the deployment includes migrations, verify there's a migration rollback step in the deployment procedure. 5. Check that the previous version's container image is retained in the registry (not garbage-collected immediately). |
| **Pass** | Rollback can be executed in under 5 minutes. Previous container images are retained. Database migrations are reversible. Rollback procedure is documented. |
| **Partial** | Container rollback is possible but database migration rollback is untested, or rollback procedure is not documented. |
| **Fail** | No rollback strategy. `latest` tag used everywhere. Irreversible migrations. Recovery requires a full rebuild. |
| **Severity** | high |
| **Tech Triggers** | [docker, kubernetes, any_ci_cd] |

---

## AI/ML Checks

### REL-018: LLM Fallback Handling

| Field | Value |
|---|---|
| **What to Look For** | Graceful degradation when LLM API calls fail due to timeouts, rate limits, or service outages — the application should not crash or hang. |
| **How to Check** | 1. Search for LLM client calls: `grep -rn "openai\|anthropic\|ChatCompletion\|completion\|langchain" --include="*.py" --include="*.js" --include="*.ts"`. 2. For each call site, verify: (a) try/except or try/catch wraps the call, (b) specific exceptions are caught (`RateLimitError`, `Timeout`, `APIError`), (c) a fallback response or behavior is defined (cached response, simpler model, user-facing error message). 3. Check for timeout configuration on LLM client calls (OpenAI default is 600s — far too long for user-facing requests). 4. Look for rate limit handling: search for `rate_limit`, `429`, `retry-after` handling. 5. Verify the application remains functional (possibly in degraded mode) when the LLM is completely unavailable. |
| **Pass** | All LLM calls have timeout, retry, and fallback handling. Rate limit errors trigger backoff. Application degrades gracefully (e.g., returns cached response or user-friendly error) when LLM is unavailable. |
| **Partial** | Some LLM calls have error handling but others don't, or fallback behavior is just re-raising the exception with a generic 500 error. |
| **Fail** | LLM calls have no error handling. A timeout or rate limit from OpenAI/Anthropic causes the request to hang or crash the application. |
| **Severity** | high |
| **Tech Triggers** | [openai, anthropic, langchain, any_ai_ml] |

### REL-019: Model Version Pinning

| Field | Value |
|---|---|
| **What to Look For** | AI/ML model versions explicitly pinned to specific versions — not `latest`, not unpinned aliases that can change without notice. |
| **How to Check** | 1. Search for model references: `grep -rn "model.*=\|model_name\|engine=" --include="*.py" --include="*.js" --include="*.ts" --include="*.env" --include="*.yml"`. 2. Flag any instance of `model="gpt-4"` (unpinned — should be `gpt-4-0613` or a dated snapshot). Flag `model="gpt-4-turbo"` without a date version. 3. Check environment variables and config files for model name definitions — verify they use specific versions. 4. For self-hosted models, check that model files are versioned (hash, version tag) and not pulled as `latest` at runtime. 5. Check for embedding model versions separately — an unannounced embedding model change will corrupt your vector store. |
| **Pass** | All model references use dated/versioned identifiers. Model versions are defined in configuration (not hardcoded in multiple places). Embedding model version matches the vector store index. |
| **Partial** | Main LLM model is pinned but embedding models or secondary models (e.g., summarization) use unpinned aliases. |
| **Fail** | Model references use unpinned aliases (`gpt-4`, `claude-3-sonnet`). A provider-side model update could silently change behavior. |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

### REL-020: Embedding Store Resilience

| Field | Value |
|---|---|
| **What to Look For** | Vector database / embedding store has backup, connection retry, and graceful fallback when unavailable. |
| **How to Check** | 1. Identify the vector store: search for `chromadb`, `pinecone`, `weaviate`, `qdrant`, `milvus`, `pgvector`, `faiss` imports or configuration. 2. **Connection handling**: Verify the client connection has retry logic and timeout (see REL-004, REL-006). Check for connection pooling if applicable. 3. **Backup**: For persistent stores (Chroma with persistence, Pinecone), verify backup or snapshot configuration. For `faiss` with local index files, verify the index files are included in backups. 4. **Fallback**: Check what happens when the vector store is unavailable — does the app crash, hang, or degrade gracefully? Search for try/except around embedding search calls. 5. **Index rebuilding**: Verify there's a script or procedure to rebuild the embedding index from source data if the store is lost. |
| **Pass** | Vector store has backup/snapshot configuration. Connection has retry and timeout. Application degrades gracefully when store is unavailable. Index rebuild procedure exists. |
| **Partial** | Connection retry exists but no backup strategy, or backup exists but no graceful degradation on outage. |
| **Fail** | No backup of vector store. No retry on connection failure. Embedding store outage crashes the application. No rebuild procedure. |
| **Severity** | medium |
| **Tech Triggers** | [chromadb, pinecone, weaviate, any_ai_ml] |

---

## Data Integrity Checks

### REL-021: Input Data Validation

| Field | Value |
|---|---|
| **What to Look For** | Validation of incoming data at the boundaries — API request bodies, file uploads, data pipeline inputs, and message queue payloads are checked before processing. |
| **How to Check** | 1. **API endpoints**: Check for schema validation — search for `pydantic`, `marshmallow`, `cerberus`, `joi`, `zod`, `ajv`, `class-validator` imports and usage. Verify every POST/PUT/PATCH endpoint validates the request body. 2. **Django**: Check for `serializers.py` or `forms.py` validation. Verify `serializer.is_valid(raise_exception=True)` is called. 3. **Data pipelines**: Check for schema validation on ingested data — `pandera`, `great_expectations`, JSON Schema validation before processing. 4. **Null/empty handling**: Grep for raw dictionary access without `.get()` or null checks on data that comes from external sources. 5. **Type enforcement**: Check that numeric fields are validated as numbers, dates are parsed and validated, enums are checked against allowed values. |
| **Pass** | All external inputs validated with schema validation libraries. Null handling is explicit. Type enforcement is in place. Validation errors return clear error messages. |
| **Partial** | Some endpoints have validation but others accept raw unvalidated input, or validation is inconsistent (some fields checked, others not). |
| **Fail** | No input validation. Raw request bodies are passed directly to business logic or database queries. |
| **Severity** | high |
| **Tech Triggers** | [any_database, any_ai_ml] |

### REL-022: Idempotent Operations

| Field | Value |
|---|---|
| **What to Look For** | Critical write operations (payments, data mutations, job processing) that produce the same result when executed multiple times with the same input — preventing duplicate charges, double-processing, or data corruption from retries. |
| **How to Check** | 1. **API endpoints**: Search for idempotency key handling — `Idempotency-Key` header, `idempotency_key` parameter, or deduplication logic on POST endpoints that create resources or trigger side effects. 2. **Database writes**: Check for `INSERT ... ON CONFLICT DO NOTHING` / `ON DUPLICATE KEY UPDATE` patterns, or `get_or_create` / `upsert` usage instead of blind `INSERT`. 3. **Background jobs**: Verify that job processors check if work has already been done before executing (e.g., checking a `processed` flag or status before processing an order). 4. **Message consumers**: Check for message deduplication — `message_id` tracking in a dedup table or Redis set. 5. Flag any payment or financial operation that doesn't have idempotency protection. |
| **Pass** | Critical write operations are idempotent. API supports idempotency keys. Database writes use upsert/conflict handling. Background jobs check for prior completion. |
| **Partial** | Some operations are idempotent but others (especially background jobs or webhook handlers) are not. |
| **Fail** | No idempotency protection. Retried requests or redelivered messages can cause duplicate records, double charges, or corrupted state. |
| **Severity** | medium |
| **Tech Triggers** | [any_api, any_database] |
