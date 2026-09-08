---
domain_id: compatibility
domain_name: Compatibility
check_prefix: CMP

iso:
  quality_characteristic: Compatibility
  sub_characteristics:
    - co_existence
    - interoperability
  grounding_standards:
    - id: "ISO/IEC 25023"
      focus: "Compatibility measurement — interoperability, co-existence metrics"

applicability:
  always_include: false
  triggers:
    - any_api
    - any_web_framework
    - any_message_broker
    - any_database
    - docker
    - kubernetes
  description: "Active for layers with APIs, integrations, or shared infrastructure"

scope: per-layer
---

# Compatibility

Compatibility covers the degree to which a product, system, or component can
exchange information with other products, systems, or components, and/or
perform its required functions while sharing the same hardware or software
environment. This domain maps to ISO 25010 sub-characteristics: co-existence
and interoperability.

---

## API Interoperability

Checks for API design standards, versioning, and cross-service communication
patterns. APIs that are well-documented and consistently formatted reduce
integration friction and prevent breaking changes from cascading across
consumers.

---

### CMP-001: API Schema Documentation

| Field | Value |
|---|---|
| **What to Look For** | A machine-readable API schema (OpenAPI/Swagger, GraphQL SDL, AsyncAPI, gRPC proto) that documents all public endpoints, request/response shapes, and status codes. |
| **How to Check** | 1. Search for OpenAPI/Swagger spec files: `find . -name 'openapi.*' -o -name 'swagger.*' -o -name '*.openapi.yml' -o -name '*.openapi.yaml' -o -name '*.openapi.json'`. 2. Search for GraphQL schema: `find . -name 'schema.graphql' -o -name '*.graphql' -o -name 'schema.gql'`. Check for `typeDefs` or `buildSchema` in source: `grep -rn 'typeDefs\|buildSchema\|makeExecutableSchema' --include='*.js' --include='*.ts' --include='*.py' .` 3. For gRPC: search for `.proto` files: `find . -name '*.proto'`. 4. For AsyncAPI (message brokers): `find . -name 'asyncapi.*'`. 5. For Django REST Framework: check for `drf-spectacular` or `drf-yasg` in dependencies — these auto-generate OpenAPI. `grep -r 'spectacular\|yasg\|swagger' requirements*.txt pyproject.toml setup.cfg Pipfile`. 6. For FastAPI: the spec is generated automatically at `/docs` — verify the app imports `FastAPI` and has route decorators with response models. 7. Verify the schema covers all routes — compare route definitions in code against endpoints listed in the spec. |
| **Pass** | A machine-readable API schema exists, covers all public endpoints, includes request/response models, and is kept in sync with the codebase (via auto-generation or CI validation). |
| **Partial** | A schema file exists but is incomplete (missing endpoints or response models), or is manually maintained with no CI check for drift. |
| **Fail** | No machine-readable API documentation exists. Consumers have no spec to code against. |
| **Severity** | high |
| **Tech Triggers** | [any_api] |

---

### CMP-002: API Versioning

| Field | Value |
|---|---|
| **What to Look For** | A clear API versioning strategy — version in URL path (`/api/v1/`), custom header (`API-Version`), or content-type versioning (`application/vnd.app.v1+json`). A documented deprecation policy for old versions. |
| **How to Check** | 1. Search URL routing for version prefixes: `grep -rn '/api/v[0-9]\|/v[0-9]/' --include='*.py' --include='*.js' --include='*.ts' --include='*.yaml' --include='*.yml' .` 2. For Django REST Framework: search for `DEFAULT_VERSIONING_CLASS` in settings: `grep -rn 'VERSIONING_CLASS\|versioning' --include='*.py' .` 3. For Express/Fastify: check route registration for versioned routers: `grep -rn "router.*v[0-9]\|app\.use.*v[0-9]" --include='*.js' --include='*.ts' .` 4. For API Gateway configs (nginx, Kong, AWS API Gateway): search for version routing rules. 5. Check for deprecation documentation: look for `CHANGELOG.md`, `MIGRATION.md`, or deprecation headers in middleware (`Sunset`, `Deprecation`). 6. Verify that at least one version segment is present in the base URL or that a versioning middleware is registered. |
| **Pass** | URLs or headers include a version identifier; a deprecation strategy is documented; old versions have sunset dates or redirect notices. |
| **Partial** | Version is present in URLs but no deprecation strategy or migration guide exists. |
| **Fail** | No versioning strategy is present — endpoints are unversioned with no plan for backwards-compatible evolution. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

