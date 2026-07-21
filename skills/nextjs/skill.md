---
name: nextjs
description: Organization-wide senior-level engineering standards for Next.js (App Router) + TypeScript frontend code — naming conventions, TypeScript config, component architecture, styling, state/data fetching, performance, accessibility, security, and testing. Use this any time you write, generate, scaffold, review, refactor, or critique any React/Next.js component, page, hook, route handler, or file for this organization — e.g. "build me a dashboard page," "add a login form," "why is this component re-rendering," "review my PR," "what should I name this file," "set up a new feature folder," "is this accessible/secure." Trigger even if the person doesn't say "standards," "conventions," or "code review" explicitly. The naming rules (PascalCase components, camelCase props, kebab-case files/folders) are mandatory on every file this skill touches — no exceptions, no "just this once."
---

# Next.js Engineering Standards

These are this organization's engineering standards for Next.js frontend work, targeting App Router + TypeScript. They exist for one reason: a developer should be able to move between any of our projects and immediately recognize the shape of the code. Consistency compounds — every convention below removes a small decision on every file, every review, every onboarding.

This document was researched against the current (2026) Next.js/React ecosystem rather than written from memory, since "industry standard" drifts fast in this stack. Where a recommendation reflects a judgment call rather than a hard rule, that's noted so you know where flexibility is acceptable and where it isn't.

**How to use this skill:** the naming rules below are mandatory and non-negotiable — apply them to every file, every time, regardless of what else the task is. Everything after that is layered: read the relevant section for the part of the codebase you're touching before writing or reviewing code in that area.

---

## Topics

For naming conventions of files, folders, components, props. See [naming conventions](references/naming-conventions.md)

For typescript rules guide usage. See [typescript guide](references/typescript.md)

For project structure and folder organization. See [project structure](references/project-structure.md)

For component architecture guide. See [component architecture](references/component-architecture.md)

For caching rules and guidelines. See [caching](references/caching.md)

For error handling and logging rules. See [error handling and logging](references/error-handling.md)

For form and API routes rules. See [form and api routes](references/form.md)

For styling guidelines and rules. See [styling guidelines](references/styling-guidelines.md)

For state management rules. See [state management](references/state-management.md)

For data fetching rules. See [data fetching](references/data-fetching.md)

For performance rules and guidelines. See [performance](references/performance.md)

For testing rules and tooling guidelines. See [testing and tooling guidelines](references/testing.md)

For SEO rules and guidelines. See [SEO](references/seo.md)


## Fast compliance check

Before treating a component/page/file as done — whether you wrote it or you're reviewing someone else's:

- [ ] Component name PascalCase, both the export and every JSX usage
- [ ] Props camelCase, typed, minimal
- [ ] File and folder names kebab-case (except Next.js's reserved filenames)
- [ ] TypeScript strict, no bare `any`
- [ ] Server Component unless it genuinely needs interactivity/hooks/browser APIs — then `'use client'`, pushed as low in the tree as possible
- [ ] Images through `next/image`, fonts through `next/font`
- [ ] Every interactive element reachable and operable by keyboard alone
- [ ] No secret or unvalidated input trusted just because it "came from our own form"
- [ ] All forms and API routes validated with Zod
- [ ] Proper error boundaries (`error.tsx`) in place, avoiding exposed stack traces
- [ ] Caching strategies (`no-store`, `revalidatePath`, etc.) are deliberate and handled correctly
- [ ] SEO metadata correctly implemented for public-facing pages
- [ ] AI-generated code has been thoroughly reviewed and validated
- [ ] A test exists for the behavior that would actually break something if it regressed
