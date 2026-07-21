---
name: nextjs-typescript
description: TypeScript standards for Next.js App Router — strict mode, naming conventions, path aliases, and common patterns.
---

# TypeScript

TypeScript is the standard for all new frontend code at this org — not JavaScript, not "TypeScript when convenient." A `.jsx` file in a new PR should be treated the same as a missing test: fix before merge, don't wave it through.

- **Strict mode is not optional.** Every project's `tsconfig.json` starts from:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "exactOptionalPropertyTypes": true,
      "moduleResolution": "bundler"
    }
  }
  ```
  `strict: true` alone turns on eight separate checks; the two extras above catch real, common bugs (`array[i]` silently typed as defined when it might not be; `{ foo: undefined }` silently accepted where `foo` was never declared optional) that plain `strict` mode misses.
- **No bare `any`.** If a type is genuinely unknown, use `unknown` and narrow it. `any` turns off type-checking for everything it touches, silently, including places far from where you wrote it.
- **Path aliases over `../../../`.** Use the `@/*` alias Next.js scaffolds by default (or more granular aliases like `@/components/*`, `@/lib/*`, `@/hooks/*` if the project is large enough to want them). An import path should never need you to count dots.
- **Name prop types `ComponentNameProps`,** colocated in the same file as the component unless it's shared across multiple components, in which case it belongs in that feature's `types.ts`.
- **`interface` for props and anything meant to be extended; `type` for unions, intersections, and utility compositions.** Pick this rule and don't relitigate it per file — the value is in not having to think about it, not in which one "wins."

---
