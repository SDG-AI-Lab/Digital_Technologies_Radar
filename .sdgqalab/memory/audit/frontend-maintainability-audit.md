---
schema: sdgqalab/audit@3
layer: frontend
layer_type: react-typescript
quality_attribute: maintainability
quality_attribute_name: Maintainability
iso_characteristic: "ISO/IEC 25010:2023 Maintainability (modularity, reusability, analysability, modifiability, testability)"
project: "UNDP Digital Technologies Radar"
audited_at: 2026-09-09T19:32:00Z
config_version: 3

score:
  pass: 8
  partial: 7
  fail: 1
  na: 6
  applicable: 16
  score_pct: 71.9
  rating: "Solid"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 4
  p3_improvement: 4

delta:
  previous_audit: null
  score_change: null
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: corrected
---

# Maintainability Audit — Frontend (React / TypeScript / CRA)

> **Score**: 71.9% · Solid
> **Results**: 8 pass · 7 partial · 1 fail · 6 n/a
> **Blockers**: 0 | **Critical**: 0 | **High**: 3
> **Audited**: 2026-09-09
> **Layer**: frontend (react-typescript)
> **ISO Grounding**: ISO/IEC 25010:2023 Maintainability; ISO/IEC 5055:2021; ISO/IEC 25023

---

## Summary

The frontend has the strongest maintainability posture of any domain: TypeScript is in **`strict: true`** mode, ESLint + Prettier are enforced (Prettier via `pretest`, ESLint in the PR workflow), Jest + RTL + Cypress + `jest-axe` are all present, and the `src/` tree is well-organised with clear component/page/helper/radar/ui/layouts/navigation scopes. The main debts are (a) **no pre-commit hooks** — the only pre-*test* hook is manual, (b) `react-hooks/exhaustive-deps` and `prettier/prettier` are **disabled** in ESLint (`package.json`), (c) `bcryptjs` and `crypto-browserify` are dead dependencies, (d) `publish.yml` skips lint, and (e) `.env.example` does not document `REACT_APP_RADAR_API_URL`. No P0/P1 findings.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | React 17 CRA SPA — the codebase must remain approachable to volunteers and rotating contributors. |
| Interfaces | Config surface: `package.json`, `tsconfig.json`, ESLint config in `package.json`, `.prettierrc`/`prettier -c src/`, `.github/workflows/*.yml`. |
| Data contracts | N/A at the maintainability layer — this is about code hygiene. |
| AI/ML behavior | None at runtime. |
| Checkpoint status | pending — user has not yet been asked to confirm this brief. |

---

## Results

### PASS (8 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| MNT-001 | Linter configuration | ESLint 7.11 configured via `package.json` `eslintConfig` extending `react-app` + `react-app/jest`; `develop.yml` runs `yarn lint` on PRs to `master`/`develop`. |
| MNT-002 | Code formatter | Prettier 2.5 in `devDependencies`; `pretest: yarn prettify` runs `prettier -c src/` before every test invocation (which CI executes). |
| MNT-003 | Type safety | `tsconfig.json` sets `"strict": true`, `noFallthroughCasesInSwitch: true`, `forceConsistentCasingInFileNames: true`; CRA runs `tsc` in the build. |
| MNT-005 | Project structure | Clean top-level `src/`: `components/`, `pages/`, `helpers/`, `radar/`, `ui/`, `layouts/`, `navigation/`. Test files live next to source. |
| MNT-008 | Version control hygiene | `.gitignore` covers `node_modules`, `build`, coverage; `.env.local` is untracked (visible in `git status`); `yarn.lock` and `deno.lock` are tracked. |
| MNT-009 | CI pipeline exists | `.github/workflows/develop.yml` triggers on PRs to `master`/`develop` with install/lint/audit/build/test steps; `publish.yml` runs on `push` to `master`. |
| MNT-010 | Automated testing in CI | `develop.yml` runs `yarn test` which cascades unit + API + E2E; not wrapped in `continue-on-error`. |
| MNT-016 | package.json scripts | `start`, `build`, `test`, `test:unit`, `test:api`, `test:e2e`, `lint`, `prettify`, `format`, `deploy` all present and reference real tooling. |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| MNT-004 | Dependency management | `yarn.lock` committed; deps are pinned via lockfile. | No Dependabot/Renovate configured; `bcryptjs` (auth is Supabase) and `crypto-browserify` are dead deps. React 17 is EOL; `react-scripts@4` is EOL; `eslint@7.11` is very old. | high |
| MNT-006 | Dead code detection | ESLint's default `no-unused-vars` catches most unused imports; codebase is small enough to spot debt. | `bcryptjs` + `@types/bcryptjs` unused; `crypto-browserify` unused; `react-lorem-ipsum` looks like a scaffolding leftover; `Untitled` file present in tree (see `git status`); no explicit dead-code tool (`ts-prune`/`knip`). | low |
| MNT-007 | Code complexity | Small-to-medium files throughout; TS strict catches typing issues early. | No `max-complexity` / `max-lines-per-function` ESLint rule; some page components (`ProjectAction`, `EventAction`) approach length limits. | medium |
| MNT-012 | Consistent development environment | Standard `yarn start`/`yarn build`/`yarn test` scripts documented in the CRA README pattern. | No `.editorconfig`; no `.devcontainer/`; no `Makefile`/`Taskfile`; setup instructions have the README-vs-`deploy.yml` staging-branch conflict noted in project-context. | medium |
| MNT-015 | TypeScript strict configuration | `strict: true` in `tsconfig.json`. | `react-hooks/exhaustive-deps` and `prettier/prettier` explicitly disabled in `package.json` eslintConfig; a handful of `e: any` handlers (e.g. `src/pages/users/signIn/SignIn.tsx`); no `@typescript-eslint/no-explicit-any` rule enforced. | medium |
| MNT-017 | Separation of concerns | Clear directory-level split: `helpers/` (data + API + auth), `components/` (UI atoms), `pages/` (routes with fetches), `radar/` (visualization). | Pages own their fetch orchestration and mix Chakra + MUI + inline styling; there is no dedicated data-access hook layer; `SignIn` mixes API calls, `alert()`s, and navigation. | high |
| MNT-018 | Configuration management | Uses `process.env.REACT_APP_*` throughout; no hardcoded secrets. | `.env.example` does not document `REACT_APP_RADAR_API_URL` (per project-context); no runtime config validator; no centralised `config.ts`. | high |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| MNT-011 | Pre-commit hooks | No `.pre-commit-config.yaml`, no `.husky/`, no `lint-staged` config. `pretest: yarn prettify` only runs when a developer manually invokes `yarn test`; nothing blocks a raw `git commit`. | medium | P2 |

### N/A (6 items)

| Check ID | Item | Reason |
|----------|------|--------|
| MNT-013 | Python package structure | No Python in this layer. |
| MNT-014 | Python import organization | No Python in this layer. |
| MNT-019 | API versioning strategy | Covered on the API layer audit. |
| MNT-020 | Database migration framework | No client-side database. |
| MNT-021 | Prompt management | No AI/ML at runtime. |
| MNT-022 | Model configuration management | No AI/ML at runtime. |

---

## Remediation Roadmap

### P0 — Blockers (must fix before ANY deployment)

_None._

---

### P1 — Critical (fix before production)

_None._

---

### P2 — Important (fix within first sprint post-launch)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| MNT-004 | Dependency management | Add `.github/dependabot.yml` for `npm`, `github-actions`, and (if desired) `pip`. Drop `bcryptjs` + `@types/bcryptjs` + `crypto-browserify` in the same PR. Plan a React 18 + `react-scripts` → Vite/Next upgrade track. | Quick win + Large |
| MNT-011 | Pre-commit hooks | Add Husky + lint-staged: `yarn add -D husky lint-staged && npx husky install`. Run `eslint --fix` + `prettier -w` on staged `*.ts,*.tsx`. Add `yarn typecheck` (introduce script `tsc --noEmit`) to the pre-push hook. | Quick win |
| MNT-017 | Separation of concerns | Extract data-access into `src/hooks/useProjects.ts`, `useDisasters.ts`, etc.; move `alert()` and navigation out of `SignIn` and into a `useAuth()` hook + a shared toast utility. | Medium |
| MNT-018 | Configuration management | Add `REACT_APP_RADAR_API_URL` to `.env.example`; introduce `src/config.ts` that reads env vars once, validates them, and re-exports typed constants. | Quick win |

---

### P3 — Improvements (backlog)

| Check ID | Item | Fix Summary | Effort |
|----------|------|-------------|--------|
| MNT-006 | Dead code detection | Run `npx knip` or `npx ts-prune`, delete `bcryptjs`, `crypto-browserify`, `react-lorem-ipsum` (if unused), and the stray `Untitled` file from the working tree. | Quick win |
| MNT-007 | Code complexity | Enable `complexity: ["warn", 15]` and `max-lines-per-function: ["warn", 200]` in ESLint; refactor flagged pages incrementally. | Short |
| MNT-012 | Consistent development environment | Add `.editorconfig`; reconcile the README staging-branch text with `deploy.yml`; add a `Makefile` or `justfile` wrapping the top-3 dev commands. | Quick win |
| MNT-015 | TypeScript strict configuration | Re-enable `react-hooks/exhaustive-deps` (fix or suppress with justification per-hook); add `@typescript-eslint/no-explicit-any: ["warn"]`; type the two `e: any` handlers in `SignIn`. | Short |

---

## Delta from Previous Audit

_No prior snapshot exists on this branch — this is the baseline._

---

## Acceptance Criteria

- [ ] All P0 blockers resolved (none present)
- [ ] All P1 critical items resolved or risk-accepted (none present)
- [ ] Quality attribute score >= 50% (currently 71.9% — met)
- [ ] Dead deps removed and Dependabot enabled before the next dependency-bump PR wave
- [ ] Pre-commit hook wired so no unformatted / lint-broken code can be committed
