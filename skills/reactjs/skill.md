---
name: reactjs
description: React 18+ coding conventions for functional components, hooks, state management, API layer, styling, and folder structure. Covers component best practices, ref, useState, hooks, API layer, forms, validation, caching, SEO, and AI coding standards.
---

# Frontend Project Standards

## 1. Project Principles

- Write the simplest solution that solves the problem. Avoid unnecessary abstractions.
- One responsibility per component, function, hook, and module.
- Separate UI, business logic, data fetching, and utilities.
- Build reusable components/hooks/utilities instead of duplicating code.
- Follow the project's folder structure and naming conventions consistently.
- Write code that scales with the app. Keep files small and organized.
- Optimize only when necessary. Never expose secrets.

# 2.Folder Structure Best Practices

 **General Rules:**
 
 - Create a new folder only when it has a clear responsibility.
 - Avoid unnecessary nesting
 - One folder should have one responsibility.
 - Avoid unnecessary folder nesting. Create folders only when they improve organization and are expected to grow.
 - Organize the project using a feature-first architecture.(for large apps)


| Folder       | Purpose               | Create When                                 |
| ------------ | --------------------- | ------------------------------------------- |
| routes       | React routes          | Define application routing                  |
| pages        | Route pages           | Create a new route/page                     |
| components   | Reusable UI           | UI is reused in two or more places          |
| providers    | Global providers      | Add Theme, Auth, Query, etc.                |
| services     | API layer             | Create backend or external API calls        |
| hooks        | Reusable hooks        | Logic is reused across components           |
| store        | Zustand/Redux         | State is shared across unrelated components |
| context      | Stable shared values  | Theme, Locale, or provider values           |
| utils        | Helpers               | Create pure utility functions               |
| lib          | Third-party configs   | Configure external libraries                |
| constants    | Shared constants      | Values are reused throughout the project    |
| types        | TypeScript types      | Types are reused across modules             |
| assets       | Static assets         | Store images, icons, fonts, videos          |
| styles       | Global styles         | Global CSS, Tailwind, variables             |
| features     | Feature modules       | Add a new business feature(for large app)   |

**folder structure for small apps:**
  src/
    ├── assets/
    ├── components/
    ├── features/
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── providers/
    ├── routes/
    ├── services/
    ├── store/
    ├── types/
    └── utils/

**Feature Folder Example:**
  features/

    auth/
     ├── components/
     ├── hooks/
     ├── services/
     ├── schemas/
     ├── types/
     ├── utils/
     └── index.ts

    dashboard/
     ├── components/
     ├── hooks/
     ├── services/
     └── index.ts


## 3. Naming Conventions

**Files/folders:** kebab-case (`car-card.tsx`, `image-gallery.tsx`). Not `SingleFilter.tsx`.
**Components:** PascalCase (`<MyComponent>`).
**Props:** camelCase (`userId="7"`, not `user-id` / `UserId`).
**Variables:** descriptive, no `a/data/temp/obj/res` (use `carList`, `isLoading`, `apiResponse`).

- Booleans: prefix `is/has/can/should`.
- Arrays: plural (`cars`); Objects: singular (`car`).
- Functions: verb-first (`fetchCars()`), never a bare noun.
- Constants (module-level, never reassigned): `SCREAMING_SNAKE_CASE`.
- JSDoc typedefs: kebab-case, no `I` prefix.

## 4. Declaration Order

1. Imports
2. Types/JSDoc
3. Constants
4. Component
5. State
6. Refs
7. Hooks/Context
8. useEffect
9. API functions
10. Event handlers
11. Derived values
12. JSX

## 5. Styling Rules
- Never use !important.
- Never use arbitrary values unless necessary.
- create primaray and secondary color palette
- create utils file inside lib for `cn()` 
- Use `cn()` (clsx + tailwind-merge) for conditional/merged classNames; skip it for simple static classes.
- Reusable components must accept and merge a `className` prop via `cn()`.
- use CVA for variant classes.
- With CVA: merge user `className` after variant classes.
- Prefer Tailwind utilities over custom CSS wrapper classes.
- Never use inline styles except for dynamic values Tailwind can't express (e.g. `width: ${progress}%`).
- Define a primary/secondary color palette; never hardcode colors.
- Avoid unnecessary fixed widths/heights.
- Typography: use consistent scale (`text-sm` → `text-xl`, `font-medium/semibold/bold`); no random sizes.
- Border radius: use design-system values (`rounded-md/lg/xl`); avoid arbitrary values like `rounded-[13px]`.

