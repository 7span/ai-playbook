---
name: vuejs
description: "Frontend Vue.js best practices for Vite-based single-page applications. Covers Vue 3 Composition API, component structure, reactive state, composables, stores, routing, forms, validation, API layer, and AI coding standards."
---

# Vue 3 (Vite / SPA) Coding Conventions

These are binding rules for any AI agent editing this codebase. If a rule and a request
conflict, follow the rule and flag the conflict instead of silently deviating.

## 1. Project Principles

- Always prioritize readability over brevity.
- Never introduce breaking changes unless explicitly requested.
- Reuse existing code before writing new code.
- Follow existing project patterns rather than introducing new ones.
- Add comments.
- Keep components focused on a single responsibility.
- Prefer explicit code over clever abstractions.
- Assume Vue 3 (Composition API, `<script setup>`) and Vite as the build tool unless
  the project shows otherwise.

## 2. Folder Structure

| Folder                                   | Purpose                                                                                                                                     | Create a new file here when...                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/views/`                             | Route-level components, paired 1:1 with `vue-router` routes                                                                                 | The content needs its own URL                                      |
| `src/components/`                        | Reusable UI pieces                                                                                                                          | The markup is used more than once, or is complex enough to isolate |
| `src/layouts/`                           | Manual page shells (header/footer/nav wrappers), applied via a wrapper component or per-route meta since Vue has no automatic layout system | Multiple views share the same overall structure                    |
| `src/router/`                            | `vue-router` instance, route definitions, navigation guards                                                                                 | You're adding/changing a route or a route guard                    |
| `src/composables/`                       | Reusable reactive logic (`useX`)                                                                                                            | Stateful logic is needed in more than one component                |
| `src/stores/`                            | Pinia stores                                                                                                                                | State must be shared across unrelated components/views             |
| `src/services/` (or `src/repositories/`) | API layer — wraps `axios`/`fetch` calls per resource                                                                                        | You're exposing a new API call the app consumes                    |
| `src/utils/`                             | Pure, stateless helper functions                                                                                                            | Logic has no reactivity and no side effects                        |
| `src/types/`                             | Shared JSDoc typedefs (`@typedef`) for editor autocomplete/hints                                                                            | A shape is documented and reused in more than one file             |
| `src/plugins/`                           | Registration code for third-party libraries, invoked from `main.js` via `app.use()`                                                         | A library needs app-level setup                                    |
| `src/assets/`                            | Files that go through Vite's build pipeline (processed CSS, images referenced in code)                                                      | The asset needs compilation/optimization                           |
| `public/`                                | Files served as-is at the root URL (favicon, robots.txt) — Vite convention, copied verbatim                                                 | The asset must NOT be processed and needs a stable URL             |
| `src/App.vue`, `src/main.js`             | App root and entry point                                                                                                                    | —                                                                  |

There is no Nuxt-style `pages/` (file-based routing), `server/` (backend endpoints),
or automatic `middleware/`/`layouts/` resolution here — those are Nuxt-only
mechanisms. In plain Vue:

- Routes are declared explicitly in `src/router/`, not inferred from the filesystem.
- Route guards live in `src/router/` as `router.beforeEach(...)` or per-route `meta`
  - a guard, not in a `middleware/` folder.
- If the app needs a backend, that's a separate project/service — this app only
  contains a `services/` layer that calls it.

## 3. File Naming

- Components: `kebab-case.vue` (`car-card.vue`, `image-gallery.vue`, `filter-sidebar.vue`)
- Route/view components: `kebab-case.vue` in `src/views/`, with the route path (including
  dynamic segments like `:id`) declared explicitly in `src/router/index.js` — not encoded
  in the filename
- Composables: `useX.js` (`useCars.js`, `useAuth.js`, `useFilters.js`)
- Utilities: `camelCase.js` (`formatPrice.js`, `truncateText.js`)
- Types: `camelCase.js` (`car.js`, `user.js`), one domain per file
- Tests: same name as the file under test, suffixed `.spec.js`
- Never: `helper.js`, `utils.js`, `misc.js` — these are dumping grounds; name files by
  what they do

## 4. Variable Naming

Never: `a`, `data`, `temp`, `obj`, `res`
Instead: `carList`, `selectedBrand`, `isLoading`, `currentPage`, `apiResponse`, `filteredCars`

- Booleans: prefix `is`/`has`/`can`/`should` (`isLoading`, `hasError`, `canEdit`), never
  bare `loading`, `visible`, `errorFlag`
- Arrays: plural (`cars`, `users`, `images`)
- Objects: singular (`car`, `user`, `image`)
- Functions: verb-first (`fetchCars()`, `loadImages()`, `updateFilters()`), never a bare
  noun (`cars()`, `filter()`)
- Constants (module-level, never reassigned config values): `SCREAMING_SNAKE_CASE`
  (`MAX_PAGE_SIZE`)
- JSDoc typedefs: kebab-case, no `I` prefix (`Car`, not `i-car`)

## 5. Declaration Order (inside `<script setup>`)

1. imports
2. JSDoc typedefs used only in this file (if any)
3. `defineProps` / `defineEmits` / `defineOptions` (must appear before any other logic —
   Vue's compiler macros are hoisted and expected near the top)
4. router (`useRouter()`, `useRoute()`)
5. stores
6. composables
7. `ref` / `reactive` state
8. `computed`
9. `watch` / `watchEffect`
10. lifecycle hooks
11. plain functions/methods
12. `defineExpose` (if the component exposes anything to a parent via template ref)

## 6. `ref` vs `reactive`

Use `ref` for: numbers, strings, booleans, null, Date, arrays, and any object that gets
fully replaced (not just mutated).

Use `reactive` for: forms, filters, config objects, grouped related state that is mutated
in place, never replaced wholesale.

Never group unrelated state into one `reactive` blob (e.g. `reactive({ loading, cars, modal, page })`) — each concern gets its own `ref`.

Destructuring: plain `reactive()` objects lose reactivity when destructured. Use
`toRefs()` on a local reactive object, or `storeToRefs()` when pulling state out of a
Pinia store, before destructuring.

## 7. Computed

Use for: derived state only — `filteredCars`, `sortedCars`, `totalPrice`, `isFormValid`,
`formattedPrice`.

Never use for: API calls, async operations, mutations, or side effects. A computed must
be pure — it must not set other refs.

It's fine for a computed to build the parameters for an API call (e.g. assembling a
filters object), as long as the fetch itself happens elsewhere (in a function or watch),
not inside the computed getter.

## 8. Watch

Use only when something external must happen as a reaction to a change: URL updates,
API requests, analytics, saving drafts, debouncing, pagination, infinite scroll.

If the handler is just deriving a new value from another ref, that's a computed, not a
watch.

Know the options: `immediate` (run once on setup), `deep` (watch nested mutations),
`flush: 'post'` (run after DOM update). Stop a watcher by calling the function `watch()`
returns when it's no longer needed (e.g. in `onUnmounted`), rather than leaving it running.

## 9. watchEffect

Use rarely — only when the dependencies genuinely can't be listed explicitly. Otherwise
prefer `watch()`, since it's clearer about what triggers it.

## 10. Methods

- Do one thing.
- Stay under ~40 lines; past that, extract a helper — this is a signal the function has
  more than one responsibility, not a hard technical limit.
- Return early instead of nesting if/else.

## 11. API Layer

Never fetch directly inside a view or component (`views/CarList.vue` calling `fetch(...)`
directly).

Flow: component → composable (`useCars()`) → service (`carService.js`) → API

- The service is a plain module (e.g. `services/carService.js`) that wraps
  `axios`/`fetch` calls for one resource and returns structured data (documented with a
  JSDoc `@typedef` if the shape is reused). It knows the endpoint URLs; nothing above it
  does.
- The composable owns reactive state (`loading`, `error`, `data`) and calls the service,
  exposing state + actions to components.
- Use `axios` if the project already depends on it; otherwise native `fetch` wrapped in
  the service layer.
- Every API-backed composable must expose: `loading`, `error`, and a way to distinguish
  "not yet loaded" from "loaded but empty."
- Base URLs and any client-exposed config come from Vite env vars ,never hardcoded.

## 12. Rendering Model & Environment Config

This is a client-side rendered (CSR) SPA — there is no SSR step, so there's no
`useAsyncData`/`useFetch`/`ClientOnly` equivalent to reach for. Initial data fetching
happens from `onMounted` or a router navigation guard, not at a build/
server step.

- All env vars exposed to client code must be prefixed `VITE_` (Vite's requirement) and
  read via `import.meta.env.VITE_*`.
- Never hardcode a URL, key, or environment-specific value directly in a component,
  composable, or service.
- Non-`VITE_`-prefixed vars in `.env` are available at build time (e.g. in
  `vite.config.js`) but are not exposed to browser code — use that distinction instead
  of Nuxt's `runtimeConfig.public` split.
- Never commit `.env` files; only `.env.example` with placeholder keys.

## 13. Browser APIs

Since this is CSR-only, `window`/`document`/`localStorage`/etc. are safely available
everywhere by default — there's no SSR mismatch to guard against. The only exception is
if the project also runs code in a non-browser context (e.g. Node-based unit tests,
Vitest with a non-jsdom environment); in that case, guard narrowly with
`typeof window !== 'undefined'` around just the code that needs it, rather than
wrapping whole components.

## 14. State Management

- Use `ref`/`reactive` for local, single-component state.
- Use Pinia only for state genuinely shared across unrelated components/views.
- Never create a store for a modal, a dropdown, or a single view's local filters —
  that's local state.
- Prefer setup-syntax stores (`defineStore('id', () => {...})`) for consistency with
  Composition API usage elsewhere.
- Store id = file name, kebab-case (`stores/carFilters.js` → id `"car-filters"`).
- Import stores explicitly where used (`import { useCarStore } from '@/stores/car'`) —
  there's no Nuxt auto-import here.

## 15. Lifecycle Hooks

- `onMounted`: browser-only setup (measuring DOM, initializing a browser-only library)
  **and** initial data fetching for the component/view, since there's no SSR-aware
  fetch composable to defer to — call the composable's fetch action here.
- `onUnmounted`/`onBeforeUnmount`: required whenever `onMounted` set up a listener,
  observer, timer, or manual `watch()` stop-handle — clean up what you created.

## 16. Performance

- Lazy-load routes via `component: () => import('../views/CarDetail.vue')` in the router
  config, and lazy-load non-route components that aren't needed on initial paint via
  `defineAsyncComponent`.
- Use `vite-imagetools` (or a similar plugin) or native `<img loading="lazy">` for image
  optimization.
- Virtualize long lists (100+ items) rather than rendering them all.
- Memoize expensive derived values with `computed` (it caches automatically) instead of
  recomputing in the template.
- Use `shallowRef`/`markRaw` for large objects that don't need deep reactivity (e.g.
  third-party class instances, big static datasets).

## 17. Components

- Max ~350 lines. Max 5 props. Max 3 emits.
- If a component legitimately needs more, split it into subcomponents rather than
  exceeding the limit — the limit is a signal to decompose, not a target to negotiate.
- Prefer slots over prop-drilling boolean flags to control child markup.

## 18. JavaScript

For a JavaScript project — do not introduce `.ts`/`.vue` with `lang="ts"`, TypeScript
syntax, or type annotations anywhere.

- Type props with the runtime `defineProps({...})` object syntax, including `type` and
  `required`/`default` for every prop — never the bare `defineProps(['car', 'loading'])`
  array form once a component has more than one or two trivial props.
- Type emits with the runtime `defineEmits(['update', 'delete'])` array (or object form
  with validators for emits that carry a payload needing validation).
- Use JSDoc comments (`@param`, `@returns`, `@typedef`) on composables, service
  functions, and utils to document shapes and expected types for editor hints — this is
  the closest equivalent to TypeScript's benefits without adding TypeScript.
- Validate function inputs explicitly where correctness matters (API boundaries, form
  submission) instead of relying on a type system to catch mismatches.
- Never guess a data shape — inspect the actual API response or an existing JSDoc
  `@typedef` before writing code that consumes it.
- Use optional chaining (`?.`) when accessing nested properties that may be
  null/undefined (`car?.owner?.name`), instead of manual `&&` chains or unguarded
  access that can throw.
- Pair it with nullish coalescing (`??`) when a fallback value is needed
  (`car?.price ?? 0`) — don't reach for `||` for this, since `||` also overrides valid
  falsy values like `0` or `""`.

## 19. Accessibility

- Every interactive element must be reachable and operable by keyboard
  (tab, enter/space), not just mouse/touch.
- Every image needs meaningful alt text (or `alt=""` if purely decorative).
- Every form input needs an associated `<label>`.
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`) over generic `<div>`s with
  click handlers.
