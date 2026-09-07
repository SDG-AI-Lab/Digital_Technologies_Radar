# SDG QA Lab — Quality Taxonomy

> ISO-grounded, developer-practical quality assurance framework for
> production readiness auditing.

---

## Design Principles

1. **ISO = completeness guard, not compliance target.** We use ISO
   characteristics to ensure no quality category is overlooked. We do
   not audit "to ISO compliance" — the standards inform our structure,
   not our output.

2. **Checks are project-specific, not abstract.** "Configure
   django-ratelimit on public API endpoints" — not "ensure capacity
   management." The agent generates findings that reference actual
   files, line numbers, and configuration values.

3. **Tech triggers drive relevance.** Each check specifies which
   technology stacks activate it. The agent only runs checks whose
   triggers match the project's detected stack layers. A CLI tool
   won't be audited for WCAG compliance; a data pipeline won't be
   checked for browser compatibility.

4. **11 domains = comprehensive but not bloated.** A small project
   might only activate 6–7 domains (skip interaction-capability if
   no UI, skip safety if no AI, skip data-quality if no data pipeline,
   skip compatibility if no external integrations).

5. **Audit report speaks developer language.** ISO traceability is
   internal metadata — useful for us to verify completeness, invisible
   in the audit output. Developers see actionable findings, not
   standard references.

---

