---
name: sdgqalab-init
description: >
  Initialize the QA kit for a project. Discovers tech stack, identifies
  stack layers, maps quality attribute domains, detects test patterns and
  ignore rules, and generates .sdgqalab/config.yml. Run before
  sdgqalab-audit or sdgqalab-testmap.
  Part of the sdgqalab.
metadata:
  author: SDG AI Lab
  version: "3.0"
---

# SDG AI Lab QA Kit — Init

Discover project tech stack, identify stack layers, map applicable quality
attribute domains, detect test patterns and ignore rules, and generate
`.sdgqalab/config.yml` — the shared configuration for both the QA
audit and the coverage audit.

Read `../sdgqalab-audit/references/taxonomy.md` for the two-dimension
model (stack layers × quality attributes) and the ISO-grounded domain
catalog.

## Workflow

### Step 0: Ensure working branch

If on a protected branch (`main`, `develop`), create and switch to
`sdgqalab-init`. Otherwise proceed on the current branch.

### Step 1: Read project context

Check for `.specify/memory/constitution.md`. If it exists, extract tech
stack, project type, deployment targets, and compliance requirements.
If not, ask the user for this context.

### Step 2: Discover tech stack

Scan dependency and configuration files to build a structured tech stack
inventory. Read `references/stack-detection.md` for the full detection
matrix (files, patterns, categories).

Write the inventory to `.sdgqalab/tech-stack.md` using
`assets/tech-stack-template.md`.

### Step 3: Identify stack layers

A **stack layer** is an independently auditable unit. Layers are
discovered per-project — not preset. Common patterns:

| Project Type | Likely Layers |
|-------------|-----------|
| Full-stack web app | `frontend`, `backend` |
| Full-stack with AI | `frontend`, `backend`, `ai-pipeline` |
| API-only service | `api` |
| Monorepo | One layer per service/package |
| Data platform | `ingestion`, `processing`, `serving` |
| ML project | `data-pipeline`, `training`, `inference-api` |

For each layer, detect:
1. **Root directory** — where source code lives
2. **Type label** — freeform (e.g., `react-typescript`, `python-django`)
3. **Tech tags** — technology identifiers for check trigger matching
4. **Services** — related infrastructure (database, cache, proxy, etc.)

### Step 4: Map applicable quality attributes

Scan `../sdgqalab-audit/references/domains/*.md`, parse YAML
frontmatter, and match each domain's `applicability` block against layer
tech tags:

- `always_include: true` → include for every layer
- `always_include: false` → include only if tech tags match `triggers`
- `scope: project-wide` → schedule once for the whole project

### Step 5: Discover test coverage metadata

For each layer, detect test coverage settings using
`references/stack-detection.md` sections 2–3:

1. **Scopes** — testable modules within each layer (section 2)
2. **Test file patterns** — glob for existing test conventions
   (`**/test_*.py`, `**/*.test.ts`, `**/*_test.go`, etc.)
3. **Source patterns** — glob for source files of the layer's tech stack
4. **Test and coverage commands** — detect from package.json scripts,
   Makefile targets, CI workflows, or Docker compose services
5. **Ignore patterns** — auto-generate per-stack defaults (section 3):
   migrations, generated code, barrel re-exports, type definitions,
   config files, etc. Adjust per project.

### Step 6: Present to user for confirmation (HITL)

Display discovered layers, tech tags, quality attribute activation
matrix, scopes, test commands, and ignore patterns. Ask the user to
confirm or adjust:
- Add/remove/rename layers
- Add/remove tech tags per layer
- Override quality attribute applicability
- Adjust scopes, test/coverage commands, ignore patterns
- Set severity overrides or exclude specific check IDs

### Step 7: Write config and create directories

1. Write `.sdgqalab/config.yml` using `assets/config-template.yml`
2. Create `.sdgqalab/memory/audit/` directory
3. Create `.sdgqalab/memory/testmap/` directory
4. Ensure `.sdgqalab/` is committed to the repo

## Output

```
.sdgqalab/
├── config.yml          # Shared config (layers + QA attrs + test coverage)
├── tech-stack.md       # Discovered tech stack inventory
└── memory/
    ├── audit/          # QA audit reports (sdgqalab-audit)
    └── testmap/        # Coverage audit reports (sdgqalab-testmap)
```

## Important Notes

- **Monorepos**: Multiple `package.json`/`requirements.txt` files may
  each represent a separate layer. Check for workspace configs.
- **Docker-only projects**: Read Dockerfiles to discover the actual stack.
- **Dev dependencies**: List in tech stack but mark as dev-only — they
  still matter for maintainability and coverage checks.
- **Existing config.yml**: Ask user whether to overwrite or merge.
- **Shared code across layers**: Tag with the tech of all consuming layers.
- **Container test commands**: Use non-interactive flags (e.g., `-T`
  for no TTY) or output parsing in the coverage audit will fail.
- **Coverage tools**: Verify they're in dependency files or install.
