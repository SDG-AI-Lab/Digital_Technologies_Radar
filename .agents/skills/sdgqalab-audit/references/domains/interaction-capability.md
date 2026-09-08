---
domain_id: interaction-capability
domain_name: Interaction Capability
check_prefix: INT

iso:
  quality_characteristic: Interaction Capability
  sub_characteristics:
    - appropriateness_recognizability
    - learnability
    - operability
    - user_error_protection
    - user_engagement
    - inclusivity
    - user_assistance
    - self_descriptiveness
  grounding_standards:
    - id: "WCAG 2.2 / ISO 40500"
      focus: "78 testable success criteria for web accessibility"
    - id: "ISO/IEC 25059"
      focus: "AI system interaction — controllability, transparency, explainability"
      activates_for: [any_ai_ml]

applicability:
  always_include: false
  triggers:
    - react
    - vue
    - angular
    - nextjs
    - svelte
    - any_web_framework
    - any_ai_ml
  description: "Active for layers with UI components or AI user-facing interactions"

scope: per-layer
---

# Interaction Capability

> ISO 25010:2023 Interaction Capability — renamed from "Usability" in
> the 2011 revision, expanded with User Engagement, Inclusivity, User
> Assistance, and Self-descriptiveness sub-characteristics.

This domain audits how effectively users can interact with the system:
accessibility, usability patterns, error protection, responsive design,
internationalization readiness, and AI-specific interaction quality.

Grounded in **WCAG 2.2 / ISO 40500** for web accessibility and
**ISO/IEC 25059** for AI system interaction patterns.

---

## Accessibility Checks (WCAG Grounded)

### INT-001: Semantic HTML

| Field | Value |
|---|---|
| **What to Look For** | Proper heading hierarchy (`h1`→`h6`), landmark elements (`nav`, `main`, `aside`, `footer`, `header`), semantic tags (`button`, `a`, `ul`, `table`) instead of `div`/`span` soup |
| **How to Check** | 1. Grep component files for heading tags — verify each page/route has exactly one `h1` and headings don't skip levels (e.g., `h2` → `h4`). 2. Search for landmark elements (`<nav`, `<main`, `<aside`, `<footer`, `<header`) — at least `main` and `nav` should exist in the layout. 3. Search for click handlers on `div` or `span` elements (`<div onClick`, `<span onClick`) — these should be `button` or `a` elements instead. 4. Check for `<table>` usage with `<thead>`, `<th>` when tabular data is present. 5. In React/Vue, check that custom components render semantic HTML roots, not bare `div` wrappers. |
| **Pass** | Heading hierarchy is correct across all routes, landmark elements are used in layouts, interactive elements use semantic tags, no `div`-as-button anti-patterns |
| **Partial** | Landmark elements are used but heading hierarchy has gaps, or a few click handlers on non-semantic elements exist |
| **Fail** | No landmark elements, headings are used for styling only (skipped levels everywhere), interactive divs/spans are pervasive |
| **Severity** | high |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-002: Alt Text for Images

| Field | Value |
|---|---|
| **What to Look For** | All `<img>` elements have meaningful `alt` attributes. Decorative images use `alt=""`. Icon-only buttons have `aria-label` or `aria-labelledby`. |
| **How to Check** | 1. Grep for `<img` tags across all component/template files — verify each has an `alt` attribute. 2. Check that `alt` values are descriptive, not generic (`alt="image"`, `alt="photo"`, `alt="icon"` are red flags). 3. Search for decorative images (CSS backgrounds used as content, or `<img>` with `role="presentation"`) — these should have `alt=""`. 4. Find icon-only buttons (buttons containing only an SVG or icon component, no visible text) — verify they have `aria-label` or a visually-hidden text child. 5. Check for `<svg>` elements used inline — verify they have `role="img"` and a `<title>` element, or `aria-hidden="true"` if decorative. |
| **Pass** | All images have appropriate alt text, decorative images have empty alt, icon-only buttons have accessible labels, no generic alt values |
| **Partial** | Most images have alt text but a few are missing or generic; icon buttons are partially labeled |
| **Fail** | Multiple images missing alt attributes, icon-only buttons have no accessible labels, generic alt text is widespread |
| **Severity** | high |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-003: Keyboard Navigation