## 6. Component and file Rules
- Prefer files with **300 lines or fewer**.
- If a file exceeds **300 lines**, it must have a valid architectural reason—not convenience.
- aim for <300 lines, split if larger.
- Extract UI used 2+ times into a reusable component; extract logic used 2+ times into a hook/utility.
- Keep UI separate from business logic; don't fetch data or place complex logic directly inside reusable UI components/JSX.

## 7. State Management

**Priority order:**

1. **Local state (default)** — `useState`/`useReducer`. Use for modals, form inputs, tabs, single-component data. Derive computed values instead of storing them (e.g. `fullName = \`${first} ${last}\`` not a separate state).
2. **Zustand (default global state)** — for auth, theme, cart, notifications, dashboard filters — anything shared across unrelated components. Store under `src/stores/*.ts`.
3. **Redux Toolkit** — large enterprise apps, complex workflows, time-travel debugging. Don't pick it just because state is global(Redux Toolkit should only be introduced when Zustand or Context can no longer satisfy application complexity).
4. **React Context** — only for stable, app-wide values (theme, locale, DI, auth provider). Not for frequently-changing data (cart, real-time data).
 
 **Server State:**
  - TanStack Query
  - SWR

**Client State:**
  - useState
  - Context
  - Zustand  
  - Redux Toolkit (large enterprise only)

- Manage server state with TanStack Query/SWR, not Zustand/Redux.






## 8. API Calls

- Standard: native `fetch()` + `async/await` + `try/catch` (no `.then()` chains, no direct calls from UI components).
- Put all requests in a `services/` layer, one file per resource/feature
- Wrap every request in `try/catch`
- Every request must handle: loading, success, error, and empty states — never render a blank screen.
- Validate response shape before use; never assume structure is correct.
- Handle HTTP statuses explicitly (200/201/204/400/401/403/404/500) with matching UI feedback.
- Allow manual retry on failure; don't auto-retry endlessly.
- Attach auth headers when required; handle expired sessions gracefully.
- Cancel requests on unmount; prevent race conditions and duplicate/unneeded fetches.
- Components should only: trigger requests and render loading/success/error/empty states.
- Use AbortController to cancel fetch requests.
- Normalize API errors.
- Avoid duplicate API logic.
- Keep API types close to service layer.


## 9. Error Handling
- show user-friendly errors
- Use Error Boundaries.
- Never expose backend errors.
- Log unexpected errors.
- Provide fallback UI.
- Handle offline scenarios gracefully.

## 10. Forms

- Validation order: **Zod** (schema) → **React Hook Form** (state/submission).
- Keep validation schema separate.
- Reuse schemas across frontend/backend where possible.
- Show inline validation messages.
- Validate before submission.

## 11. Animation

- Standard library: **Framer Motion** for all non-trivial animations/transitions; CSS transitions only for simple hover/focus/color changes. Don't mix animation libraries.
- Use for: page transitions, modals, drawers, dropdowns, tooltips, toasts, loading/skeleton states, cards, accordions, tabs, scroll reveal, list animations. Avoid animating every element.
- Keep animations short (150–300ms), smooth, with proper easing; avoid excessive or continuous motion.
- Animate `transform`/`opacity`; avoid animating layout properties (width, height, top, left, margin) unless necessary.
- Reuse animation variants/wrappers (e.g. `animations/fade.ts`, `slide.ts`, `scale.ts`); keep animation logic separate from business logic.
- Respect `prefers-reduced-motion`; never block user interaction.
- Animate list items on enter/exit with stable keys.
- Modals: animate backdrop and dialog together; prevent layout shift.

## 12. TypeScript

- Avoid any.
- Prefer unknown over any.
- Use interfaces for objects.
- Use type for unions.
- Enable strict mode.
- Reuse shared types.
- Never disable TypeScript errors.


## 13. Accessibility

- Use semantic HTML.
- All images require meaningful alt text.
- Buttons should never be replaced with clickable divs.
- Keyboard navigation must work.
- Forms require labels.
- Use proper ARIA attributes only when necessary.
- Maintain sufficient color contrast.
- Visible focus states are mandatory.


## 14. Performance

