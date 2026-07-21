---
name: nextjs-testing-and-tooling-standards
description: Testing and tooling standards for Next.js (App Router) + TypeScript frontend code — unit testing, integration testing, E2E testing, linting, formatting, code quality, and continuous integration. Use this when writing, generating, scaffolding, reviewing, refactoring, or critiquing any component, page, hook, or utility in this codebase.
---

# Testing and Tooling

This section outlines our approach to testing frontend code, ensuring code quality through linting and formatting, and maintaining continuous integration.

## Testing Philosophy

We test **behaviors, not implementation details**. If a user's experience hasn't changed, a refactor shouldn't break the tests.

- **Don't test the framework:** We don't write tests to ensure React renders a `<div>`, or that Next.js routes correctly. We test our custom logic.
- **Test what breaks:** Focus on critical user journeys, complex state calculations, and boundary conditions.

## Unit & Integration Testing

We use **Vitest** (or Jest) combined with **React Testing Library (RTL)** for component tests.

### Colocation

Test files must live right next to the file they are testing.

- `user-card.tsx` -> `user-card.test.tsx`
- `use-debounce.ts` -> `use-debounce.test.ts`

### Best Practices with RTL

- Query elements by their accessible role (`getByRole('button', { name: /submit/i })`) rather than test IDs or CSS classes. This implicitly tests accessibility while testing functionality.
- Use `@testing-library/user-event` instead of `fireEvent` because it more accurately simulates real browser interactions (e.g., typing includes keydown, keypress, keyup).

```tsx
// ✅ Good: Testing behavior via accessible roles
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

test("shows error on invalid submission", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});
```

## End-to-End (E2E) Testing

For critical paths (e.g., user signup, checkout flow), use an E2E testing framework like **Playwright** or **Cypress**.

- E2E tests should live in a dedicated `e2e/` or `tests/` directory at the root of the project, completely separate from component unit tests.
- These tests run against a fully built version of the application connected to a test database.

## Linting and Formatting

Consistency is enforced by machines, not by humans debating in PRs.

### Prettier (Formatting)

- We use Prettier for all code formatting.
- Format-on-save must be enabled in your IDE.
- There is no debate on code formatting (tabs vs. spaces, line length, etc.). Prettier's defaults (or our project's `.prettierrc`) are the law.

### ESLint (Code Quality)

- We use ESLint to catch bugs and enforce architectural rules.
- Key plugins include `eslint-plugin-react-hooks` (strictly enforce rules of hooks), `eslint-plugin-jsx-a11y` (accessibility), and `unicorn/filename-case` (enforce kebab-case as outlined in the core standards).
- **Do not use `// eslint-disable-next-line` lightly.** If you must disable a rule, you must leave a comment explaining exactly _why_ it's safe to bypass the rule in this specific instance.

## Pre-commit Hooks

We use **Husky** and **lint-staged** to ensure that failing code never makes it into the git history.

- On `git commit`, `lint-staged` will automatically run Prettier and ESLint against only the staged files.
- If linting fails, the commit is aborted.

## Continuous Integration (CI)

Every pull request must pass the CI pipeline before it can be merged. The CI pipeline will:

1. Check types (`tsc --noEmit`)
2. Run ESLint
3. Run Unit Tests (Vitest/Jest)
4. Build the Next.js app (`npm run build`)
5. Run E2E Tests (Playwright/Cypress) against the build.

---
