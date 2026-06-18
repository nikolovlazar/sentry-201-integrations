// Browser-side Sentry initialization (Next.js 16 convention: this file replaces
// the old `sentry.client.config.ts`). It runs in the client bundle.
import * as Sentry from "@sentry/nextjs";

import {
  ERRORS_SAMPLE_RATE,
  REPLAYS_ON_ERROR_SAMPLE_RATE,
  REPLAYS_SESSION_SAMPLE_RATE,
  TRACES_SAMPLE_RATE,
} from "@/lib/sampling";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Attach IP + request headers so issues carry richer user context
  // (directly demos the "missing context" pain point being solved).
  sendDefaultPii: true,

  // ── The three independently-sampled data types (see lib/sampling.ts) ──
  sampleRate: ERRORS_SAMPLE_RATE, // errors
  tracesSampleRate: TRACES_SAMPLE_RATE, // traces
  replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE, // replays (all sessions)
  replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE, // replays (on error)

  integrations: [Sentry.replayIntegration()],

  // Structured logs (used by the logging-friendly demos).
  enableLogs: true,

  // Surface what the SDK is doing in the browser console during the workshop.
  debug: false,
});

// Instruments App Router client-side navigations as Sentry transactions.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
