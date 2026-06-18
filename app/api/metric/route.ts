import * as Sentry from "@sentry/nextjs";

const REGIONS = ["us-east-1", "us-west-2", "eu-central-1"];
const TIERS = ["free", "pro", "enterprise"];
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Emits a custom application metric via the Sentry Metrics API
 * (`Sentry.metrics.*`, SDK >= 10.25.0). These are what a *custom* Metric
 * Monitor watches — business signals, not just errors.
 *
 *   POST /api/metric  { kind: "order_value" | "orders_placed" | "queue_depth" | "spike" }
 *
 * We `flush()` after emitting so the metric reaches Sentry promptly during the
 * live demo instead of waiting for the periodic background flush.
 *
 * Note: attributes are kept LOW-cardinality (bounded enums) on purpose —
 * high-cardinality dimensions (user IDs, UUIDs) degrade the metrics backend.
 */
export async function POST(request: Request) {
  const { kind } = (await request.json().catch(() => ({}))) as { kind?: string };

  const emitted: { name: string; value: number; unit?: string }[] = [];

  switch (kind) {
    case "orders_placed": {
      Sentry.metrics.count("orders.placed", 1, {
        attributes: { region: pick(REGIONS), tier: pick(TIERS) },
      });
      emitted.push({ name: "orders.placed", value: 1 });
      break;
    }

    case "queue_depth": {
      const depth = Math.floor(Math.random() * 50);
      Sentry.metrics.gauge("queue.depth", depth, {
        attributes: { worker: "checkout-processor" },
      });
      emitted.push({ name: "queue.depth", value: depth });
      break;
    }

    case "spike": {
      // Fire a burst of unusually-high order values to trip a threshold-based
      // monitor on demand.
      for (let i = 0; i < 10; i++) {
        const value = 800 + Math.floor(Math.random() * 700);
        Sentry.metrics.distribution("checkout.order_value", value, {
          unit: "none",
          attributes: { region: pick(REGIONS), tier: "enterprise" },
        });
        emitted.push({ name: "checkout.order_value", value });
      }
      break;
    }

    case "order_value":
    default: {
      const value = 20 + Math.floor(Math.random() * 180);
      Sentry.metrics.distribution("checkout.order_value", value, {
        unit: "none",
        attributes: { region: pick(REGIONS), tier: pick(TIERS) },
      });
      emitted.push({ name: "checkout.order_value", value });
      break;
    }
  }

  await Sentry.flush(2000);

  return Response.json({ ok: true, emitted });
}
