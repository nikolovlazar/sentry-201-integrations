// Server-side registration entrypoint. Next.js calls `register()` once per
// runtime at startup; we load the matching Sentry config. `onRequestError`
// forwards uncaught errors from React Server Components / route handlers to
// Sentry (Next.js 16 convention).
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