### CMP-003: Standard Response Format

| Field | Value |
|---|---|
| **What to Look For** | Consistent JSON response envelope across all endpoints — uniform status codes, error format (code + message + optional details), and pagination structure. |
| **How to Check** | 1. Inspect API route handlers for response structure: `grep -rn 'JsonResponse\|jsonify\|Response(\|res\.json\|res\.status' --include='*.py' --include='*.js' --include='*.ts' .` — sample 5–10 endpoints and compare their response shapes. 2. Check for a shared response utility or serializer: `grep -rn 'ApiResponse\|BaseResponse\|success_response\|error_response\|ResponseSchema' --include='*.py' --include='*.js' --include='*.ts' .` 3. For DRF: check if a custom renderer or exception handler standardizes output: `grep -rn 'EXCEPTION_HANDLER\|DEFAULT_RENDERER' --include='*.py' .` 4. For error responses: verify a consistent structure is used (e.g., `{ "error": { "code": "...", "message": "..." } }`). Search for custom exception handlers. 5. For paginated endpoints: verify a shared pagination format (e.g., `{ "results": [], "count": N, "next": "..." }`). 6. Compare at least 3 different route files to confirm the format is consistent across modules. |
| **Pass** | All endpoints use a shared response envelope; errors follow a uniform format with machine-readable codes; pagination is consistent across list endpoints. |
| **Partial** | Most endpoints share a format but some modules return ad-hoc structures, or error format varies between modules. |
| **Fail** | No consistent response structure — every endpoint returns a different shape. Consumers cannot write generic parsing logic. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

### CMP-004: Content Negotiation

| Field | Value |
|---|---|
| **What to Look For** | Proper handling of `Accept` request headers and `Content-Type` response headers. API should return the format the client requests (or 406 Not Acceptable) and always declare its own `Content-Type`. |
| **How to Check** | 1. Check if the framework sets `Content-Type` automatically (most do): for DRF, verify `DEFAULT_RENDERER_CLASSES` includes `JSONRenderer`. For Express: check if `res.json()` is used (auto-sets header). 2. Search for explicit `Content-Type` header setting: `grep -rn 'Content-Type\|content_type\|contentType' --include='*.py' --include='*.js' --include='*.ts' .` 3. For APIs that support multiple formats (JSON + XML/CSV): verify `Accept` header parsing — `grep -rn 'Accept\|content_negotiation\|accepts(' --include='*.py' --include='*.js' --include='*.ts' .` 4. Check for 406 Not Acceptable responses: `grep -rn '406\|NotAcceptable' --include='*.py' --include='*.js' --include='*.ts' .` 5. For file download endpoints: verify correct `Content-Type` and `Content-Disposition` headers are set. |
| **Pass** | All responses include correct `Content-Type` headers; multi-format APIs handle `Accept` negotiation or return 406; file downloads use proper MIME types. |
| **Partial** | `Content-Type` is set on most responses but some endpoints omit it, or multi-format support is incomplete. |
| **Fail** | Responses lack `Content-Type` headers, or the API sends JSON with `text/html` content type, or `Accept` headers are completely ignored. |
| **Severity** | low |
| **Tech Triggers** | [any_api] |

---

### CMP-005: CORS Configuration

