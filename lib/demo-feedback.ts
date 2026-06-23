import * as Sentry from "@sentry/nextjs";

import { CheckoutRenderError, SearchTimeoutError } from "./demo-errors";
import { enrichDemoContext, type DemoFeature } from "./sentry-context";

/**
 * Fakes a piece of user feedback that is *about* a specific error — and ties
 * the two together so the rest of the demo can light up:
 *
 *   1. The user hits a real error (e.g. SearchTimeoutError) → a Sentry issue.
 *   2. That same user submits feedback complaining about exactly that problem.
 *   3. Sentry fires a "feedback received" Slack alert.
 *   4. You @-mention the Sentry Slack bot, which walks from the feedback to the
 *      *exact* issue and does a root-cause analysis on it.
 *
 * The magic that makes step 4 work is TWO links, established here:
 *
 *   • Shared trace — the error and the feedback are captured inside one
 *     `Sentry.startSpan`, so they share a single trace ID. That trace is the
 *     path the bot follows from "a user is unhappy" to "here is the failing
 *     code". (In the browser everything in a pageload already shares a trace;
 *     the explicit span just makes it a visible transaction in the trace view.)
 *
 *   • `associatedEventId` — a direct pointer from the feedback event to the
 *     error event, so the linkage survives even without trace-walking.
 */

type FeedbackScenario = {
  feature: DemoFeature;
  /** The error the user is actually hitting — this becomes the issue. */
  makeError: () => Error;
  /** Short label for the issue this feedback addresses (shown in the UI). */
  addresses: string;
  /** The complaint, written from the user's point of view. */
  message: string;
};

const SCENARIOS = {
  search: {
    feature: "search",
    makeError: () => new SearchTimeoutError(),
    addresses: "SearchTimeoutError",
    message:
      "I've tried searching for the same product three times today and it just " +
      "spins forever, then tells me there are no results. I KNOW you sell it — " +
      "I bought it last month. Your search is broken and I can't find anything " +
      "to buy.",
  },
  checkout: {
    feature: "checkout",
    makeError: () => new CheckoutRenderError(),
    addresses: "CheckoutRenderError",
    message:
      "The checkout page is completely blank when I try to review my order. My " +
      "cart has items in it but I can't see the total or a place-order button, " +
      "so I can't actually pay. Please fix this — I've been trying for 20 minutes.",
  },
} satisfies Record<string, FeedbackScenario>;

export type FeedbackScenarioKey = keyof typeof SCENARIOS;

export type FeedbackResult = {
  errorEventId: string;
  feedbackId: string;
  addresses: string;
};

/**
 * Triggers one error + one piece of associated feedback, sharing a trace.
 * Returns both event IDs so the UI can show the cross-reference.
 */
export function submitDemoFeedback(key: FeedbackScenarioKey): FeedbackResult {
  const scenario = SCENARIOS[key];

  return Sentry.startSpan(
    { name: `${scenario.feature} session`, op: "ui.action.feedback" },
    () => {
      // Same enrichment the error buttons use → the feedback "user" is the same
      // person whose error we just captured.
      const { user } = enrichDemoContext(scenario.feature);

      // 1. The error the user is hitting.
      const errorEventId = Sentry.captureException(scenario.makeError());

      // 2. Their feedback about it — linked to that exact event, same trace.
      const feedbackId = Sentry.captureFeedback({
        name: user.username,
        email: user.email,
        message: scenario.message,
        source: "workshop-demo",
        associatedEventId: errorEventId,
        tags: { feature: scenario.feature, "workshop.demo": "true" },
      });

      return { errorEventId, feedbackId, addresses: scenario.addresses };
    },
  );
}
