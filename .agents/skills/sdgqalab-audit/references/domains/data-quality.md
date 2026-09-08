---
domain_id: data-quality
domain_name: Data Quality
check_prefix: DQ

iso:
  quality_characteristic: "ISO 25012 Data Quality + ISO 5259 ML Data Quality"
  sub_characteristics:
    - accuracy
    - completeness
    - consistency
    - credibility
    - currentness
    - accessibility
    - compliance
    - confidentiality
    - traceability
    - understandability
  grounding_standards:
    - id: "ISO/IEC 25012"
      focus: "15 data quality characteristics — accuracy, completeness, consistency, etc."
    - id: "ISO/IEC 5259"
      focus: "Data quality for analytics and ML — training data, bias, lineage"

applicability:
  always_include: false
  triggers:
    - any_database
    - any_ai_ml
    - pandas
    - numpy
    - dbt
    - airflow
    - spark
  description: "Active for layers with data storage, processing, or ML pipelines"

scope: per-layer
---

# Data Quality

> ISO 25012 + ISO 5259 grounded checks for data accuracy, completeness,
> lineage, and governance across database and ML pipeline layers.

This domain activates when the layer includes database technologies,
data processing frameworks, or ML pipelines. It covers traditional
relational data quality (schema constraints, referential integrity,
validation) as well as ML-specific data quality (training data
documentation, bias detection, data versioning).

---

## Data Accuracy & Integrity

### DQ-001: Database Schema Constraints

| Field | Value |
|---|---|
| **What to Look For** | NOT NULL, UNIQUE, CHECK constraints, and foreign keys enforced at the database level — not just application logic |
| **How to Check** | 1. Scan migration files (`migrations/`, `alembic/versions/`, `db/migrate/`) for `NOT NULL`, `UNIQUE`, `CHECK`, and `FOREIGN KEY` declarations. 2. If using an ORM, inspect model definitions for constraint annotations (`unique=True`, `nullable=False`, `CheckConstraint`, `validates`). 3. Check for bare `TextField`/`VARCHAR` columns storing structured data (dates, enums, booleans) without CHECK constraints. 4. Verify at least primary key + NOT NULL constraints exist on every table. |
| **Pass** | All tables have primary keys; critical columns have NOT NULL / UNIQUE / CHECK constraints enforced at the DB level; foreign keys are declared |
| **Partial** | Constraints exist but are inconsistent — some tables have them, others rely solely on application-level validation |
| **Fail** | No database-level constraints beyond auto-generated PKs; all validation is application-only |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### DQ-002: Data Validation at Input

| Field | Value |
|---|---|
| **What to Look For** | All user-facing inputs (API payloads, form submissions, file uploads) are validated and sanitized before writes |
| **How to Check** | 1. Identify API endpoint handlers and form views. 2. Check for validation libraries at the boundary: Django REST serializers, Pydantic models, Zod schemas, Joi validators, marshmallow schemas. 3. Verify validation runs *before* any database write — not after. 4. Look for raw `request.data` or `request.body` passed directly to ORM `.create()` or raw SQL without intermediate validation. 5. Check file upload endpoints for type/size validation. |
| **Pass** | Every write path has explicit input validation using a schema/serializer library; no raw user input reaches the database unvalidated |
| **Partial** | Validation exists on most endpoints but some paths (e.g., internal APIs, admin endpoints, bulk import) bypass it |
| **Fail** | User input is passed directly to database operations without validation on multiple endpoints |
| **Severity** | high |
| **Tech Triggers** | [any_database, any_api] |

### DQ-003: Referential Integrity

| Field | Value |
|---|---|
| **What to Look For** | Foreign key constraints with appropriate ON DELETE / ON UPDATE rules; no orphaned records |
| **How to Check** | 1. Scan schema/migrations for `FOREIGN KEY` or ORM equivalents (`ForeignKey`, `relationship`, `references`). 2. Check ON DELETE behavior — look for explicit `CASCADE`, `SET NULL`, `RESTRICT`, or `PROTECT`. Flag any FK without an explicit delete rule (database default varies). 3. Search for soft-delete patterns (`is_deleted`, `deleted_at`) and verify FK references handle soft-deleted parents. 4. Look for ID columns (e.g., `user_id`, `order_id`) that store references but lack FK constraints (common in NoSQL-style usage of SQL databases). 5. If using Django, check `on_delete` parameter on every `ForeignKey` field. |
| **Pass** | All cross-table relationships have FK constraints with explicit ON DELETE rules; soft-delete patterns account for referential integrity |
| **Partial** | FKs exist for most relationships but some reference columns lack constraints or use implicit delete behavior |
| **Fail** | Multiple reference columns without FK constraints; no ON DELETE rules specified; orphaned records likely |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### DQ-004: Data Type Enforcement