| Field | Value |
|---|---|
| **What to Look For** | Cross-Origin Resource Sharing configured to allow required client origins while blocking unauthorized ones. Proper handling of preflight OPTIONS requests. Credentials mode set correctly. |
| **How to Check** | 1. For Django: `grep -rn 'CORS_ALLOWED_ORIGINS\|CORS_ALLOW_ALL_ORIGINS\|CORS_ORIGIN_WHITELIST\|CORS_ALLOW_CREDENTIALS\|CORS_ALLOW_HEADERS' --include='*.py' .` Check for `django-cors-headers` in dependencies. 2. For FastAPI: `grep -rn 'CORSMiddleware\|allow_origins\|allow_credentials\|allow_methods' --include='*.py' .` Inspect whether `allow_origins=["*"]` is guarded by environment. 3. For Express: `grep -rn "cors(\|origin:" --include='*.js' --include='*.ts' .` Check if wildcard `*` is used in production. 4. Verify preflight handling: search for explicit OPTIONS route handlers or confirm framework middleware handles them. 5. Check that `Access-Control-Allow-Credentials: true` is NOT combined with `Access-Control-Allow-Origin: *` (browser security violation). 6. For Nginx proxy: `grep -rn 'Access-Control-Allow-Origin\|add_header.*Origin' nginx/ conf/`. 7. Confirm configuration differs between dev (permissive) and production (explicit origins). |
| **Pass** | CORS allows specific origins in production; preflight is handled; credentials mode and allowed headers are explicitly configured. |
| **Partial** | CORS is configured but uses overly broad patterns, or production and dev share the same permissive config. |
| **Fail** | `allow_origins=["*"]` in production with no environment guard, or CORS is not configured at all (blocking legitimate cross-origin clients). |
| **Severity** | medium |
| **Tech Triggers** | [any_api, any_web_framework] |

---

## Data Interoperability

Checks for data format standards, encoding, and timezone handling. Inconsistent
data representation is one of the most common sources of integration bugs,
especially in multi-service or multi-timezone environments.

---

### CMP-006: Standard Data Formats

