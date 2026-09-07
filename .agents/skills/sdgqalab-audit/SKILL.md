---
name: sdgqalab-audit
description: >
  Run production readiness and QA hardening audit. Iterates quality
  attribute domains across discovered stack layers, first builds a
  codebase-grounded project context model, executes tech-triggered
  evidence-based checks without generic product assumptions, supports
  layer-by-layer human feedback checkpoints, and produces reports with
  pass/fail results, severity ratings, and prioritized remediation roadmaps.
  Part of the sdgqalab.
metadata:
  author: SDG AI Lab
  version: "3.0"
---

# SDG AI Lab QA Kit — Quality Audit

Analyze production readiness across ISO-grounded quality attribute domains
and produce actionable reports with evidence-based findings, severity
ratings, and prioritized remediation roadmaps.

Read `references/taxonomy.md` for the two-dimension model (stack layers ×
quality attributes), ISO grounding, and domain catalog.

> **Related skill**: `sdgqalab-testmap` provides complementary test
> coverage analysis. Run both for a complete quality picture — they share
> `.sdgqalab/config.yml` but write to separate report directories and
> do not conflict.

## Prerequisites

- `.sdgqalab/config.yml` must exist (run `sdgqalab-init` first)
- Repository source code accessible for evidence collection

## Domain Catalog

Quality attribute domains live in `references/domains/*.md` — each is a
self-contained file with YAML frontmatter (ISO grounding, applicability
rules) and the full checklist. **Do not hard-code domain lists** — always
discover by scanning this directory at runtime.

To add a domain: drop a new `.md` file following the frontmatter schema
in `references/taxonomy.md`. It will be picked up automatically.

## Workflow

### Step 0: Ensure working branch

If on a protected branch (`main`, `develop`), create and switch to
`sdgqalab-audit/YYYY-MM-DDTHH-MM` (UTC). Always create fresh — never
reuse an existing audit branch.

### Step 1: Load configuration

Read `.sdgqalab/config.yml` for layer definitions, quality attribute
overrides, severity overrides, and excluded checks. If layers are empty,
instruct user to run `sdgqalab-init`.

### Step 2: Build the project context model

Before building the audit matrix, inspect the repository and write a
concise project context brief. The brief is audit evidence, not background
guesswork. Use actual files, schemas, routes, prompts, tests, docs, and
configuration to identify:

- Product purpose and primary user workflows
- External interfaces: HTTP routes, CLI commands, jobs, webhooks, queues,
  integrations, and public packages
- Data contracts: OpenAPI specs, GraphQL schemas, protobuf/Avro schemas,
  TypeScript types, Pydantic models, Zod schemas, JSON schemas, database
  migrations, ORM models, validation code, and sample fixtures
- AI/ML behavior, when present: task type, model/provider, prompts,
  tool/function calls, retrieval sources, structured inputs, structured
  outputs, output validators, fallback behavior, evals, and safety gates
- Runtime architecture: deployments, workers, storage, auth boundaries,
  environment files, Docker/compose/Kubernetes/Terraform, and CI/CD
- Existing quality signals: tests, linters, type checks, monitoring,
  documentation, runbooks, ADRs, and known risk notes

Use this context brief to adapt every check. Do not audit an AI feature as
a generic chatbot unless the codebase shows a user-facing free-form chat
interface. If the project has structured AI input/output schemas, validate
schema enforcement, invalid-input handling, output parsing, deterministic
contracts, and downstream consumers instead of assuming conversational UX
requirements.

If the codebase evidence conflicts with `.sdgqalab/config.yml`, flag the
conflict and ask whether to update the config before continuing.

### Step 3: Build the audit matrix

Scan `references/domains/*.md`, parse frontmatter, and match each
domain's `applicability` block against layer tech tags:

- `always_include: true` → include for every layer
- `always_include: false` → include only if tech tags match `triggers`
- `scope: project-wide` → run once for the whole project

Within each domain, filter individual checks by their `Tech Triggers`.
Special triggers: `universal`, `any_database`, `any_api`,
`any_web_framework`, `any_ai_ml`. Non-matching checks → N/A.

Before executing checks, compare the matrix against the project context
brief. Add or remove applicability only when backed by evidence; record
why any tech-trigger result was overridden.

### Step 4: Execute per-layer audits

Audit one layer at a time. For each layer × applicable quality attribute:

1. **Load** the domain file
2. **Filter** checks by tech trigger match
3. **Execute** each check:
   - Collect evidence (read files, configs, code per "How to Check")
   - Evaluate against Pass / Partial / Fail criteria
   - Assign result: PASS, FAIL, PARTIAL, or N/A
   - Record severity (use check default unless overridden)
   - Note remediation for FAIL and PARTIAL (with code examples)
4. **Skip** excluded checks (mark N/A with "Excluded by configuration")

After completing all applicable quality attributes for a layer, stop and
present a layer checkpoint unless the user explicitly requested unattended
execution. Include:

- Layer purpose, technologies, and boundaries inferred from evidence
- Checks run, checks skipped, and trigger overrides
- Top PASS/PARTIAL/FAIL findings with file-path evidence
- Any assumptions, ambiguous ownership, or missing production context
- Specific feedback request: "Does this layer context and finding set match
  the project? What should be corrected before I audit the next layer?"

If the user corrects the context, update the project context brief, revisit
affected results, and only then continue to the next layer. If the user
does not respond and the task must continue, mark the checkpoint as
"No feedback received" in the historical report metadata and proceed using
the current evidence.

### Step 5: Execute project-wide audits

For `scope: project-wide` domains (e.g., documentation), run once for
the whole project — same execution process as Step 4. For interactive
audits, present a project-wide checkpoint before scoring.

### Step 6: Score, rate, and classify

Apply `references/scoring.md`: compute per-attribute scores, assign
rating bands, compute weighted overall score, classify findings into
priority tiers (P0–P3), and determine the production readiness verdict.

### Step 7: Generate audit reports

Use `references/audit-report-template.md` to produce **one report per
quality attribute per layer** (and one per project-wide domain).

Naming: `{layer}-{domain_id}-audit.md` (e.g., `backend-security-audit.md`)
Project-wide: `project-{domain_id}-audit.md`

Write to two locations:
1. **Latest**: `.sdgqalab/memory/audit/{name}-audit.md` (overwritten)
2. **Historical**: `.sdgqalab/memory/audit/reports/YYYY-MM-DDTHH-MM/{name}-audit.md`

Each report must include a "Project Context Used" section summarizing the
relevant context brief entries that shaped applicability and evaluation.

### Step 8: Generate executive summary and update metrics

Use `assets/executive-summary-template.md` to produce
`.sdgqalab/memory/audit/executive-summary.md` with the scorecard,
production readiness verdict, blocker list, top priorities, and effort
estimates. Generate the executive summary only after all layer and
project-wide checkpoints have been handled or explicitly skipped.

Append a snapshot to `.sdgqalab/memory/audit/metrics.yml` using
`assets/metrics-template.yml`. If a previous snapshot exists, include
delta comparisons in reports.

### Step 9: Validate and output

Before finalizing, verify each report:
- File paths cited as evidence actually exist
- Check counts: pass + fail + partial + n/a = total
- Scores and ratings match formulas in scoring.md
- All FAIL items have remediation; all PARTIAL items describe gaps
- Project context claims cite codebase evidence
- AI/ML findings match the discovered AI task type, schemas, and runtime
  behavior instead of generic chatbot assumptions

Print a terminal summary with per-layer scores and overall verdict.

## Evidence Collection Rules

- **Never assume** — always verify by reading actual files
- Treat `.sdgqalab/config.yml` as a starting point, not proof; reconcile it
  with repository evidence before auditing
- Record both positive and negative evidence
- File paths must be relative to repository root
- Quote actual config values, don't paraphrase
- For PARTIAL, describe exactly what passes and what's missing
- Evidence types: config values (with line numbers), file existence,
  code patterns (< 5 lines), command output, dependency versions
- For AI/ML checks, cite the concrete prompt, schema, validator, eval,
  provider wrapper, retrieval path, or downstream consumer inspected
- Never infer chatbot, agent, RAG, classification, extraction, or generation
  behavior from package names alone; identify the actual behavior in code

## Important Notes

- **Environment-dependent checks**: Check all env files (.env, .env.prod,
  docker-compose.prod.yml). Flag when production config is missing.
- **Docker-only services**: Check Docker configs for runtime settings.
- **False positives**: Settings may be overridden by env vars — check
  the full override chain.
- **Partial implementations**: Half-done (e.g., Sentry installed but
  not configured) → PARTIAL, not FAIL.
- **Single domain/layer audit**: Supports `--domain security` or
  `--layer backend` for focused audits.
- **Re-audit**: Compares against previous metrics.yml snapshot.
