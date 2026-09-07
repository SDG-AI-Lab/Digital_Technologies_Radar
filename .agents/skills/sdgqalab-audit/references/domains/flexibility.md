---
domain_id: flexibility
domain_name: Flexibility
check_prefix: FLX

iso:
  quality_characteristic: Flexibility
  sub_characteristics:
    - adaptability
    - scalability
    - installability
    - replaceability
  grounding_standards:
    - id: "ISO/IEC 25023"
      focus: "Flexibility measurement — adaptability, scalability metrics"

applicability:
  always_include: true
  triggers: []
  description: "Every layer should be checked for flexibility and scalability"

scope: per-layer
---

# Flexibility

Flexibility measures how well a system can adapt to changes in requirements, scale under load, and be installed or replaced in different environments. A flexible system is one that doesn't fight you when reality changes — it bends instead of breaking.

This domain covers containerization, scalability patterns, adaptability mechanisms, installability, replaceability, and AI/ML-specific flexibility concerns.

---

## Containerization & Deployment

### FLX-001: Containerization

| Field | Value |
|---|---|
| **What to Look For** | A well-structured Dockerfile that produces a lean, reproducible container image using multi-stage builds and minimal base images. |
| **How to Check** | 1. Look for a `Dockerfile` at the project root or in a `docker/` directory. 2. Open it and verify it uses multi-stage builds (multiple `FROM` statements — one for build, one for runtime). 3. Confirm the runtime stage uses a slim or distroless base (e.g., `python:3.12-slim`, `node:20-alpine`, `gcr.io/distroless/base`). 4. Check that the build stage installs only production dependencies in the final image (no dev deps, no build tools in runtime). 5. Verify a `.dockerignore` exists and excludes `.git/`, `node_modules/`, `__pycache__/`, `.env`, and other non-essential files. 6. Confirm the container runs as a non-root user (`USER` directive). |
| **Pass** | Dockerfile exists with multi-stage build, slim base image, `.dockerignore` present, non-root user configured. |
| **Partial** | Dockerfile exists but uses a single stage or a bloated base image (e.g., `python:3.12` instead of `slim`); `.dockerignore` missing or incomplete. |
| **Fail** | No Dockerfile found, or Dockerfile copies everything into a full OS image with no optimization. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### FLX-002: Docker Compose for Local Development

| Field | Value |
|---|---|
| **What to Look For** | A `docker-compose.yml` that spins up the full local development stack (app, database, cache, message broker, etc.) with a single command. |
| **How to Check** | 1. Look for `docker-compose.yml` or `compose.yml` at the project root. 2. Verify it defines the application service(s) plus all infrastructure dependencies (e.g., `postgres`, `redis`, `rabbitmq`, `minio`). 3. Check that the app service mounts source code as a volume for hot-reload (`volumes: - .:/app`). 4. Confirm port mappings are sensible and documented. 5. Look for named volumes for data persistence across restarts (`volumes:` section at top level). 6. Verify that `depends_on` or health checks enforce startup ordering. 7. Run `docker compose config` mentally — ensure no undefined variables or circular dependencies. |
| **Pass** | Compose file exists, includes all required services, uses volumes for code mounting and data persistence, and a developer can run `docker compose up` to get a working environment. |
| **Partial** | Compose file exists but is missing key services (e.g., no database or cache defined), forcing developers to install dependencies manually. |
| **Fail** | No compose file exists; local setup requires manual installation of every dependency. |
| **Severity** | medium |
| **Tech Triggers** | [docker] |

---

### FLX-003: Environment-Based Configuration