| Field | Value |
|---|---|
| **What to Look For** | Database columns use semantically correct types — dates stored as DATE/TIMESTAMP, booleans as BOOLEAN, enums as ENUM or constrained VARCHAR |
| **How to Check** | 1. Scan models/migrations for columns that store structured data as plain TEXT or VARCHAR without constraints: dates-as-strings, booleans-as-strings (`"true"`/`"false"`), JSON-as-text without JSON column type. 2. Check for numeric values stored as strings (prices, quantities, scores). 3. Verify ENUM-like fields use database ENUM types, CHECK constraints, or application-level `choices`/`Literal` types. 4. Look for `JSONField` or `JSONB` usage — acceptable, but verify schemas are validated (e.g., JSON Schema validation, Pydantic models for JSON payloads). |
| **Pass** | Columns use appropriate database types; structured data is not stored as unvalidated text; enums are constrained |
| **Partial** | Most columns are well-typed but a few store structured data as plain text (e.g., dates or booleans as strings) |
| **Fail** | Widespread use of TEXT/VARCHAR for structured data; no type enforcement beyond string storage |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## Data Completeness & Consistency

### DQ-005: Migration Completeness

| Field | Value |
|---|---|
| **What to Look For** | All model/schema changes have corresponding migrations; no pending or out-of-sync migrations |
| **How to Check** | 1. For Django: run `python manage.py makemigrations --check --dry-run` or inspect if model fields match the latest migration state. 2. For Alembic/SQLAlchemy: check `alembic heads` vs current revision; look for model fields not reflected in migration history. 3. For Rails: check `db/schema.rb` or `structure.sql` is up to date with migrations. 4. For any ORM: compare model definitions against the latest migration file — flag fields that exist in models but not in migrations. 5. Verify migrations are ordered and have no conflicting heads (branching without merge). |
| **Pass** | All model fields have corresponding migrations; no pending migrations; migration history is linear or properly merged |
| **Partial** | Migrations exist but are slightly behind — one or two new fields lack migrations, or there are unresolved migration branches |
| **Fail** | Multiple model fields have no migration; migration history is broken or has unresolved conflicts |
| **Severity** | medium |
| **Tech Triggers** | [django, sqlalchemy, any_database] |

### DQ-006: Default Values

| Field | Value |
|---|---|
| **What to Look For** | Sensible defaults on non-nullable fields; clear NULL vs empty string semantics |
| **How to Check** | 1. Scan model/schema definitions for non-nullable columns without defaults — these will fail on INSERT if the application doesn't supply a value. 2. Check for inconsistent NULL handling: some fields use `NULL` to mean "not set" while others use empty string `""` for the same purpose. 3. Verify boolean fields have explicit defaults (`default=False` not just `nullable=False`). 4. Look for timestamp fields that should auto-populate (`auto_now_add`, `DEFAULT NOW()`, `server_default`). 5. Check for `created_at` / `updated_at` columns — verify they have database-level defaults, not just application-level. |
| **Pass** | Non-nullable columns have sensible defaults; NULL vs empty string semantics are consistent; timestamps auto-populate |
| **Partial** | Most fields have defaults but a few non-nullable columns could fail on insert; NULL/empty handling is mostly consistent |
| **Fail** | Multiple non-nullable columns without defaults; mixed NULL/empty semantics across the schema |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

### DQ-007: Data Normalization

| Field | Value |
|---|---|
| **What to Look For** | No unnecessary data duplication; denormalization is intentional and documented |
| **How to Check** | 1. Look for the same data stored in multiple tables without a single source of truth (e.g., user email in both `users` and `orders` tables). 2. Check for repeated column groups that suggest an un-extracted entity (e.g., `shipping_address_line1`, `shipping_address_city` duplicated across tables). 3. If denormalization exists (common for performance), verify it's documented with a comment or ADR explaining the trade-off. 4. Look for materialized views, cache tables, or summary tables — these are acceptable denormalization if refreshed. 5. Check for N+1 denormalization patterns: data copied to avoid joins without caching strategy. |
| **Pass** | Schema follows normalization principles; any denormalization is intentional, documented, and has a refresh/sync mechanism |
| **Partial** | Minor duplication exists but is limited; some denormalization lacks documentation |
| **Fail** | Significant data duplication across tables with no documentation or sync strategy; schema is a flat dump |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## ML Data Quality (ISO 5259)

### DQ-008: Training Data Documentation