| Field | Value |
|---|---|
| **What to Look For** | Consistent use of standard data formats: ISO 8601 for dates/timestamps, UTF-8 encoding for text, and a consistent naming convention (camelCase or snake_case — not mixed) across API payloads. |
| **How to Check** | 1. For date formatting: search serializers and response builders for date format strings: `grep -rn 'strftime\|isoformat\|DateTimeFormat\|toISOString\|date_format\|DATETIME_FORMAT' --include='*.py' --include='*.js' --include='*.ts' .` Verify ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`). 2. For DRF: check `REST_FRAMEWORK` settings for `DATETIME_FORMAT` and `DATE_FORMAT`: `grep -rn 'DATETIME_FORMAT\|DATE_FORMAT' --include='*.py' .` 3. For naming convention: sample 5+ API responses or serializers. Check if field names are consistently camelCase or snake_case: `grep -rn 'class.*Serializer\|router\.\|app\.get\|app\.post' --include='*.py' --include='*.js' --include='*.ts' .` 4. For DRF: check for `COERCE_DECIMAL_TO_STRING` and camelCase converter (`djangorestframework-camel-case`). 5. Verify numeric IDs vs UUIDs are used consistently across endpoints. 6. Check that enum values use a consistent format (UPPER_SNAKE, lowercase, etc.). |
| **Pass** | Dates use ISO 8601; field naming is consistent across all endpoints; encoding is UTF-8; enums and identifiers follow a stated convention. |
| **Partial** | Most data follows standards but some endpoints use non-ISO date formats or mix naming conventions. |
| **Fail** | Dates are returned in non-standard formats (e.g., Unix timestamps mixed with strings), or field naming is inconsistent (camelCase in one endpoint, snake_case in another). |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

### CMP-007: Database Character Encoding

| Field | Value |
|---|---|
| **What to Look For** | Database and tables are configured for UTF-8 encoding to support internationalization. For MySQL, this means `utf8mb4` (not `utf8` which only supports 3-byte chars). For PostgreSQL, `UTF8` encoding. |
| **How to Check** | 1. For MySQL in Docker: check `docker-compose.yml` or `my.cnf` for charset config: `grep -rn 'character-set-server\|collation-server\|utf8mb4\|charset' docker-compose*.yml my.cnf .docker/`. 2. For PostgreSQL: check database creation scripts or Docker env vars for encoding: `grep -rn 'ENCODING\|LC_COLLATE\|POSTGRES_INITDB_ARGS.*encoding\|template0' --include='*.sql' --include='*.yml' --include='*.yaml' .` 3. For Django: check `DATABASES` config for charset options: `grep -rn "charset\|OPTIONS.*utf8" --include='*.py' .` 4. For SQLAlchemy: check connection string for charset param: `grep -rn 'charset=utf8mb4\|charset=utf8\|encoding' --include='*.py' .` 5. For migration files: check if any `CREATE TABLE` statements specify charset: `grep -rn 'CHARACTER SET\|COLLATE\|CHARSET' --include='*.sql' --include='*.py' .` 6. Check for `utf8` vs `utf8mb4` in MySQL configs — `utf8` is a red flag as it truncates 4-byte characters (emoji, some CJK). |
| **Pass** | Database is configured with full UTF-8 support (`utf8mb4` for MySQL, `UTF8` for PostgreSQL); connection strings include charset; collation is appropriate for the target locale. |
| **Partial** | Database uses UTF-8 but connection strings don't explicitly set charset, or MySQL uses `utf8` instead of `utf8mb4`. |
| **Fail** | No encoding configuration found, or database uses a non-UTF-8 encoding (e.g., `latin1`). |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

### CMP-008: Timezone Handling

| Field | Value |
|---|---|
| **What to Look For** | All datetime values are stored and transmitted in UTC. Application code uses timezone-aware datetime objects. Display-layer conversion to local time happens only at the presentation boundary. |
| **How to Check** | 1. For Django: check `settings.py` for `USE_TZ = True` and `TIME_ZONE = 'UTC'`: `grep -rn 'USE_TZ\|TIME_ZONE' --include='*.py' .` 2. For Python: search for naive datetime usage: `grep -rn 'datetime\.now()\|datetime\.utcnow()' --include='*.py' .` — `datetime.now()` without a tz argument and `datetime.utcnow()` (deprecated in 3.12) are red flags. Prefer `datetime.now(tz=timezone.utc)`. 3. For Node.js: search for `new Date()` usage and verify timezone handling: `grep -rn 'new Date(\|Date\.now\|moment(\|dayjs(' --include='*.js' --include='*.ts' .` Check if a timezone library (moment-timezone, luxon, dayjs with UTC plugin) is used. 4. For database: check if timestamp columns use `TIMESTAMP WITH TIME ZONE` (PostgreSQL) or are documented as UTC. 5. For API responses: verify datetime fields include timezone offset or `Z` suffix (ISO 8601 with TZ). 6. Search for hardcoded timezone strings: `grep -rn "timezone\|America/\|Europe/\|Asia/" --include='*.py' --include='*.js' --include='*.ts' .` — these should only appear in presentation-layer code. |
| **Pass** | `USE_TZ = True` (Django) or equivalent is set; all datetime values are stored/transmitted in UTC with timezone info; naive datetime constructors are not used for business logic. |
| **Partial** | UTC is used for storage but some code paths create naive datetimes, or API responses omit the timezone offset. |
| **Fail** | `USE_TZ = False` or no timezone awareness; datetimes are stored in local time; API responses use naive datetime strings. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

## Service Co-existence

Checks for shared infrastructure isolation, port management, and resource
namespacing. When multiple services share the same host, cluster, or backing
stores, proper co-existence prevents one service from disrupting another.

---

### CMP-009: Port Conflict Prevention

| Field | Value |
|---|---|
| **What to Look For** | Docker Compose or orchestration configs that avoid hardcoded port collisions. Service ports should be configurable through environment variables so multiple stacks can coexist on the same host. |
| **How to Check** | 1. Parse `docker-compose*.yml` for port mappings: `grep -rn 'ports:' -A 5 docker-compose*.yml` — list all host:container port pairs. 2. Check for duplicate host ports: extract all host ports and verify no duplicates exist across services. 3. Verify ports are configurable: check if port values reference environment variables (`${PORT:-8000}`) rather than hardcoded numbers: `grep -rn '\${.*PORT\|:-[0-9]' docker-compose*.yml`. 4. For Kubernetes: check `Service` and `Deployment` manifests for `containerPort` and `nodePort` values — verify no conflicts within the namespace. 5. Check `.env` or `.env.example` for port variable documentation. 6. For non-Docker setups: check if the application reads its listen port from env (`PORT`, `APP_PORT`, etc.): `grep -rn 'PORT\|listen(' --include='*.py' --include='*.js' --include='*.ts' .` |
| **Pass** | All service ports are configurable via environment variables; Docker Compose has no hardcoded port collisions; `.env.example` documents port variables. |
| **Partial** | No port collisions exist but ports are hardcoded in Compose files rather than parameterized. |
| **Fail** | Multiple services map to the same host port, or critical service ports are hardcoded with no override mechanism. |
| **Severity** | medium |
| **Tech Triggers** | [docker] |

---

### CMP-010: Shared Resource Management

| Field | Value |
|---|---|
| **What to Look For** | Proper namespace isolation in shared backing services — key prefixes in Redis, schema or database separation in SQL, collection prefixes in MongoDB, and queue name prefixes in message brokers. |
| **How to Check** | 1. For Redis: search for key prefix configuration: `grep -rn 'KEY_PREFIX\|CACHE_KEY_PREFIX\|REDIS_PREFIX\|key_prefix\|namespace' --include='*.py' --include='*.js' --include='*.ts' --include='*.yml' .` 2. For Django cache: check `CACHES` config for `KEY_PREFIX`: `grep -rn 'KEY_PREFIX\|LOCATION.*redis' --include='*.py' .` 3. For Celery: check `CELERY_DEFAULT_QUEUE` and `task_default_queue` — verify queue names are project-specific, not generic like `default`: `grep -rn 'default_queue\|CELERY_DEFAULT_QUEUE\|task_routes' --include='*.py' .` 4. For shared databases: check if services use separate schemas or at minimum, table name prefixes: `grep -rn 'db_table\|tableName\|table_prefix' --include='*.py' --include='*.js' --include='*.ts' .` 5. For Docker Compose shared services: verify Redis/PostgreSQL instances are either dedicated per service or use namespace separation: inspect `docker-compose*.yml` for shared `depends_on` targets. 6. For MongoDB: check for database-per-service or collection prefix patterns. |
| **Pass** | Shared Redis uses key prefixes; shared databases use separate schemas or prefixed tables; message queues use project-specific names; isolation strategy is documented. |
| **Partial** | Some shared resources are namespaced but others use generic keys or default queue names. |
| **Fail** | Multiple services share Redis/database/queues with no namespace isolation — data collision risk is present. |
| **Severity** | medium |
| **Tech Triggers** | [redis, any_database] |

---

### CMP-011: Message Queue Compatibility

| Field | Value |
|---|---|
| **What to Look For** | Standard message serialization formats across producers and consumers. Version-tolerant message schemas. Dead-letter queue configuration for failed messages. |
| **How to Check** | 1. For Celery: check serializer config: `grep -rn 'task_serializer\|accept_content\|result_serializer\|CELERY_TASK_SERIALIZER' --include='*.py' .` Verify JSON is used (not pickle, which is a security and compatibility risk). 2. For RabbitMQ: search for queue declarations and check message content types: `grep -rn 'channel\.\|queue_declare\|basic_publish\|content_type' --include='*.py' --include='*.js' --include='*.ts' .` 3. For Kafka: check producer/consumer serialization config (e.g., `value_serializer`, `key_serializer`): `grep -rn 'serializer\|deserializer\|KafkaProducer\|KafkaConsumer' --include='*.py' --include='*.js' --include='*.ts' .` 4. Check for dead-letter queue configuration: `grep -rn 'dead.letter\|dlq\|DLQ\|dead_letter\|task_reject_on_worker_lost' --include='*.py' --include='*.yml' --include='*.yaml' .` 5. For message versioning: search for schema version fields in message payloads or schema registry usage. 6. Verify that producer and consumer serialization settings match — mismatched serializers cause silent data corruption. |
| **Pass** | All services use the same serialization format (JSON preferred); dead-letter queues are configured; message schemas are versioned or documented. |
| **Partial** | Serialization is consistent but dead-letter queues are not configured, or message schemas lack versioning. |
| **Fail** | Services use mismatched serialization formats (e.g., pickle producer, JSON consumer), or no dead-letter handling exists for failed messages. |
| **Severity** | medium |
| **Tech Triggers** | [celery, rabbitmq, any_message_broker] |

---

## Browser / Client Compatibility

Checks for frontend build targets and graceful degradation. These ensure the
application works across the range of browsers and devices your users actually
have, and degrades gracefully when features are unsupported.

---

### CMP-012: Browser Support Policy

| Field | Value |
|---|---|
| **What to Look For** | An explicit browser support policy via `browserslist` configuration (`.browserslistrc`, `browserslist` key in `package.json`, or environment variable). Build tools should target the declared browser set. |
| **How to Check** | 1. Check for `.browserslistrc` file: `find . -name '.browserslistrc'`. 2. Check `package.json` for `browserslist` key: `grep -n 'browserslist' package.json`. 3. Check for Babel target config: `grep -rn 'targets\|@babel/preset-env' babel.config.* .babelrc package.json`. 4. For Vite: check `build.target` in `vite.config.*`: `grep -rn 'target\|build:' vite.config.*`. 5. For Next.js: check if `browsersListForSwc` is configured in `next.config.*`. 6. For webpack: check `target` in webpack config files. 7. Verify the browserslist query is reasonable — not overly broad (e.g., `> 0%`) or too narrow (e.g., `last 1 Chrome version` in a public-facing app). 8. Run `npx browserslist` (if `package.json` exists) to see resolved browser targets. |
| **Pass** | A browserslist config exists and targets a reasonable set of browsers matching the user base; build tools are configured to transpile/polyfill accordingly. |
| **Partial** | Build tools target specific browsers but there's no explicit browserslist config, or the config is overly broad/narrow. |
| **Fail** | No browser support policy is defined; build tools use default targets with no consideration for the actual user base. |
| **Severity** | low |
| **Tech Triggers** | [react, vue, angular, nextjs, vite, webpack] |

---

### CMP-013: Progressive Enhancement

| Field | Value |
|---|---|
| **What to Look For** | Graceful degradation when JavaScript is disabled, browser features are unsupported, or network conditions are poor. Critical content should be accessible without JavaScript where feasible. Loading and error states should be handled. |
| **How to Check** | 1. For Next.js/Nuxt (SSR frameworks): verify server-side rendering is enabled — check for `getServerSideProps`, `getStaticProps` (Next.js) or `asyncData`, `useFetch` (Nuxt). SSR provides a baseline HTML fallback. 2. Check for `<noscript>` tags in HTML templates: `grep -rn '<noscript>' --include='*.html' --include='*.jsx' --include='*.tsx' --include='*.vue' .` 3. Search for feature detection before use: `grep -rn 'typeof window\|navigator\.\|window\.\|supports(' --include='*.js' --include='*.ts' --include='*.jsx' --include='*.tsx' .` — verify browser APIs are checked before use. 4. Check for loading states: `grep -rn 'loading\|isLoading\|skeleton\|spinner\|Suspense\|fallback' --include='*.jsx' --include='*.tsx' --include='*.vue' .` 5. Check for error boundaries (React): `grep -rn 'ErrorBoundary\|componentDidCatch\|getDerivedStateFromError' --include='*.jsx' --include='*.tsx' .` 6. For SPAs: check if a meaningful fallback is rendered before JavaScript loads (not just a blank `<div id="root">`). |
| **Pass** | SSR provides baseline HTML; `<noscript>` fallbacks exist; browser feature detection is used before API access; loading and error states are handled throughout the UI. |
| **Partial** | Loading states and error boundaries exist but no `<noscript>` fallback, or SSR is available but not used for critical pages. |
| **Fail** | The app renders a blank page without JavaScript; no error boundaries or loading states; browser APIs are called without feature detection. |
| **Severity** | low |
| **Tech Triggers** | [react, vue, angular, nextjs, any_web_framework] |

---

## Cross-Service Integration

Checks for integration resilience, backwards compatibility, and contract
testing. These verify that services can evolve independently without breaking
each other — the foundation of sustainable microservice and API-driven
architectures.

---

### CMP-014: Service Health Dependency Checks

| Field | Value |
|---|---|
| **What to Look For** | Health check endpoints that verify connectivity to dependent services (database, cache, message broker, external APIs) — not just "I'm alive" but "I can reach everything I need." |
| **How to Check** | 1. Search for health check endpoints: `grep -rn 'health\|healthz\|readiness\|liveness\|ready\|alive\|status' --include='*.py' --include='*.js' --include='*.ts' --include='*.yml' --include='*.yaml' .` 2. Inspect the health endpoint implementation: verify it checks dependent services (database connection, Redis ping, external API reachability), not just returns 200. 3. For Django: check for `django-health-check` in dependencies: `grep -r 'django-health-check\|health_check' requirements*.txt pyproject.toml setup.cfg`. 4. For Docker/Kubernetes: check health check configs: `grep -rn 'healthcheck\|livenessProbe\|readinessProbe' docker-compose*.yml k8s/ kubernetes/ charts/ --include='*.yml' --include='*.yaml'`. 5. Verify readiness probes are separate from liveness probes in Kubernetes — readiness should check dependencies, liveness should check the process itself. 6. Check that health endpoints return structured status per dependency (e.g., `{ "db": "ok", "redis": "ok", "broker": "degraded" }`), not just a blanket 200/500. |
| **Pass** | Health endpoint exists and checks all critical dependencies individually; Kubernetes readiness and liveness probes are correctly configured; response includes per-dependency status. |
| **Partial** | Health endpoint exists but only checks the application itself (not dependencies), or probes are configured but point to a generic endpoint. |
| **Fail** | No health check endpoint exists, or the endpoint always returns 200 regardless of dependency status. |
| **Severity** | medium |
| **Tech Triggers** | [any_api, docker] |

---

### CMP-015: Backwards Compatibility

| Field | Value |
|---|---|
| **What to Look For** | API changes that don't break existing consumers — additive-only field additions, no removal of existing fields, no type changes on existing fields. Database migrations that are backwards-compatible (no destructive column drops in the same release as code changes). |
| **How to Check** | 1. Check recent migration files for destructive operations: `grep -rn 'RemoveField\|DropColumn\|drop_column\|DROP COLUMN\|RemoveModel\|DropTable\|DROP TABLE\|AlterField.*type\|RenameField\|RENAME COLUMN' --include='*.py' --include='*.sql' --include='*.ts' --include='*.js' migrations/ alembic/`. 2. If destructive migrations exist: verify they are behind a feature flag or multi-step deployment (add new → migrate data → remove old). 3. For API: compare current API spec against the previous version (if available in git history): `git log --oneline --all -- '*openapi*' '*swagger*'` — then diff the specs. 4. Search for field removal in serializers: `grep -rn 'exclude\|fields.*=' --include='*.py' .` — compare against previous versions. 5. Check for API field deprecation annotations rather than removal: `grep -rn 'deprecated\|Deprecated\|@deprecated' --include='*.py' --include='*.js' --include='*.ts' .` 6. For GraphQL: check for `@deprecated` directive usage on fields before removal. 7. Review the last 10 commits touching API routes or serializers: `git log --oneline -10 -- '*serializer*' '*route*' '*controller*' '*schema*'`. |
| **Pass** | No destructive API changes without versioning; database migrations are additive or use multi-step deployment; deprecated fields are marked before removal. |
| **Partial** | Migrations are mostly safe but one column rename or type change exists without a multi-step plan, or API fields are removed without prior deprecation. |
| **Fail** | Breaking API changes are shipped without versioning; destructive migrations drop columns that active consumers depend on; no deprecation process. |
| **Severity** | high |
| **Tech Triggers** | [any_api, any_database] |

---

### CMP-016: External Service Contract Testing

| Field | Value |
|---|---|
| **What to Look For** | Tests that verify the application's integration with external services still works — contract tests (Pact, Spring Cloud Contract), integration test suites hitting real or mocked external APIs, or API snapshot tests. |
| **How to Check** | 1. Search for contract testing frameworks: `grep -rn 'pact\|Pact\|contract.*test\|ContractTest\|consumer_test\|provider_test' --include='*.py' --include='*.js' --include='*.ts' .` Also check dependencies: `grep -r 'pact\|contract' requirements*.txt pyproject.toml package.json`. 2. Search for integration tests that hit external services: `grep -rn 'integration.*test\|external.*test\|e2e.*test\|api.*test' --include='*.py' --include='*.js' --include='*.ts' -l .` 3. Check for API response mocking/recording: `grep -rn 'VCR\|cassette\|nock\|responses\|httpretty\|wiremock\|msw\|mock_server\|MockServer' --include='*.py' --include='*.js' --include='*.ts' .` 4. For services consumed: check if there are tests that validate the response schema of external APIs (e.g., parsing tests, schema validation with `jsonschema` or `zod`). 5. Check CI pipeline for integration test stages: `grep -rn 'integration\|contract\|e2e' .github/workflows/ .gitlab-ci.yml Jenkinsfile`. 6. For service providers: check if there are tests that verify the API spec matches the implementation (e.g., DRF spectacular's `validate` management command, or Swagger diff tools). |
| **Pass** | Contract tests or integration tests exist for all critical external service dependencies; tests run in CI; API response schemas are validated. |
| **Partial** | Some integration tests exist but don't cover all external dependencies, or tests exist but don't run in CI. |
| **Fail** | No contract or integration tests exist for external service dependencies — breaking changes in upstream services will not be caught until production. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |
