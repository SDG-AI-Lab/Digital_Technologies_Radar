---
domain_id: security
domain_name: Security
check_prefix: SEC

iso:
  quality_characteristic: Security
  sub_characteristics:
    - confidentiality
    - integrity
    - non-repudiation
    - accountability
    - authenticity
    - resistance
  grounding_standards:
    - id: "ISO/IEC 5055:2021"
      focus: "Automated security weakness patterns from source code (CWE-based)"
    - id: "ISO/IEC 27001:2022"
      focus: "Information security management controls"
    - id: "OWASP Top 10 2021"
      focus: "Web application security risks"
    - id: "ISO/IEC 25059"
      focus: "AI security — intervenability and controllability"
      activates_for: [any_ai_ml]

applicability:
  always_include: true
  triggers: []
  description: "Every layer must be security-audited"

scope: per-layer
---

# Security

Security covers the degree to which a product or system protects information
and data so that persons or other products have the degree of data access
appropriate to their types and levels of authorisation. This domain maps to
ISO 25010 sub-characteristics: confidentiality, integrity, non-repudiation,
accountability, authenticity, and resistance.

---

## Universal Checks

These checks apply to every project regardless of tech stack.

---

### SEC-001: Secrets in Source Control

| Field | Value |
|---|---|
| **What to Look For** | API keys, passwords, tokens, private keys, or connection strings committed to the repository. |
| **How to Check** | 1. Run `git log --all -p` piped through grep for common secret patterns: `grep -rEi '(AKIA[0-9A-Z]{16}|password\s*=\s*["\x27].+["\x27]|secret_key\s*=|api_key\s*=|token\s*=\s*["\x27].+["\x27]|-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----)' --include='*.py' --include='*.js' --include='*.ts' --include='*.env' --include='*.yml' --include='*.yaml' --include='*.json' --include='*.toml' .` 2. Check for committed `.env` files: `git ls-files | grep -i '\.env'` (excluding `.env.example` or `.env.template`). 3. Look for `.env` in `.gitignore`: `grep '\.env' .gitignore`. 4. Search for hardcoded AWS keys, GCP service account JSON, or Azure connection strings. 5. Check if a secret-scanning tool (e.g., `trufflehog`, `gitleaks`, `detect-secrets`) is configured in CI or as a pre-commit hook. |
| **Pass** | No secrets found in tracked files; `.env` is in `.gitignore`; a secret scanner is configured. |
| **Partial** | `.env` is gitignored but no secret scanner is configured, or a single low-risk token was found in a test fixture with a comment marking it as a dummy. |
| **Fail** | Real API keys, passwords, or private keys are present in tracked files, or `.env` files with secrets are committed. |
| **Severity** | critical |
| **Tech Triggers** | [universal] |

---

### SEC-002: Dependency Vulnerability Scanning

| Field | Value |
|---|---|
| **What to Look For** | Automated scanning for known vulnerabilities in third-party dependencies as part of the CI pipeline. |
| **How to Check** | 1. For Node.js: check CI workflow files for `npm audit`, `yarn audit`, or `npx audit-ci`. 2. For Python: search CI for `pip-audit`, `safety check`, or `bandit`. 3. For Go: search for `govulncheck` or `nancy`. 4. Check if Dependabot or Renovate config exists: look for `.github/dependabot.yml` or `renovate.json`. 5. Search GitHub Actions workflows: `grep -r 'audit\|safety\|snyk\|trivy\|grype\|dependabot' .github/workflows/`. 6. Check `package.json` scripts for audit commands: `grep -i 'audit' package.json`. |
| **Pass** | At least one vulnerability scanning tool runs in CI on every PR or push; Dependabot or Renovate is configured for automated updates. |
| **Partial** | Scanning tool exists but only runs on a schedule (not per-PR), or Dependabot is configured but vulnerability scanning is not in CI. |
| **Fail** | No dependency vulnerability scanning is configured anywhere in the project. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### SEC-003: Environment Variable Management

| Field | Value |
|---|---|
| **What to Look For** | Secrets and configuration values loaded from environment variables rather than hardcoded in source files. |
| **How to Check** | 1. Search for hardcoded connection strings: `grep -rEi '(postgres|mysql|mongodb|redis)://[^$]' --include='*.py' --include='*.js' --include='*.ts' .` 2. Verify `.env` is in `.gitignore`: `grep '\.env' .gitignore`. 3. Check that an `.env.example` or `.env.template` file exists documenting required variables. 4. Verify app code reads secrets from env: search for `os.environ`, `os.getenv`, `process.env`, `env()`, `config()` near secret-related names. 5. Check for `dotenv` or equivalent library usage in the entrypoint. |
| **Pass** | All secrets are loaded from environment variables; `.env` is gitignored; an `.env.example` documents required variables without real values. |
| **Partial** | Most secrets use env vars but one or two non-critical config values are hardcoded, or `.env.example` is missing. |
| **Fail** | Database credentials, API keys, or other secrets are hardcoded in source files. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### SEC-004: HTTPS Enforcement