| Field | Value |
|---|---|
| **What to Look For** | Data cards, dataset READMEs, or equivalent documentation describing training data sources, collection methods, and known limitations |
| **How to Check** | 1. Search for data documentation files: `datacard.md`, `data/README.md`, `docs/data/`, `MODEL_CARD.md` (model cards often include data sections). 2. Check for dataset metadata: source attribution, collection date, size, feature descriptions, label distribution, known biases. 3. Verify documentation covers: data source and provenance, preprocessing steps applied, train/validation/test split rationale, and any exclusion criteria. 4. If using HuggingFace datasets, check for `dataset_info` or `README.md` in the dataset directory. 5. Look for license information on training data — especially for third-party or scraped datasets. |
| **Pass** | Training datasets have data cards or equivalent docs covering source, collection method, preprocessing, splits, known limitations, and licensing |
| **Partial** | Some documentation exists but is incomplete — missing key sections like bias notes, licensing, or preprocessing details |
| **Fail** | No training data documentation; datasets are undocumented black boxes |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

### DQ-009: Data Lineage

| Field | Value |
|---|---|
| **What to Look For** | Data pipeline stages are documented and traceable from raw source through transformations to final model input |
| **How to Check** | 1. Check for pipeline DAG definitions: Airflow DAGs (`dags/`), dbt lineage (`models/`), Prefect flows, or custom pipeline scripts. 2. Verify each transformation step has a clear input → output relationship (not a monolithic script that does everything). 3. Look for data lineage tools: dbt docs, Airflow UI metadata, Great Expectations suites, or manual lineage documentation. 4. Check if intermediate datasets are named and versioned (not just overwritten temp files). 5. For ML pipelines: verify the path from raw data → features → training set → model is traceable. 6. Search for pipeline README or architecture diagram in `docs/`, `data/`, or project root. |
| **Pass** | Full lineage from source to model input is documented; pipeline stages are modular with clear inputs/outputs; lineage tool or documentation exists |
| **Partial** | Pipeline structure is visible (DAGs exist, scripts are modular) but lineage is not formally documented or only covers part of the pipeline |
| **Fail** | Data transformations are opaque — monolithic scripts, no DAG, no lineage documentation; impossible to trace data flow |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml, pandas, dbt, airflow] |

### DQ-010: Bias Detection

| Field | Value |
|---|---|
| **What to Look For** | Bias testing or monitoring in the data pipeline; evidence of dataset diversity and representativeness evaluation |
| **How to Check** | 1. Search for bias detection libraries: `fairlearn`, `aif360`, `what-if-tool`, `slicefinder`, or custom bias analysis scripts. 2. Look for demographic parity, equalized odds, or disparate impact metrics in evaluation code or notebooks. 3. Check for data stratification analysis: distribution of protected attributes (gender, race, age, geography) in training data. 4. Verify model evaluation includes per-group performance breakdowns, not just aggregate metrics. 5. Look for bias documentation in model cards or data cards. 6. Check CI/CD for automated bias checks on data or model updates. |
| **Pass** | Bias detection tools are integrated; dataset diversity is analyzed and documented; per-group evaluation metrics exist; bias findings are tracked |
| **Partial** | Some bias awareness (e.g., a notebook with exploratory analysis) but not systematized — no automated checks, incomplete coverage |
| **Fail** | No bias detection, no diversity analysis, no per-group metrics; fairness is not addressed |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

### DQ-011: Data Versioning

| Field | Value |
|---|---|
| **What to Look For** | Data versioning strategy using dedicated tools or documented snapshot/tagging approach |
| **How to Check** | 1. Check for DVC (`.dvc` files, `dvc.yaml`, `dvc.lock`), Delta Lake (`_delta_log/`), LakeFS, or Pachyderm configuration. 2. If no dedicated tool, look for versioned data directories (e.g., `data/v1/`, `data/2024-01/`), S3 versioning, or documented snapshot strategy. 3. Verify training data can be reconstructed for a given model version — check if model metadata references a specific data version or commit hash. 4. Look for data immutability patterns: raw data is never overwritten, only new versions are appended. 5. Check `requirements.txt`, `pyproject.toml`, or `Pipfile` for data versioning tool dependencies. |
| **Pass** | Data versioning tool is configured and actively used; model-to-data version mapping exists; data is immutable and reproducible |
| **Partial** | Some versioning exists (e.g., dated directories) but no formal tool; model-to-data linkage is manual or incomplete |
| **Fail** | No data versioning; datasets are mutable and overwritten in place; no way to reproduce past training runs |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

### DQ-012: Feature Store / Data Schema

