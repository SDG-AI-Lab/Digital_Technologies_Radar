---
domain_id: maintainability
domain_name: Maintainability
check_prefix: MNT

iso:
  quality_characteristic: Maintainability
  sub_characteristics:
    - modularity
    - reusability
    - analysability
    - modifiability
    - testability
  grounding_standards:
    - id: "ISO/IEC 5055:2021"
      focus: "Automated maintainability weakness patterns — complexity, coupling, dead code"
    - id: "ISO/IEC 25023"
      focus: "Maintainability measurement — modularity, analysability metrics"

applicability:
  always_include: true
  triggers: []
  description: "Every layer must be checked for maintainability"

scope: per-layer
---

# Maintainability

Maintainability measures how easy it is to modify, extend, debug, and keep a codebase healthy over time. A maintainable system has low coupling, clear module boundaries, automated quality gates, and predictable change-propagation patterns. This domain covers linting, formatting, type safety, dependency hygiene, CI/CD automation, structural conventions, and AI/ML-specific configuration management.

---

## Universal Checks

### MNT-001: Linter Configuration

| Field | Value |
|---|---|
| **What to Look For** | A language-appropriate linter is configured with a committed config file and enforced in CI. |
| **How to Check** | 1. Search the repo root for linter config files: `.eslintrc.*`, `eslint.config.*`, `.pylintrc`, `ruff.toml`, `pyproject.toml` (look for `[tool.ruff]` or `[tool.pylint]`), `.flake8`, `setup.cfg` (look for `[flake8]`), `.golangci.yml`, `.rubocop.yml`. 2. Open the config file and verify it defines meaningful rules (not an empty or fully-disabled ruleset). 3. Check CI workflows (`.github/workflows/*.yml`) for a lint step that runs the linter and fails the build on violations. 4. Look for any `# noqa`, `// eslint-disable`, or equivalent suppression patterns — a few targeted ones are fine, blanket disables are not. |
| **Pass** | Linter config exists with meaningful rules enabled; CI runs the linter and blocks merge on failure. |
| **Partial** | Linter config exists but CI does not enforce it, or the config has excessive rule disabling. |
| **Fail** | No linter configuration found, or linter is present but entirely disabled / not wired into any workflow. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### MNT-002: Code Formatter

| Field | Value |
|---|---|
| **What to Look For** | An auto-formatter is configured so code style is consistent and non-debatable. |
| **How to Check** | 1. Search for formatter config: `.prettierrc*`, `prettier.config.*`, `pyproject.toml` (look for `[tool.black]` or `[tool.yapf]`), `.editorconfig`, `rustfmt.toml`, `.clang-format`. 2. Check for format-on-save or pre-commit integration: look in `.pre-commit-config.yaml` for formatter hooks, or in `package.json` scripts for a `format` command, or in `.husky/pre-commit` for format invocations. 3. Verify the formatter runs in CI or pre-commit so unformatted code cannot land. |
| **Pass** | Formatter config exists; formatting is enforced via pre-commit hook or CI check step. |
| **Partial** | Formatter config exists but enforcement is optional (no hook, no CI step). |
| **Fail** | No formatter configuration found anywhere in the repository. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### MNT-003: Type Safety

| Field | Value |
|---|---|
| **What to Look For** | Static type checking is configured and enforced to catch type errors before runtime. |
| **How to Check** | 1. **TypeScript**: Open `tsconfig.json` and verify `"strict": true` or at minimum `"noImplicitAny": true` and `"strictNullChecks": true`. Check CI for `tsc --noEmit` or equivalent type-check step. 2. **Python**: Search for `mypy.ini`, `.mypy.ini`, `pyproject.toml` `[tool.mypy]`, or `pyrightconfig.json`. Verify `disallow_untyped_defs = true` or equivalent strictness. Check if CI runs the type checker. 3. **Other languages**: Look for compiler strict flags, linter type rules, or static analysis configs. |
| **Pass** | Type checker is configured in strict mode and enforced in CI. |
| **Partial** | Type checker exists but is in permissive mode (many ignores, partial strictness) or not enforced in CI. |
| **Fail** | No type checking configured; dynamic language used without any static type analysis tooling. |
| **Severity** | medium |
| **Tech Triggers** | [typescript, python] |

