---
name: nextjs-styling-guide
description: Styling, state management, and data fetching patterns for Next.js App Router.
---

#  Styling guide

This section covers how we handle the look of our application, how we manage UI state, and how we interact with data in a Next.js App Router environment.

## Styling

Whether we are using Tailwind CSS, CSS Modules, or another styling solution, consistency is key.

### Keep Styles Scoped

Avoid global CSS as much as possible (except for base resets and root variables).

- If using **Tailwind CSS**, use utility classes directly on elements. Avoid using Tailwind arbitrary classes if you find highly usable then add make variable and add it in global.css file also Avoid `@apply` in CSS files unless creating a highly reusable, framework-agnostic design system token.
- If using **CSS Modules**, colocate the `.module.css` file with the component (`my-component.module.css`).

### Design Tokens

Use design tokens for colors, spacing, and typography. Do not hardcode hex values or pixel sizes in individual components.

- Use Tailwind's `tailwind.config.ts` to define the theme.
- Or use CSS variables at the `:root` level.

### Conditional Classes

Use a utility like `clsx` or `tailwind-merge` (often combined as a `cn()` utility) to conditionally apply classes cleanly, avoiding template literal clutter.

```tsx
import { cn } from '@/lib/utils';

<button className={cn("base-class", isActive && "active-class", className)}>
```
