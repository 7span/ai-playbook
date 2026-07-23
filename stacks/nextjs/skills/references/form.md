---
name: nextjs-forms-and-api-routes-standards
description: forms and api routes standards for next.js standard practices.
---

# Forms and API Routes

## Forms and Validation

Almost every interactive project relies heavily on forms.

- Use **React Hook Form** for managing client-side form state efficiently without unnecessary re-renders.
- Use **Zod** for schema validation. Share the same Zod schemas between the client (React Hook Form resolver) and the server (Server Action/API validation).
- Prefer **Server Actions** for form submissions to reduce client-side JavaScript, but fall back to API routes when exposing public endpoints.
- Provide **Optimistic UI** updates (via `useOptimistic`) so the user feels immediate feedback while the background mutation completes.

## API Routes (Route Handlers)

When building API endpoints (`route.ts`):

- Explicitly handle HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
- Always validate incoming request payloads and query parameters using Zod.
- Enforce authentication (verifying the session) and authorization (checking permissions) at the very top of the route handler.
- Implement rate limiting to prevent abuse.
- Standardize response formats across all endpoints (e.g., returning `{ data: ..., error: null }` for success and `{ data: null, error: "message" }` for failures).

---