---

### MNT-004: Dependency Management

| Field | Value |
|---|---|
| **What to Look For** | Dependencies are pinned via lock files, lock files are committed, and dependencies are reasonably up to date. |
| **How to Check** | 1. Verify lock files exist and are committed (not in `.gitignore`): `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml` for JS/TS; `poetry.lock`, `Pipfile.lock`, or `requirements.txt` with pinned versions for Python; `go.sum` for Go; `Gemfile.lock` for Ruby. 2. Check `.gitignore` — lock files must NOT be listed. 3. Look for Dependabot or Renovate config (`.github/dependabot.yml`, `renovate.json`) for automated dependency update PRs. 4. If possible, scan for critically outdated or deprecated packages (check `package.json` engines, Python version constraints). |
| **Pass** | Lock file exists and is committed; automated dependency update tool is configured. |
| **Partial** | Lock file exists and is committed but no automated update tool; or update tool exists but lock file is in `.gitignore`. |
| **Fail** | No lock file found, or lock file is explicitly gitignored, or dependencies are unpinned (e.g., all `*` versions). |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### MNT-005: Project Structure Convention

| Field | Value |
|---|---|
| **What to Look For** | The repository follows a clear, organized directory structure with logical separation of concerns. |
| **How to Check** | 1. List top-level directories and assess whether the structure is self-documenting. Common good patterns: `src/`, `tests/`, `docs/`, `config/`; or feature-based grouping like `src/auth/`, `src/users/`, `src/orders/`. 2. Check that test files mirror source structure (e.g., `src/auth/service.ts` → `tests/auth/service.test.ts`). 3. Verify no "god folders" — single directories with 30+ unrelated files. 4. Look for a README or ARCHITECTURE.md that explains the structure. |
| **Pass** | Clear, consistent directory structure; test files mirror source; structure is documented or self-evident. |
| **Partial** | Generally organized but some inconsistencies — mixed conventions, a few oversized flat directories. |
| **Fail** | Flat structure with everything in root or one directory; no discernible organizational pattern. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### MNT-006: Dead Code Detection

| Field | Value |
|---|---|
| **What to Look For** | The codebase is free from unused imports, unreachable code paths, and large commented-out blocks. |
| **How to Check** | 1. Search for commented-out code blocks (multi-line comments containing code-like syntax: function definitions, variable assignments, import statements). A few `// TODO` lines are fine; 20-line commented functions are not. 2. Look for unused imports — many linters flag these (`no-unused-vars` in ESLint, `F401` in Flake8/Ruff). Check if these rules are enabled. 3. Search for functions/classes that are defined but never referenced anywhere in the codebase using grep. 4. Check for `TODO`, `FIXME`, `HACK` comments — a moderate count is normal, but dozens of stale ones indicate neglect. |
| **Pass** | No significant commented-out code blocks; unused import rules are enabled; minimal stale TODOs. |
| **Partial** | Some commented-out code or unused imports exist but the linter is configured to catch them going forward. |
| **Fail** | Large blocks of commented-out code throughout; unused imports everywhere; no tooling to detect dead code. |
| **Severity** | low |
| **Tech Triggers** | [universal] |

---

### MNT-007: Code Complexity

| Field | Value |
|---|---|
| **What to Look For** | Functions are reasonable in length and nesting depth; no excessively complex single functions. |
| **How to Check** | 1. Search for functions longer than ~100 lines — use line count heuristics on function bodies. 2. Look for deeply nested code (4+ levels of indentation from conditionals/loops). 3. Check if a complexity linter rule is configured: `complexity` rule in ESLint (threshold ≤ 15), `max-complexity` in Pylint, or `mccabe` in Flake8/Ruff (`C901`). 4. Scan for functions with more than 5-6 parameters (a smell for high coupling). 5. Look for god classes/modules — single files over 500 lines with mixed responsibilities. |
| **Pass** | No functions exceed ~100 lines; nesting ≤ 3 levels typical; complexity linter rule is configured and enforced. |
| **Partial** | A few long functions exist but complexity tooling is in place; or most code is clean but no complexity rule is configured. |
| **Fail** | Multiple functions over 200 lines; deeply nested logic throughout; no complexity checks configured. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### MNT-008: Version Control Hygiene