| Field | Value |
|---|---|
| **What to Look For** | Application reads all environment-specific configuration (database URLs, API keys, feature flags, ports) from environment variables — never hardcoded. |
| **How to Check** | 1. Search for a `.env.example` or `.env.template` file at the project root. 2. Open it and verify it lists every required environment variable with descriptive comments and safe placeholder values. 3. Grep the codebase for hardcoded connection strings, API keys, or secrets (e.g., `postgresql://localhost`, `sk-...`, `Bearer ...`). Flag any found. 4. Verify the app uses a config loader (e.g., `python-decouple`, `dotenv`, `@nestjs/config`, `viper`) that reads from env vars with sensible defaults for development. 5. Confirm `.env` is listed in `.gitignore` so real secrets are never committed. 6. Check that the config module validates required variables at startup and fails fast with a clear error message if any are missing. |
| **Pass** | `.env.example` exists with all variables documented, no hardcoded secrets in source, `.env` is gitignored, and the app validates config at startup. |
| **Partial** | Environment variables are used but `.env.example` is incomplete or missing, or some config values are still hardcoded. |
| **Fail** | Secrets or connection strings are hardcoded in source code; no `.env.example`; no config validation. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### FLX-004: Multi-Environment Support

| Field | Value |
|---|---|
| **What to Look For** | Clear separation of configuration across development, staging, and production environments with environment-specific overrides. |
| **How to Check** | 1. Check for environment-specific configuration files: `docker-compose.prod.yml`, `docker-compose.staging.yml`, `settings/production.py`, `config/environments/`, or similar patterns. 2. If using Kubernetes, look for environment-specific manifests or Helm values files (`values-dev.yaml`, `values-prod.yaml`). 3. Verify that production configs differ meaningfully from development (e.g., `DEBUG=false`, different database hosts, real secrets via secret manager). 4. Check that the deployment mechanism selects the correct environment config (e.g., `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`). 5. Confirm there is no scenario where development defaults accidentally leak into production (e.g., `DEBUG=True` as a fallback). |
| **Pass** | At least dev and production environments have separate configs; environment selection is explicit and documented; no dangerous defaults that could leak into prod. |
| **Partial** | Some environment separation exists but it's inconsistent — e.g., only the database URL changes between environments, while debug mode and logging are the same. |
| **Fail** | Single configuration for all environments; no way to differentiate dev from production behavior. |
| **Severity** | high |
| **Tech Triggers** | [docker, kubernetes, universal] |

---

## Scalability

### FLX-005: Stateless Application Design

| Field | Value |
|---|---|
| **What to Look For** | The application does not store session data, file uploads, or transient state on the local filesystem — all shared state lives in external stores (S3, Redis, database). |
| **How to Check** | 1. Search for file write operations in the app layer: `open(..., 'w')`, `fs.writeFileSync`, `File.write`, `multipart.save()`. 2. Check if uploaded files are stored locally (e.g., `UPLOAD_DIR = './uploads'`) or sent to an object store (S3, MinIO, Azure Blob). 3. Look at session configuration — verify sessions use Redis, database, or JWT tokens, not filesystem or in-memory stores (e.g., `SESSION_ENGINE = 'django.contrib.sessions.backends.cache'` not `file`). 4. Check for in-memory caches that aren't shared across instances (e.g., a plain Python dict used as cache instead of Redis). 5. Grep for temporary file usage patterns that assume a single-server deployment. |
| **Pass** | No local file storage for shared state; sessions stored externally; uploads go to object storage; caches use Redis or equivalent. |
| **Partial** | Most state is externalized but one or two areas still write to local disk (e.g., temp file processing without cleanup, or local session fallback). |
| **Fail** | Application stores sessions in memory, saves uploads to local disk, or uses in-process caching for data that must be shared across instances. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework, any_api] |

---

### FLX-006: Horizontal Scaling Readiness

| Field | Value |
|---|---|
| **What to Look For** | The application can run multiple instances behind a load balancer without requiring sticky sessions or shared local state. |
| **How to Check** | 1. Confirm FLX-005 passes (stateless design is a prerequisite). 2. Check for WebSocket usage — if present, verify a shared pub/sub adapter is configured (e.g., `socket.io-redis`, Redis channels) so events reach all instances. 3. Look for scheduled jobs (cron) — verify they use a distributed scheduler or leader election to prevent duplicate execution across instances. 4. Check database migrations — ensure they run as a separate step, not on every instance startup (to avoid race conditions). 5. If the app writes to a shared resource (e.g., file lock, PID file), verify those patterns are compatible with multi-instance deployment. 6. Look for `docker compose` `replicas` or Kubernetes `Deployment` with `replicas > 1` to see if horizontal scaling has been tested. |
| **Pass** | Stateless design confirmed; shared state externalized; WebSocket adapters configured for multi-instance; cron jobs use distributed locks; migration runs separately from boot. |
| **Partial** | Mostly scalable but one area (e.g., cron jobs, WebSocket) isn't configured for multi-instance operation. |
| **Fail** | Application requires sticky sessions, uses in-memory state for shared data, or runs migrations on every instance startup. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework, any_api] |