## Three-Level Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Level 1 — Quality Model (WHAT to audit)                    │
│  ISO/IEC 25010:2023 · ISO/IEC 25012 · ISO/IEC 25059        │
│  Defines the quality characteristics and sub-characteristics│
├─────────────────────────────────────────────────────────────┤
│  Level 2 — Specific Standards (HOW to audit)                │
│  ISO/IEC 5055 · ISO/IEC 27001 · WCAG 2.2 · ISO/IEC 42001  │
│  Provides concrete, measurable criteria per characteristic  │
├─────────────────────────────────────────────────────────────┤
│  Level 3 — Our Checks (WHAT the agent does)                 │
│  Practical, file-path-citing, tech-triggered audit items    │
│  Organized by tech triggers within each quality attribute   │
└─────────────────────────────────────────────────────────────┘
```

**Level 1** tells us which quality categories exist.
**Level 2** tells us what good looks like in each category.
**Level 3** turns that into grep-able, evidence-based checks the agent runs.

---

## ISO/IEC 25010:2023 — Product Quality Model

The 2023 revision defines **9 quality characteristics**. We use 8 of
them directly as audit domains (Functional Suitability is deferred to
sdgqalab-testmap). Key changes from the 2011 version are noted.

| # | Characteristic | Sub-characteristics | 2011 → 2023 Changes |
|---|---|---|---|
| 1 | **Functional Suitability** | Completeness, Correctness, Appropriateness | *(deferred to sdgqalab-testmap)* |
| 2 | **Performance Efficiency** | Time behaviour, Resource utilization, Capacity | Unchanged |
| 3 | **Compatibility** | Co-existence, Interoperability | Unchanged |
| 4 | **Interaction Capability** | Appropriateness recognizability, Learnability, Operability, User error protection, User engagement, Inclusivity, User assistance, Self-descriptiveness | Renamed from "Usability"; added Engagement, Inclusivity, Assistance, Self-descriptiveness |
| 5 | **Reliability** | Faultlessness, Availability, Fault tolerance, Recoverability | "Maturity" renamed to "Faultlessness" |
| 6 | **Security** | Confidentiality, Integrity, Non-repudiation, Accountability, Authenticity, Resistance | "Resistance" added |
| 7 | **Maintainability** | Modularity, Reusability, Analysability, Modifiability, Testability | Unchanged |
| 8 | **Flexibility** | Adaptability, Scalability, Installability, Replaceability | Renamed from "Portability"; "Scalability" added |
| 9 | **Safety** | Operational constraint, Risk identification, Fail safe, Hazard warning, Safe integration | Entirely new in 2023 |

---

## Complementary ISO Standards

These standards provide concrete, measurable criteria that drill into
specific ISO 25010 characteristics.

### ISO/IEC 5055:2021 — Automated Source Code Quality Measures

Defines weakness patterns (based on CWE) detectable in source code for
four quality characteristics: **Security**, **Reliability**, **Performance
Efficiency**, and **Maintainability**. Provides the most directly
automatable checks in our framework.

### ISO/IEC 27001:2022 / 27002:2022 — Information Security

Specifies controls for information security management. Informs our
security domain with authentication, access control, cryptography,
network security, and incident management checks.

### ISO/IEC 40500 (WCAG 2.0) + WCAG 2.2 — Web Accessibility

78 testable success criteria across four principles (Perceivable,
Operable, Understandable, Robust). Directly maps to our
interaction-capability domain for UI layers.

### ISO/IEC 25059 — AI System Quality

Extends ISO 25010 for AI systems. Adds sub-characteristics:
- **Functional Adaptability** (learning from data)
- **User Controllability** (human intervention)
- **Transparency** (explainability)
- **Robustness** (performance under all conditions)
- **Intervenability** (operator override capability)

### ISO/IEC 42001:2023 — AI Management System

Requirements for responsible AI development. Informs our safety domain
with governance, risk management, and ethical considerations for AI.

### ISO/IEC 23894:2023 — AI Risk Management

Guidance on AI-specific risk identification and mitigation. Complements
42001 for our safety domain.

### ISO/IEC 25012 — Data Quality Model

15 data quality characteristics (Accuracy, Completeness, Consistency,
Credibility, Currentness, Accessibility, Compliance, Confidentiality,
Efficiency, Precision, Traceability, Understandability, Availability,
Portability, Recoverability). Backbone of our data-quality domain.

### ISO/IEC 5259 — Data Quality for Analytics & ML

Extends 25012 for machine learning data pipelines. Adds considerations
for training data quality, bias detection, and data lineage.

### OWASP Top 10

Industry-standard web application security risk catalog. Complements
ISO standards with practical, web-focused security checks.

---

## Domain Catalog (11 domains)

### Tier 1 — ISO 25010:2023 Direct (8 domains)

These map directly to ISO 25010:2023 quality characteristics.

| Domain ID | Domain Name | ISO 25010 Characteristic | Check Prefix | Grounding Standards | Active When |
|---|---|---|---|---|---|
| `security` | Security | Security | SEC | ISO 5055, ISO 27001/27002, OWASP Top 10, ISO 25059 | Always |
| `reliability` | Reliability | Reliability | REL | ISO 5055, ISO 25023 | Always |
| `performance-efficiency` | Performance Efficiency | Performance Efficiency | PER | ISO 5055, ISO 25023 | Always |
| `maintainability` | Maintainability | Maintainability | MNT | ISO 5055, ISO 25023 | Always |
| `interaction-capability` | Interaction Capability | Interaction Capability | INT | WCAG 2.2 / ISO 40500, ISO 25059 | UI layers only |
| `flexibility` | Flexibility | Flexibility | FLX | ISO 25023 | Always |
| `safety` | Safety | Safety | SAF | ISO 42001, ISO 23894, ISO 25059, ISO 42005 | AI/ML layers |
| `compatibility` | Compatibility | Compatibility | CMP | ISO 25023 | APIs + integrations |

### Tier 2 — ISO-Grounded Extensions (3 domains)

These don't map 1:1 to a single ISO 25010 characteristic but are
grounded in specific ISO standards or multiple ISO 25010 sub-characteristics.

| Domain ID | Domain Name | ISO Grounding | Check Prefix | Active When |
|---|---|---|---|---|
| `data-quality` | Data Quality | ISO 25012 + ISO 5259 | DQ | Data/ML layers |
| `observability` | Observability | ISO 25010 Reliability.Availability + Maintainability.Analysability | OBS | Always |
| `documentation` | Documentation | ISO 25010 Maintainability.Analysability + Interaction Capability.Self-descriptiveness | DOC | Always |

### Why No "Production Readiness" Domain?

The overall audit IS the production readiness assessment. The executive
summary aggregates all domain scores into a go/no-go verdict with
blocker lists and priority tiers. A separate domain would duplicate
what the scoring framework already provides.

### Why No "Functional Suitability" Domain?

Functional testing (does the software do what it should?) is handled
by the companion `sdgqalab-testmap` skill, which provides test coverage
auditing, gap analysis, and test generation. Combining the two skills
gives complete functional + non-functional coverage.

---

## Two-Dimension Audit Model

The audit operates across two dimensions:

```
                    Quality Attributes (standardized, ISO-grounded)
                    ┌──────┬──────┬──────┬──────┬──────┬───┐
                    │ SEC  │ REL  │ PER  │ MNT  │ OBS  │...│
    ┌───────────────┼──────┼──────┼──────┼──────┼──────┼───┤
    │ frontend      │  ●   │  ●   │  ●   │  ●   │  ●   │   │
S   │ backend       │  ●   │  ●   │  ●   │  ●   │  ●   │   │
t   │ data-pipeline │  ●   │  ●   │  ●   │  ●   │  ●   │   │
a   │ ml-models     │  ●   │  ●   │  ●   │  ●   │  ●   │   │
c   └───────────────┴──────┴──────┴──────┴──────┴──────┴───┘
k
    Layers (dynamic, discovered per-project)
