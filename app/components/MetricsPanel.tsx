"use client";

import { Panel } from "./Panel";
import { TriggerButton, type TriggerResult } from "./TriggerButton";

async function emit(kind: string): Promise<TriggerResult> {
  const res = await fetch("/api/metric", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind }),
  });
  const data = (await res.json()) as { emitted: { name: string; value: number }[] };
  const last = data.emitted.at(-1);
  const summary =
    data.emitted.length > 1
      ? `Emitted ${data.emitted.length} × ${last?.name}`
      : `${last?.name} = ${last?.value}`;
  return { ok: true, message: summary };
}

export function MetricsPanel() {
  return (
    <Panel
      title="Custom Metrics"
      segment="Metric Monitors · custom"
      accent="emerald"
      description="Emit business metrics via Sentry.metrics.* (count / gauge / distribution). These are what a custom Metric Monitor watches — signals that trend wrong before anything errors."
    >
      <TriggerButton
        label="Record an order value"
        hint="distribution → checkout.order_value"
        tone="primary"
        onTriggerAction={() => emit("order_value")}
      />

      <TriggerButton
        label="Increment orders placed"
        hint="count → orders.placed"
        tone="primary"
        onTriggerAction={() => emit("orders_placed")}
      />

      <TriggerButton
        label="Set queue depth"
        hint="gauge → queue.depth"
        tone="primary"
        onTriggerAction={() => emit("queue_depth")}
      />

      <TriggerButton
        label="Spike order value"
        hint="10× high values — trips a threshold-based monitor"
        tone="neutral"
        onTriggerAction={() => emit("spike")}
      />
    </Panel>
  );
}