- Add ARIA attributes only when semantic HTML can't express the state (e.g.
  `aria-expanded` on a custom dropdown).
- Visible focus states must not be removed (`outline: none` without a replacement is not
  allowed).

## 20. Error Handling

Every API-backed operation must account for: loading, error, retry, empty, success
states — not just the happy path.

- Catch errors at the service or composable layer and surface them as the error state
  described in Section 11 — don't let raw exceptions reach the template.
- Register a global fallback via `app.config.errorHandler` in `main.js` for uncaught
  render/lifecycle errors, and pair it with an `<ErrorBoundary>`-style wrapper component
  or route-level fallback UI for navigation/render failures (there's no Nuxt
  `error.vue`/`createError()` here).
- User-facing errors get a message via the project's toast/notification pattern (if one
  exists) rather than `console.error` alone.

## 21. Styling Conventions

- State the project's styling approach explicitly before writing styles (Tailwind utility
  classes vs scoped `<style>` with SCSS/CSS — check `vite.config.js`/`package.json` for
  which is installed; don't introduce a second system).
- If Tailwind: compose utility classes directly in templates; extract to a component when
  the class list becomes unreadable, not before.
- If scoped CSS/SCSS: use `<style scoped>` per component; avoid global style overrides
  outside a dedicated `src/assets/css` entry file.