---

### FLX-007: Database Scalability

| Field | Value |
|---|---|
| **What to Look For** | Database configuration supports scaling patterns: connection pooling, read replicas, and query optimization for high-throughput scenarios. |
| **How to Check** | 1. Check the database connection config for a connection pooler (e.g., PgBouncer, HikariCP, SQLAlchemy pool settings, Prisma connection pool). Verify `pool_size`, `max_overflow`, or equivalent settings are explicitly configured. 2. Look for read replica configuration — a separate read-only database URL or a routing mechanism that sends reads to replicas. 3. Check for N+1 query patterns: ORM queries inside loops, missing `select_related`/`prefetch_related` (Django), missing `include`/`join` (Prisma/Sequelize), or unbounded `SELECT *` without pagination. 4. Verify database indexes exist for frequently queried columns (check migration files or schema definitions). 5. Look for query timeouts and statement-level kill switches to prevent runaway queries. |
| **Pass** | Connection pooling configured with explicit limits; read replica support present or documented as ready; no obvious N+1 queries; indexes defined for hot paths. |
| **Partial** | Connection pooling exists but uses defaults; no read replica config; some N+1 queries in non-critical paths. |
| **Fail** | No connection pooling; default database settings everywhere; obvious N+1 patterns in hot paths; no indexes beyond primary keys. |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

### FLX-008: Async Task Queue

| Field | Value |
|---|---|
| **What to Look For** | CPU-intensive, slow, or non-critical operations (email sending, PDF generation, ML inference, data processing) are offloaded to a background task queue instead of blocking request handlers. |
| **How to Check** | 1. Look for a task queue library: Celery (Python), Bull/BullMQ (Node.js), Sidekiq (Ruby), or a cloud equivalent (SQS + Lambda, Cloud Tasks). 2. Check for a message broker configuration (Redis, RabbitMQ, SQS) that the task queue connects to. 3. Identify operations that should be async: email sending, file processing, report generation, external API calls with retries, ML inference. Verify they are dispatched to the queue, not executed inline in request handlers. 4. Check for retry policies, dead-letter queues, and failure handling in task definitions. 5. Verify the worker process is defined in the deployment (separate container or process, not running inside the web server). |
| **Pass** | Task queue configured with a message broker; slow/heavy operations dispatched to workers; retry policies and failure handling defined; workers run as separate processes. |
| **Partial** | Task queue exists but only used for some operations; other slow tasks still run inline. Or task queue exists but lacks retry/DLQ configuration. |
| **Fail** | No task queue; all operations run synchronously in request handlers, including email, file processing, and external API calls. |
| **Severity** | medium |
| **Tech Triggers** | [celery, any_web_framework, any_api] |

---

### FLX-009: Load Balancer Configuration

| Field | Value |
|---|---|
| **What to Look For** | A load balancer or reverse proxy is configured for traffic distribution, health-check-based routing, and SSL termination. |
| **How to Check** | 1. Look for an nginx config (`nginx.conf`, `default.conf`) with an `upstream` block listing backend instances, or a Kubernetes `Service` / `Ingress` resource. 2. Check for health check endpoints in the load balancer config (e.g., `proxy_pass` to `/health` with failure thresholds). 3. Verify SSL/TLS termination is handled at the load balancer level (certificates configured in nginx or ingress controller), not in the application. 4. If using Docker Compose, check for an nginx or Traefik service that fronts the app containers. 5. Look for rate limiting, request size limits, and timeout configurations at the proxy layer. 6. In Kubernetes, verify `readinessProbe` and `livenessProbe` are defined on the application deployment. |
| **Pass** | Load balancer/reverse proxy configured with health checks, SSL termination, and sensible timeouts; K8s probes defined if applicable. |
| **Partial** | Reverse proxy exists but lacks health checks or uses a basic config without rate limiting or timeouts. |
| **Fail** | No load balancer or reverse proxy; application serves traffic directly on its own port with no health check routing. |
| **Severity** | medium |
| **Tech Triggers** | [nginx, docker, kubernetes] |