- Measure before optimizing; fix only identified bottlenecks.
- Keep components small; lift state only when necessary; keep state close to usage.
- `React.memo()`: only for frequently-rendering components with stable props — not everything.
- `useMemo()`: only for expensive/repeated calculations — not primitives or trivial ops.
- `useCallback()`: only for callbacks passed to memoized children or used in dependency arrays.
- State: store minimum needed, compute derived values, avoid deep nesting/duplication.
- Avoid creating new objects/arrays/inline functions during render where it hurts performance.
- Lists: stable unique keys (never array index), use backend IDs, virtualize large lists.
- Lazy-load heavy components with `React.lazy()` + `Suspense`.
- Debounce/throttle expensive handlers (search, resize, scroll).
- API: prevent duplicate requests, cache via TanStack Query, cancel on unmount.
- Images: lazy-load, compress, use SVG icons, import only what's needed.
- Imports: only what's needed, remove unused, prefer tree-shakable libraries.
- Hooks: single responsibility, no unnecessary internal state.
- Effects: only for side effects, correct dependency arrays, clean up subscriptions/timers, no derived state in effects.
- Context: keep values stable, split large contexts, memoize provider values.
- Bundle: remove unused deps, code-split, lazy-load feature modules.
- Split vendor bundles.
- Use dynamic imports for heavy libraries.
- Optimize fonts.
- Optimize bundle size using tree shaking.
- Avoid unnecessary Context re-renders.

## 15. Security
-**Env type:** .env — Base environment variables shared across all environments
               .env.local — Local developer-specific environment variables; overrides .env and is never committed
               .env.staging — Environment variables used for the staging environment before production deployment
               .env.production — Environment variables used for the production environment. 
- **Env vars:** all in `.env`, never hardcoded; only browser-safe vars exposed (`VITE_*`/`REACT_APP_*`); separate files per environment; validate at startup.
- **.gitignore:** `.env*`, `node_modules`, `dist`, `build`, `coverage`, `*.log`. Never commit secrets/tokens/certs.
- **Secrets:** never in components, never exposed to client, never committed; rotate if leaked; use a secret manager in production.
- **API:** HTTPS only; never trust client-side validation alone; validate/sanitize server-side; don't leak internal error details.
- **Auth:** never hardcode credentials or expose JWT secrets client-side; clear auth data on logout; protect routes.
- **User input:** validate and sanitize all input/content before rendering; never trust it.
- **XSS:** avoid `dangerouslySetInnerHTML`; sanitize any external HTML before rendering.
- **Dependencies:** keep updated, remove unused, audit for vulnerabilities.
- **Logging:** never log passwords/tokens/secrets; strip dev logs from production.
- **Storage:** no sensitive data in `localStorage`; clear on logout.
- **Errors:** show user-friendly messages only; never expose stack traces/DB/server details.
- **File uploads:** validate type, size, and extension; reject unsupported formats.
- **Before deploy:** remove debug code/unused env vars, verify prod endpoints, enable HTTPS, check source maps.
- **logging:** never log sensitive data; use structured logging; sanitize logs to avoid leaking secrets.


## 16. Code Quality

- Prettier
- Husky
- lint-staged

**Every PR should pass:**
 - lint
 - typecheck
 - tests


## 17. Git Standards

- Feature branches
- Pull Requests
- Squash commits
- Conventional commits
- Code review mandatory

## 18. Documentation

- Add README for every major module.
- Document reusable hooks.
- Document shared components.
- Keep architecture diagrams updated.


## 19. Testing

- Unit Testing: Vitest / Jest
- Component Testing: React Testing Library
- E2E: Playwright or Cypress

**Test:**
 - Components
 - Hooks
 - Utilities
 - API services

## 20. Build & Deployment

- Production builds must pass lint.
- Remove console.log before production.
- Enable source maps only when required.
- Verify environment variables.
- Enable gzip/brotli compression.


 ## React Best Practices
 - Prefer Server Components when using frameworks that support them.
 - Use Suspense for async UI boundaries.
 - Prefer Actions for form submissions where supported.
 - Avoid unnecessary useEffect; derive state whenever possible.
 - Keep components pure.
 - Never mutate props and state.
 - Prefer composition over inheritance.
 - Use controlled components for forms.
 - Avoid prop drilling when Context is appropriate.
 - Keep hooks at the top level.
 - Never call hooks conditionally.
 