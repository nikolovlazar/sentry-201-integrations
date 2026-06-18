import * as Sentry from "@sentry/nextjs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Traced request with configurable latency.
 *
 *   POST /api/slow?ms=50     → fast, healthy request
 *   POST /api/slow?ms=3000   → latency spike (trips a latency Metric Monitor)
 *
 * The route handler is already a Sentry transaction; we add realistic nested
 * child spans (a DB query + an outbound HTTP call) so the trace waterfall looks
 * like a real request. Total duration ≈ `ms`, which is what a p95-latency
 * monitor watches.
 */
export async function POST(request: Request) {
  const msParam = Number(new URL(request.url).searchParams.get("ms"));
  const ms = Number.isFinite(msParam) ? Math.min(Math.max(msParam, 0), 10_000) : 200;

  // Split the artificial latency across two child spans.
  const dbMs = Math.round(ms * 0.6);
  const httpMs = ms - dbMs;

  const total = await Sentry.startSpan(
    { op: "http.server", name: "POST /api/slow" },
    async () => {
      const start = Date.now();

      await Sentry.startSpan(
        { op: "db.query", name: "SELECT * FROM orders WHERE user_id = ?" },
        async () => {
          await sleep(dbMs);
        },
      );

      await Sentry.startSpan(
        { op: "http.client", name: "GET https://payments.internal/charges" },
        async () => {
          await sleep(httpMs);
        },
      );

      return Date.now() - start;
    },
  );

  return Response.json({ durationMs: total, requestedMs: ms });
}