| Field | Value |
|---|---|
| **What to Look For** | Feature definitions are documented and schema-validated; consistent feature engineering across training and serving |
| **How to Check** | 1. Check for feature store tools: Feast (`feature_store.yaml`), Tecton, Hopsworks, or custom feature registries. 2. If no feature store, look for feature schema definitions: Pydantic models, JSON Schema, protobuf, or documented feature catalogs. 3. Verify training-serving consistency: features used during training match those used during inference (no training-serving skew). 4. Check for feature documentation: descriptions, data types, valid ranges, null handling. 5. Look for feature validation in the pipeline (e.g., Great Expectations, pandera, custom assert statements). 6. If using embeddings as features, verify embedding dimensions and models are documented. |
| **Pass** | Features are documented in a registry/schema; training-serving consistency is enforced; feature validation exists in the pipeline |
| **Partial** | Feature definitions exist in code but lack formal documentation or validation; training-serving skew is not actively monitored |
| **Fail** | No feature documentation; features are computed ad-hoc in notebooks; no training-serving consistency checks |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

---

## Data Security & Privacy

### DQ-013: PII Handling

| Field | Value |
|---|---|
| **What to Look For** | PII fields are identified, encrypted at rest, masked in logs, and handled in compliance with GDPR / privacy regulations |
| **How to Check** | 1. Search for columns/fields likely containing PII: `email`, `phone`, `ssn`, `address`, `date_of_birth`, `ip_address`, `name`, `national_id`. 2. Verify PII columns are encrypted at rest — check for application-level encryption (`django-encrypted-model-fields`, `pgcrypto`, `cryptography` library) or database-level TDE. 3. Search log output, Sentry configs, and serializers for PII leakage — PII should never appear in plaintext logs. Check for log scrubbing/filtering. 4. Look for data anonymization or pseudonymization in non-production environments (staging, dev). 5. Check for GDPR compliance artifacts: data processing agreements, privacy policy, user data export/deletion endpoints. 6. For ML: verify training data has PII removed or pseudonymized before model training. |
| **Pass** | PII fields are identified and inventoried; encryption at rest is enforced; logs are scrubbed; GDPR endpoints exist; ML training data is de-identified |
| **Partial** | Some PII handling exists but gaps remain — e.g., encrypted in DB but leaking into logs, or no anonymization in dev environments |
| **Fail** | PII stored in plaintext with no encryption; PII visible in logs; no privacy compliance measures; ML trained on raw PII |
| **Severity** | critical |
| **Tech Triggers** | [any_database, any_ai_ml] |

### DQ-014: Data Access Controls

| Field | Value |
|---|---|
| **What to Look For** | Database access is role-based with least-privilege principles; no shared superuser accounts in application code |
| **How to Check** | 1. Check database connection configuration for the application user — it should NOT be `root`, `postgres`, `sa`, or any superuser. Look in `settings.py`, `.env`, `docker-compose.yml`, `database.yml`. 2. Verify multiple database roles exist: application read-write, read-only for reporting, migration-only for schema changes. 3. Check for row-level security or tenant isolation if multi-tenant. 4. Look for database credentials management: env vars, secrets manager (AWS Secrets Manager, Vault, GCP Secret Manager), NOT hardcoded. 5. Verify admin/migration database access is separate from application runtime access. |
| **Pass** | Application uses a least-privilege DB user; credentials are managed via secrets; admin access is separate; row-level security exists if multi-tenant |
| **Partial** | Application uses a non-superuser but it has more permissions than needed; credentials are in env vars but not rotated; admin access not fully separated |
| **Fail** | Application connects as superuser; credentials are hardcoded; no role separation; shared accounts |
| **Severity** | high |
| **Tech Triggers** | [any_database] |

### DQ-015: Data Retention Policy

| Field | Value |
|---|---|
| **What to Look For** | Documented data retention periods with automated cleanup or archival processes |
| **How to Check** | 1. Search for retention policy documentation: `docs/data-retention.md`, privacy policy, compliance docs, or ADRs. 2. Look for automated cleanup: scheduled deletion jobs (Celery tasks, cron jobs, Airflow DAGs), database partitioning with TTL, or archival scripts. 3. Check for log retention: are application logs, audit logs, and analytics data retained indefinitely or with configured TTLs? 4. Verify cloud storage lifecycle policies if using S3, GCS, or Azure Blob (check Terraform/CloudFormation for `lifecycle_rule`). 5. For ML: check if old training data, model artifacts, and experiment logs have retention/cleanup policies. |
| **Pass** | Retention periods are documented; automated cleanup/archival exists; storage lifecycle policies configured; old data is not accumulating indefinitely |
| **Partial** | Some retention awareness (e.g., log rotation configured) but no comprehensive policy; some data accumulates without cleanup |
| **Fail** | No retention policy; no automated cleanup; data grows indefinitely; no awareness of retention requirements |
| **Severity** | medium |
| **Tech Triggers** | [any_database] |

