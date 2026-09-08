---
domain_id: performance-efficiency
domain_name: Performance Efficiency
check_prefix: PER

iso:
  quality_characteristic: Performance Efficiency
  sub_characteristics:
    - time_behaviour
    - resource_utilization
    - capacity
  grounding_standards:
    - id: "ISO/IEC 5055:2021"
      focus: "Automated performance efficiency weakness patterns"
    - id: "ISO/IEC 25023"
      focus: "Performance efficiency measurement — response time, throughput, resource usage"

applicability:
  always_include: true
  triggers: []
  description: "Every layer should be checked for performance efficiency"

scope: per-layer
---

# Performance Efficiency

> Degree to which a system meets requirements for time behaviour,
> resource utilization, and capacity under stated conditions.

This domain audits whether the application can serve its users without
unnecessary latency, wasted resources, or capacity limits that bite at
the worst possible time. Checks are organized from universal database
and caching concerns through frontend, API, infrastructure, and AI/ML
optimizations.

---

## Universal Checks

### PER-001: N+1 Query Prevention

| Field | Value |
|---|---|
| **What to Look For** | ORM queries inside loops that fire one SELECT per iteration instead of batching |
| **How to Check** | 1. Search for `for … in queryset` or `for … in Model.objects` patterns (Django) — look for attribute access on related models inside the loop body without `select_related`/`prefetch_related` on the queryset. 2. For SQLAlchemy, grep for `relationship()` definitions and confirm `lazy="select"` is not used on hot-path queries — expect `joinedload`, `subqueryload`, or `selectinload` in the query options. 3. For any ORM, search for database calls (`execute`, `cursor`, `query`) inside loop bodies. 4. Check Django views/serializers: if a queryset feeds a serializer that accesses ForeignKey or ManyToMany fields, confirm `select_related`/`prefetch_related` is applied upstream. |
| **Pass** | All queryset-based loops use eager loading; no ORM calls inside iteration bodies |
| **Partial** | Some loops are optimized but at least one hot path still has N+1 potential |
| **Fail** | Multiple N+1 patterns found in views, serializers, or API handlers |
| **Severity** | high |
| **Tech Triggers** | [django, sqlalchemy, any_database] |

### PER-002: Database Query Optimization

| Field | Value |
|---|---|
| **What to Look For** | Indexes on frequently queried columns, composite indexes for multi-column filters, absence of full table scans on large tables |
| **How to Check** | 1. Open migration files (Django `migrations/`, Alembic `versions/`) and search for `AddIndex`, `index=True`, `Index()`, or `CREATE INDEX` statements. 2. Cross-reference with model fields used in `filter()`, `WHERE`, `ORDER BY`, `GROUP BY` — any field used in these clauses on a non-trivial table should have an index. 3. Check for `select_for_update()` or explicit locking patterns that could cause contention. 4. Look for `EXPLAIN` or query analysis configuration in dev settings. 5. Verify `Meta.indexes` or `Meta.index_together` in Django models, or `__table_args__` indexes in SQLAlchemy. |
| **Pass** | All filter/sort fields on large tables are indexed; composite indexes exist for common multi-column queries |
| **Partial** | Primary key and obvious foreign keys are indexed but secondary filter fields are missing indexes |
| **Fail** | No custom indexes beyond auto-generated PKs; fields used in frequent queries are unindexed |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### PER-003: Caching Strategy

| Field | Value |
|---|---|
| **What to Look For** | A caching layer for expensive or frequently accessed data — Redis, Memcached, or framework-level cache |
| **How to Check** | 1. Check settings/config for cache backend (`CACHES` in Django settings, Redis/Memcached connection in env vars or config files). 2. Search for cache usage patterns: `cache.get`/`cache.set`, `@cache_page`, `@cached_property`, `lru_cache`, `functools.cache`, or framework-specific decorators. 3. Verify cache invalidation strategy — search for `cache.delete`, `cache.clear`, or signal-based invalidation. 4. Check that cache TTLs are set (not infinite by default). 5. For read-heavy endpoints, confirm the response is cached or the underlying query is. |
| **Pass** | Cache backend is configured, actively used for expensive queries and hot data, and invalidation strategy is documented or evident |
| **Partial** | Cache backend is configured but only used in 1–2 places, or no clear invalidation strategy |
| **Fail** | No caching layer configured; every request hits the database directly |
| **Severity** | high |
| **Tech Triggers** | [redis, memcached, any_database] |