| Field | Value |
|---|---|
| **What to Look For** | All production traffic is served over TLS. HTTP requests are redirected to HTTPS. |
| **How to Check** | 1. Check nginx config for SSL and redirect: `grep -r 'ssl_certificate\|return 301 https\|ssl on\|listen 443' nginx/` or `conf/` or `etc/nginx/`. 2. For Django: check `settings.py` for `SECURE_SSL_REDIRECT = True` and `SESSION_COOKIE_SECURE = True`. 3. For Express: search for `express-force-https`, `helmet`, or manual redirect middleware. 4. For FastAPI/Flask behind a proxy: verify proxy headers are trusted and upstream enforces TLS. 5. Check Docker/docker-compose for exposed ports — port 80 should redirect, not serve. 6. For cloud deployments: check Terraform/CloudFormation for load balancer HTTPS listeners. |
| **Pass** | TLS is configured; HTTP-to-HTTPS redirect is in place; secure cookie flags are set. |
| **Partial** | TLS is configured but HTTP redirect is missing, or secure cookie flags are not set. |
| **Fail** | No TLS configuration found; application serves over plain HTTP in production config. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### SEC-005: Security Headers

| Field | Value |
|---|---|
| **What to Look For** | Standard security headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security (HSTS), Referrer-Policy, Permissions-Policy. |
| **How to Check** | 1. Check for `helmet` middleware in Express apps: `grep -r 'helmet' --include='*.js' --include='*.ts' .` 2. For Django: check `settings.py` for `SECURE_HSTS_SECONDS`, `X_FRAME_OPTIONS`, `SECURE_CONTENT_TYPE_NOSNIFF`. Also check `SecurityMiddleware` is in `MIDDLEWARE`. 3. For nginx: `grep -rE 'add_header.*(Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)' nginx/`. 4. For Next.js: check `next.config.js` for `headers()` function or `next.config.mjs` security headers. 5. For meta tags: search HTML templates for `<meta http-equiv="Content-Security-Policy"`. |
| **Pass** | At minimum Content-Security-Policy, X-Frame-Options (or CSP frame-ancestors), X-Content-Type-Options, and HSTS are set. |
| **Partial** | Some headers are set but CSP or HSTS is missing. |
| **Fail** | No security headers are configured. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework] |

---

## Web Application Checks

Checks targeting web applications, covering OWASP Top 10 and common web vulnerabilities.

---

### SEC-006: CORS Configuration

| Field | Value |
|---|---|
| **What to Look For** | Cross-Origin Resource Sharing configuration that does not use wildcard origins in production. |
| **How to Check** | 1. For Django: search for `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, or `CORS_ORIGIN_WHITELIST` in `settings.py` or `settings/`. Fail if `CORS_ALLOW_ALL_ORIGINS = True` in production settings. 2. For FastAPI: `grep -r 'CORSMiddleware\|allow_origins' --include='*.py' .` — check if `allow_origins=["*"]` is used outside of development. 3. For Express: `grep -r 'cors(\|origin:' --include='*.js' --include='*.ts' .` — check if `origin: '*'` or `origin: true` is set without restriction. 4. For Next.js: check `next.config.js` for CORS headers in the `headers()` function. 5. Verify CORS configuration differs between dev and production environments. |
| **Pass** | CORS origins are explicitly listed for production; wildcard is only used in development configs behind an environment check. |
| **Partial** | CORS is configured but uses a broad pattern or reflects any origin conditionally. |
| **Fail** | `allow_origins=["*"]` or `origin: '*'` is set in production configuration with no environment guard. |
| **Severity** | high |
| **Tech Triggers** | [django, fastapi, flask, express, nextjs, any_web_framework] |

---

### SEC-007: CSRF Protection

| Field | Value |
|---|---|
| **What to Look For** | Cross-Site Request Forgery protection is enabled and not globally bypassed on state-changing endpoints. |
| **How to Check** | 1. For Django: verify `django.middleware.csrf.CsrfViewMiddleware` is in `MIDDLEWARE`. Search for `@csrf_exempt` decorators: `grep -rn 'csrf_exempt' --include='*.py' .` — each exemption needs justification. 2. For Flask: check for `flask-wtf` or `CSRFProtect` initialization. Search for `@csrf.exempt`. 3. For Express: search for `csurf`, `csrf-csrf`, or `lusca` middleware: `grep -r 'csurf\|csrf\|lusca' --include='*.js' --include='*.ts' .` 4. For SPA + API pattern: verify that the API uses token-based auth (JWT/Bearer) rather than cookies — if cookies are used, CSRF protection is mandatory. 5. Check that CSRF tokens are included in HTML forms: `grep -r 'csrf_token\|_csrf\|csrfmiddlewaretoken' --include='*.html' --include='*.jinja2' --include='*.ejs' .` |
| **Pass** | CSRF middleware is active; no unjustified `csrf_exempt` decorators; forms include CSRF tokens (or API uses token-based auth making CSRF moot). |
| **Partial** | CSRF is enabled but one or two endpoints are exempted without clear documentation of why. |
| **Fail** | CSRF middleware is missing or disabled; multiple state-changing endpoints lack protection. |
| **Severity** | critical |
| **Tech Triggers** | [django, flask, express, any_web_framework] |

---

### SEC-008: SQL Injection Prevention

| Field | Value |
|---|---|
| **What to Look For** | Absence of raw SQL queries with string interpolation or concatenation. Consistent use of parameterized queries or ORM. |
| **How to Check** | 1. Search Python files for raw SQL: `grep -rn 'raw(\|execute(\|cursor\.\|RawSQL\|extra(' --include='*.py' .` — then inspect each hit for string formatting (`f"`, `.format(`, `%s` with `%`). 2. Search JS/TS for raw queries: `grep -rn 'query(\|raw(\|execute(' --include='*.js' --include='*.ts' .` — check for template literals or concatenation with user input. 3. Check for ORM usage: presence of Django ORM (`models.py` with model classes), SQLAlchemy models, Prisma schema, or TypeORM entities. 4. For any `raw()` or `execute()` calls found, verify they use parameterized placeholders (`%s`, `$1`, `?`) with a separate params argument, not string interpolation. 5. Search for `text()` in SQLAlchemy: `grep -rn 'text(' --include='*.py' .` — verify params are passed separately. |
| **Pass** | All database access uses ORM or parameterized queries; any raw SQL uses proper parameter binding. |
| **Partial** | Mostly ORM-based but one or two raw queries exist with parameterized inputs (not string interpolation). |
| **Fail** | Raw SQL queries use string concatenation or f-strings with user-controlled values. |
| **Severity** | critical |
| **Tech Triggers** | [django, fastapi, sqlalchemy, any_database] |