---

## Adaptability

### FLX-010: Feature Flags

| Field | Value |
|---|---|
| **What to Look For** | A feature flag mechanism that allows toggling features on/off without code deployments — either a dedicated service (LaunchDarkly, Unleash, Flagsmith) or a config-driven approach. |
| **How to Check** | 1. Search the codebase for feature flag patterns: `is_feature_enabled(...)`, `feature_flags.get(...)`, `if settings.FEATURE_X_ENABLED`, `process.env.FEATURE_*`. 2. Check if there's a centralized feature flag config file or service integration. 3. Verify flags have clear naming conventions and are documented (what each flag controls, default state, planned removal date). 4. Look for stale flags — flags that have been permanently `True` or `False` for a long time and should be cleaned up. 5. If no formal system exists, check if environment variables are used as a lightweight flagging mechanism. |
| **Pass** | Feature flags exist (library, service, or env-var-based); flags are documented with clear purpose; mechanism allows toggling without redeployment. |
| **Partial** | Some feature toggles exist via environment variables but they're undocumented and inconsistently used. |
| **Fail** | No feature flag mechanism; every feature change requires a code deployment with no ability to toggle. |
| **Severity** | low |
| **Tech Triggers** | [universal] |

---

### FLX-011: Plugin/Extension Architecture

| Field | Value |
|---|---|
| **What to Look For** | The system supports extending functionality through plugins, middleware chains, event hooks, or modular extension points without modifying core code. |
| **How to Check** | 1. Look for middleware registration patterns: Express `app.use()`, Django `MIDDLEWARE`, FastAPI middleware, NestJS interceptors/guards. 2. Check for event/hook systems: event emitters, signal dispatchers (`django.dispatch`), webhook handlers, or lifecycle hooks. 3. Look for plugin loading mechanisms: dynamic imports, entry points, or a plugin registry. 4. Verify the core business logic is decoupled from integrations — e.g., notification sending is behind an interface so you can swap email for Slack without touching business code. 5. Check for dependency injection (DI) patterns or service containers that allow swapping implementations. |
| **Pass** | System uses middleware, event hooks, or DI patterns; integrations are decoupled from core logic; new functionality can be added without modifying existing code. |
| **Partial** | Some middleware or hooks exist but core logic is partially coupled to specific integrations. |
| **Fail** | Monolithic design with no extension points; adding any integration requires modifying core business logic. |
| **Severity** | low |
| **Tech Triggers** | [universal] |

---

### FLX-012: API Contract Stability

| Field | Value |
|---|---|
| **What to Look For** | API schemas are explicitly defined (OpenAPI, GraphQL schema, Protobuf) enabling contract-based development and backward-compatible evolution. |
| **How to Check** | 1. Look for API schema files: `openapi.yaml`/`openapi.json`, `schema.graphql`, `*.proto` files. 2. If using a framework with auto-generated docs (FastAPI, NestJS Swagger, Django REST framework), verify the docs are accessible and accurate. 3. Check for API versioning strategy: URL-based (`/api/v1/`), header-based (`Accept: application/vnd.api+json;version=1`), or query param-based. 4. Look for breaking change protections — deprecation notices on old endpoints, migration guides, or sunset headers. 5. Verify request/response types are validated against the schema (e.g., Pydantic models, Zod schemas, DTO classes). |
| **Pass** | API schema defined and up to date; versioning strategy in place; request/response validated against schema; deprecation process documented. |
| **Partial** | Schema exists but is partially outdated; versioning is informal; some endpoints lack validation. |
| **Fail** | No API schema; no versioning; endpoints accept and return unvalidated data. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