| Field | Value |
|---|---|
| **What to Look For** | Full keyboard operability — focus management, skip navigation, logical tab order, visible focus indicators, keyboard event handlers on interactive elements |
| **How to Check** | 1. Search for a skip navigation link (usually the first focusable element in the layout — `<a href="#main-content">Skip to content</a>` or equivalent). 2. Grep for `tabIndex` / `tabindex` usage — `tabindex="0"` is acceptable for custom widgets, `tabindex > 0` is an anti-pattern. 3. Search for `onKeyDown`, `onKeyUp`, `onKeyPress` handlers on custom interactive components (dropdown menus, modals, tabs) — these need keyboard support beyond just click. 4. Check modal/dialog components for focus trapping (focus should not escape the modal while open). Look for `focus-trap`, `FocusTrap`, or manual `focusin`/`focusout` logic. 5. Check for visible focus styles — search CSS/Tailwind for `:focus`, `:focus-visible`, `focus:ring`, `outline` rules. Verify `outline: none` or `outline: 0` is not used without a replacement focus indicator. 6. Verify route changes manage focus (in SPAs, focus should move to the new content or page title on navigation). |
| **Pass** | Skip link exists, no positive tabindex values, custom widgets have keyboard handlers, modals trap focus, focus styles are visible, SPA route changes manage focus |
| **Partial** | Some keyboard support exists (e.g., skip link present) but custom widgets lack keyboard handlers, or focus styles are removed without replacement |
| **Fail** | No skip link, positive tabindex values, custom dropdowns/modals have no keyboard support, focus styles globally removed, SPA navigation doesn't manage focus |
| **Severity** | high |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-004: Color Contrast

| Field | Value |
|---|---|
| **What to Look For** | Text meets WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text). No information conveyed by color alone. |
| **How to Check** | 1. Check the design system or theme file for color token definitions — look for `colors`, `theme`, or palette config (Tailwind `tailwind.config`, MUI `createTheme`, Chakra `theme.ts`). 2. Inspect text/background color pairings in the theme — flag any obvious low-contrast combinations (e.g., light gray text on white). 3. Search for color-only indicators — grep for patterns like "red" or "green" used as sole status indicators without accompanying text or icons (e.g., a red dot alone to mean "error"). 4. Check for a contrast checking tool in dev dependencies (`eslint-plugin-jsx-a11y`, `@axe-core/react`, `pa11y`, `lighthouse`) — presence indicates awareness. 5. Look for CSS custom properties or Tailwind classes that enforce consistent contrast (e.g., `text-foreground` / `bg-background` pairing). |
| **Pass** | Theme defines accessible color pairings, no color-only indicators found, a11y linting or contrast tools are in devDependencies |
| **Partial** | Theme exists but some pairings look low-contrast, or no a11y tooling is present but colors appear reasonable |
| **Fail** | No theme/design system for consistent colors, obvious low-contrast text, status conveyed by color alone, no a11y tooling |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, tailwind, any_web_framework] |

### INT-005: Form Labels and Validation

| Field | Value |
|---|---|
| **What to Look For** | Every form input has an associated `<label>` (via `htmlFor`/`for` or wrapping). Error messages are descriptive, linked to their input via `aria-describedby`, and announced to screen readers. |
| **How to Check** | 1. Find all form input elements (`<input`, `<select`, `<textarea`) in component files. 2. For each input, verify it has either: a wrapping `<label>`, a `<label htmlFor>` pointing to its `id`, an `aria-label`, or an `aria-labelledby`. Placeholder-only is NOT sufficient. 3. Check form validation logic — search for error message rendering near form fields. Verify error text is specific ("Password must be at least 8 characters") not generic ("Invalid input"). 4. Check that error messages use `aria-describedby` or `aria-errormessage` to link to the input, or that the form library handles this (React Hook Form, Formik, VeeValidate, etc.). 5. Search for `aria-invalid` or `aria-required` on inputs that have validation — these signal state to assistive tech. 6. Verify submit buttons are `<button type="submit">` or `<input type="submit">`, not generic `<div onClick>`. |
| **Pass** | All inputs have proper labels, error messages are descriptive and linked to inputs, validation states use ARIA attributes, forms use semantic submit buttons |
| **Partial** | Most inputs have labels but some rely on placeholder-only, or error messages exist but lack `aria-describedby` linkage |
| **Fail** | Multiple inputs without labels, generic error messages ("Invalid"), no ARIA validation states, non-semantic submit elements |
| **Severity** | high |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-006: ARIA Attributes