---

### SEC-009: XSS Prevention

| Field | Value |
|---|---|
| **What to Look For** | User-supplied data is properly escaped before rendering in HTML. Template engines use auto-escaping. Dangerous rendering functions are avoided or used with sanitized input. |
| **How to Check** | 1. For React: search for `dangerouslySetInnerHTML`: `grep -rn 'dangerouslySetInnerHTML' --include='*.jsx' --include='*.tsx' .` — each usage must sanitize input with DOMPurify or equivalent. 2. For Django/Jinja2: search for `\|safe` filter and `{% autoescape off %}`: `grep -rn '\|safe\|autoescape off' --include='*.html' --include='*.jinja2' .` 3. For Vue: search for `v-html`: `grep -rn 'v-html' --include='*.vue' .` 4. For Angular: search for `bypassSecurityTrustHtml\|innerHTML`: `grep -rn 'bypassSecurityTrust\|innerHTML' --include='*.ts' --include='*.html' .` 5. For server-rendered apps: verify template engine auto-escaping is enabled (Django: default on, Jinja2: check `autoescape=True`). 6. Check for sanitization libraries: `grep -r 'DOMPurify\|sanitize-html\|bleach\|xss' package.json requirements.txt Pipfile pyproject.toml`. |
| **Pass** | Auto-escaping is enabled; no unguarded `dangerouslySetInnerHTML`, `v-html`, or `|safe` usage; sanitization library is used where raw HTML is needed. |
| **Partial** | Auto-escaping is on but one or two `|safe` usages exist on data that appears to be admin-controlled. |
| **Fail** | Auto-escaping is disabled globally, or user input is rendered unsanitized via `dangerouslySetInnerHTML` / `v-html` / `|safe`. |
| **Severity** | critical |
| **Tech Triggers** | [react, vue, angular, django, jinja2, any_web_framework] |

---

### SEC-010: Authentication Implementation

| Field | Value |
|---|---|
| **What to Look For** | A working authentication system is in place. Protected routes require authentication. Session or token configuration follows security best practices. |
| **How to Check** | 1. Identify the auth mechanism: search for JWT libraries (`jsonwebtoken`, `PyJWT`, `djangorestframework-simplejwt`, `passport`, `next-auth`), session middleware, or OAuth libraries in dependency files. 2. Check that auth middleware is applied: for Django, look for `LoginRequiredMixin` or `@login_required` on views. For Express: `grep -rn 'isAuthenticated\|requireAuth\|protect\|authenticate' --include='*.js' --include='*.ts' .` 3. For JWT: verify token expiry is set (`expiresIn`, `ACCESS_TOKEN_LIFETIME`), secret is loaded from env, and refresh token rotation is implemented. 4. Check for password hashing: `grep -r 'bcrypt\|argon2\|pbkdf2\|scrypt\|make_password' --include='*.py' --include='*.js' --include='*.ts' .` 5. Verify there are no endpoints serving sensitive data without auth by checking route definitions for missing middleware. |
| **Pass** | Auth middleware is consistently applied to protected routes; JWT/session config uses secure defaults; passwords are hashed with a strong algorithm. |
| **Partial** | Auth exists but some protected routes are missing the middleware, or JWT expiry is too long (>24h for access tokens). |
| **Fail** | No authentication system is implemented, or protected routes are accessible without auth. |
| **Severity** | critical |
| **Tech Triggers** | [any_web_framework, any_api] |

