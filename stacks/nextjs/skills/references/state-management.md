---
name: nextjs-state-management
description: State Management patterns for Next.js App Router.
---

# State Management

With React Server Components, the amount of state you need to manage on the client drastically decreases. Evaluate your state needs carefully.

## URL as State (The Default)

For state that should be shareable, bookmarkable, or persist across reloads (e.g., search queries, pagination, active tabs, filters), **use the URL**.

- In Client Components, use Next.js's `useRouter`, `usePathname`, and `useSearchParams`.
- In Server Components, read `searchParams` directly from the Page props.

## Local State

For UI state that only matters to a single component (e.g., a dropdown being open, a form input value), use React's built-in `useState` or `useReducer` (eg: cart state for adding items to cart, form state for form inputs).

## Shared Client State

For state that must be shared across disparate Client Components (e.g., global theme toggle, complex multi-step client wizards):

- Use **React Context** for simple, low-frequency updates.
- Use a lightweight library like **Zustand** or **Jotai** for complex or high-frequency updates.
- **Avoid Redux** unless integrating with an existing legacy codebase that already heavily relies on it.
