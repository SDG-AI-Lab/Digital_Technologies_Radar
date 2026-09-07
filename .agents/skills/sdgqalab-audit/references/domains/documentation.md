---
domain_id: documentation
domain_name: Documentation
check_prefix: DOC

iso:
  quality_characteristic: "ISO 25010 Maintainability.Analysability + Interaction Capability.Self-descriptiveness"
  sub_characteristics:
    - analysability
    - self_descriptiveness
  grounding_standards:
    - id: "ISO/IEC 25010:2023"
      focus: "Maintainability.Analysability — ease of diagnosing issues; Interaction Capability.Self-descriptiveness — system self-documentation"
    - id: "ISO/IEC 25023"
      focus: "Documentation completeness and quality measurement"

applicability:
  always_include: true
  triggers: []
  description: "Every project needs documentation for production operation"

scope: project-wide
---

# Documentation — Quality Attribute Domain

Documentation is the connective tissue between what your system does and what
humans need to know to build, run, debug, and evolve it. This domain audits the
presence, completeness, and practical usefulness of project documentation —
from README through runbooks to AI model cards.

**Scope:** project-wide (not per-layer).

---

## Project Documentation

### DOC-001: README Completeness

| Field | Value |
|---|---|
| **What to Look For** | A `README.md` at the repo root that gives a new developer (or on-call SRE) enough context to understand what this project is and how to get started. |
| **How to Check** | 1. Open `README.md` at the repository root. 2. Verify it contains **all** of the following sections (exact headings may vary): a) **Project description** — what the system does in 2-3 sentences; b) **Prerequisites / Requirements** — runtime versions, system-level deps; c) **Setup / Installation** — how to go from clone to running locally; d) **Development workflow** — how to run tests, linters, build commands; e) **Architecture overview** — high-level diagram or prose explaining major components. 3. Check the README was updated within the last 6 months (use `git log -1 -- README.md`). |
| **Pass** | README contains all five sections and was updated within the last 6 months. |
| **Partial** | README exists but is missing 1-2 of the five sections, or content is clearly stale. |
| **Fail** | README is missing, is a skeleton placeholder, or is missing 3+ sections. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### DOC-002: Setup Instructions

| Field | Value |
|---|---|
| **What to Look For** | Step-by-step setup guide that a new developer can follow to get the project running locally from scratch. |
| **How to Check** | 1. Locate setup instructions (README section, `docs/setup.md`, or `CONTRIBUTING.md`). 2. Walk through the documented steps mentally and compare against actual project files: a) Do listed dependencies match `package.json`, `requirements.txt`, `pyproject.toml`, `Gemfile`, etc.? b) Are database setup steps included if a database is used? c) Are env var setup steps included if `.env` or config files are needed? d) Is the documented start command correct (check `scripts` in `package.json`, `Makefile`, `docker-compose.yml`)? 3. Flag any obvious mismatch (e.g., docs say `npm start` but `package.json` has no `start` script). |
| **Pass** | Setup instructions exist, match actual dependency/config files, and cover all major steps (deps, config, database, start). |
| **Partial** | Setup instructions exist but are incomplete or have minor mismatches with actual project files. |
| **Fail** | No setup instructions, or instructions are clearly broken (reference nonexistent files, wrong commands). |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### DOC-003: Architecture Documentation

| Field | Value |
|---|---|
| **What to Look For** | Architecture-level documentation that explains the system's major components, their interactions, and key design decisions. |
| **How to Check** | 1. Search for architecture docs in common locations: `docs/architecture.md`, `docs/design/`, `docs/adr/`, `ADR/`, `ARCHITECTURE.md`, `docs/diagrams/`. 2. Check README for an architecture section or link to external docs. 3. Look for Architecture Decision Records (ADRs) — files following a numbered naming pattern like `001-*.md` or using a template with Status/Context/Decision/Consequences sections. 4. Check for diagram files (`.drawio`, `.mermaid`, `.puml`, `.png`/`.svg` in a `diagrams/` folder). 5. Evaluate: does the documentation explain the "why" behind major technical choices? |
| **Pass** | Architecture documentation exists with component overview, interaction patterns, and at least 2 ADRs or a comprehensive design doc. |
| **Partial** | Some architecture documentation exists (e.g., a diagram without explanation, or a brief section in the README) but lacks depth or ADRs. |
| **Fail** | No architecture documentation found anywhere in the repository. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### DOC-004: Contributing Guide