- Class naming (when not using Tailwind): BEM-style (`car-card__title`,
  `car-card--highlighted`).
- No inline `style="..."` attributes except for computed/dynamic values that can't be
  expressed as a class.

## 22. Linting & Formatting

- Follow the project's existing ESLint and Prettier configs; do not introduce new rules
  or override existing ones without being asked.
- Run the lint/format check before considering a change complete; fix violations rather
  than disabling rules inline.
- Don't hand-format code to differ from what Prettier would produce — let the formatter
  decide, don't fight it with manual spacing/line breaks.

## 23. Package Manager

- Use whichever lockfile already exists in the project (`pnpm-lock.yaml`, `yarn.lock`, or
  `package-lock.json`) to determine the package manager — never mix managers or add a
  second lockfile.
- If starting a new project with no existing lockfile, default to pnpm.
- Never run `npm install` in a project that has a `pnpm-lock.yaml` or `yarn.lock` (and
  the equivalent for other combinations) — it creates a conflicting lockfile.

## 24. Security

- Never use `v-html` on content that isn't sanitized/trusted — it's a direct XSS vector.
- Follow whatever the existing auth setup already does (token storage, header
  attachment via an `axios`/`fetch` interceptor) rather than introducing a new storage
  mechanism.
- Validate and sanitize all user input on the server side (the separate backend this SPA
  calls), even if it's also validated client-side — client validation is UX, not
  security.
