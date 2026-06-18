/**
 * Single source of truth for Sentry's sampling rates.
 *
 * These constants are imported by every `Sentry.init()` call AND by the
 * Sampling Inspector panel, so the numbers attendees see on screen are the
 * exact numbers the SDK is configured with — never a hardcoded copy that can
 * drift out of sync.
 *
 * Workshop framing: Sentry samples THREE data types independently. Tuning one
 * dial does not affect the others.
 *
 *   errors  → `sampleRate`
 *   traces  → `tracesSampleRate`
 *   replays → `replaysSessionSampleRate` + `replaysOnErrorSampleRate`
 *
 * The rates below are intentionally generous so events reliably show up during
 * a live demo. In production you would lower them (see the Usage & Billing
 * page) — the inspector panel explains exactly that tradeoff.
 */

/** Errors: fraction of error events sent to Sentry. */
export const ERRORS_SAMPLE_RATE = 1.0;

/** Traces: fraction of transactions sampled for performance monitoring. */
export const TRACES_SAMPLE_RATE = 1.0;

/** Replays: fraction of *all* user sessions recorded. Kept low — replays are heavy. */
export const REPLAYS_SESSION_SAMPLE_RATE = 0.1;

/** Replays: fraction of sessions recorded *when an error occurs*. Worth keeping high. */
export const REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0;

/** Metadata used by the Sampling Inspector to explain each dial. */
export const SAMPLING_DIALS = [
  {
    dataType: "Errors",
    option: "sampleRate",
    value: ERRORS_SAMPLE_RATE,
    governs: "What fraction of error/exception events are sent.",
    accent: "rose",
  },
  {
    dataType: "Traces",
    option: "tracesSampleRate",
    value: TRACES_SAMPLE_RATE,
    governs:
      "What fraction of transactions (performance traces) are sampled. Use tracesSampler for per-route control.",
    accent: "violet",
  },
  {
    dataType: "Replays (session)",
    option: "replaysSessionSampleRate",
    value: REPLAYS_SESSION_SAMPLE_RATE,
    governs: "What fraction of all user sessions are recorded as replays.",
    accent: "sky",
  },
  {
    dataType: "Replays (on error)",
    option: "replaysOnErrorSampleRate",
    value: REPLAYS_ON_ERROR_SAMPLE_RATE,
    governs: "What fraction of sessions are recorded when an error happens.",
    accent: "amber",
  },
] as const;
