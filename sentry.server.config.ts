// Node.js runtime Sentry initialization. Loaded by instrumentation.ts.
import * as Sentry from "@sentry/nextjs";

import { ERRORS_SAMPLE_RATE, TRACES_SAMPLE_RATE } from "@/lib/sampling";

Sentry.init({
  // The DSN isn't secret; a single NEXT_PUBLIC_SENTRY_DSN powers every runtime,
  // but a dedicated SENTRY_DSN takes precedence if you set one.
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,

  sampleRate: ERRORS_SAMPLE_RATE, // errors
  tracesSampleRate: TRACES_SAMPLE_RATE, // traces

  // Attach IP + request headers to events.
  sendDefaultPii: true,

  // Attach local variable values to server stack frames — turns a bare stack
  // trace into "here are the exact values when it broke" (great for the
  // enriched-context story).
  includeLocalVariables: true,

  // Structured logs from the server (route handlers emit these).
  enableLogs: true,

  debug: false,
});