## Installability & Replaceability

### FLX-013: Setup Documentation

| Field | Value |
|---|---|
| **What to Look For** | A README or setup guide that gets a new developer from zero to running in under 15 minutes, ideally with a single command. |
| **How to Check** | 1. Open the `README.md` and look for a "Getting Started", "Setup", or "Development" section. 2. Verify it includes: prerequisites (runtime versions, tools), clone/install commands, environment setup (copy `.env.example`), and a single start command (`make dev`, `docker compose up`, `npm run dev`). 3. Check that the instructions are up to date — do the referenced files/commands actually exist in the repo? 4. Look for a `Makefile`, `justfile`, or `scripts/` directory that wraps common workflows. 5. Verify troubleshooting tips for common setup issues are included or linked. 6. If the project has multiple services, check that there's a clear guide for running the full stack locally. |
| **Pass** | README has clear, step-by-step setup instructions; a one-command start option exists; instructions reference files that actually exist in the repo; common issues documented. |
| **Partial** | Setup instructions exist but are outdated, incomplete, or require tribal knowledge to fill in the gaps. |
| **Fail** | No setup documentation; README is a stub or missing; new developers must reverse-engineer how to run the project. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### FLX-014: Dependency Abstraction

| Field | Value |
|---|---|
| **What to Look For** | External services and third-party dependencies are accessed through abstraction layers (interfaces, adapters, wrappers) so they can be replaced without rewriting business logic. |
| **How to Check** | 1. Identify external service integrations: payment gateways, email providers, storage services, LLM APIs. 2. Check if they are accessed directly (e.g., `import boto3; s3.upload_file(...)` scattered throughout) or through an abstraction (e.g., `storage_service.upload(file)` with a `StorageService` interface). 3. Look for the adapter/repository pattern: interfaces defined in the domain layer, implementations in an infrastructure layer. 4. Check if tests mock external services at the interface boundary (good) or monkey-patch SDK internals (bad — indicates tight coupling). 5. Verify that swapping a dependency (e.g., S3 → Azure Blob) would require changes in one place (the adapter), not across the codebase. |
| **Pass** | External services accessed through abstraction layers; swapping a dependency requires changing one adapter, not business logic; tests mock at the interface level. |
| **Partial** | Some abstractions exist but certain external services are called directly from business logic; tests partially mock SDK internals. |
| **Fail** | External SDKs called directly throughout the codebase; no abstraction layer; changing a provider requires a codebase-wide refactor. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### FLX-015: Infrastructure as Code

| Field | Value |
|---|---|
| **What to Look For** | Infrastructure is defined declaratively using IaC tools (Terraform, Pulumi, CloudFormation, CDK) rather than manually provisioned through console UIs. |
| **How to Check** | 1. Look for IaC directories: `terraform/`, `infra/`, `infrastructure/`, `cdk/`, `pulumi/`. 2. Check for IaC files: `*.tf`, `template.yaml` (CloudFormation), `Pulumi.yaml`, `cdk.json`. 3. Verify the IaC covers the actual deployed infrastructure — not just a partial subset. Check for compute, database, networking, DNS, and IAM definitions. 4. Look for state management: Terraform remote backend config (`backend "s3"`), Pulumi state config. 5. Check for environment separation in IaC (e.g., `environments/dev/`, `environments/prod/` or workspace-based isolation). 6. Verify that IaC changes go through code review (check for IaC files in PR history). |
| **Pass** | IaC covers all deployed infrastructure; state is managed remotely; environment separation exists; IaC changes are code-reviewed. |
| **Partial** | IaC exists but covers only part of the infrastructure; some resources were provisioned manually or state is stored locally. |
| **Fail** | No IaC; infrastructure is provisioned and managed entirely through cloud provider consoles or ad-hoc scripts. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### FLX-016: CI/CD Pipeline Portability

