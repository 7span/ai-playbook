---
name: nextjs-error-handling
description: error handling and logging guidelines for next.js standard practices.
---


# Error Handling and Logging

## Error Boundaries

- Use `error.tsx` for granular, route-level errors. This prevents a single component failure from crashing the entire page.
- Use `not-found.tsx` specifically for 404 pages (both UI-driven and when calling `notFound()`).
- Use `global-error.tsx` only as a last resort for catastrophic, application-level failures (it replaces the root layout).
- **Security:** Never expose internal server errors or stack traces to end users in production. Catch them, log them, and show a generic user-friendly message.

## Logging

- **No Console Logs:** Never leave `console.log()` in production code.
- **Observability:** Forward errors to an observability platform like Sentry, Datadog, or OpenTelemetry.
- **Data Privacy:** Always mask, strip, or redact sensitive user information (PII, tokens, passwords, auth headers) before logging.

---
