// Edge runtime Sentry initialization. Loaded by instrumentation.ts.
import * as Sentry from "@sentry/nextjs";

import { ERRORS_SAMPLE_RATE, TRACES_SAMPLE_RATE } from "@/lib/sampling";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,

  sampleRate: ERRORS_SAMPLE_RATE, // errors
  tracesSampleRate: TRACES_SAMPLE_RATE, // traces

  sendDefaultPii: true,

  enableLogs: true,

  debug: false,
});
