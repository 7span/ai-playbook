---
name: nextjs-caching
description: caching guide for next.js standard practices. Use this when writing, generating, scaffolding, reviewing, refactoring, or critiquing any component, page, hook, or utility in this codebase.
---

# Caching

Next.js App Router includes aggressive caching defaults. You must explicitly control them rather than guessing why stale data is showing.

- **Fetch Caching:** Understand the defaults of `fetch()`. Use `{ cache: 'force-cache' }` for static data and `{ cache: 'no-store' }` for highly dynamic, personalized data.
- **Time-based Revalidation:** Use `next: { revalidate: 60 }` on fetch requests or `export const revalidate = 60` on route segments for data that changes predictably but doesn't need to be strictly real-time.
- **On-Demand Revalidation:** Use `revalidateTag` or `revalidatePath` inside Server Actions to purge the cache precisely when mutating data.
- **Function Caching:** Use React's `cache()` to memoize data requests within the same render pass (preventing duplicate DB queries), and Next.js's `unstable_cache` for expensive operations you want to persist across requests.

---