| Field | Value |
|---|---|
| **What to Look For** | A `CONTRIBUTING.md` or equivalent that tells new contributors how to participate in the project. |
| **How to Check** | 1. Check for `CONTRIBUTING.md` at the repo root or `docs/contributing.md`. 2. Verify it covers: a) **Coding standards** — style guide reference, linter config, formatting rules; b) **Branch strategy** — naming conventions, which branch to branch from; c) **PR process** — how to submit, review expectations, required checks; d) **Commit conventions** — message format (e.g., Conventional Commits); e) **Testing requirements** — what tests must pass, coverage expectations. 3. Cross-reference with actual CI config (`.github/workflows/`, `.gitlab-ci.yml`) to ensure documented process matches automated checks. |
| **Pass** | Contributing guide exists and covers at least 4 of the 5 areas above, consistent with CI configuration. |
| **Partial** | Contributing guide exists but is thin (covers 1-3 areas) or is inconsistent with actual CI/review process. |
| **Fail** | No contributing guide found. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### DOC-005: Changelog / Release Notes

| Field | Value |
|---|---|
| **What to Look For** | A version history that tracks what changed between releases, enabling users and operators to understand upgrade impact. |
| **How to Check** | 1. Check for `CHANGELOG.md` or `HISTORY.md` at the repo root. 2. Check GitHub Releases page (look for release tags via `git tag -l`). 3. If a changelog exists, verify: a) Entries are organized by version/date; b) Recent releases (last 3+) have entries; c) Entries categorize changes (Added, Changed, Fixed, Removed — "Keep a Changelog" format preferred); d) Breaking changes are explicitly called out. 4. If using automated changelog generation (e.g., `standard-version`, `semantic-release`), verify the tool is configured and producing output. |
| **Pass** | Changelog or release notes exist, cover the last 3+ releases, and categorize changes clearly. |
| **Partial** | Changelog exists but is incomplete (missing recent versions, no categorization, or only has auto-generated commit lists). |
| **Fail** | No changelog, no release notes, and no release tags found. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

---

## API Documentation

### DOC-006: API Documentation

| Field | Value |
|---|---|
| **What to Look For** | Published API documentation that describes all public endpoints, their parameters, and response formats. |
| **How to Check** | 1. Search for OpenAPI/Swagger spec files: `openapi.yaml`, `openapi.json`, `swagger.yaml`, `swagger.json`, or files in `docs/api/`. 2. Check for auto-generated API docs: a) **Django REST Framework** — look for `drf-spectacular` or `drf-yasg` in `requirements*.txt` / `pyproject.toml` and a `/api/schema/` or `/swagger/` URL route; b) **FastAPI** — built-in at `/docs` and `/redoc`, check `main.py` or app entry for route mounts; c) **Express/Node** — look for `swagger-jsdoc`, `swagger-ui-express`, or `tsoa` in `package.json`; d) **Spring Boot** — look for `springdoc-openapi` or `springfox` in `pom.xml`/`build.gradle`. 3. If no auto-generation, check for manual API docs in `docs/api/`, wiki, or README. 4. Verify docs cover at least 80% of routes (compare documented endpoints against router/URL config files). |
| **Pass** | API documentation exists (auto-generated or manual), covers all major endpoints, and is accessible to developers. |
| **Partial** | API docs exist but are incomplete (missing endpoints, outdated, or only cover a subset of the API). |
| **Fail** | No API documentation found for a project that exposes an API. |
| **Severity** | high |
| **Tech Triggers** | [any_api] |

### DOC-007: API Examples

| Field | Value |
|---|---|
| **What to Look For** | Request/response examples for key API endpoints that developers can copy-paste to test quickly. |
| **How to Check** | 1. Open the API documentation (identified in DOC-006). 2. Check that major endpoints include: a) Example request body (for POST/PUT/PATCH); b) Example successful response (200/201); c) Example error response (400/401/404/422). 3. Look for supplementary example collections: Postman collections (`.postman_collection.json`), Insomnia exports, HTTP files (`.http`, `.rest`), or a `docs/examples/` directory. 4. Check if OpenAPI spec includes `example` or `examples` fields in schema definitions. 5. For GraphQL APIs, look for example queries in docs or a `queries/` directory. |
| **Pass** | Key endpoints have request/response examples, and at least one example collection (Postman, HTTP files, etc.) is provided. |
| **Partial** | Some examples exist but are incomplete — missing error cases, or examples only cover a few endpoints. |
| **Fail** | No request/response examples found in API docs or as separate files. |
| **Severity** | medium |
| **Tech Triggers** | [any_api] |