| Field | Value |
|---|---|
| **What to Look For** | Correct use of ARIA roles, states, and properties. No ARIA misuse (redundant roles on semantic elements, invalid ARIA attributes, `role="button"` without keyboard support). |
| **How to Check** | 1. Search for `role=` in component files — verify roles are not redundant on semantic elements (e.g., `<button role="button">` or `<nav role="navigation">` are unnecessary). 2. Check that elements with `role="button"` also have `tabIndex="0"` and `onKeyDown` handling for Enter/Space. 3. Search for `aria-hidden="true"` — verify it's not used on focusable elements or elements containing focusable children. 4. Verify `aria-expanded`, `aria-selected`, `aria-checked` are used on disclosure widgets, tabs, and checkboxes respectively. 5. Check for `aria-live` regions — dynamic content updates (toasts, notifications, live data) should have `aria-live="polite"` or `aria-live="assertive"`. 6. If using an a11y linter (`eslint-plugin-jsx-a11y`, `vue-a11y`), check its config — verify key ARIA rules are enabled, not disabled. |
| **Pass** | ARIA is used correctly — no redundant roles, interactive ARIA elements have keyboard support, `aria-hidden` is not on focusable elements, dynamic content uses `aria-live` |
| **Partial** | Some correct ARIA usage but a few misuses found (redundant roles, missing keyboard support on ARIA buttons), or no `aria-live` for dynamic content |
| **Fail** | Widespread ARIA misuse, `role="button"` without keyboard handlers, `aria-hidden` on focusable elements, no `aria-live` regions for dynamic updates |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-007: Screen Reader Compatibility

| Field | Value |
|---|---|
| **What to Look For** | Dynamic content changes are announced via `aria-live` regions. Visually hidden text provides context where visual cues are insufficient. Page titles update on route changes. |
| **How to Check** | 1. Search for `aria-live` attributes — verify they exist on elements that update dynamically (notification areas, chat messages, search results counts, form submission status). 2. Check for a visually-hidden utility class (`.sr-only`, `.visually-hidden`, Tailwind `sr-only`) — verify it's used to provide context (e.g., "Opens in new tab", "Required field", "3 items in cart"). 3. Verify `<title>` or document title updates on SPA route changes — search for `useEffect` + `document.title`, `next/head`, `useHead`, `Title` component, or helmet usage. 4. Check that modals/dialogs have `aria-modal="true"` and descriptive `aria-label` or `aria-labelledby` pointing to the dialog title. 5. Look for notification/toast components — verify they render into an `aria-live` region, not just visually appear. |
| **Pass** | Dynamic content uses `aria-live` regions, visually-hidden text provides context, page titles update on navigation, modals are properly labeled |
| **Partial** | Some `aria-live` usage but not comprehensive, or page titles don't update on all routes, or modals lack accessible labels |
| **Fail** | No `aria-live` regions, no visually-hidden utility class, page title is static in SPA, modals have no accessible labeling |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

---

## Usability / UX Checks

### INT-008: Loading States

| Field | Value |
|---|---|
| **What to Look For** | Loading indicators (spinners, skeleton screens, progress bars) displayed during asynchronous operations. Users should never see a blank screen while data is fetching. |
| **How to Check** | 1. Search for loading state variables (`isLoading`, `loading`, `isPending`, `isFetching`) in components — verify they gate a loading indicator in the JSX/template. 2. Check data fetching patterns (React Query `isLoading`, SWR `isValidating`, Apollo `loading`, Vue composables) — verify loading states are consumed in the UI. 3. Look for skeleton screen components (`Skeleton`, `Placeholder`, `Shimmer`) or spinner components — verify they're used on pages with async data. 4. Search for `Suspense` boundaries (React) or async component wrappers (Vue) — verify they have fallback loading UI. 5. Check for route-level loading (Next.js `loading.tsx`, Nuxt loading indicator) — verify page transitions show loading state. |
| **Pass** | All async operations show loading indicators, skeleton screens or spinners are used consistently, route-level loading exists in frameworks that support it |
| **Partial** | Some pages show loading states but others have bare awaits with no indicator, or only a global spinner exists (no per-component loading) |
| **Fail** | No loading indicators found, async data causes blank screens, no skeleton or spinner components in the codebase |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-009: Error State UX