---

### SEC-011: Authorization & RBAC

| Field | Value |
|---|---|
| **What to Look For** | Role-based or permission-based access control beyond basic authentication. Users can only access resources they are authorized for. |
| **How to Check** | 1. For Django: search for `PermissionRequiredMixin`, `@permission_required`, `has_perm`, custom permission classes in DRF (`permissions.py`): `grep -rn 'permission_classes\|PermissionRequired\|has_perm\|IsAdminUser\|BasePermission' --include='*.py' .` 2. For Express: search for role-checking middleware: `grep -rn 'role\|authorize\|isAdmin\|hasPermission\|can(' --include='*.js' --include='*.ts' .` 3. For any framework: check if there is a roles/permissions model or table in the database schema. 4. Verify that admin endpoints are restricted: search for admin routes and confirm they have stricter permission checks. 5. Check for object-level permissions (can user X access resource Y): look for ownership checks in query filters. |
| **Pass** | RBAC or permission system is implemented; different roles have different access levels; admin routes are restricted; object-level permissions exist where needed. |
| **Partial** | Basic role checks exist (admin vs. user) but no fine-grained object-level permissions. |
| **Fail** | No authorization beyond authentication — all authenticated users can access all resources. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework, any_api] |

---

### SEC-012: Rate Limiting

| Field | Value |
|---|---|
| **What to Look For** | Rate limiting on public-facing endpoints, especially authentication, registration, password reset, and API endpoints. |
| **How to Check** | 1. Search for rate-limiting libraries in dependencies: `grep -i 'ratelimit\|rate-limit\|throttle\|slowapi\|bottleneck\|express-rate-limit\|django-ratelimit' package.json requirements.txt Pipfile pyproject.toml`. 2. For Django REST Framework: `grep -rn 'throttle_classes\|DEFAULT_THROTTLE' --include='*.py' .` 3. For Express: `grep -rn 'rateLimit\|RateLimit' --include='*.js' --include='*.ts' .` 4. For FastAPI: `grep -rn 'SlowAPI\|Limiter\|RateLimiter' --include='*.py' .` 5. Check nginx for rate limiting: `grep -r 'limit_req\|limit_conn' nginx/`. 6. Verify rate limits are applied to login, registration, and password reset endpoints specifically. |
| **Pass** | Rate limiting is configured on authentication endpoints and general API access; limits are reasonable (not too permissive). |
| **Partial** | Rate limiting exists on some endpoints but login or registration endpoints are unprotected. |
| **Fail** | No rate limiting is configured on any endpoint. |
| **Severity** | high |
| **Tech Triggers** | [django, fastapi, flask, express, any_api] |

---

### SEC-013: Input Validation

| Field | Value |
|---|---|
| **What to Look For** | All user input is validated and sanitized before processing. Request bodies, query parameters, and path parameters have defined schemas. |
| **How to Check** | 1. For Django REST Framework: check for serializer classes on views: `grep -rn 'serializer_class\|Serializer' --include='*.py' .` 2. For FastAPI: check for Pydantic model usage in route parameters: `grep -rn 'BaseModel\|Field(\|Query(\|Path(\|Body(' --include='*.py' .` 3. For Express: check for validation middleware: `grep -rn 'Joi\|yup\|zod\|express-validator\|celebrate\|ajv' --include='*.js' --include='*.ts' .` 4. For Flask: search for `marshmallow`, `WTForms`, or manual validation. 5. Check that file uploads validate MIME type and size. 6. Verify that numeric IDs and pagination params are validated (not passed raw to queries). |
| **Pass** | All endpoints validate input using schemas or serializers; query/path params are typed; no raw user input reaches business logic unsanitized. |
| **Partial** | Most endpoints validate input but some accept raw request bodies or untyped query params. |
| **Fail** | No systematic input validation — endpoints process raw `request.body` or `request.GET` without validation. |
| **Severity** | high |
| **Tech Triggers** | [django, fastapi, flask, express, any_web_framework, any_api] |

---

### SEC-014: Cookie Security

| Field | Value |
|---|---|
| **What to Look For** | Session cookies are configured with HttpOnly, Secure, and SameSite attributes. |
| **How to Check** | 1. For Django: check `settings.py` for `SESSION_COOKIE_HTTPONLY` (default True), `SESSION_COOKIE_SECURE = True`, `SESSION_COOKIE_SAMESITE = 'Lax'` or `'Strict'`, and `CSRF_COOKIE_SECURE = True`. 2. For Express: `grep -rn 'cookie\|session' --include='*.js' --include='*.ts' .` — look for `httpOnly: true`, `secure: true`, `sameSite: 'lax'\|'strict'` in session/cookie configuration. 3. For Flask: check `app.config` for `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_SAMESITE`. 4. Check `Set-Cookie` header patterns in middleware or response handlers. |
| **Pass** | All session cookies have HttpOnly, Secure (in production), and SameSite set to Lax or Strict. |
| **Partial** | HttpOnly is set but Secure or SameSite is missing. |
| **Fail** | Session cookies lack HttpOnly flag, or Secure is not set for production. |
| **Severity** | medium |
| **Tech Triggers** | [django, flask, express, any_web_framework] |