### PER-004: Pagination Implementation

| Field | Value |
|---|---|
| **What to Look For** | All list/collection endpoints return paginated results; no unbounded querysets sent to the client |
| **How to Check** | 1. Identify list endpoints (views returning querysets, API viewsets with `list` action, GraphQL list resolvers). 2. Check for pagination class assignment: `pagination_class` in DRF, `LIMIT`/`OFFSET` in raw SQL, cursor-based pagination params. 3. Search for `.all()` or unfiltered querysets returned directly without slicing or pagination. 4. Verify default page size is set and maximum page size is capped (e.g., `max_page_size` in DRF settings). 5. For GraphQL, check that `first`/`last`/`after`/`before` connection args are enforced. |
| **Pass** | All list endpoints enforce pagination with a sensible default and a max page size cap |
| **Partial** | Most endpoints are paginated but at least one list endpoint returns unbounded results |
| **Fail** | No pagination configured; list endpoints can return entire tables |
| **Severity** | medium |
| **Tech Triggers** | [any_api, any_web_framework] |

### PER-005: Async Processing

| Field | Value |
|---|---|
| **What to Look For** | Long-running tasks (email sending, PDF generation, report building, external API calls, file processing) offloaded to async workers instead of running synchronously in request handlers |
| **How to Check** | 1. Search for Celery task definitions (`@shared_task`, `@app.task`, `@celery_app.task`) or equivalent (RQ, Dramatiq, Huey, Bull). 2. Identify potentially slow operations in views/handlers: file uploads, email dispatch (`send_mail`, SMTP calls), PDF/report generation, third-party API calls. 3. Verify these operations use `.delay()`, `.apply_async()`, or equivalent async dispatch — not inline execution. 4. Check for task queue configuration (broker URL, result backend). 5. For FastAPI/async frameworks, verify `async def` endpoints don't call blocking I/O without `run_in_executor` or equivalent. |
| **Pass** | All long-running operations are dispatched to background workers; task queue infrastructure is configured |
| **Partial** | Task queue exists but some slow operations (e.g., email, PDF gen) still run inline in request handlers |
| **Fail** | No background task processing; all operations run synchronously in the request cycle |
| **Severity** | medium |
| **Tech Triggers** | [celery, any_web_framework, any_api] |

### PER-006: Connection Pooling

| Field | Value |
|---|---|
| **What to Look For** | Database and cache connections use pooling with appropriate pool sizes — not a new connection per request |
| **How to Check** | 1. Check database configuration for pooling params: `CONN_MAX_AGE` in Django (should be > 0, not `None` for unlimited), `pool_size`/`max_overflow` in SQLAlchemy, `pgbouncer` configuration. 2. Check Redis connection for pooling: `ConnectionPool`, `redis.ConnectionPool`, `redis.BlockingConnectionPool`, or connection pool settings in Redis client config. 3. For external HTTP APIs, check for `requests.Session()` reuse or `httpx.AsyncClient` with connection pooling instead of one-off `requests.get()` calls. 4. Verify pool sizes are appropriate for the deployment target (not defaulting to 5 connections for a high-traffic app). |
| **Pass** | Database, cache, and HTTP client connections all use pooling with configured sizes |
| **Partial** | Database pooling is configured but Redis or HTTP client connections are not pooled |
| **Fail** | No connection pooling; `CONN_MAX_AGE=0` (Django default) or new connections created per request |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

---

## Frontend / Web Checks

### PER-007: Bundle Size Optimization

| Field | Value |
|---|---|
| **What to Look For** | JavaScript bundle is split, tree-shaken, and lazy-loaded — not a single monolithic bundle |
| **How to Check** | 1. Check bundler config (`vite.config.*`, `webpack.config.*`, `next.config.*`) for code splitting settings — `splitChunks`, dynamic `import()`, `React.lazy()`. 2. Search for lazy-loaded routes: `React.lazy(() => import(...))`, `defineAsyncComponent` (Vue), `loadChildren` (Angular). 3. Check `package.json` for bundle analysis tools (`webpack-bundle-analyzer`, `rollup-plugin-visualizer`). 4. Look for large dependencies imported at the top level that should be lazy-loaded (`moment`, `lodash` full import vs cherry-pick, `chart.js`). 5. Verify `sideEffects: false` in `package.json` for tree-shaking. |
| **Pass** | Routes are lazy-loaded, vendor chunks are split, tree-shaking is enabled, no unnecessarily large top-level imports |
| **Partial** | Some code splitting exists but major routes or heavy libraries are still in the main bundle |
| **Fail** | Single monolithic bundle; no code splitting or lazy loading configured |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, vite, webpack] |

### PER-008: Image Optimization

| Field | Value |
|---|---|
| **What to Look For** | Images use modern formats, are compressed, lazy-loaded below the fold, and sized responsively |
| **How to Check** | 1. Search for `<img>` tags — check for `loading="lazy"`, `srcset`, `sizes` attributes. 2. Look for image optimization pipeline: `next/image`, `vite-plugin-image-optimizer`, `sharp`, or build-time compression. 3. Check for modern formats: `.webp`, `.avif` usage or format conversion in build config. 4. Search for unoptimized patterns: large `.png`/`.jpg` files in `public/` or `static/` directories served as-is. 5. For Next.js, verify `<Image>` component usage instead of raw `<img>`. |
| **Pass** | Images use modern formats with compression, responsive sizing, and lazy loading below the fold |
| **Partial** | Some images are optimized but others are served as uncompressed PNGs/JPEGs without lazy loading |
| **Fail** | No image optimization; large images served directly from static directories without compression or lazy loading |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs] |

### PER-009: CDN Configuration

| Field | Value |
|---|---|
| **What to Look For** | Static assets (JS, CSS, images, fonts) are served from a CDN or reverse proxy with caching — not by the application server |
| **How to Check** | 1. Check for CDN configuration: Cloudflare, CloudFront, Fastly, or Vercel/Netlify edge config. 2. Look at nginx configuration for `location /static/` blocks with `expires`, `add_header Cache-Control`. 3. Check for `STATIC_URL` pointing to a CDN domain (Django), or asset prefix configuration in Next.js/Vite. 4. Verify `docker-compose.yml` or K8s manifests include a reverse proxy or CDN layer for static assets. 5. Look for `whitenoise` configuration if running Django (acceptable for small-scale deployments). |
| **Pass** | Static assets are served via CDN or properly configured reverse proxy with long cache TTLs |
| **Partial** | Reverse proxy serves static files but no CDN; or CDN is configured but not for all asset types |
| **Fail** | Application server handles static files directly in production (e.g., Django `runserver` serving static, Express serving from `public/` without proxy) |
| **Severity** | medium |
| **Tech Triggers** | [nginx, any_web_framework] |

### PER-010: Browser Caching Headers

| Field | Value |
|---|---|
| **What to Look For** | Static assets have appropriate `Cache-Control`, `ETag`, and `Last-Modified` headers for browser caching |
| **How to Check** | 1. Check nginx config for `expires` directive and `Cache-Control` headers on static file locations. 2. Search for middleware or decorator that sets caching headers: `@cache_control`, `CacheMiddleware`, `SecurityMiddleware` settings. 3. Verify hashed/fingerprinted filenames are used for cache-busted assets (Vite, Webpack content hash in filenames). 4. Check for `Vary` header on compressed responses. 5. Confirm HTML pages have `Cache-Control: no-cache` or short TTLs while static assets have long TTLs (`max-age=31536000, immutable` for fingerprinted assets). |
| **Pass** | Fingerprinted assets have long cache TTLs with `immutable`; HTML/API responses have appropriate short-lived or no-cache headers |
| **Partial** | Some caching headers exist but not consistent; or assets aren't fingerprinted so long cache is risky |
| **Fail** | No caching headers configured; every request re-downloads all assets |
| **Severity** | medium |
| **Tech Triggers** | [nginx, any_web_framework] |

### PER-011: Frontend Rendering Performance

| Field | Value |
|---|---|
| **What to Look For** | No unnecessary re-renders, large lists use virtualization, component trees are kept shallow |
| **How to Check** | 1. Search for `React.memo`, `useMemo`, `useCallback` on components that receive complex props or render frequently. 2. Check for missing `key` props on mapped lists (causes full re-renders). 3. Look for virtualization libraries for long lists: `react-window`, `react-virtualized`, `vue-virtual-scroller`, `@angular/cdk/scrolling`. 4. Search for state stored too high in the component tree (context/Redux updates causing wide re-renders). 5. Check for expensive computations in render bodies without memoization. 6. Verify no synchronous `localStorage`/`sessionStorage` reads in render paths. |
| **Pass** | Large lists are virtualized, memoization is applied to expensive paths, no obvious re-render storms |
| **Partial** | Some memoization exists but large lists are rendered without virtualization, or context updates cause wide re-renders |
| **Fail** | No render optimization; large lists render all items, no memoization, state updates trigger full tree re-renders |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular] |

---

## API / Backend Checks

### PER-012: API Response Compression

| Field | Value |
|---|---|
| **What to Look For** | API and page responses are compressed with gzip or brotli before transmission |
| **How to Check** | 1. Check nginx config for `gzip on;`, `gzip_types`, `gzip_min_length`, and optionally `brotli on;` (ngx_brotli module). 2. For Django, check `MIDDLEWARE` for `GZipMiddleware` (or confirm nginx handles it). 3. For FastAPI, check for `GZipMiddleware` in the middleware stack. 4. For Express/Node, search for `compression` middleware. 5. Verify compression applies to `application/json`, `text/html`, `text/css`, `application/javascript` at minimum. 6. Confirm `gzip_min_length` is set (don't compress tiny responses — typically ≥ 256 bytes). |
| **Pass** | Compression enabled at reverse proxy or application level for all text-based response types |
| **Partial** | Compression enabled but only for some content types, or only at one layer when both are needed |
| **Fail** | No response compression configured anywhere in the stack |
| **Severity** | medium |
| **Tech Triggers** | [nginx, django, fastapi, express, any_api] |

### PER-013: Efficient Serialization

| Field | Value |
|---|---|
| **What to Look For** | Serializers/schemas select only needed fields, avoid deep nesting, and don't trigger extra queries |
| **How to Check** | 1. Check DRF serializers for `fields` explicitly listed (not `fields = '__all__'` on models with many columns). 2. Look for nested serializer depth — more than 2 levels of nesting is a red flag. 3. Search for `SerializerMethodField` that performs database queries (N+1 in serializer). 4. For FastAPI/Pydantic, check response models use `response_model_include`/`response_model_exclude` or dedicated response schemas (not the full ORM model). 5. Verify large text/blob fields are excluded from list serializers and only included in detail views. |
| **Pass** | Serializers explicitly select fields, nesting is ≤ 2 levels, no query-triggering method fields |
| **Partial** | Most serializers are explicit but some use `__all__` or have deep nesting |
| **Fail** | Serializers expose entire models with `__all__`, deep nesting, and method fields triggering queries |
| **Severity** | medium |
| **Tech Triggers** | [django, fastapi, any_api] |

### PER-014: Request/Response Size Limits

| Field | Value |
|---|---|
| **What to Look For** | Request body size limits are configured to prevent oversized payloads from consuming resources |
| **How to Check** | 1. Check nginx for `client_max_body_size` directive (should be set explicitly, not relying on default 1M). 2. Check application-level limits: `DATA_UPLOAD_MAX_MEMORY_SIZE` and `FILE_UPLOAD_MAX_MEMORY_SIZE` in Django settings. 3. For Express, check `body-parser` or `express.json()` `limit` option. 4. For file uploads, verify size limits are enforced both at reverse proxy and application level. 5. Check for streaming/chunked upload handling for legitimate large files instead of buffering everything in memory. |
| **Pass** | Size limits configured at both reverse proxy and application level; large uploads use streaming |
| **Partial** | Size limits exist at one layer but not the other; or limits are set but unreasonably large |
| **Fail** | No request size limits configured; application accepts arbitrarily large payloads |
| **Severity** | medium |
| **Tech Triggers** | [nginx, any_api, any_web_framework] |

### PER-015: Database Query Logging

| Field | Value |
|---|---|
| **What to Look For** | Slow query logging enabled in development/staging to catch performance regressions early |
| **How to Check** | 1. Check Django settings for `django.db.backends` logger configuration or `django-debug-toolbar` in `INSTALLED_APPS`. 2. Look for query count assertions in tests (`assertNumQueries` in Django, `SQLAlchemy` query counting). 3. Check database configuration for slow query log (`slow_query_log` in MySQL, `log_min_duration_statement` in PostgreSQL). 4. Search for APM integration (Sentry performance, New Relic, Datadog) that tracks query performance. 5. For SQLAlchemy, check for `echo=True` in dev config or event listeners for query timing. |
| **Pass** | Slow query logging is configured in dev/staging, and tests include query count assertions on critical paths |
| **Partial** | Some logging exists (e.g., debug toolbar) but no slow query log or query count tests |
| **Fail** | No query performance monitoring in any environment; slow queries go unnoticed |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## Infrastructure Checks

### PER-016: Container Resource Allocation

| Field | Value |
|---|---|
| **What to Look For** | CPU and memory requests/limits are explicitly set in Docker/Kubernetes configuration |
| **How to Check** | 1. Check Kubernetes manifests (`deployment.yaml`, `statefulset.yaml`) for `resources.requests` and `resources.limits` on every container. 2. Check `docker-compose.yml` for `mem_limit`, `cpus`, `deploy.resources` sections. 3. Verify limits are reasonable — not `memory: 8Gi` for a simple web app, or `cpu: 4` for a cron job. 4. Check for resource quotas or limit ranges at the namespace level. 5. Confirm the application handles OOM gracefully (doesn't corrupt data on SIGKILL). |
| **Pass** | All containers have explicit CPU and memory requests/limits; values are reasonable for the workload |
| **Partial** | Some containers have resource limits but others use defaults; or limits are set but not tuned |
| **Fail** | No resource limits configured; containers can consume unbounded CPU/memory |
| **Severity** | medium |
| **Tech Triggers** | [docker, kubernetes] |

### PER-017: Horizontal Scaling Configuration

| Field | Value |
|---|---|
| **What to Look For** | Application can run multiple instances concurrently — no local filesystem state, no in-process sessions, proper load balancing |
| **How to Check** | 1. Search for `SESSION_ENGINE` (Django) — should be `db`, `cache`, or `signed_cookies`, not `file`. 2. Look for local filesystem writes in request handlers (temp files, uploaded files stored locally). 3. Check for in-memory caches or state that would be lost on restart or not shared across instances. 4. Verify `replicas` > 1 is viable in K8s deployment or `docker-compose.yml` `deploy.replicas`. 5. Check for HorizontalPodAutoscaler (HPA) configuration or equivalent auto-scaling rules. 6. Look for singleton patterns, in-memory locks, or cron jobs that assume single-instance deployment. |
| **Pass** | Application is stateless or uses shared external state; HPA or multi-replica config is present; no local filesystem state |
| **Partial** | Application mostly stateless but has one or two local state concerns (e.g., file uploads to local disk) |
| **Fail** | Application depends on local filesystem state, in-memory sessions, or assumes single-instance deployment |
| **Severity** | medium |
| **Tech Triggers** | [docker, kubernetes] |

### PER-018: Static File Serving

| Field | Value |
|---|---|
| **What to Look For** | Static files are served by a dedicated web server or CDN — not by the Python/Node application process |
| **How to Check** | 1. Check for nginx `location /static/` and `location /media/` blocks that serve files directly. 2. Verify Django `DEBUG = False` in production and `STATIC_ROOT` is collected via `collectstatic`. 3. Check if `whitenoise` is in `MIDDLEWARE` — acceptable for moderate traffic but not ideal for high-traffic. 4. Ensure the application server (gunicorn, uvicorn, node) is not configured to serve static files in production. 5. For containerized deployments, verify the nginx/proxy container has access to the static files volume. |
| **Pass** | nginx or CDN serves all static/media files; application server handles only dynamic requests |
| **Partial** | WhiteNoise or equivalent middleware serves static files (acceptable for moderate scale) |
| **Fail** | Application server (gunicorn/uvicorn/node) serves static files directly, or `DEBUG=True` in production config |
| **Severity** | high |
| **Tech Triggers** | [django, flask, any_web_framework, nginx] |

---

## AI/ML Checks

### PER-019: LLM Response Streaming

| Field | Value |
|---|---|
| **What to Look For** | LLM API calls use streaming responses for user-facing interactions to reduce perceived latency |
| **How to Check** | 1. Search for OpenAI/Anthropic client calls — check for `stream=True` parameter on chat completion requests. 2. Look at LangChain usage — check for `streaming=True` in LLM constructor or `astream`/`stream` method calls. 3. Verify the API endpoint returns a `StreamingResponse` (FastAPI), `StreamingHttpResponse` (Django), or SSE to the frontend. 4. Check if the frontend handles chunked/streamed responses (EventSource, `ReadableStream`, or SSE parsing). 5. Non-user-facing batch calls (summarization pipelines, background processing) don't need streaming — only flag user-facing interactions. |
| **Pass** | User-facing LLM calls use streaming with proper backend SSE/chunked response and frontend stream handling |
| **Partial** | Streaming is implemented for some LLM endpoints but not all user-facing interactions |
| **Fail** | All LLM calls wait for full completion before sending response; user stares at a spinner for 10+ seconds |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, langchain, any_ai_ml] |

### PER-020: Embedding Batch Processing

| Field | Value |
|---|---|
| **What to Look For** | Embedding computations are batched rather than calling the embedding API once per document |
| **How to Check** | 1. Search for embedding API calls (`openai.Embedding.create`, `embeddings.embed_documents`, `embed_query`). 2. Check if calls are made inside loops processing individual documents — this is the anti-pattern. 3. Verify batch embedding is used: passing a list of texts to a single API call instead of one-by-one. 4. Check for rate limiting and retry logic around embedding calls. 5. For large datasets, verify embeddings are computed once and stored (not recomputed on every query). 6. Look at vector store ingestion code — confirm it batches document chunks for embedding. |
| **Pass** | Embeddings are computed in batches, stored persistently, and not recomputed unnecessarily |
| **Partial** | Batching is used but some code paths still embed one-by-one, or no persistent storage |
| **Fail** | Embeddings are computed individually in loops with no batching; or recomputed on every request |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

### PER-021: Vector Search Optimization

| Field | Value |
|---|---|
| **What to Look For** | Vector store indexes are properly configured, similarity search uses appropriate parameters, and retrieval is efficient |
| **How to Check** | 1. Check vector store initialization — look for index type configuration (HNSW, IVF, flat) and parameters (ef_construction, M for HNSW). 2. Verify `top_k`/`n_results` is bounded and reasonable (not fetching 1000 results for a single query). 3. Check for metadata filtering before vector search (pre-filter to reduce search space). 4. For ChromaDB, check collection configuration and embedding function. 5. For Pinecone, check index type (serverless vs pod), dimension, and metric configuration. 6. Verify similarity threshold or distance cutoff is used to filter low-quality results. |
| **Pass** | Vector index is properly configured for the dataset size, search params are tuned, metadata pre-filtering is used |
| **Partial** | Index exists with default parameters; no metadata filtering or result quality thresholds |
| **Fail** | No index configuration; flat/brute-force search on large datasets; no result quality filtering |
| **Severity** | medium |
| **Tech Triggers** | [chromadb, pinecone, weaviate, any_ai_ml] |

### PER-022: LLM Token Usage Optimization

| Field | Value |
|---|---|
| **What to Look For** | Prompts are optimized for token efficiency; context windows are managed; token limits are respected |
| **How to Check** | 1. Check for `max_tokens` parameter on LLM calls — should be set explicitly, not left to model default. 2. Look for prompt templates — verify they're concise and don't include unnecessary boilerplate or repeated instructions. 3. Search for token counting before API calls (`tiktoken`, `anthropic.count_tokens`) to avoid context window overflow. 4. Check RAG pipelines — verify retrieved context is truncated/summarized to fit within token limits. 5. Look for conversation history management — older messages should be trimmed or summarized, not sent in full indefinitely. 6. Verify model selection is appropriate (not using GPT-4 for tasks that GPT-3.5 handles fine). |
| **Pass** | Token limits are set, prompts are optimized, context window is managed, model selection is cost-appropriate |
| **Partial** | Some token management exists but prompts are verbose, or no context window truncation in RAG/chat |
| **Fail** | No token limits set, unbounded conversation history, no prompt optimization, context window overflows possible |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, langchain, any_ai_ml] |