| Field | Value |
|---|---|
| **What to Look For** | User-friendly error messages in the UI. Error boundaries catch rendering failures. API errors are translated to human-readable messages. No raw stack traces or JSON shown to users. |
| **How to Check** | 1. Search for error boundary components — React: `ErrorBoundary`, `componentDidCatch`, `getDerivedStateFromError`; Vue: `onErrorCaptured`, `errorCaptured`; Angular: `ErrorHandler`. 2. Verify error boundaries exist at least at the app root level and ideally at route/feature boundaries. 3. Check API error handling — search for `catch` blocks on fetch/axios/API calls. Verify the catch renders a user-friendly message, not `error.message` or `JSON.stringify(error)` directly. 4. Look for a global error/toast notification system that displays errors consistently. 5. Search for patterns like `{error && <pre>`, `error.stack`, `JSON.stringify(error)` in templates — these are red flags for raw error exposure. 6. Check for 404/500 error pages — verify custom error pages exist (Next.js `not-found.tsx`/`error.tsx`, Vue Router catch-all, etc.). |
| **Pass** | Error boundaries at app and route level, API errors show user-friendly messages, custom 404/500 pages, no raw error exposure in templates |
| **Partial** | Error boundaries exist but only at the root, or API errors are caught but messages are semi-technical, or missing custom error pages |
| **Fail** | No error boundaries, API errors shown raw to users, no custom error pages, `error.stack` or JSON exposed in UI |
| **Severity** | high |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-010: Responsive Design