### DOC-008: Authentication Documentation

| Field | Value |
|---|---|
| **What to Look For** | Clear documentation of how authentication and authorization work — how to get tokens, what headers to send, session management, and permission model. |
| **How to Check** | 1. Search for auth documentation in: `docs/auth*.md`, `docs/authentication*.md`, `docs/security*.md`, README auth section. 2. Verify documentation covers: a) **Auth method** — JWT, OAuth2, API keys, session cookies, etc.; b) **How to obtain credentials** — registration flow, API key generation, OAuth client setup; c) **How to authenticate requests** — exact header format (`Authorization: Bearer <token>`), cookie handling; d) **Token lifecycle** — expiration, refresh mechanism, revocation; e) **Permission model** — roles, scopes, what each role/scope can access. 3. Check if auth is documented in the OpenAPI spec (look for `securitySchemes` in the spec). 4. Verify documentation matches actual auth middleware/decorators in the codebase. |
| **Pass** | Auth documentation covers method, credential acquisition, request format, token lifecycle, and permission model. |
| **Partial** | Auth is mentioned but incompletely — e.g., says "uses JWT" without explaining how to obtain or refresh tokens. |
| **Fail** | No authentication documentation found for a project that requires authentication. |
| **Severity** | high |
| **Tech Triggers** | [any_api, any_web_framework] |

---

## Operational Documentation

### DOC-009: Deployment Guide

| Field | Value |
|---|---|
| **What to Look For** | Documentation describing how the application is deployed to each environment, including rollback procedures. |
| **How to Check** | 1. Search for deployment docs: `docs/deployment.md`, `docs/ops/`, `DEPLOYMENT.md`, `docs/runbooks/deploy*`. 2. Check if CI/CD pipeline files are self-documenting (well-commented `.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`, `deploy/`). 3. Verify documentation covers: a) **Deployment targets** — where the app runs (AWS, GCP, Azure, Kubernetes, bare metal); b) **Deployment steps** — what happens during a deploy (build, test, push image, apply manifests, migrate DB); c) **Rollback procedure** — how to revert a bad deploy; d) **Environment promotion** — how code moves from dev → staging → production; e) **Secrets management** — how secrets are injected at deploy time (not the secrets themselves). 4. If using IaC (Terraform, Pulumi, CDK), check for a README in the IaC directory. |
| **Pass** | Deployment documentation covers all environments, step-by-step process, rollback, and is consistent with actual CI/CD config. |
| **Partial** | Some deployment docs exist but are incomplete (e.g., missing rollback, only covers one environment, or CI/CD is undocumented). |
| **Fail** | No deployment documentation found. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### DOC-010: Environment Variables Documentation

| Field | Value |
|---|---|
| **What to Look For** | A complete inventory of all environment variables the application requires, with descriptions and example values. |
| **How to Check** | 1. Look for `.env.example`, `.env.sample`, `.env.template`, or `env.example` at the repo root and in service directories. 2. Check for env var documentation in README, `docs/configuration.md`, or `docs/env-vars.md`. 3. Cross-reference documented env vars against actual usage: a) Search codebase for `os.environ`, `process.env`, `os.Getenv`, `System.getenv`, `ENV[`, or config-loading patterns; b) Compare the list of env vars found in code against what is documented; c) Flag any undocumented env vars, especially those with no default value (they will crash at runtime if missing). 4. Verify documentation includes: a) Variable name; b) Description of purpose; c) Whether it is required or optional; d) Default value (if any); e) Example/valid values. |
| **Pass** | All env vars are documented with descriptions, required/optional status, and example values. Documentation matches actual code usage. |
| **Partial** | `.env.example` exists but is missing descriptions, or some env vars used in code are not documented. |
| **Fail** | No env var documentation. Application uses env vars but no `.env.example` or equivalent exists. |
| **Severity** | high |
| **Tech Triggers** | [universal] |

### DOC-011: Incident Response Runbook