| Field | Value |
|---|---|
| **What to Look For** | `.gitignore` properly excludes build artifacts, dependencies, secrets, and environment-specific files. |
| **How to Check** | 1. Open `.gitignore` and verify it covers: build output (`dist/`, `build/`, `*.pyc`, `__pycache__/`), dependencies (`node_modules/`, `.venv/`, `venv/`), environment files (`.env`, `.env.local`), IDE files (`.vscode/settings.json`, `.idea/`), OS files (`.DS_Store`, `Thumbs.db`). 2. Run `git ls-files` or check the repo for any files that should be ignored but are tracked (e.g., `node_modules/` committed, `.env` committed). 3. Check for `.gitattributes` with appropriate line-ending config if the team is cross-platform. |
| **Pass** | `.gitignore` is comprehensive; no build artifacts, dependencies, or secrets are tracked. |
| **Partial** | `.gitignore` exists but is incomplete — missing some common entries; or a few files that should be ignored are tracked. |
| **Fail** | No `.gitignore` at all, or critical omissions (e.g., `node_modules/` or `.env` files are committed). |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

## CI/CD & Automation

### MNT-009: CI Pipeline Exists

| Field | Value |
|---|---|
| **What to Look For** | A continuous integration pipeline is configured that at minimum runs linting and tests on every push/PR. |
| **How to Check** | 1. Check for CI config files: `.github/workflows/*.yml` (GitHub Actions), `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`, `bitbucket-pipelines.yml`. 2. Open the primary CI workflow and verify it triggers on `push` and/or `pull_request` events. 3. Confirm the workflow includes at least: (a) a dependency install step, (b) a lint step, (c) a test step. 4. Verify the pipeline is actually active — check for recent workflow runs if possible, or look for a CI status badge in the README. |
| **Pass** | CI workflow exists, triggers on push/PR, includes lint + test steps, and is active. |
| **Partial** | CI workflow exists but is missing lint or test steps; or triggers only on manual dispatch, not on push/PR. |
| **Fail** | No CI configuration found anywhere in the repository. |
| **Severity** | critical |
| **Tech Triggers** | [universal] |

---

### MNT-010: Automated Testing in CI

| Field | Value |
|---|---|
| **What to Look For** | CI runs the test suite and the build fails (blocks merge) when tests fail. |
| **How to Check** | 1. Open CI workflow files and locate the test step. Look for commands like `npm test`, `pytest`, `go test`, `dotnet test`, `bundle exec rspec`. 2. Verify the test command is NOT wrapped in `|| true`, `continue-on-error: true`, or equivalent patterns that swallow failures. 3. Check that the test step is a required check for merging (look in branch protection rules if accessible, or infer from workflow structure). 4. Confirm test results are not just logged but actually gate the pipeline. |
| **Pass** | CI runs tests; test failures block the pipeline and prevent merge. |
| **Partial** | CI runs tests but failures do not block merge (`continue-on-error: true` or not a required check). |
| **Fail** | CI does not run any tests, or there is no CI at all. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### MNT-011: Pre-commit Hooks

| Field | Value |
|---|---|
| **What to Look For** | Pre-commit hooks are configured to catch issues before code is committed (lint, format, type-check). |
| **How to Check** | 1. Search for `.pre-commit-config.yaml` (pre-commit framework). 2. Check for Husky: look in `package.json` for `"prepare": "husky install"` or `.husky/` directory with hook scripts. 3. Check for lint-staged: look in `package.json` for `"lint-staged"` config or `.lintstagedrc*` file. 4. Open the hook config and verify it runs meaningful checks (not just an echo statement). Common good hooks: linter, formatter, type checker, secret scanner. |
| **Pass** | Pre-commit hooks configured with lint + format checks; hook installation is documented or automated. |
| **Partial** | Hooks exist but only run trivial checks; or hooks are configured but installation is not automated (easy to skip). |
| **Fail** | No pre-commit hook configuration found. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