---

### SEC-015: File Upload Security

| Field | Value |
|---|---|
| **What to Look For** | File upload endpoints validate file type, enforce size limits, and do not allow arbitrary file execution. |
| **How to Check** | 1. Search for file upload handling: `grep -rn 'upload\|multer\|FileField\|FileUpload\|UploadFile\|formidable\|busboy' --include='*.py' --include='*.js' --include='*.ts' .` 2. Check for file type validation: look for MIME type checks, allowed extensions lists, or magic byte validation near upload handlers. 3. Check for file size limits: look for `MAX_UPLOAD_SIZE`, `limits: { fileSize: }`, `MAX_CONTENT_LENGTH`, or `DATA_UPLOAD_MAX_MEMORY_SIZE`. 4. Verify uploaded files are stored outside the web root or in a cloud storage bucket — not in a publicly served static directory. 5. Check that filenames are sanitized (not using user-supplied filenames directly): look for `uuid`, `secure_filename`, or hash-based renaming. |
| **Pass** | File type is validated; size limits are enforced; files are stored safely; filenames are sanitized. |
| **Partial** | Size limits exist but file type validation is missing, or files are stored in a served directory but with sanitized names. |
| **Fail** | No file type or size validation; user-supplied filenames are used directly; files are stored in web root. |
| **Severity** | high |
| **Tech Triggers** | [any_web_framework, any_api] |

---

## API Checks

Checks specific to API endpoints and data exposure.

---

### SEC-016: API Authentication

| Field | Value |
|---|---|
| **What to Look For** | All API endpoints require authentication unless explicitly designated as public. |
| **How to Check** | 1. Check for global auth middleware: in Express look for `app.use(authenticate)` before route mounting; in Django REST Framework check `DEFAULT_AUTHENTICATION_CLASSES` and `DEFAULT_PERMISSION_CLASSES` in settings. 2. List all route definitions and check each for auth middleware/decorators: `grep -rn '@app.route\|@router.\|app.get\|app.post\|router.get\|router.post' --include='*.py' --include='*.js' --include='*.ts' .` 3. Identify intentionally public endpoints (health checks, login, registration, public docs) — these should be explicitly marked. 4. For FastAPI: check if `Depends(get_current_user)` or similar dependency is on each protected route. 5. Verify API key or token validation logic rejects expired or malformed tokens with 401. |
| **Pass** | Global auth is configured with explicit opt-out for public endpoints; unauthenticated requests receive 401. |
| **Partial** | Auth exists but is applied per-route rather than globally, with a few routes missing it. |
| **Fail** | API endpoints serving sensitive data are accessible without authentication. |
| **Severity** | critical |
| **Tech Triggers** | [any_api] |

---

### SEC-017: API Input Sanitization

| Field | Value |
|---|---|
| **What to Look For** | Request bodies, query strings, and headers are sanitized to prevent injection and malformed data attacks. |
| **How to Check** | 1. Check that API endpoints use schema-based validation (see SEC-013) — this is the primary defence. 2. Search for direct access to raw input without validation: `grep -rn 'request.data\|request.json\|req.body\|req.query\|req.params' --include='*.py' --include='*.js' --include='*.ts' .` — verify a validation layer sits between raw input and business logic. 3. Check for query parameter type coercion: are string params like `?id=abc` used in numeric contexts without validation? 4. Look for deserialization of untrusted data: `grep -rn 'pickle.load\|yaml.load\|eval(\|exec(' --include='*.py' .` — these are dangerous without safe loaders. 5. For GraphQL APIs: check for query depth limiting and complexity analysis. |
| **Pass** | All inputs are validated through schemas; no raw deserialization of untrusted data; query params are typed. |
| **Partial** | Schema validation exists for POST bodies but query params or headers are not validated. |
| **Fail** | Raw request data is passed directly to database queries, file operations, or shell commands. |
| **Severity** | high |
| **Tech Triggers** | [any_api] |

---

### SEC-018: API Response Data Filtering