| Field | Value |
|---|---|
| **What to Look For** | Layout adapts to different screen sizes. Viewport meta tag is set. Responsive breakpoints or utility classes are used. No horizontal scrolling on mobile widths. |
| **How to Check** | 1. Check `index.html` or the root layout for `<meta name="viewport" content="width=device-width, initial-scale=1">`. 2. Search for responsive breakpoints — Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`), CSS media queries (`@media`), or CSS container queries. 3. Verify the layout uses flexible units — search for `flex`, `grid`, `%`, `rem`, `vw`, `vh` vs. hardcoded `px` widths on containers. 4. Check for a responsive navigation pattern — hamburger menu, collapsible nav, or drawer for mobile. Search for `md:hidden`, `lg:block`, mobile menu toggle, or responsive nav component. 5. Look for fixed-width containers (`width: 1200px`, `w-[1200px]`) without max-width constraints — these cause horizontal scroll on small screens. |
| **Pass** | Viewport meta tag present, responsive breakpoints used consistently, flexible layout units, responsive navigation pattern exists, no fixed-width containers without max-width |
| **Partial** | Viewport tag present and some responsive classes used, but navigation isn't responsive, or some pages use fixed widths |
| **Fail** | No viewport meta tag, no responsive breakpoints, hardcoded pixel widths on layout containers, no mobile navigation pattern |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, tailwind, any_web_framework] |

### INT-011: Consistent Navigation

| Field | Value |
|---|---|
| **What to Look For** | Consistent header/navigation structure across all routes. Breadcrumbs for deeply nested pages. Active state indication on current nav item. |
| **How to Check** | 1. Identify the main layout component (root layout, `Layout.tsx`, `DefaultLayout.vue`, `app.component.html`) — verify it includes a shared header/nav that wraps all routes. 2. Check that the nav component is used consistently — it should appear in the root layout, not duplicated per-page. 3. Search for active link styling — `NavLink` (React Router), `router-link-active` (Vue Router), `routerLinkActive` (Angular), or custom active class logic on nav items. 4. For apps with deep page hierarchies (> 2 levels), search for a breadcrumb component. Verify it renders dynamically based on the route, not hardcoded. 5. Check for a consistent footer across pages — verify it's in the shared layout. |
| **Pass** | Shared layout with consistent nav across all routes, active link styling on current page, breadcrumbs for deep pages, consistent footer |
| **Partial** | Shared nav exists but some pages break the layout, or no active link indication, or deep pages lack breadcrumbs |
| **Fail** | No shared layout — navigation is duplicated/inconsistent across pages, no active link styling, no breadcrumbs on deeply nested pages |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-012: Empty States

| Field | Value |
|---|---|
| **What to Look For** | Meaningful empty state handling for no-data, no-results, and first-time-user scenarios. Empty states include helpful messages and calls to action, not blank screens. |
| **How to Check** | 1. Find list/table/grid components that render dynamic data — search for `.map(`, `v-for`, `*ngFor`, or data iteration patterns. 2. Check what renders when the data array is empty — look for `{items.length === 0 && ...}`, `v-if="!items.length"`, empty state components. 3. Verify empty states have: a descriptive message ("No projects yet"), an illustration or icon (optional), and a CTA ("Create your first project"). 4. Check search/filter results — verify a "No results found" state exists with suggestions (clear filters, try different terms). 5. For dashboard pages, check first-time-user experience — is there an onboarding state or helpful empty state vs. a blank dashboard? |
| **Pass** | All data lists handle empty state with descriptive messages and CTAs, search has no-results state, first-time-user experience is considered |
| **Partial** | Some lists handle empty state but others render blank, or empty states exist but lack CTAs |
| **Fail** | Lists render completely blank when empty, no search no-results handling, blank screens on first use |
| **Severity** | low |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

### INT-013: Confirmation for Destructive Actions

| Field | Value |
|---|---|
| **What to Look For** | Confirmation dialogs before delete, remove, reset, or other irreversible operations. Users must explicitly confirm destructive actions. |
| **How to Check** | 1. Search for delete/remove handlers — grep for `delete`, `remove`, `destroy`, `reset`, `revoke`, `purge` in handler/action names (e.g., `handleDelete`, `onRemove`, `deleteUser`). 2. For each destructive handler, verify it shows a confirmation dialog before executing — look for `confirm(`, `window.confirm`, a modal/dialog component, or an `AlertDialog`/`ConfirmDialog` component. 3. Check that the confirmation message is specific — "Delete project 'My App'? This cannot be undone." not just "Are you sure?". 4. Verify the destructive button in the confirmation dialog is visually distinct (red/danger variant, not the same style as cancel). 5. Check for bulk delete operations — these should have even stronger confirmation (e.g., type-to-confirm for mass deletion). |
| **Pass** | All destructive actions require explicit confirmation, confirmation messages are specific, destructive buttons are visually distinct, bulk operations have strong confirmation |
| **Partial** | Some destructive actions have confirmation but not all, or confirmation exists but uses generic "Are you sure?" messages |
| **Fail** | Destructive actions execute immediately without confirmation, no confirmation dialogs found for delete/remove operations |
| **Severity** | medium |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte, any_web_framework] |

---

## Internationalization Checks

### INT-014: i18n Framework

| Field | Value |
|---|---|
| **What to Look For** | Internationalization framework is set up. User-facing strings are extracted into translation files, not hardcoded in components. |
| **How to Check** | 1. Check `package.json` for i18n libraries — `react-intl`, `react-i18next`, `i18next`, `next-intl`, `vue-i18n`, `@angular/localize`, `@ngx-translate/core`, `svelte-i18n`. 2. If an i18n library is present, verify it's configured — look for translation files (`locales/`, `messages/`, `i18n/`, `*.json` with translation keys), provider setup in the app root, and usage in components (`t()`, `$t()`, `formatMessage`, `<FormattedMessage>`, `<Trans>`). 3. Search for hardcoded user-facing strings in components — look for text directly in JSX/templates that isn't wrapped in a translation function. Focus on headings, button labels, error messages, form labels. Note: developer-facing strings (console.log, comments) are fine to hardcode. 4. Check for locale detection and switching — is there a language selector, locale cookie/header detection, or URL-based locale routing? 5. Verify date/number formatting uses the i18n library or `Intl` API rather than manual formatting. |
| **Pass** | i18n library installed and configured, translation files exist, user-facing strings use translation functions, locale switching mechanism exists |
| **Partial** | i18n library installed but many strings are still hardcoded, or translations exist for one language only with no switching mechanism |
| **Fail** | No i18n library, all user-facing strings are hardcoded in components |
| **Severity** | low |
| **Tech Triggers** | [react, vue, angular, nextjs, svelte] |

---

## AI/ML Interaction Checks

### INT-015: AI Transparency

| Field | Value |
|---|---|
| **What to Look For** | Clear indication when content is AI-generated. Users are informed they are interacting with AI. No deceptive presentation of AI output as human-authored. |
| **How to Check** | 1. Find components that render AI-generated content — search for chat/completion/generation response rendering, anywhere LLM or model output is displayed to users. 2. Verify the UI clearly labels AI-generated content — look for badges ("AI Generated", "Generated by AI"), icons (sparkle/robot icon), visual distinction (different background, border, or typography for AI messages), or explicit disclaimers. 3. Check onboarding or first-interaction flows — verify users are told they're interacting with AI (e.g., "I'm an AI assistant" in welcome message, or system description). 4. Search for disclaimers about AI limitations — "AI can make mistakes", "Always verify important information", or similar. 5. Verify AI-generated content in emails, reports, or exports is also labeled as AI-generated, not just in the chat UI. |
| **Pass** | AI content is clearly labeled in all contexts (chat, exports, emails), users are informed of AI interaction, limitations disclaimer exists |
| **Partial** | AI content is labeled in the main UI but not in exports/emails, or labeling is subtle and easy to miss |
| **Fail** | No labeling of AI-generated content, AI responses presented as if human-authored, no transparency about AI interaction |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

### INT-016: AI Response Controllability

| Field | Value |
|---|---|
| **What to Look For** | Users can stop, regenerate, edit, or otherwise control AI responses. Long-running AI operations can be cancelled. Users are not locked into accepting AI output. |
| **How to Check** | 1. Find the AI response rendering component — look for streaming response display, chat message component, or completion output area. 2. Check for a stop/cancel button during AI generation — search for `AbortController`, `abort()`, cancel button components, or stop generation handlers during streaming responses. 3. Look for a regenerate/retry button on AI responses — users should be able to request a new response without re-typing their input. 4. Check if users can edit AI output — look for edit buttons, inline editing, or copy-to-editor functionality on AI responses. 5. For multi-step AI workflows (agents, chains), verify users can intervene between steps — check for approval gates, step-by-step confirmation, or human-in-the-loop patterns. 6. Verify long-running AI operations show progress and are cancellable — not just a spinner with no way to abort. |
| **Pass** | Stop button during generation, regenerate option on responses, edit/copy functionality, multi-step workflows have intervention points, long operations are cancellable |
| **Partial** | Some controls exist (e.g., regenerate) but missing others (e.g., no stop button during streaming, no intervention in multi-step flows) |
| **Fail** | No user control over AI responses — can't stop generation, can't regenerate, can't edit output, multi-step flows run without intervention |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

### INT-017: AI Error Communication

| Field | Value |
|---|---|
| **What to Look For** | User-friendly error handling when AI services fail. Rate limits, timeouts, and model errors are translated into helpful messages. No raw API errors shown to users. |
| **How to Check** | 1. Find AI API call sites — search for OpenAI, Anthropic, Azure AI, HuggingFace, or custom model API calls. 2. Check error handling on these calls — verify `catch` blocks exist and don't expose raw API errors (e.g., `{"error": {"message": "Rate limit exceeded", "type": "tokens"...}}`). 3. Verify specific error types are handled differently: rate limiting → "Please wait a moment and try again", timeout → "Response is taking longer than expected", content filter → "I can't help with that request", model unavailable → "Service temporarily unavailable". 4. Check for retry logic with user-visible feedback — if the system auto-retries, does it tell the user ("Retrying...")? 5. Search for fallback behavior — when the AI service is completely down, is there a graceful degradation path (cached responses, manual mode, helpful error page)? 6. Verify error messages include actionable next steps, not just "Something went wrong". |
| **Pass** | AI errors are caught and translated to user-friendly messages, specific error types have specific messages, retry logic with feedback, fallback behavior for outages |
| **Partial** | Errors are caught but messages are generic ("Something went wrong"), or some error types are handled but others show raw API responses |
| **Fail** | Raw API error objects shown to users, no error handling on AI calls, no fallback for AI service outages |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

### INT-018: AI Output Feedback Mechanism

| Field | Value |
|---|---|
| **What to Look For** | Users can provide feedback on AI outputs — thumbs up/down, flag inappropriate content, rate quality, or provide corrections. Feedback is captured for model improvement. |
| **How to Check** | 1. Find the AI response rendering component — look for where model output is displayed to users. 2. Search for feedback UI elements on AI responses — thumbs up/down buttons, star ratings, "Was this helpful?" prompts, flag/report buttons. 3. Verify feedback actions are wired to an API — check that clicking feedback triggers a request (logging endpoint, analytics event, database write), not just a visual toggle. 4. Look for a content flagging mechanism — users should be able to report harmful, incorrect, or inappropriate AI output. Search for "flag", "report", "inappropriate" in AI response components. 5. Check if feedback includes context — does it capture the prompt, response, and user rating together, or just a standalone thumbs up? 6. Verify the feedback submission confirms to the user — "Thanks for your feedback" toast/message. |
| **Pass** | Feedback buttons on AI responses (like/dislike + flag), feedback is sent to backend, flagging mechanism exists, confirmation shown to user |
| **Partial** | Basic feedback exists (e.g., thumbs up/down) but no flagging mechanism, or feedback UI exists but isn't wired to a backend |
| **Fail** | No feedback mechanism on AI outputs, users cannot rate or flag AI responses |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |
