# Gap Classification Reference

Reference material for sdgqalab-testmap Step 2 and Step 5.
Load this file when classifying test files by type (Step 2) and
when classifying uncovered source files into gap categories (Step 5).

---

## 1. Unit Test Classification

Files that should be tested in isolation (no I/O, no external services):

- Model/entity files
- Serializer/validator files
- Utility/helper functions
- Pure functions, hooks, formatters
- Guard/permission logic
- Context providers
- State management (reducers, stores)

**File path signals → Unit:**

| Pattern                               | Example                    |
|---------------------------------------|----------------------------|
| `**/models*.py`                       | `accounts/models.py`       |
| `**/serializers*.py`                  | `audit/serializers.py`     |
| `**/validators/**`                    | `validators/email.py`      |
| `**/utils*.py`, `**/helpers/**`       | `shared/utils/format.ts`   |
| `**/hooks/**`                         | `hooks/useRole.ts`         |
| `**/guards*.py`, `**/permissions*.py` | `accounts/permissions.py`  |
| `**/components/**` (non-page)         | `components/Button.tsx`    |
| `**/context/**`, `**/*Context.*`      | `context/AuthContext.tsx`   |
| `**/formatters.*`                     | `shared/formatters.ts`     |

---

## 2. Integration Test Classification

Files that should be tested across boundaries (API, DB, services):

- View/controller files (API endpoints)
- Workflow/state machine files
- Page-level components (render with mocked API)
- Dashboard/analytics endpoints
- Report generation pipelines
- Email/notification triggers
- Files that orchestrate multiple modules
- Middleware and request pipeline

**File path signals → Integration:**

| Pattern                               | Example                    |
|---------------------------------------|----------------------------|
| `**/views*.py`                        | `audit/views.py`           |
| `**/api/**`, `**/routes/**`           | `api/users.ts`             |
| `**/controllers/**`                   | `controllers/auth.ts`      |
| `**/middleware*.py`                    | `accounts/middleware.py`   |
| `**/tasks.py`                         | `audit/tasks.py`           |
| `**/pages/**`, `**/*Page.tsx`         | `pages/LoginPage.tsx`      |
| `**/workflow*.py`                     | `audit/workflow.py`        |
| `**/pipeline*.py`                     | `extraction_pipeline.py`   |

---

## 3. E2E Test Classification

User journeys that should be tested through the real application.
E2E gaps are NOT mapped per-file but per **user journey**.

Identify critical user journeys by looking for:
- Login/authentication flows
- Core CRUD workflows (create, view, edit, delete)
- Multi-step processes (wizards, approval workflows)
- Report generation and export
- Role-based access (same URL, different capabilities)

**Detection signals** — look for existing E2E infrastructure:
- `cypress/`, `e2e/`, `playwright/` directories
- `*.cy.ts`, `*.spec.ts` (in e2e dirs), `*.e2e.ts` files
- `playwright.config.ts`, `cypress.config.ts`
- If no E2E framework exists, flag this as a gap

---

## 4. Security Test Classification

Security-relevant areas that should have dedicated test coverage.

**What to look for in existing tests:**
- Permission/guard checks (both allowed and denied)
- Authentication endpoint tests (login, logout, token refresh)
- Input validation tests (SQL injection, XSS payloads)
- CSRF protection tests
- Rate limiting tests
- Role-based access control assertions

**File path signals → Security test needed:**

| Pattern                                  | Security Concern             |
|------------------------------------------|------------------------------|
| `**/permissions*.py`, `**/guards*.py`    | Authorization logic          |
| `**/auth/**`, `**/login*`               | Authentication flow          |
| `**/middleware*.py`                      | Request pipeline security    |
| `**/serializers*.py` (with validators)   | Input validation             |
| `**/views*.py` (with decorators)         | Endpoint access control      |
| `**/*Modal*.tsx` (with form inputs)      | Client-side validation       |

**Classification rules:**
- A source file needs a security test if it handles auth, permissions,
  user input, or sensitive data — regardless of whether it also needs
  unit or integration tests (a file can appear in multiple sections)
- Check existing unit/integration tests for security assertions before
  flagging as a gap

---

## 5. Accessibility Test Classification

Components and pages that should have accessibility test coverage.

**What to look for in existing tests:**
- `jest-axe` / `axe-core` assertions (`expect(results).toHaveNoViolations()`)
- `aria-*` attribute assertions in component tests
- Keyboard navigation tests (`userEvent.tab()`, focus management)
- Screen reader text assertions (`getByRole`, `getByLabelText`)
- Color contrast checks (Lighthouse, pa11y)

**File path signals → Accessibility test needed:**

| Pattern                               | A11y Concern                 |
|---------------------------------------|------------------------------|
| `**/pages/**`, `**/*Page.tsx`         | Page-level a11y compliance   |
| `**/*Modal*.tsx`                      | Focus trap, keyboard dismiss |
| `**/*Form*.tsx`, `**/Input.tsx`       | Label association, errors    |
| `**/*Table*.tsx`                      | Table semantics, headers     |
| `**/*Dropdown*.tsx`, `**/*Select*`    | Keyboard navigation          |
| `**/*Filter*.tsx`                     | Interactive controls          |
| `**/components/**` (interactive)      | General a11y compliance      |

**Classification rules:**
- Every user-facing interactive component should have at minimum an
  axe-core smoke test
- Page-level components need full page a11y audit assertions
- Form components need label, error state, and keyboard tests
- If no a11y tooling is installed, flag setup as a P1 recommendation

---

## General Rules

- A source file can appear in **multiple** test type sections (e.g.,
  `views.py` may need both integration tests AND security tests)
- When a file doesn't match any pattern, classify based on whether it
  makes I/O calls (→ integration) or operates on data in isolation (→ unit)
- E2E gaps are journey-based, not file-based
- Security and accessibility gaps layer on top of unit/integration — they
  represent additional test concerns for files that may already have basic coverage
- **File path signals above are examples** drawn from common stacks
  (Python/Django, React/TS). Agents must adapt patterns to the project's
  actual tech stack using markers discovered by sdgqalab-init