| Field | Value |
|---|---|
| **What to Look For** | API responses do not leak sensitive fields such as password hashes, internal IDs, tokens, or personal data beyond what the consumer needs. |
| **How to Check** | 1. For Django REST Framework: check serializers for explicit `fields` or `exclude` — fail if a serializer uses `fields = '__all__'` on a user model without excluding password: `grep -rn "__all__\|password\|secret\|token" --include='*.py' serializers.py */serializers.py` 2. For Express/Fastify: check if responses use explicit projection or select — look for `.select('-password')` in Mongoose or column exclusion in queries. 3. For FastAPI: check Pydantic response models — verify `response_model` is set on routes and excludes sensitive fields. 4. Search for common sensitive field names in API test fixtures or example responses: `grep -rn 'password_hash\|ssn\|credit_card\|secret' --include='*.json' tests/ .` 5. Check error responses: verify stack traces and internal paths are not exposed in production error handlers. |
| **Pass** | Serializers/response models explicitly list fields; passwords and tokens are never in responses; errors return safe messages in production. |
| **Partial** | Most serializers are explicit but one or two use `__all__` on non-sensitive models, or error responses include debug info guarded by environment check. |
| **Fail** | Password hashes, tokens, or internal data are present in API responses; production errors expose stack traces. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

## Infrastructure / Container Checks

Security checks for Docker, containers, and deployment infrastructure.

---

### SEC-019: Docker Security

| Field | Value |
|---|---|
| **What to Look For** | Dockerfile follows security best practices: non-root user, minimal base image, no secrets in build arguments or layers. |
| **How to Check** | 1. Check for non-root user in Dockerfile: `grep -n 'USER\|adduser\|useradd\|addgroup' Dockerfile */Dockerfile`. If the container runs as root (no `USER` directive), flag it. 2. Check base image: `grep -n '^FROM' Dockerfile */Dockerfile` — prefer `slim`, `alpine`, or `distroless` over full OS images. 3. Search for secrets in build args or ENV: `grep -n 'ARG.*KEY\|ARG.*SECRET\|ARG.*PASSWORD\|ARG.*TOKEN\|ENV.*KEY\|ENV.*SECRET\|ENV.*PASSWORD' Dockerfile */Dockerfile`. 4. Check for `.dockerignore` file: ensure `.env`, `.git`, `node_modules`, and secret files are excluded. 5. Look for multi-stage builds that avoid shipping build tools in the final image. 6. Check that `COPY . .` does not copy secret files — cross-reference with `.dockerignore`. |
| **Pass** | Container runs as non-root; base image is minimal; no secrets in build args; `.dockerignore` excludes sensitive files; multi-stage build is used. |
| **Partial** | Non-root user is set but base image is full OS, or `.dockerignore` exists but is incomplete. |
| **Fail** | Container runs as root; secrets are baked into the image via ARG/ENV; no `.dockerignore`. |
| **Severity** | medium |
| **Tech Triggers** | [docker] |

---

### SEC-020: Container Secrets Management

| Field | Value |
|---|---|
| **What to Look For** | Secrets are injected at runtime via Docker secrets, environment variables from a secrets manager, or orchestration-level secret mounts — not baked into images. |
| **How to Check** | 1. Check docker-compose for secrets section: `grep -A5 'secrets:' docker-compose*.yml`. 2. Verify environment variables reference external sources: `grep -n 'environment:\|env_file:' docker-compose*.yml` — check that values use `${VAR}` syntax rather than hardcoded values. 3. Check Kubernetes manifests for Secret resources: `grep -rn 'kind: Secret\|secretKeyRef\|secretName' --include='*.yml' --include='*.yaml' .` 4. Search for `docker build --build-arg` with secret values in CI scripts: `grep -rn 'build-arg.*SECRET\|build-arg.*KEY\|build-arg.*PASSWORD' .github/ scripts/`. 5. Verify that runtime secrets are not logged: check entrypoint scripts for `echo $SECRET` or `printenv`. |
| **Pass** | Secrets are injected at runtime via secrets manager, Docker secrets, or env vars from CI; not present in image layers or build logs. |
| **Partial** | Secrets use env vars in docker-compose but the `.env` file is in the same directory without proper access control. |
| **Fail** | Secrets are hardcoded in docker-compose, passed as build args, or baked into image layers. |
| **Severity** | high |
| **Tech Triggers** | [docker, kubernetes] |

---

### SEC-021: Network Segmentation

| Field | Value |
|---|---|
| **What to Look For** | Docker compose services use network isolation — databases and internal services are not exposed to the public network. |
| **How to Check** | 1. Check docker-compose for network definitions: `grep -A10 'networks:' docker-compose*.yml`. 2. Verify that database services (postgres, mysql, redis, mongo) do not expose ports to the host: search for `ports:` on database service blocks — they should use `expose:` (internal only) instead. 3. Check that the web/proxy service is the only one with host-mapped ports. 4. Look for `network_mode: host` — this disables network isolation entirely. 5. If Kubernetes: check for NetworkPolicy resources restricting pod-to-pod communication. |
| **Pass** | Services are organized into separate networks; databases are only accessible from application network; only the reverse proxy exposes ports to the host. |
| **Partial** | Networks are defined but database ports are also mapped to the host for development convenience without a production override. |
| **Fail** | All services are on the default network with database ports exposed to the host; no network isolation. |
| **Severity** | medium |
| **Tech Triggers** | [docker] |

---

## AI/ML Checks

Security checks specific to AI and machine learning systems.

---

### SEC-022: Prompt Injection Prevention

