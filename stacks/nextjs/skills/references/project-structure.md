---
name: project-structure
description: Standard folder structure and file organization for Next.js App Router projects using the src/ directory — routing, components, features, lib, utils, and server actions layout, plus how to detect JS vs TS before creating files.
---


# Project Structure

This document defines the standard top-level directory structure for our Next.js App Router projects. We prefer using the `src/` directory to cleanly separate application code from configuration files.

## Before creating any file: detect JS or TS — never assume

Do not default to TypeScript. Before creating a single file in an existing project:

1. **Check for a `tsconfig.json` at the project root.** If present, the project is TypeScript — use `.ts`/`.tsx`.
2. **If no `tsconfig.json`, check the existing file extensions** in `src/` (or `pages/`/`app/`) — look for `.js`/`.jsx` vs `.ts`/`.tsx` in the files already there. Match whatever the majority of the codebase already uses.
3. **If the project is brand new (empty scaffold, no existing source files)**, don't guess — ask the user whether they want JavaScript or TypeScript before generating anything, and proceed only once they've answered.
4. **Stay consistent within a session.** Once the language is determined (from config, from existing files, or from the user's answer), use that consistently for every file created in that project — don't mix `.ts` and `.js` files in the same codebase without the user asking for that explicitly.

This applies to every file type in this doc: components, hooks, utils, server actions, config files, and tests.


## High-Level Structure

A standard project should look like this:

```text
my-next-app/
├── public/                 # Static assets (fonts, images, favicons)
├── src/                    # Application source code
│   ├── actions/            # Server actions (data mutations)
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   ├── components/         # Shared UI components (buttons, inputs, layouts)
│   ├── config/             # Environment validation and global configurations
│   ├── constants/          # Global constants
│   ├── features/           # Feature-based modules (optional, for larger apps)
│   ├── hooks/              # Shared custom React hooks
│   ├── lib/                # Third-party library initializations (db, analytics)
│   ├── styles/             # Global CSS
│   ├── types/              # Global TypeScript declarations
│   └── utils/              # Pure helper functions (formatting, parsing)
├── .env.example            # Example environment variables
├── eslint.config.mjs       # ESLint configuration base on user preference
├── next.config.ts         # Next.js configuration make js or ts base on user preference
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration base on user preference
```

## Detailed Directory Breakdown

### `src/app/`

The routing layer of the application.

- **Rule of thumb:** Keep route files (`page.tsx`, `layout.tsx`) as thin as possible. Delegate complex logic and markup to components in `src/components/` or `src/features/`.
- Use Route Groups (`(auth)`, `(dashboard)`) to organize routes logically without affecting the URL path.
- Keep data fetching at the page or layout level when possible, passing down data to components as props.

### `src/components/`

Global, reusable UI components.

- Group by category (e.g., `src/components/ui/` for primitives like buttons and modals, `src/components/layout/` for headers and footers).
- Components here should ideally be domain-agnostic. If a component is highly specific to a single domain (like a "User Billing Settings Form"), consider placing it in a feature folder.

### `src/features/` (Recommended for large applications)

Instead of organizing strictly by technical type (putting all components in one folder, all hooks in another), organize by feature or domain.

- Example: `src/features/auth/` could contain its own `components/`, `actions/`, `hooks/`, and `types/` that are only relevant to authentication.
- This prevents root-level directories from becoming unmanageably large.

### `src/lib/`

Wrappers and singletons for external libraries and core services.

- Examples: `db.ts` (database connection), `redis.ts`, `stripe.ts`.

### `src/utils/`

Pure, stateless utility functions.

- Examples: `format-date.ts`, `cn.ts` (for merging Tailwind classes).
- If a utility has side effects or interacts with an external service, it belongs in `src/lib/`, not `src/utils/`.

### `src/actions/`

Next.js Server Actions.

- Extracting actions into this dedicated folder ensures they can be easily imported into Client Components without accidentally importing Server-only dependencies into the client bundle.
- Ensure every action validates input (e.g., with Zod) and performs its own authorization checks.

## Colocation Principle

While this global structure exists, remember the rule from the Component Architecture guide: **keep related files together.**

If a type, test, or small utility is _only_ used by a single component, place it directly in that component's folder rather than moving it to the global `src/types/` or `src/utils/` directories.

```text
src/components/ui/button/
├── button.tsx
├── button.test.tsx
└── button.types.ts
```

## Path Alias

- Use absolute imports instead of relative imports always use alias path instead of relative path.
- If you needed ask user to create required alias in desired file based on user answer do the needful.
- If user ask to create required alias in `jsconfig.json` or `tsconfig.json` do the needful.

```text
✅ import { Button } from '@/components/ui/button'
✅ import { page } from '@/app/dashboard/page'
❌ import { Button } from '../components/ui/button'
❌ import { page } from '../app/dashboard/page'
```

---