---

## Data Pipeline Quality

### DQ-016: ETL/Pipeline Error Handling

| Field | Value |
|---|---|
| **What to Look For** | Error handling, dead letter queues, retry logic, and alerting in data pipelines |
| **How to Check** | 1. For Airflow: check DAG definitions for `retries`, `retry_delay`, `on_failure_callback`, `email_on_failure`. Verify tasks have timeout settings (`execution_timeout`). 2. For dbt: check for `on-run-end` hooks, test failure handling, and whether `dbt run` failures trigger alerts. 3. For Celery/background tasks: check for `max_retries`, `retry_backoff`, dead letter queues, and failure callbacks. 4. For custom ETL scripts: look for try/except blocks around I/O operations, partial failure handling (can the pipeline resume from a checkpoint?), and error logging. 5. Verify pipeline failures produce alerts (Slack, PagerDuty, email) — not just silent log entries. 6. Check for idempotency: can pipeline steps be safely re-run after failure without duplicating data? |
| **Pass** | Pipelines have retry logic, timeout settings, dead letter handling, and alerting; failures are idempotent and recoverable; partial progress is preserved |
| **Partial** | Some error handling exists (retries configured) but incomplete — missing alerting, no dead letter queue, or no idempotency guarantee |
| **Fail** | No error handling in pipelines; failures are silent or crash the entire pipeline; no retry logic; no alerting |
| **Severity** | high |
| **Tech Triggers** | [airflow, dbt, celery, any_ai_ml] |

### DQ-017: Data Quality Monitoring

| Field | Value |
|---|---|
| **What to Look For** | Automated data quality checks running in the pipeline — assertions on schema, value ranges, nulls, uniqueness, freshness |
| **How to Check** | 1. Check for data quality frameworks: Great Expectations (`great_expectations/`), dbt tests (`tests/`, `schema.yml` with `tests:`), Soda (`soda/`), pandera schemas, or custom assertion scripts. 2. For dbt: verify `schema.yml` includes tests like `not_null`, `unique`, `accepted_values`, `relationships` on critical columns. 3. For Great Expectations: check for expectation suites and whether they run in the pipeline (not just locally). 4. Look for freshness checks: does the pipeline verify source data was updated recently? dbt `freshness:` in `sources.yml` is ideal. 5. Verify quality check failures block downstream processing — not just log warnings. 6. Check for data quality dashboards or historical tracking of quality metrics. |
| **Pass** | Data quality framework is integrated into the pipeline; critical columns have schema/value/freshness tests; failures block processing; quality is tracked over time |
| **Partial** | Some data quality checks exist (e.g., dbt tests on a few models) but coverage is incomplete; failures may not block downstream steps |
| **Fail** | No automated data quality checks; data issues are discovered only when end users report problems |
| **Severity** | medium |
| **Tech Triggers** | [any_database, any_ai_ml, dbt, airflow] |

### DQ-018: Embedding Quality Checks

| Field | Value |
|---|---|
| **What to Look For** | Vector store integrity — consistent embedding dimensions, deduplication, metadata completeness, and stale embedding detection |
| **How to Check** | 1. Identify vector store usage: ChromaDB (`chromadb`), Pinecone (`pinecone`), Weaviate (`weaviate`), Qdrant, pgvector, FAISS. 2. Check that embedding dimension is validated before insertion — mismatched dimensions cause silent failures or corrupt indices. Look for dimension constants or assertions. 3. Verify deduplication strategy: check for content hashing or ID-based upserts to prevent duplicate embeddings of the same document. 4. Check metadata completeness: each embedding should have source document reference, creation timestamp, and embedding model version. 5. Look for stale embedding detection: when source documents are updated, are embeddings re-generated? Check for update triggers or scheduled re-indexing. 6. Verify embedding model version is tracked — switching models without re-embedding all documents creates mixed-dimension or incompatible vectors. |
| **Pass** | Dimensions are validated; deduplication exists; metadata includes source, timestamp, and model version; stale embeddings are detected and refreshed |
| **Partial** | Basic vector store usage works but lacks some controls — e.g., no deduplication, no model version tracking, or no staleness detection |
| **Fail** | No quality controls on vector store; embeddings are inserted without validation, deduplication, or metadata; model version not tracked |
| **Severity** | medium |
| **Tech Triggers** | [chromadb, pinecone, weaviate, any_ai_ml] |
