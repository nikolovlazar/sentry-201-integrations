import * as Sentry from "@sentry/nextjs";

import { DatabaseConnectionError, FlakyExperimentError } from "@/lib/demo-errors";
import { enrichDemoContext } from "@/lib/sentry-context";

/**
 * Server-side error trigger.
 *
 *   POST /api/error            → a recurring DatabaseConnectionError (one stable issue)
 *   POST /api/error?type=new   → a unique FlakyExperimentError (a BRAND-NEW issue each call)
 *
 * We capture explicitly so we can hand the event ID back to the UI for
 * cross-referencing in Sentry. (Genuinely unhandled route errors are still
 * caught automatically by `onRequestError` in instrumentation.ts.)
 */
export async function POST(request: Request) {
  const type = new URL(request.url).searchParams.get("type");

  if (type === "new") {
    enrichDemoContext("experiments");
    // Salt the variant so every press produces a distinct fingerprint → a new
    // issue group → fires the "new issue" Slack alert + Linear auto-create.
    const variant = `checkout-v${Date.now().toString().slice(-5)}`;
    const error = new FlakyExperimentError(variant);

    const eventId = Sentry.withScope((scope) => {
      scope.setFingerprint(["flaky-experiment", variant]);
      return Sentry.captureException(error);
    });

    return Response.json({ eventId, name: error.name, message: error.message }, { status: 500 });
  }

  enrichDemoContext("checkout");
  const error = new DatabaseConnectionError();
  const eventId = Sentry.captureException(error);

  return Response.json({ eventId, name: error.name, message: error.message }, { status: 500 });
}