| Field | Value |
|---|---|
| **What to Look For** | Documented procedures for responding to production incidents — who to contact, how to diagnose, common fixes. |
| **How to Check** | 1. Search for runbooks: `docs/runbooks/`, `docs/ops/`, `runbooks/`, `docs/incident*.md`, `docs/on-call*.md`. 2. Check for incident response documentation covering: a) **Escalation path** — who to contact first, second, third; on-call rotation if applicable; b) **Common failure modes** — top 5-10 known issues and how to resolve them; c) **Diagnostic commands** — how to check logs, health endpoints, database state, queue depth; d) **Communication template** — how to communicate status to stakeholders during an incident; e) **Post-mortem process** — how to conduct and document a post-mortem after resolution. 3. If the project is early-stage, at minimum check for documented health check endpoints and basic troubleshooting steps. |
| **Pass** | Runbook exists with escalation path, common failure modes, diagnostic steps, and post-mortem process. |
| **Partial** | Some operational docs exist (e.g., basic troubleshooting in README) but no formal runbook with escalation and diagnostic procedures. |
| **Fail** | No incident response documentation found. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### DOC-012: Monitoring & Alerting Guide

| Field | Value |
|---|---|
| **What to Look For** | Documentation explaining what is monitored, what alerts exist, what each alert means, and how to respond. |
| **How to Check** | 1. Search for monitoring docs: `docs/monitoring.md`, `docs/alerting.md`, `docs/ops/monitoring*`, `docs/observability*`. 2. Check for alert definition files: Prometheus alert rules (`*.rules.yml`), Datadog monitors, PagerDuty config, Grafana alert JSON. 3. Verify documentation covers: a) **Key metrics** — what metrics are tracked (latency, error rate, saturation, etc.); b) **Alert inventory** — list of all configured alerts with threshold values; c) **Alert response** — for each alert, what it means and what to do when it fires; d) **Dashboard locations** — links or descriptions of where to find dashboards; e) **SLIs/SLOs** — if defined, where they are documented and how they are measured. 4. Cross-reference alert definitions with documented response procedures. |
| **Pass** | Monitoring documentation covers key metrics, alert inventory with thresholds, response procedures, and dashboard locations. |
| **Partial** | Some monitoring is set up (alert configs found) but documentation of what alerts mean and how to respond is missing or incomplete. |
| **Fail** | No monitoring or alerting documentation found. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### DOC-013: Backup & Recovery Procedures

| Field | Value |
|---|---|
| **What to Look For** | Documented backup strategy including what is backed up, how often, where backups are stored, and how to restore from backup. |
| **How to Check** | 1. Search for backup docs: `docs/backup*.md`, `docs/recovery*.md`, `docs/ops/backup*`, `docs/disaster-recovery*`. 2. Check IaC/config for backup configuration: a) Database backup cron jobs or managed service backup settings; b) Cloud provider backup policies (AWS Backup, GCP snapshots, Azure Backup); c) Object storage lifecycle policies. 3. Verify documentation covers: a) **What is backed up** — databases, file storage, configuration, secrets; b) **Backup frequency** — how often (hourly, daily, weekly); c) **Retention policy** — how long backups are kept; d) **Backup location** — where backups are stored (cross-region, cross-account); e) **Restore procedure** — step-by-step instructions to restore from backup; f) **Recovery testing** — when backups were last tested, how often they are validated. 4. If the project uses a managed database service, verify the backup configuration is documented even if it is automatic. |
| **Pass** | Backup documentation covers what/frequency/retention/location/restore and includes evidence of tested recovery. |
| **Partial** | Backup configuration exists (in IaC or cloud console) but documentation is incomplete — e.g., no restore procedure or no evidence of recovery testing. |
| **Fail** | No backup documentation and no identifiable backup configuration for a project that stores persistent data. |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## Code Documentation

### DOC-014: Code Comments Quality

| Field | Value |
|---|---|
| **What to Look For** | Meaningful code documentation — module-level docstrings, complex function documentation, and absence of stale markers in critical paths. |
| **How to Check** | 1. Sample 5-10 key source files (entry points, core business logic, complex utilities). 2. Check for **module-level documentation**: a) Python: module docstrings at top of `.py` files; b) JavaScript/TypeScript: JSDoc comment block or header comment; c) Go: package-level comment in `doc.go` or main package file; d) Java/C#: class-level Javadoc/XMLDoc. 3. Check for **function-level documentation** on complex or public functions (more than 20 lines, or with non-obvious parameters). 4. Search for stale markers: `grep -rn "TODO\|FIXME\|HACK\|XXX\|WORKAROUND"` — count and assess. A few TODOs in non-critical code are fine; TODOs in core business logic or security-critical paths are a concern. 5. Verify critical algorithms or business rules have explanatory comments (the "why", not the "what"). |
| **Pass** | Key modules have docstrings/header comments, complex functions are documented, and no stale TODO/FIXME markers exist in critical code paths. |
| **Partial** | Some documentation exists but is inconsistent — some modules documented, others not. A few stale markers in non-critical code. |
| **Fail** | No meaningful code documentation. Stale TODO/FIXME/HACK markers scattered through critical business logic. |
| **Severity** | low |
| **Tech Triggers** | [universal] |