- Never log sensitive data (tokens, passwords, PII) to the console or external logging
  services.

## 25. Form Validation

- Use the project's existing validation library if one is installed; if none exists and
  one must be introduced, prefer `vee-validate` (Vue-native, integrates with
  `<script setup>`) with Yup schemas (Zod is TypeScript-oriented and less idiomatic in a
  plain-JS project) — don't hand-roll validation logic when either is available.
- Validation schemas/rules live near the form or in a shared `schemas/`/`validation/`
  location, not inline scattered across the template.
- Every validated field surfaces its error state using the same pattern as Section 20
  (loading/error/etc.) — consistent, not ad hoc per form.

## 26. AI Agent Rules

- Search for an existing component before creating a new one.
- Reuse composables whenever possible.
- Do not duplicate business logic.
- Match the project's naming conventions and file organization.
- Avoid introducing new dependencies unless explicitly requested.
- Do not guess API shapes or data models — inspect existing types or interfaces first.
- Prefer SPA-compatible solutions consistent with the existing Vite/vue-router setup —
  don't introduce SSR-only patterns into a CSR project.
- Ask for clarification rather than making assumptions when requirements are ambiguous.
- When a rule in this document conflicts with a pattern already present in the
  codebase, follow the existing codebase pattern and flag the discrepancy rather than
  silently picking one.


