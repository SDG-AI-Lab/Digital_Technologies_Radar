---
schema: sdgqalab/audit@3
layer: "api"
layer_type: "nodejs-netlify"
quality_attribute: "flexibility"
quality_attribute_name: "Flexibility"
iso_characteristic: "Flexibility"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T18:04:00Z"
config_version: 3

score:
  pass: 3
  partial: 7
  fail: 3
  na: 5
  applicable: 13
  score_pct: 50.0
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 3
  p3_improvement: 7

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Flexibility Audit — API

> **Score**: 50.0% · Adequate
> **Results**: 3 pass · 7 partial · 3 fail · 5 n/a
> **Blockers**: 0 | **Critical**: 0 | **Important**: 3
> **Audited**: 2026-09-09
> **Layer**: api (nodejs-netlify)
> **ISO Grounding**: Flexibility

---

## Summary

The API is naturally scalable as Netlify Functions (stateless, no sticky sessions) with solid env-based secrets/CORS config. Flexibility is only Adequate: no portable container/IaC for Supabase, no OpenAPI/versioned contract, README silent on API setup, and no feature-flag or background-queue patterns for future growth.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Deploy path | `netlify.toml` functions-only build; redirect `/api/*` → `/.netlify/functions/api/:splat` |
| Config | Netlify env: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ALLOWED_ORIGINS` (see `.env.example`) |
| AI/ML | None — FLX-017/018 N/A |
| Checkpoint status | Unattended |

**Trigger overrides:**
- FLX-001 evaluated against Netlify Functions hosting (no Docker in current path) → PARTIAL not hard FAIL.
- FLX-009 N/A: load balancing provided by Netlify edge; layer lacks nginx/docker/k8s tags.

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| FLX-003 | Environment-Based Configuration | `.env.example` lists server vars; `configuredClient()` fails fast without URL/secret; no secrets in source; `.env` gitignored |
| FLX-005 | Stateless Application Design | Pure request/response Functions; JWT Bearer auth; no local filesystem session/upload writes in `api.js` |
| FLX-006 | Horizontal Scaling Readiness | Serverless multi-instance by design; no sticky session state; no migration-on-boot; no WebSockets/cron in handler |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| FLX-001 | Containerization | Reproducible Netlify Functions deploy via `netlify.toml` | No `Dockerfile` / `.dockerignore` for non-Netlify hosts | high* |
| FLX-004 | Multi-Environment Support | Config via Netlify env + local `.env`; `[dev]` block in `netlify.toml` | No committed staging vs prod API overlays; env separation is console-only | high |
| FLX-007 | Database Scalability | Supabase-managed Postgres (external pooler typical) | No app-level pool/replica settings; many `select: '*'`; no in-repo indexes | medium |
| FLX-011 | Plugin/Extension Architecture | `PUBLIC_RESOURCES` / `PUBLIC_DETAIL_RESOURCES` maps extend public GETs without new branches | Admin routes are large nested `if` chains; no middleware/DI registry | low |
| FLX-013 | Setup Documentation | `.env.example`, `yarn test:api`, `netlify.toml` exist | README has no Netlify Functions / API env / local invoke instructions | medium |
| FLX-014 | Dependency Abstraction | All Supabase access concentrated in one file; Jest mocks `@supabase/supabase-js` | No repository/interface layer — SDK shapes leak into handler logic | medium |
| FLX-015 | Infrastructure as Code | `netlify.toml` declares functions root, redirects, security headers | Supabase project, Netlify site, secrets managed outside Terraform/Pulumi | medium |

\*Checklist severity high; practical priority P2 while Netlify remains the sole Functions host.

### FAIL (3 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| FLX-008 | Async Task Queue | All admin mutations (incl. related-project loops) run inline in the request; no Bull/SQS/etc. | medium | P2 |
| FLX-010 | Feature Flags | No `FEATURE_*` / flag service in API | low | P3 |
| FLX-012 | API Contract Stability | No OpenAPI/GraphQL/proto; unversioned paths; ad-hoc validation only | medium | P2 |

### N/A (5 items)

| Check ID | Item | Reason |
|----------|------|--------|
| FLX-002 | Docker Compose | docker tag not on api layer |
| FLX-009 | Load Balancer Configuration | nginx/docker/kubernetes tags absent (Netlify edge external) |
| FLX-016 | CI/CD Pipeline Portability | github_actions / any_ci_cd not in api tech_tags |
| FLX-017 | LLM Provider Abstraction | any_ai_ml |
| FLX-018 | Model Configuration Flexibility | any_ai_ml |

---

## Remediation Roadmap

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| FLX-012 | API Contract | Add OpenAPI for public + admin routes; tie to versioning (MNT-019/CMP-002) | Medium |
| FLX-008 | Task queue | Only if admin bulk updates / emails grow; otherwise document sync-OK risk acceptance | Short |
| FLX-013 | Setup docs | README: Netlify link, required env vars, `netlify dev` / `yarn test:api` | Short |
| FLX-001 | Containerization | Optional Node slim Dockerfile wrapping the handler for portability | Medium |
| FLX-004 | Multi-env | Document Netlify contexts (branch deploys) + required env matrix | Short |
| FLX-015 | IaC | Export Netlify + Supabase as Terraform/OpenTofu or document as accepted console ops | Large |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| FLX-010 | Feature flags | Env toggles for risky admin behaviors if needed | Quick win |
| FLX-007 | DB scale | Explicit column selects; document Supabase pooler; add indexes via migrations | Medium |
| FLX-011 | Extensions | Extract admin routers; keep resource-map pattern | Short |
| FLX-014 | Abstraction | Thin `db` wrapper around Supabase client for tests/swaps | Medium |

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off
- [ ] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state