| Field | Value |
|---|---|
| **What to Look For** | CI/CD pipeline is well-documented and structured so that migrating to a different CI provider (GitHub Actions → GitLab CI, or vice versa) is feasible without rewriting everything. |
| **How to Check** | 1. Locate the CI/CD config: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `bitbucket-pipelines.yml`. 2. Check if build and deploy logic lives in the CI config itself (bad — vendor lock-in) or in portable scripts (`Makefile`, `scripts/build.sh`, `package.json` scripts) that the CI just invokes (good). 3. Verify that CI steps are documented — what each job does, required secrets, deployment targets. 4. Look for CI-specific features that create lock-in: GitHub Actions marketplace actions that have no equivalent elsewhere, or heavy use of provider-specific caching. 5. Check if the pipeline can be run locally for debugging (e.g., `act` for GitHub Actions, `gitlab-runner exec`). |
| **Pass** | Build/deploy logic in portable scripts; CI config is a thin orchestration layer; pipeline is documented; local execution possible. |
| **Partial** | Some logic is in portable scripts but key steps are embedded in CI-specific syntax; documentation is sparse. |
| **Fail** | All build and deploy logic lives inside CI-specific configuration with no portable scripts; undocumented; impossible to run locally. |
| **Severity** | low |
| **Tech Triggers** | [github_actions, gitlab_ci, any_ci_cd] |

---

## AI/ML Flexibility

### FLX-017: LLM Provider Abstraction

| Field | Value |
|---|---|
| **What to Look For** | LLM API calls are abstracted behind an interface so the application can swap between providers (OpenAI, Anthropic, local models) without changing business logic. |
| **How to Check** | 1. Search for direct LLM SDK usage: `openai.ChatCompletion.create`, `client.chat.completions.create`, `anthropic.messages.create`. Note how many call sites exist. 2. Check if there's an abstraction layer: a `LLMService`, `AIClient`, or similar wrapper that encapsulates provider-specific logic. 3. If using LangChain, LiteLLM, or similar frameworks, verify the provider is configurable (not hardcoded to `gpt-4`). 4. Look for a configuration option to select the LLM provider and model (e.g., `LLM_PROVIDER=openai`, `LLM_MODEL=gpt-4o`). 5. Check if prompt templates are stored separately from provider-specific code. 6. Verify that switching providers requires changing configuration, not code. |
| **Pass** | LLM calls go through an abstraction layer or multi-provider framework; provider and model are configurable via environment; prompt templates are decoupled from provider code. |
| **Partial** | An abstraction exists but only supports one provider; or LiteLLM/LangChain is used but the model is hardcoded in multiple places. |
| **Fail** | Direct SDK calls scattered throughout the codebase; provider and model names hardcoded; switching requires a multi-file refactor. |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, langchain, any_ai_ml] |

---

### FLX-018: Model Configuration Flexibility

| Field | Value |
|---|---|
| **What to Look For** | LLM parameters (model name, temperature, max_tokens, top_p, system prompts) are configurable through environment variables or config files, not hardcoded in source. |
| **How to Check** | 1. Search for hardcoded model parameters: `temperature=0.7`, `max_tokens=4096`, `model="gpt-4"` directly in function calls. 2. Check if these values come from a config module, environment variables, or a settings file (e.g., `settings.LLM_TEMPERATURE`, `process.env.MODEL_NAME`). 3. Verify that system prompts and prompt templates are stored in separate files or a prompt management system, not inline in Python/JS/TS code. 4. Look for per-use-case configuration — different tasks may need different models or temperatures (e.g., classification uses `temperature=0`, creative generation uses `temperature=0.9`). 5. Check that model config changes don't require a code deployment — a config change or env var update should suffice. |
| **Pass** | Model name, temperature, max_tokens, and prompts are all configurable via environment or config; different use cases can have different parameters; no hardcoded values in business logic. |
| **Partial** | Some parameters are configurable but others (e.g., temperature, system prompt) are hardcoded; or configuration exists but only for one model across all use cases. |
| **Fail** | Model parameters and prompts are hardcoded throughout the codebase; changing any LLM setting requires code changes and redeployment. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |
