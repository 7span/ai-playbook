---
name: nextjs-data-fetching
description: Data fetching and mutations patterns for Next.js App Router.
---

# Data Fetching and Mutations

The App Router shifts data fetching to the server. We do not use `useEffect` for fetching data.

## Fetching Data

- Fetch data directly inside Server Components using `async`/`await`.
- Use the native `fetch` API, which Next.js extends with caching and revalidation options.
- If you need to access a database directly (e.g., using Prisma or Drizzle), do it directly in the Server Component.

```tsx
export default async function Page() {
  const data = await db.query.users.findMany();
  return <UserList users={data} />;
}
```

## Mutating Data (Server Actions)

To mutate data (create, update, delete), use **Server Actions**.

- Server actions are async functions executed on the server.
- They can be called directly from forms (`action={myAction}`) or manually invoked via `useTransition` in Client Components.
- Use `revalidatePath` or `revalidateTag` inside your Server Action to update the UI with fresh data after a mutation.

```tsx
// actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  // ... perform database update ...
  revalidatePath("/users");
}
```

---