### MNT-012: Consistent Development Environment

| Field | Value |
|---|---|
| **What to Look For** | The repo provides tooling so every developer gets a consistent environment (editor config, dev containers, task runners). |
| **How to Check** | 1. Check for `.editorconfig` with settings for indent style, indent size, end-of-line, charset, and trim trailing whitespace. 2. Look for `.devcontainer/devcontainer.json` or `docker-compose.yml` for containerized dev environments. 3. Check for a `Makefile`, `Taskfile.yml`, `justfile`, or `package.json` scripts that provide standard commands (`make dev`, `make test`, `make lint`). 4. Verify a README or CONTRIBUTING.md documents how to set up the dev environment. |
| **Pass** | `.editorconfig` present; standard task runner configured; setup instructions documented; optionally a devcontainer. |
| **Partial** | Some environment tooling exists (e.g., `.editorconfig` or `Makefile`) but setup is underdocumented. |
| **Fail** | No `.editorconfig`, no standardized commands, no dev setup documentation. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

## Python-Specific

### MNT-013: Python Package Structure

| Field | Value |
|---|---|
| **What to Look For** | Python projects use modern packaging conventions with proper module structure. |
| **How to Check** | 1. Check for `pyproject.toml` (preferred) or `setup.py` / `setup.cfg`. If using `pyproject.toml`, verify it declares `[build-system]`, `[project]` metadata, and dependencies. 2. Verify source packages have `__init__.py` files where needed (packages should be importable). 3. Check for virtual environment config: `.python-version`, `Pipfile`, `pyproject.toml` with `[tool.poetry]`, or `requirements.txt`. 4. Look for a `src/` layout (recommended) vs. flat layout — either is fine if consistent. 5. Verify `requirements.txt` or equivalent has pinned versions, not just bare package names. |
| **Pass** | `pyproject.toml` (or `setup.py`) exists with proper metadata; `__init__.py` files present; virtual env config provided; dependencies pinned. |
| **Partial** | Package config exists but is incomplete (e.g., missing `__init__.py` in some packages, or deps not fully pinned). |
| **Fail** | No packaging config; Python files scattered without module structure; no virtual environment configuration. |
| **Severity** | medium |
| **Tech Triggers** | [python] |

---

### MNT-014: Python Import Organization

| Field | Value |
|---|---|
| **What to Look For** | Imports are consistently organized (stdlib → third-party → local) and there are no circular imports. |
| **How to Check** | 1. Check for `isort` configuration: `pyproject.toml` `[tool.isort]`, `.isort.cfg`, or `setup.cfg` `[isort]`. Verify `profile = "black"` if Black is also used. 2. Look for isort in pre-commit hooks or CI. 3. Spot-check 3-5 source files for import ordering consistency. 4. Search for potential circular imports: look for late/local imports inside functions (a common workaround for circularity). If many exist, flag it. 5. Check that `__init__.py` files don't import the entire package tree (lazy imports preferred for large packages). |
| **Pass** | `isort` configured and enforced; imports are consistent across files; no evidence of circular imports. |
| **Partial** | Import style is mostly consistent but no automated enforcement; or a few circular import workarounds exist. |
| **Fail** | No import organization tooling; chaotic import ordering; evidence of circular import problems. |
| **Severity** | low |
| **Tech Triggers** | [python] |

---

## JavaScript/TypeScript-Specific

### MNT-015: TypeScript Strict Configuration