---

# 27. Vue Router Best Practices

- Use `meta` fields for authentication, permissions, page titles, and breadcrumbs.
- Prefer lazy-loaded routes using dynamic imports.
- Keep route guards lightweight and delegate business logic elsewhere.
- Avoid deeply nested routes unless there is a clear UX requirement.

# 28. Composable Best Practices

- Each composable should solve one reusable concern.
- Keep business logic out of components.
- Avoid creating singleton/global state inside composables unless intentionally shared.
- Return only the reactive state and methods consumers actually need.

# 29. Pinia Best Practices

- Keep stores domain-specific.
- Do not store temporary UI state globally.
- Prefer actions for asynchronous operations.
- Keep getters pure and side-effect free.

# 30. Component Communication

- Prefer Props + Emits for parent/child communication.
- Prefer Slots over excessive configuration props.
- Use `provide/inject` only for deeply nested component trees.
- Avoid Event Bus patterns in new code.

# 31. Forms Best Practices

- Use `v-model` correctly.
- Never mutate props directly.
- Disable submit buttons while requests are pending.
- Reset form state after successful submission.

# 32. Additional API Best Practices

- Cancel stale API requests.
- Debounce search requests.
- Centralize authentication interceptors.
- Retry only idempotent requests.
- Keep API concerns inside the service layer.

# 33. Testing

- Use Vitest for unit testing.
- Use Vue Test Utils for component testing.
- Mock API requests.
- Test composables independently.
- Test Pinia stores independently.

# 34. Advanced Performance

- Use `v-once` for static content.
- Use `v-memo` where appropriate (Vue 3.3+).
- Avoid unnecessary watchers.
- Avoid expensive expressions inside templates.
- Prefer cached computed properties.

# 35. Reusability

- Extract reusable logic into composables.
- Extract repeated UI into reusable components.
- Avoid duplicate business logic.
- Design reusable UI components before copying code.

# 36. Enterprise Folder 

Create these folders only when required:

- `src/api/`
- `src/constants/`
- `src/enums/`
- `src/directives/`
- `src/validations/`
- `src/hooks/`

# 37. Environment Files

- `.env.development`
- `.env.production`
- `.env.local`
- `.env.example`

Never commit environment files containing secrets.

# 38. Internationalization (i18n)

- Use `vue-i18n` when multilingual support is required.
- Never hardcode user-facing strings.
- Store translations separately.

# 39. Logging

- Remove `console.log` before production.
- Use centralized logging utilities.
- Log only meaningful information.
- Never log authentication tokens or personal data.

# 40. Code Review Checklist

Before opening a Pull Request:

- Lint passes.
- Build passes.
- No `console.log`.
- No unused imports.
- Accessibility verified.
- Mobile responsiveness verified.
- Loading state implemented.
- Empty state implemented.
- Error handling implemented.
- Retry behavior implemented where appropriate.

# 41. Recommended Vue Ecosystem

When applicable, prefer established ecosystem tools:

- Vue DevTools
- VueUse
- Vue I18n
- Vitest
- Vue Test Utils
- Axios Interceptors
- Dynamic Imports
- Error Boundaries
- PWA support
- State persistence
- Caching strategies
- Optimistic UI updates
- Infinite scrolling
- Pagination
- File uploads
- Authentication & Authorization
- Role-Based Access Control (RBAC)