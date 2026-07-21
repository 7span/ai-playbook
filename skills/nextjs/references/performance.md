---
name: nextjs-performance
description: Performance and Accessibility standards for Next.js App Router.
---

# Performance and Accessibility

This section outlines the organization's standards for delivering fast, accessible experiences. "It works on my machine" is not the bar; it must work well on slow networks and be usable by everyone.

## Performance (Core Web Vitals)

Next.js provides built-in components to help optimize performance. Use them by default.

### Images (`next/image`)

Never use the raw `<img>` tag unless you have a specific, documented reason. Always use `<Image />` from `next/image`.

- **Sizing:** Always provide `width` and `height` (or `fill` with a parent aspect ratio) to prevent Cumulative Layout Shift (CLS).
- **Priority:** Add the `priority` prop to the Largest Contentful Paint (LCP) image (usually the hero image above the fold). Do not add `priority` to images below the fold.

### Fonts (`next/font`)

Do not load fonts via `<link>` tags in the document head from external networks, which causes render-blocking and layout shifts.

- Use `next/font/google` or `next/font/local`.
- These modules automatically download font files at build time and host them with your other static assets, ensuring zero layout shift and no external network requests.

### Scripts (`next/script`)

For third-party scripts (analytics, ads, widgets), use `<Script />` from `next/script`.

- Pick the correct `strategy`:
  - `beforeInteractive`: Critical scripts (e.g., bot detection) needed before page becomes interactive.
  - `afterInteractive` (default): Tag managers, analytics.
  - `lazyOnload`: Chat widgets, social media plugins.

### Bundle Size

- Avoid heavy client-side libraries (e.g., `moment.js` -> prefer `date-fns` or native `Intl`).
- Rely on Server Components to keep heavy processing and large dependencies (like markdown parsers or heavy formatting libraries) strictly on the server.

## Accessibility (A11y)

Accessibility is a requirement, not an enhancement. Code that cannot be navigated by keyboard or understood by a screen reader is broken code.

### Semantic HTML

Use the correct HTML elements for the job. Semantic HTML gives you 80% of accessibility for free.

- Use `<button>` for actions, `<a>` for navigation. Do not use `<div onClick={...}>`.
- Structure the page logically with `<header>`, `<main>`, `<nav>`, `<aside>`, and `<footer>`.
- Ensure headings (`<h1>` to `<h6>`) are ordered correctly without skipping levels.

### Keyboard Navigation

- Every interactive element must be reachable using the `Tab` key.
- Focus states must be visible. Do not use `outline: none` without providing a custom, highly visible focus ring (e.g., `focus-visible:ring` in Tailwind).

### ARIA Attributes

Use ARIA (Accessible Rich Internet Applications) attributes only when semantic HTML falls short.

- **Rule of thumb:** No ARIA is better than bad ARIA.
- Use `aria-label` or `aria-labelledby` when an interactive element lacks visible text (e.g., an icon-only button).
- Use `aria-expanded` and `aria-controls` for dropdowns, accordions, and modals.
- Use `aria-live="polite"` for dynamic content that screen readers should announce (e.g., toast notifications).

### Images and Alt Text

- All images must have an `alt` attribute.
- If the image is purely decorative, use `alt=""` (empty string) so screen readers ignore it.
- If the image conveys meaning, write a concise, descriptive `alt` text.

### Enforcing A11y

Ensure `eslint-plugin-jsx-a11y` is active in your ESLint configuration and treat its warnings as errors.
