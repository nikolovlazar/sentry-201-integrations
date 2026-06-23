/**
 * Single source of truth for Sentry's sampling rates.
 *
 * These constants are imported by every `Sentry.init()` call, so the SDK is
 * always configured from one place — no hardcoded copies that can drift out
 * of sync.
 *
 * Workshop framing: Sentry samples THREE data types independently. Tuning one
 * dial does not affect the others.
 *
 *   errors  → `sampleRate`
 *   traces  → `tracesSampleRate`
 *   replays → `replaysSessionSampleRate` + `replaysOnErrorSampleRate`
 *
 * The rates below are intentionally generous so events reliably show up during
 * a live demo. In production you would lower them.
 */

/** Errors: fraction of error events sent to Sentry. */
export const ERRORS_SAMPLE_RATE = 1.0;

/** Traces: fraction of transactions sampled for performance monitoring. */
export const TRACES_SAMPLE_RATE = 1.0;

/** Replays: fraction of *all* user sessions recorded. Kept low — replays are heavy. */
export const REPLAYS_SESSION_SAMPLE_RATE = 0.1;

/** Replays: fraction of sessions recorded *when an error occurs*. Worth keeping high. */
export const REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0;