### DOC-015: Configuration Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documentation of all configuration options the application accepts — what each setting does, valid values, and defaults. |
| **How to Check** | 1. Identify configuration sources: a) Config files (`config.yaml`, `settings.py`, `application.properties`, `config/*.json`); b) Environment variables (covered separately in DOC-010, but config-file settings need docs too); c) Command-line flags; d) Feature flags / remote config. 2. Check for configuration documentation: a) Inline comments in config files explaining each setting; b) A dedicated `docs/configuration.md` or config section in README; c) Config schema file (JSON Schema, Pydantic model with descriptions, Zod schema with `.describe()`). 3. Verify documentation covers: a) Setting name and purpose; b) Valid values or value type; c) Default value; d) Impact of changing the value (e.g., "increasing this above 100 may cause OOM"). 4. Flag any config settings that have no documentation and no obvious name. |
| **Pass** | All configuration options are documented (inline or in dedicated docs) with purpose, valid values, and defaults. |
| **Partial** | Some config is documented (e.g., comments in config files) but coverage is incomplete or descriptions are too terse to be useful. |
| **Fail** | Configuration files exist with no documentation, no inline comments, and no config reference docs. |
| **Severity** | medium |
| **Tech Triggers** | [universal] |

### DOC-016: Database Schema Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documentation of the database schema — tables/collections, relationships, column meanings, and migration history. |
| **How to Check** | 1. Check for schema documentation: a) ERD diagram files (`.drawio`, `.mermaid`, `.puml`, image files in `docs/database/` or `docs/schema/`); b) Schema description doc (`docs/database.md`, `docs/schema.md`, `docs/data-model.md`); c) Auto-generated schema docs (e.g., `dbdocs`, `SchemaSpy`, `django-extensions` graph). 2. Check ORM models for documentation: a) Python (Django/SQLAlchemy): look for `help_text`, docstrings on model classes, field comments; b) TypeScript (Prisma): `///` comments in `schema.prisma`; c) Ruby (Rails): look for `db/schema.rb` comments or model annotations (`annotate` gem). 3. Check for migration files and verify they are named descriptively (not just timestamps). 4. Verify that relationships (foreign keys, many-to-many) are documented or obvious from the schema. 5. Check for a data dictionary that explains what each table and non-obvious column represents. |
| **Pass** | Schema documentation exists (ERD or written), key tables/columns are described, and relationships are clear. |
| **Partial** | ORM models exist and are somewhat self-documenting, but no dedicated schema docs or ERD, and some tables/columns have unclear purpose. |
| **Fail** | No schema documentation, ORM models have no comments, and column names are ambiguous. |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## AI/ML Documentation

### DOC-017: AI/ML Model Documentation

| Field | Value |
|---|---|
| **What to Look For** | Model cards or equivalent documentation that describes each AI/ML model used — what it does, how it was trained, its performance characteristics, and its limitations. |
| **How to Check** | 1. Search for model documentation: `docs/models/`, `docs/ml/`, `MODEL_CARD.md`, `model_card*.md`, `docs/ai/`. 2. Check for model card content covering: a) **Model purpose** — what task the model performs, what problem it solves; b) **Training data** — what data was used, data collection methodology, known biases in the data; c) **Architecture** — model type, size, key hyperparameters; d) **Performance metrics** — accuracy, precision, recall, F1, or domain-specific metrics with evaluation dataset details; e) **Limitations** — known failure modes, out-of-distribution behavior, demographic performance gaps; f) **Intended use** — approved use cases vs. out-of-scope uses; g) **Version** — model version, training date, last retraining date. 3. For third-party models (OpenAI, Anthropic, HuggingFace), verify documentation of which specific model version is used and any fine-tuning applied. 4. Check if model documentation is kept in sync with deployed model versions. |
| **Pass** | Model cards exist for each model covering purpose, training data, metrics, limitations, and versioning. |
| **Partial** | Some model documentation exists but is incomplete — e.g., mentions the model but omits limitations, performance metrics, or training data description. |
| **Fail** | No model documentation found for a project that uses AI/ML models. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

