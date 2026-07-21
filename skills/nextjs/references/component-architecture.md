---
name: component-architecture
description: Component design standards for Next.js App Router — Server vs Client Component boundaries, when to use 'use client', composition patterns, file colocation, and barrel file avoidance.
---

# Component Architecture

This section covers the organization standards for component design, Server/Client component boundaries, composition, and file structure in Next.js App Router applications.

## 4.1 Server Components vs. Client Components

Next.js App Router uses React Server Components (RSC) by default. This is a fundamental shift in how we build React applications.

### The Default is Server

Every component should be a Server Component unless it absolutely needs to be a Client Component. Server Components give us:

- Zero JavaScript sent to the client
- Direct access to backend resources (database, filesystem)
- Secure handling of sensitive information (tokens, API keys)
- Caching and performance benefits by default

### When to use `'use client'`

You must add the `'use client'` directive **only** when a component requires:

- Interactivity and event listeners (e.g., `onClick`, `onChange`)
- State and lifecycle hooks (e.g., `useState`, `useReducer`, `useEffect`)
- Browser-only APIs (e.g., `window`, `document`, `localStorage`)
- Custom hooks that depend on state or effects
- React Class components

### Push the Boundary Down

Do not put `'use client'` at the top of a page or layout unless absolutely necessary. Push the client boundary as far down the component tree as possible.

- **Bad:** A whole page is `'use client'` just because it has a toggle button.
- **Good:** The page is a Server Component, and it imports a smaller `<ToggleButton />` that has `'use client'`.

The split happens at the **file boundary**, not at JSX nesting depth: once a file has `'use client'` at the top, every component that file directly imports and renders is pulled into the client bundle — even if those imported components have no interactivity of their own. Extract interactive leaves into their own files rather than adding `'use client'` to a shared file that other Server Components also import.

### Interleaving Server and Client Components

`'use client'` marks a boundary between the server and client module graphs. Anything a Client Component file **imports and renders directly** becomes part of its client module graph and is bundled/hydrated as a client component. This does **not** apply to Server Components passed in as `children` or other props — those are rendered on the server and passed down as already-rendered output, so they keep all the benefits of being a Server Component.

```tsx
// ✅ Good: Passing a Server Component as a child to a Client Component
import { ClientWrapper } from "./client-wrapper";
import { ServerContent } from "./server-content";

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />
    </ClientWrapper>
  );
}
```

This same pattern applies to context providers: render providers as deep in the tree as possible (wrapping only `{children}`, not the whole `<html>` document), so Next.js can keep as much of the tree statically optimized as possible.

## 4.2 Component Design & Composition

### Composition over Prop Drilling

If you find yourself passing props through multiple layers of components that don't use them (prop drilling), use composition instead. Use the `children` prop or specialized slot props to pass content down.

### Single Responsibility Principle

A component should ideally do one thing. If a component is growing past 150-200 lines, ask yourself if it can be broken down into smaller, reusable pieces.

### Pure Components

Keep your components as pure as possible. Given the same props, they should render the same output. Avoid side effects in rendering logic.

## 4.3 Directory Structure & File Colocation

Keep related files together. If a component has specific types, styles, or tests that aren't used anywhere else, they belong in the same folder as the component.

```
components/
  user-profile/
    user-profile.tsx        # The main component
    user-profile.test.tsx   # Tests
    user-profile.types.ts   # Colocated types
    components/             # Sub-components used only by user-profile
      avatar.tsx
```

## 4.4 Barrel Files (`index.ts`)

**Avoid barrel files in application code within  the App Router.**

While `export * from './my-component'` looks clean, barrel files often break tree-shaking and can cause server-side code to leak into client bundles, or create massive circular dependency chains. This is worse than it sounds for icon/component libraries with thousands of re-exports — importing a single icon can still pay the cost of evaluating the entire barrel.

- **Bad:** Importing from `@/components` where `components/index.ts` exports 50 different components.
- **Good:** Importing directly from the specific component file: `import { Button } from '@/components/button'`.

For **third-party libraries** that ship their own barrel files (e.g. icon packs, UI kits), you don't control their source — use Next.js's [`optimizePackageImports`](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) config option instead, which automatically rewrites barrel imports from a configured list of packages into direct imports at build time.

If you are building an isolated UI library package, barrel files are acceptable, but in application code, prefer direct imports.

---