```

**Stack Layers** (rows) — discovered dynamically by `sdgqalab-init`:
- Auto-detected from the project's dependency files and structure
- Confirmed and adjusted by the user (HITL)
- Examples: `[frontend, backend]`, `[api, ml-pipeline, data-store]`
- Each layer has a detected tech stack (e.g., `react-typescript`, `python-django`)

**Quality Attributes** (columns) — standardized audit domains:
- Defined in the domain catalog (`references/domains/*.md`)
- Each domain file specifies tech triggers for layer applicability
- The agent activates relevant checks per layer based on tech triggers

---

## Domain File Schema

Each domain file in `references/domains/` is a self-contained Markdown
file with YAML frontmatter followed by the check definitions.

### Frontmatter Schema

```yaml
---
domain_id: security                    # Unique identifier, matches filename
domain_name: Security                  # Human-readable name
check_prefix: SEC                      # Prefix for check IDs (SEC-001, SEC-002, ...)

# ISO grounding (internal metadata for completeness tracking)
iso:
  quality_characteristic: Security     # ISO 25010:2023 characteristic
  sub_characteristics:                 # Which sub-characteristics this domain covers
    - confidentiality
    - integrity
    - non-repudiation
    - accountability
    - authenticity
    - resistance
  grounding_standards:                 # Specific standards informing our checks
    - id: "ISO/IEC 5055:2021"
      focus: "Automated security weakness patterns from source code"
    - id: "ISO/IEC 27001:2022"
      focus: "Information security management controls"
    - id: "OWASP Top 10 2021"
      focus: "Web application security risks"
    - id: "ISO/IEC 25059"
      focus: "AI security extensions — intervenability"
      activates_for: [ai_ml]

# Applicability rules
applicability:
  always_include: true                 # Include for every layer?
  triggers: []                         # Tech stack triggers (if not always)
  description: "Every layer must be security-audited"

# Scope
scope: per-layer                       # per-layer | project-wide
---
```

### Check Structure

Each check within a domain file follows this pattern:

```markdown
### SEC-001: SQL Injection Prevention

| Field | Value |
|---|---|
| **What to Look For** | All database queries use parameterized queries or ORM |
| **How to Check** | 1. Search for raw SQL patterns. 2. Check ORM usage. 3. Inspect migration files. |
| **Pass** | All queries use ORM or parameterized queries exclusively |
| **Partial** | Raw SQL exists but only with hardcoded values (no user input) |
| **Fail** | Raw SQL with string concatenation using user-controlled input |
| **Severity** | critical |
| **Tech Triggers** | [django, fastapi, sqlalchemy, any_database] |
```

**Fields explained:**
- **What to Look For** — concise description of what constitutes quality
- **How to Check** — step-by-step instructions for the agent (grep patterns, file paths, config keys)
- **Pass / Partial / Fail** — unambiguous criteria for each result
- **Severity** — `critical | high | medium | low`
- **Tech Triggers** — which tech stacks activate this check; agent skips if layer doesn't match

Checks within a domain file are organized under sections by scope:
- `## Universal Checks` — apply to any layer
- `## Web Application Checks` — apply when web frameworks detected
- `## API Checks` — apply when API frameworks detected
- `## AI/ML Checks` — apply when AI/ML libraries detected
- `## Data Pipeline Checks` — apply when data processing detected

---

## Check ID Conventions

| Prefix | Domain |
|---|---|
| SEC | Security |
| REL | Reliability |
| PER | Performance Efficiency |
| MNT | Maintainability |
| INT | Interaction Capability |
| FLX | Flexibility |
| SAF | Safety |
| CMP | Compatibility |
| DQ | Data Quality |
| OBS | Observability |
| DOC | Documentation |

IDs are sequential within each domain: `SEC-001`, `SEC-002`, etc.
Gaps in numbering are acceptable (checks may be removed over time).

---

## Layer Discovery & Tech Triggers

### How Layers Are Discovered (`sdgqalab-init`)

1. **Auto-detect** — scan dependency files, Dockerfiles, project structure
2. **HITL confirmation** — present discovered layers to user, allow add/remove/rename
3. **Tech tagging** — each layer gets a set of technology tags (e.g., `[python, django, postgresql, redis]`)

### How Tech Triggers Work (`sdgqalab-audit`)

Each check specifies `Tech Triggers` — a list of technology tags.
At audit time, the agent:

1. Reads the layer's technology tags from config
2. For each check in the domain, compares tech triggers against layer tags
3. Runs the check only if there's a match (or if trigger is `universal`)
4. Marks non-matching checks as N/A

Special trigger values:
- `universal` — runs for every layer
- `any_database` — runs if any database technology detected
- `any_api` — runs if any API framework detected
- `any_web_framework` — runs if any web framework detected
- `any_ai_ml` — runs if any AI/ML library detected

---

## Scoring & Verdicts

See `scoring.md` for the complete scoring methodology. Key points:

- Each quality attribute domain gets a score (0–100%)
- Scores are weighted by check severity
- Overall verdict is a production readiness assessment:
  - Critical → **NOT PRODUCTION READY**
  - Low → **NOT RECOMMENDED**
  - Adequate → **CONDITIONALLY READY**
  - Solid → **PRODUCTION READY**
  - Exemplary → **EXEMPLARY**

The overall audit IS the production readiness assessment. No separate
"production readiness" domain is needed.
