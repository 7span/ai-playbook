---
name: nextjs-seo-practices
description: seo best practices for next.js standard practices. Use this when writing, generating, scaffolding, reviewing, refactoring, or critiquing any component, page, hook, or utility in this codebase.
---

# SEO Best Practices

Next.js App Router completely changes how SEO metadata is handled via the Metadata API.

- Implement static `export const metadata: Metadata` objects or dynamic `export async function generateMetadata()` functions in your `page.tsx` and `layout.tsx` files.
- Include standard tags on all public pages: Canonical URLs, OpenGraph (for Facebook/LinkedIn), and Twitter Cards.
- Automate crawler files: provide dynamic `sitemap.ts` and `robots.ts` in your `app/` root.
- Use `JSON-LD` structured data (via `<script type="application/ld+json">`) for rich search results (recipes, products, articles).
- For internationalized (i18n) sites, properly implement `hreflang` tags to specify language and regional URLs.

---
