---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "react-typescript"
quality_attribute: "flexibility"
quality_attribute_name: "Flexibility"
iso_characteristic: "Flexibility"
project: "UNDP Digital Technologies Radar"
audited_at: "2026-09-09T17:39:00Z"
config_version: 3

score:
  pass: 3
  partial: 5
  fail: 2
  na: 8
  applicable: 10
  score_pct: 55.0
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 1
  p3_improvement: 5

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Flexibility Audit — Frontend

> **Score**: 55.0% · Adequate
> **Results**: 3 pass · 5 partial · 2 fail · 8 n/a
> **Blockers**: 0 | **Critical**: 1 (FLX-015) | **High**: 0 adjusted for static hosting
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: Flexibility

---

## Summary

As a static CRA SPA on GH Pages, the frontend scales horizontally by nature and supports multi-environment deploys via workflows. Flexibility is Adequate: config and dependency abstraction are incomplete, there is no IaC or feature-flag system, and Dockerfile absence is expected for current hosting but still a replaceability gap.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Deploy path | `publish.yml` → GH Pages; staging `deploy.yml`; CI `develop.yml` |
| Config | `REACT_APP_*`, hardcoded API/image defaults |
| AI/ML | None — FLX-017/018 N/A |
| Checkpoint status | Unattended |

**Trigger overrides:**
- FLX-008 → N/A: static SPA has no FE request workers to offload (async work is Netlify API).
- FLX-001 evaluated against GH Pages static hosting (no Docker in path).

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| FLX-004 | Multi-Environment Support | Distinct workflows: CI (`develop.yml`), prod GH Pages (`publish.yml`), staging DO (`deploy.yml`); CRA build-time env |
| FLX-005 | Stateless Application Design | Static `build/` artifacts; auth in `sessionStorage` (`auth.ts`); no server filesystem writes in FE |
| FLX-006 | Horizontal Scaling Readiness | CDN/GH Pages static hosting; no sticky-session FE server |

### PARTIAL (5 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| FLX-001 | Containerization | Reproducible `yarn build` → static publish | No `Dockerfile` / `.dockerignore` — alternate container host needs greenfield work | high* |
| FLX-003 | Environment-Based Config | GlitchTip DSN via env; API URL via `REACT_APP_RADAR_API_URL` | `.env.example` incomplete; default API URL + Supabase fallback image URLs hardcoded | high |
| FLX-011 | Plugin/Extension Architecture | React context (`RadarContext`); drawer/filter composition | Dual Chakra+MUI coupling; no DI/plugin registry | low |
| FLX-013 | Setup Documentation | README scripts, hook setup, CI/CD overview | Staging branch docs may be stale (`develop` vs `staging`); env vars underdocumented | medium |
| FLX-014 | Dependency Abstraction | `apiClient.ts` wraps fetch | Supabase storage URLs duplicated across Image/cards; Leaflet tile URL inline | medium |

\*Severity high per checklist; practical priority P2 for GH Pages-only deploy.

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| FLX-010 | Feature Flags | No `FEATURE_*` / flag service; only `REACT_APP_GLITCHTIP_DSN` / API URL env | low | P3 |
| FLX-015 | Infrastructure as Code | No Terraform/Pulumi/CDK; GH Pages + Netlify + DO configured outside repo IaC | medium | P2 |

### N/A (8 items)

| Check ID | Item | Reason |
|----------|------|--------|
| FLX-002 | Docker Compose | docker tag not on frontend layer |
| FLX-007 | Database Scalability | any_database |
| FLX-008 | Async Task Queue | Overridden: static SPA — no FE task handlers |
| FLX-009 | Load Balancer Config | nginx/docker/kubernetes tags absent |
| FLX-012 | API Contract Stability | any_api |
| FLX-016 | CI/CD Portability | github_actions/any_ci_cd not in layer tech_tags (repo has Actions) |
| FLX-017 | LLM Provider Abstraction | any_ai_ml |
| FLX-018 | Model Configuration Flexibility | any_ai_ml |

---

## Remediation Roadmap

### P1 — Critical (context: P2 for static hosting)

#### FLX-015: Infrastructure as Code

**Current state:** Hosting (GH Pages, Netlify, DO) is console/script driven.
**Fix:** Capture GH Pages + Netlify site settings as IaC or at least documented runbooks/scripts in-repo; optional Dockerfile for non-Pages targets.
**Effort:** Medium

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| FLX-003 | Env config | Complete `.env.example` with `REACT_APP_RADAR_API_URL`; centralize asset base URLs | Quick win |
| FLX-001 | Container | Optional multi-stage Node build + nginx if DO/containers become primary | Medium |
| FLX-014 | Abstraction | Single `config/assets.ts` for fallback images and tile URLs | Quick win |

### P3 — Improvements

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| FLX-010 | Feature flags | Env-based `REACT_APP_FEATURE_*` for risky UI | Short |
| FLX-013 | Docs | Align README staging branch name with `deploy.yml` | Quick win |
| FLX-011 | Extension | Prefer one UI kit long-term; keep RadarContext as extension point | Large |

---

## Acceptance Criteria

- [ ] FLX-003 env template complete
- [ ] FLX-015 risk-accepted or IaC started
- [x] Score >= 50% — met (55%)