| Field | Value |
|---|---|
| **What to Look For** | User input is sanitized before being included in LLM prompts. System prompts are isolated from user content. Output is validated before being used in downstream operations. |
| **How to Check** | 1. Search for prompt construction: `grep -rn 'prompt\|ChatMessage\|HumanMessage\|SystemMessage\|ChatPromptTemplate\|PromptTemplate' --include='*.py' --include='*.js' --include='*.ts' .` 2. Check if user input is directly interpolated into prompts with f-strings or template literals without sanitization: look for `f"...{user_input}..."` or `` `...${userInput}...` `` in prompt construction. 3. Verify system prompts are separated from user messages (using message roles, not concatenation). 4. Check for input length limits on user-supplied text before LLM calls. 5. Look for output validation: is LLM output parsed/validated before being used in code execution, database queries, or API calls? Search for `exec(`, `eval(`, `subprocess` near LLM response handling. 6. Check for guardrails libraries: `grep -r 'guardrails\|NeMo\|rebuff\|LLMGuard' requirements.txt package.json`. |
| **Pass** | User input is sanitized and length-limited; system prompts use message roles; LLM output is validated before use in sensitive operations; guardrails are in place. |
| **Partial** | System prompts are separated but user input is not sanitized, or output is used in non-critical operations without validation. |
| **Fail** | User input is directly concatenated into system prompts; LLM output is passed to `exec()`, `eval()`, or raw SQL without validation. |
| **Severity** | critical |
| **Tech Triggers** | [langchain, openai, anthropic, any_ai_ml] |

---

### SEC-023: API Key Protection for LLM Services

| Field | Value |
|---|---|
| **What to Look For** | LLM API keys (OpenAI, Anthropic, Cohere, etc.) are stored securely and never exposed in client-side code, logs, or error messages. |
| **How to Check** | 1. Search for hardcoded API keys: `grep -rEn '(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,}|OPENAI_API_KEY\s*=\s*["\x27]sk-)' --include='*.py' --include='*.js' --include='*.ts' --include='*.env' .` 2. Verify keys are loaded from environment: `grep -rn 'OPENAI_API_KEY\|ANTHROPIC_API_KEY\|COHERE_API_KEY\|HF_TOKEN' --include='*.py' --include='*.js' --include='*.ts' .` — they should use `os.environ`, `os.getenv`, or `process.env`. 3. Check that API keys are not in client-side bundles: search `src/` or `public/` or `frontend/` for LLM API key references. 4. Verify keys are not logged: `grep -rn 'print.*api_key\|console.log.*api_key\|logger.*api_key\|logging.*api_key' --include='*.py' --include='*.js' --include='*.ts' .` 5. Check `.env.example` does not contain real keys. |
| **Pass** | All LLM API keys are loaded from environment variables; not present in client code, logs, or example files. |
| **Partial** | Keys are in env vars but the key variable name is logged at debug level, or `.env.example` contains a placeholder that looks like a real key. |
| **Fail** | API keys are hardcoded in source files, present in client-side code, or logged in application output. |
| **Severity** | critical |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

---

### SEC-024: Model Access Control

| Field | Value |
|---|---|
| **What to Look For** | Model inference endpoints are protected by authentication and rate limiting to prevent abuse and cost overruns. |
| **How to Check** | 1. Identify model-serving endpoints: search for routes containing `predict`, `generate`, `complete`, `inference`, `chat`, `embed`: `grep -rn 'predict\|generate\|inference\|/chat\|/embed\|/complete' --include='*.py' --include='*.js' --include='*.ts' .` 2. Verify these endpoints have auth middleware (see SEC-010 and SEC-016 checks). 3. Check for rate limiting on these specific endpoints (see SEC-012). 4. Look for usage tracking or cost monitoring: search for token counting, usage logging, or billing middleware. 5. Verify that model endpoints are not publicly accessible without auth by checking route registration. |
| **Pass** | All model endpoints require authentication; rate limiting is applied; usage is tracked. |
| **Partial** | Auth is applied but no rate limiting or usage tracking on model endpoints. |
| **Fail** | Model endpoints are publicly accessible without authentication. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

### SEC-025: Data Leakage Prevention

| Field | Value |
|---|---|
| **What to Look For** | Sensitive data (PII, credentials, proprietary information) is not included in LLM prompts, embeddings, or vector store documents without sanitization. |
| **How to Check** | 1. Trace the data pipeline into LLM calls: search for document loaders, text splitters, and embedding functions: `grep -rn 'TextLoader\|DirectoryLoader\|RecursiveCharacterTextSplitter\|embed\|from_documents\|add_texts' --include='*.py' .` 2. Check what data sources are loaded: are database records, user data, or internal documents being sent to external LLM APIs? 3. Verify PII scrubbing before LLM calls: search for anonymization or redaction utilities: `grep -rn 'anonymize\|redact\|mask\|scrub\|pii' --include='*.py' --include='*.js' .` 4. Check vector store contents: if using Chroma, Pinecone, Weaviate, etc., verify that stored documents do not contain unmasked PII. 5. Review logging around LLM calls — ensure full prompts with sensitive data are not logged at INFO level. |
| **Pass** | Data is sanitized before sending to LLMs; PII is masked or removed; logging does not capture sensitive prompt content. |
| **Partial** | Some data sanitization exists but logging captures full prompts, or PII filtering is applied inconsistently. |
| **Fail** | Raw user data or database records with PII are sent directly to external LLM APIs without sanitization. |
| **Severity** | high |
| **Tech Triggers** | [langchain, any_ai_ml] |