| Field | Value |
|---|---|
| **What to Look For** | TypeScript is configured in strict mode to maximize type safety and catch bugs at compile time. |
| **How to Check** | 1. Open `tsconfig.json` (and any `tsconfig.*.json` extends files). 2. Check for `"strict": true` — this enables all strict family options. If `strict` is not `true`, check individual flags: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`. 3. Search for `@ts-ignore` and `@ts-expect-error` comments — a few targeted ones are acceptable, widespread use indicates the strict config is being bypassed. 4. Check for `any` type usage — search for `: any` occurrences. Occasional use in type guards is fine; pervasive use defeats the purpose of TypeScript. |
| **Pass** | `"strict": true` is set; minimal `@ts-ignore` / `any` usage; all strict sub-flags effectively active. |
| **Partial** | Some strict flags enabled but not all; or strict is true but heavily bypassed with `@ts-ignore` / `any`. |
| **Fail** | `strict` is false or absent; `noImplicitAny` is false; TypeScript is effectively untyped. |
| **Severity** | medium |
| **Tech Triggers** | [typescript] |

---

### MNT-016: Package.json Scripts

| Field | Value |
|---|---|
| **What to Look For** | `package.json` defines standard scripts so any developer can run common tasks without tribal knowledge. |
| **How to Check** | 1. Open `package.json` and inspect the `"scripts"` section. 2. Verify these standard scripts exist: `dev` or `start` (run locally), `build` (compile/bundle), `test` (run tests), `lint` (run linter). Nice-to-haves: `format`, `typecheck`, `clean`. 3. Run a quick sanity check — do the script commands reference installed tools (e.g., `eslint .` when eslint is in devDependencies)? 4. Check that `test` is not the default npm placeholder (`echo "Error: no test specified" && exit 1`). |
| **Pass** | `dev`, `build`, `test`, and `lint` scripts all defined and reference real tooling. |
| **Partial** | Some scripts defined but missing key ones (e.g., no `lint` or `test` is a placeholder). |
| **Fail** | Minimal or no scripts defined; `test` is the npm default placeholder. |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, express] |

---

## Architecture

### MNT-017: Separation of Concerns

| Field | Value |
|---|---|
| **What to Look For** | Business logic is cleanly separated from framework-specific code (HTTP handlers, UI components, database queries). |
| **How to Check** | 1. Identify the architectural layers: routes/controllers, services/use-cases, data-access/repositories, models/entities. 2. Check that HTTP/framework concerns (request parsing, response formatting, middleware) live in controller/route files, NOT in service files. 3. Verify business logic lives in service/use-case files that can be tested without spinning up the framework. 4. Look for direct database queries inside route handlers or controllers — these should go through a data-access layer. 5. In frontend apps, check that API calls are abstracted (service layer or hooks), not scattered across components. |
| **Pass** | Clear layered architecture; business logic is framework-independent and testable in isolation. |
| **Partial** | Some separation exists but is inconsistent — a few controllers contain business logic or direct DB calls. |
| **Fail** | No separation of concerns; route handlers contain business logic, database queries, and response formatting all in one. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### MNT-018: Configuration Management

| Field | Value |
|---|---|
| **What to Look For** | Application configuration (URLs, credentials, feature flags, thresholds) is externalized, not hardcoded in source. |
| **How to Check** | 1. Search for `.env.example` or `.env.template` — this documents required environment variables. 2. Check source code for hardcoded values: search for patterns like `http://localhost`, `127.0.0.1`, hardcoded port numbers, API keys, connection strings. 3. Verify the app reads config from environment variables or config files (look for `process.env.`, `os.environ`, `os.getenv`, `config.get`). 4. Check that `.env` files are in `.gitignore` (not committed to the repo). 5. Look for a config module/file that centralizes config loading with defaults and validation. |
| **Pass** | Config is externalized via env vars / config files; `.env.example` documents required vars; a config module centralizes access; no secrets in source. |
| **Partial** | Most config is externalized but some hardcoded values remain (e.g., default ports, localhost URLs in non-dev code). |
| **Fail** | Config values (especially secrets or URLs) are hardcoded throughout source code; no `.env.example`; no config module. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

---

### MNT-019: API Versioning Strategy

| Field | Value |
|---|---|
| **What to Look For** | APIs have a versioning strategy so breaking changes don't silently affect consumers. |
| **How to Check** | 1. Check route definitions for version prefixes: `/api/v1/`, `/api/v2/`, or header-based versioning (`Accept: application/vnd.api+json; version=1`). 2. Look for a versioning convention in the router setup or API gateway config. 3. Check for deprecation annotations or middleware (e.g., `@deprecated`, sunset headers). 4. If using GraphQL, check for `@deprecated` directive usage on fields. 5. Review the API documentation (if any) for versioning policy. |
| **Pass** | Clear versioning strategy in place (URL or header-based); deprecation process documented or implemented. |
| **Partial** | Version prefix exists (e.g., `/api/v1/`) but no deprecation strategy; or versioning is inconsistent across endpoints. |
| **Fail** | No API versioning at all; all endpoints are unversioned with no plan for managing breaking changes. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

---

### MNT-020: Database Migration Framework

| Field | Value |
|---|---|
| **What to Look For** | Database schema changes are managed through a migration framework, not manual SQL scripts or ad-hoc changes. |
| **How to Check** | 1. Look for migration tooling config: Django `migrations/` directories, Alembic `alembic.ini` + `alembic/versions/`, Knex `knexfile.js` + `migrations/`, Prisma `prisma/migrations/`, Sequelize `migrations/`, Flyway `db/migration/`, TypeORM migration files. 2. Check that migrations are committed to the repo and sequential/timestamped. 3. Look for a CI step or deployment script that runs pending migrations. 4. Verify no raw `CREATE TABLE` or `ALTER TABLE` statements exist outside the migration framework. 5. Check for seed data scripts (good practice but not required). |
| **Pass** | Migration framework is configured; migrations are committed and sequential; deployment pipeline runs them. |
| **Partial** | Migration framework exists but some schema changes are made outside of it; or migrations exist but are not run in CI/deployment. |
| **Fail** | No migration framework; schema changes are manual SQL; or no database tooling is configured. |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

---

## AI/ML Specific

### MNT-021: Prompt Management

| Field | Value |
|---|---|
| **What to Look For** | LLM prompts are externalized into template files or configuration, not hardcoded as string literals in business logic. |
| **How to Check** | 1. Search for large string literals (multi-line strings) inside Python/JS/TS source files that look like LLM prompts (contain instruction language, `{variable}` placeholders, system/user role markers). 2. Check if prompts are stored in dedicated files: `prompts/`, `templates/`, `.txt`, `.jinja2`, `.yaml`, or a prompt management module. 3. Look for prompt versioning — can prompts be updated without code changes? Are they loaded from config/files at runtime? 4. If using LangChain, check for `PromptTemplate` or `ChatPromptTemplate` usage with externalized templates vs. inline strings. 5. Verify prompt strings are not duplicated across multiple files. |
| **Pass** | Prompts are externalized in template files or a dedicated config; prompt changes don't require code changes; no duplication. |
| **Partial** | Some prompts are externalized but others are still inline; or prompts are in constants at the top of files (better than inline but not fully externalized). |
| **Fail** | Prompts are hardcoded as inline string literals throughout business logic; duplicated across files; require code deploys to update. |
| **Severity** | medium |
| **Tech Triggers** | [langchain, openai, anthropic, any_ai_ml] |

---

### MNT-022: Model Configuration Management

| Field | Value |
|---|---|
| **What to Look For** | LLM/model parameters (model name, temperature, max_tokens, top_p, etc.) are configurable via environment variables or config files, not hardcoded. |
| **How to Check** | 1. Search for hardcoded model parameters: `temperature=0.7`, `max_tokens=1024`, `model="gpt-4"`, `model_name="claude"` as literal values in function calls. 2. Check if model config is centralized in a config file or module (e.g., `config.py`, `constants.ts`, `.env`, `config.yaml`). 3. Verify model names are not hardcoded — they should come from env vars or config so you can switch models without code changes. 4. Look for a fallback/default pattern: config with sensible defaults that can be overridden by environment. 5. Check that API keys for AI services are loaded from env vars, not hardcoded. |
| **Pass** | Model parameters are in config/env vars; model names are configurable; API keys come from environment; sensible defaults with override capability. |
| **Partial** | Some parameters are configurable but model names or key settings are hardcoded; or config exists but is not consistently used. |
| **Fail** | Model names, temperatures, max_tokens, and/or API keys are hardcoded throughout the codebase. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |
