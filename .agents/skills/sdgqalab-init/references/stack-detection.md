# Stack Detection Reference

Reference for sdgqalab-init Steps 2–4.
Load when discovering tech stack, identifying layers, and generating
test ignore patterns.

---

## 1. Tech Stack Detection

Scan files in priority order. Stop early if the stack is clear.

### Priority 1: Package manager files (highest signal)

| File | Stack Signal |
|------|-------------|
| `package.json` | Node.js ecosystem — check `dependencies` + `devDependencies` |
| `requirements.txt` / `Pipfile` / `pyproject.toml` | Python ecosystem |
| `go.mod` | Go ecosystem |
| `Cargo.toml` | Rust ecosystem |
| `pom.xml` / `build.gradle` | Java/Kotlin ecosystem |
| `Gemfile` | Ruby ecosystem |
| `composer.json` | PHP ecosystem |
| `pubspec.yaml` | Dart/Flutter ecosystem |

### Priority 2: Framework markers

| Marker | Framework |
|--------|-----------|
| `next.config.*` | Next.js |
| `nuxt.config.*` | Nuxt.js |
| `vite.config.*` | Vite (check for React/Vue/Svelte plugin) |
| `angular.json` | Angular |
| `svelte.config.*` | SvelteKit |
| `manage.py` + `settings*.py` | Django |
| `app.py` / `main.py` + `fastapi` import | FastAPI |
| `config/application.rb` | Ruby on Rails |
| `cmd/` + `go.mod` | Go service |
| `Cargo.toml` + `src/main.rs` | Rust binary |
| `nest-cli.json`, `main.ts` with NestFactory | NestJS |
| `server.js` or `app.js` with express import | Express |

### Priority 3: Infrastructure files

| File | What it reveals |
|------|-----------------|
| `docker-compose*.yml` | Service topology, databases, caches, brokers |
| `Dockerfile*` | Base images, build stages, runtime config |
| `nginx.conf` / `nginx/*.conf` | Reverse proxy, SSL config |
| `.github/workflows/*.yml` | CI/CD pipeline tools |
| `k8s/` / `kubernetes/` / `helm/` | Kubernetes orchestration |
| `terraform/` / `*.tf` | Infrastructure as Code |
| `serverless.yml` / `sam-template.yml` | Serverless deployment |

### Priority 4: Configuration files

| File | What it reveals |
|------|-----------------|
| `tailwind.config.*` | TailwindCSS |
| `postcss.config.*` | PostCSS processing |
| `.eslintrc*` / `eslint.config.*` | ESLint configuration |
| `jest.config.*` / `vitest.config.*` | Test runner |
| `cypress.config.*` / `playwright.config.*` | E2E testing |
| `tsconfig.json` | TypeScript |
| `webpack.config.*` | Webpack bundler |
| `sentry.*.config.*` | Error tracking |
| `prometheus.yml` / `grafana/` | Monitoring |

---

## 2. Scope Discovery (for test coverage)

Within each layer, discover testable modules/scopes:

| Tech Stack | How to Find Scopes |
|------------|-------------------|
| Django | Directories containing `models.py` (these are apps) |
| FastAPI/Flask | Directories under `routers/`, `routes/`, or `api/` |
| Express | Directories under `src/` or `routes/` |
| NestJS | Directories under `src/` containing `*.module.ts` |
| Go | Packages under `internal/` or `pkg/` |
| React | Directories under `src/features/`, `src/pages/`, `src/shared/` |
| Vue | Directories under `src/views/`, `src/components/`, `src/stores/` |
| Angular | Directories under `src/app/` containing `*.module.ts` |
| Flutter | Directories under `lib/` |
| Rust | Crate modules under `src/` |
| Rails | Directories under `app/models/`, `app/controllers/` |
| General | Any directory with 3+ non-ignored source files |

---

## 3. Test Ignore Patterns

Files that should NOT count as "untested source files" in coverage audits.
Auto-generate per-stack, then let the user adjust.

### Python/Django
```
- "**/migrations/**"
- "**/__pycache__/**"
- "**/__init__.py"
- "**/manage.py"
- "**/*settings*.py"
- "**/wsgi.py"
- "**/asgi.py"
- "**/apps.py"
- "**/urls.py"
- "**/admin.py"
```

### React/TypeScript
```
- "**/*.d.ts"
- "**/setupTests.*"
- "**/react-app-env*"
- "**/reportWebVitals*"
- "**/index.ts"
- "**/types.ts"
- "**/types/**"
```

### Vue
```
- "**/*.d.ts"
- "**/shims-*.d.ts"
- "**/main.ts"
- "**/types/**"
```

### Node/Express
```
- "**/node_modules/**"
- "**/*.config.js"
- "**/*.config.ts"
- "**/migrations/**"
```

### Go
```
- "**/vendor/**"
- "**/*_generated.go"
- "**/mock_*.go"
- "**/wire_gen.go"
```

### Flutter/Dart
```
- "**/.dart_tool/**"
- "**/generated/**"
- "**/*.g.dart"
- "**/*.freezed.dart"
```

### Rust
```
- "**/target/**"
- "**/build.rs"
```

### Ruby/Rails
```
- "**/db/migrate/**"
- "**/config/**"
- "**/bin/**"
- "**/vendor/**"
```

### .NET/C#
```
- "**/bin/**"
- "**/obj/**"
- "**/Migrations/**"
- "**/Properties/**"
```

---

## 4. Category Taxonomy

Organize discovered technologies into these categories:

### Frontend
- Core Framework (React, Vue, Angular, Svelte)
- Language (TypeScript, JavaScript)
- Build Tool (Vite, Webpack, Turbopack, esbuild)
- Styling (TailwindCSS, Sass, CSS Modules, styled-components)
- Routing (React Router, Vue Router, Next.js routing)
- State Management (Redux, Zustand, Pinia, Context API)
- UI Library (MUI, Ant Design, Radix, shadcn/ui)
- Data Visualization (D3.js, Chart.js, Recharts)
- Form Handling (React Hook Form, Formik, Zod)
- Code Quality (ESLint, Prettier, Stylelint)

### Backend
- Core Framework (Django, FastAPI, Express, Gin, Rails, Spring)
- API Framework (DRF, GraphQL, tRPC, gRPC)
- Language (Python, Node.js, Go, Java, Ruby)
- WSGI/ASGI Server (Gunicorn, Uvicorn, Daphne)
- Task Queue (Celery, Django-Q, Bull, Sidekiq)
- Caching (django-redis, node-cache, Redis)
- Authentication (django-otp, Passport.js, Auth0 SDK)

### Database
- Primary Database (PostgreSQL, MySQL, SQLite, MongoDB)
- Vector Database (ChromaDB, Pinecone, Weaviate, pgvector)
- Cache & Broker (Redis, Memcached, RabbitMQ, Kafka)
- Search Engine (Elasticsearch, Meilisearch, Typesense)

### AI/ML & LLM
- LLM Framework (LangChain, LlamaIndex, Semantic Kernel)
- LLM Provider (OpenAI, Azure OpenAI, Anthropic, Ollama)
- ML Runtime (ONNX Runtime, TensorFlow, PyTorch)
- Document Processing (PyPDF, pymupdf, unstructured)
- Data Processing (Pandas, NumPy, OpenPyXL)

### DevOps
- Containerization (Docker, Docker Compose)
- Orchestration (Kubernetes, ECS)
- Reverse Proxy (Nginx, Caddy, Traefik)
- CI/CD (GitHub Actions, GitLab CI, Jenkins)
- IaC (Terraform, Pulumi, CloudFormation)

### Testing
- Unit Test Runner (pytest, Jest, Vitest, Go test)
- E2E Framework (Cypress, Playwright, Selenium)
- Coverage Tool (coverage.py, Istanbul/c8, go cover)
- Security Scanner (Bandit, Semgrep, npm audit, Snyk)

### Monitoring & Observability
- Error Tracking (Sentry, Rollbar, Bugsnag)
- APM (New Relic, Datadog, Elastic APM)
- Logging (ELK Stack, Loki, structlog)
- Tracing (OpenTelemetry, Jaeger, Zipkin)

---

## 5. Version Extraction

| File Format | Version Location |
|-------------|-----------------|
| `package.json` | `dependencies.{pkg}` / `devDependencies.{pkg}` — strip `^` `~` `>=` |
| `requirements.txt` | After `==` or `>=` — prefer pinned versions |
| `Pipfile` | `[packages]` and `[dev-packages]` sections |
| `pyproject.toml` | `[project.dependencies]` and `[project.optional-dependencies]` |
| `docker-compose*.yml` | `image:` tags (e.g., `postgres:15-alpine` → PostgreSQL 15) |
| `Dockerfile` | `FROM` directives (e.g., `FROM python:3.11-slim` → Python 3.11) |
| `go.mod` | `require` block with versions |

If version is unpinned (e.g., `django>=5.0`), record as "5.x" with a note.