### DOC-018: Prompt Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documentation of LLM prompts including their purpose, expected behavior, input/output format, and known edge cases. |
| **How to Check** | 1. Identify prompt files or prompt strings in code: a) Dedicated prompt files: `prompts/`, `templates/`, files with `prompt` in the name; b) Inline prompts: search for `system_message`, `SystemMessage`, `ChatPromptTemplate`, `PromptTemplate`, long string literals passed to LLM APIs. 2. For each prompt or prompt template, check for: a) **Purpose statement** — what this prompt is supposed to accomplish; b) **Input variables** — what context is injected and what format it should be in; c) **Expected output format** — what the LLM should return (JSON, markdown, classification label, etc.); d) **Few-shot examples** — if used, are they documented and representative? e) **Known edge cases** — documented failure modes, hallucination risks, or inputs that produce poor results; f) **Version/changelog** — history of prompt changes and why they were made. 3. Check for a prompt registry or catalog if the project uses multiple prompts. 4. Verify prompt documentation is co-located with the prompts themselves (comments above the prompt, or a companion `.md` file). |
| **Pass** | Prompts are documented with purpose, I/O format, edge cases, and version history. Prompt registry exists for multi-prompt systems. |
| **Partial** | Prompts have some documentation (e.g., inline comments describing purpose) but lack edge case documentation or version history. |
| **Fail** | Prompts exist as raw strings with no documentation of purpose, expected behavior, or known limitations. |
| **Severity** | medium |
| **Tech Triggers** | [langchain, openai, anthropic, any_ai_ml] |

### DOC-019: AI Decision Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documentation that clearly delineates when the system uses AI/ML vs. deterministic logic, and the boundaries and fallback behavior for AI-driven decisions. |
| **How to Check** | 1. Search for AI decision documentation: `docs/ai-decisions.md`, `docs/ml/decision-boundaries.md`, `docs/architecture/ai-*`. 2. Check for documentation covering: a) **Decision inventory** — which decisions in the system are made by AI vs. deterministic code; b) **Confidence thresholds** — at what confidence level does the system trust AI output vs. falling back to a default or human review; c) **Fallback behavior** — what happens when the AI model is unavailable, returns low confidence, or errors out; d) **Human-in-the-loop** — which AI decisions require human approval, and how that approval flow works; e) **Audit trail** — whether AI decisions are logged for review, and where those logs are. 3. Check application code for confidence thresholds and fallback logic — verify these are documented, not just buried in code. 4. Look for feature flags that control AI feature rollout and verify they are documented. |
| **Pass** | AI decision boundaries are documented with confidence thresholds, fallback behavior, HITL flows, and audit logging. |
| **Partial** | Some AI decision documentation exists (e.g., mentions fallback behavior) but lacks a complete decision inventory or confidence threshold documentation. |
| **Fail** | No documentation of AI decision boundaries — unclear where the system uses AI vs. deterministic logic. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

### DOC-020: Data Pipeline Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documentation of data pipelines including data flow diagrams, transformation steps, input/output schemas, scheduling, and failure handling. |
| **How to Check** | 1. Search for pipeline documentation: `docs/pipelines/`, `docs/data/`, `docs/etl/`, `docs/data-flow*`, `dags/README.md`. 2. Check for pipeline documentation covering: a) **Data flow diagram** — visual or written description of how data moves through the system (sources → transformations → destinations); b) **Input schemas** — what data each pipeline expects, format, validation rules; c) **Output schemas** — what each pipeline produces, where it lands; d) **Transformation logic** — key transformations explained (especially business-rule-driven ones); e) **Scheduling** — when pipelines run, cron expressions, trigger conditions; f) **Failure handling** — what happens when a pipeline step fails, retry policy, dead-letter behavior; g) **Data quality checks** — what validations are in place, how data quality issues are surfaced. 3. For Airflow: check DAG docstrings (`doc_md` attribute) and README in `dags/` directory. 4. For dbt: check `schema.yml` for model descriptions and `docs/` for generated dbt docs. 5. For custom pipelines: check for README or docs co-located with pipeline code. |
| **Pass** | Pipeline documentation covers data flow, I/O schemas, transformation logic, scheduling, and failure handling. |
| **Partial** | Some pipeline documentation exists (e.g., DAG code is readable, dbt models have descriptions) but no comprehensive data flow documentation or failure handling docs. |
| **Fail** | No data pipeline documentation found for a project that processes data through multi-step pipelines. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml, airflow, dbt] |