---

## CI/CD Checks

Security checks for continuous integration and deployment pipelines.

---

### SEC-026: CI/CD Secrets Management

| Field | Value |
|---|---|
| **What to Look For** | CI/CD workflows use encrypted secrets, not hardcoded values. Secret scanning is part of the pipeline. |
| **How to Check** | 1. Search GitHub Actions workflows for hardcoded secrets: `grep -rn 'password:\|api_key:\|token:\|secret:' --include='*.yml' --include='*.yaml' .github/workflows/` — values should reference `${{ secrets.* }}` not literal strings. 2. Verify secrets usage pattern: `grep -rn '\${{ secrets\.' .github/workflows/` — confirm secrets are used correctly. 3. For GitLab CI: check `.gitlab-ci.yml` for `$CI_` variables vs hardcoded values. 4. Check for secret scanning steps in CI: `grep -r 'trufflehog\|gitleaks\|detect-secrets\|git-secrets' .github/workflows/ .pre-commit-config.yaml`. 5. Verify that CI logs do not echo secrets: search for `echo $SECRET` or `printenv` in workflow steps. 6. Check for `GITHUB_TOKEN` permissions: look for `permissions:` block in workflows to verify least privilege. |
| **Pass** | All secrets use encrypted CI/CD secret storage; secret scanning runs in CI; workflow permissions follow least privilege. |
| **Partial** | Secrets use `${{ secrets.* }}` but no secret scanning step, or permissions are not explicitly scoped. |
| **Fail** | Secrets are hardcoded in CI workflow files, or CI steps echo sensitive values. |
| **Severity** | high |
| **Tech Triggers** | [github_actions, gitlab_ci, any_ci_cd] |

---

### SEC-027: Dependency Pinning

| Field | Value |
|---|---|
| **What to Look For** | Dependencies are pinned to specific versions. Lock files exist and are committed to the repository. |
| **How to Check** | 1. Check for lock files: `ls -la package-lock.json yarn.lock pnpm-lock.yaml Pipfile.lock poetry.lock requirements.txt go.sum`. 2. Verify lock files are committed: `git ls-files | grep -E 'lock\|go.sum'`. 3. Check that lock files are NOT in `.gitignore`: `grep -E 'lock\|go.sum' .gitignore` — they should not be ignored. 4. For `requirements.txt`: check for pinned versions (`==`) vs unpinned (`>=`): `grep -c '==' requirements.txt` vs `grep -c '>=' requirements.txt`. 5. For Docker: check that base images use specific tags, not `latest`: `grep 'FROM.*:latest\|FROM.*[^:]$' Dockerfile */Dockerfile`. 6. For GitHub Actions: check that actions use SHA pins or version tags: `grep -E 'uses:.*@' .github/workflows/*.yml` — prefer SHA (`@abc123`) over mutable tags (`@v1`). |
| **Pass** | Lock files exist and are committed; base images use specific version tags; CI actions are pinned to SHAs or immutable tags. |
| **Partial** | Lock files exist but Docker images use `latest` tag, or CI actions use mutable version tags like `@v1`. |
| **Fail** | No lock files committed; dependencies use unpinned ranges; Docker uses `latest` tags. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### SEC-028: Branch Protection

| Field | Value |
|---|---|
| **What to Look For** | Main/production branches require pull request reviews and passing status checks before merge. Direct pushes are blocked. |
| **How to Check** | 1. Check repository settings via GitHub API or UI for branch protection rules on `main`/`master`/`production` branches. 2. Look for branch protection configuration in infrastructure-as-code: `grep -rn 'branch_protection\|required_pull_request_reviews\|required_status_checks' --include='*.tf' --include='*.yml' .` 3. Check for CODEOWNERS file: `ls -la .github/CODEOWNERS CODEOWNERS`. 4. Verify CI checks are defined: `.github/workflows/` should have at least one workflow that runs on `pull_request` events. 5. Check for merge requirements: search for `required_approving_review_count`, `require_code_owner_reviews` in Terraform or Pulumi config. 6. Look for auto-merge configuration — if enabled, verify it still requires passing checks. |
| **Pass** | Branch protection is enabled on main branch; PRs require at least one approval and passing CI checks; CODEOWNERS is configured. |
| **Partial** | Branch protection exists but only requires passing checks (no review required), or CODEOWNERS is missing. |
| **Fail** | No branch protection rules; direct pushes to main are allowed; no CI checks required for merge. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |
