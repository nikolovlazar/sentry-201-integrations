"use client";

import { Panel } from "./Panel";
import { TriggerButton, type TriggerResult } from "./TriggerButton";

async function hitSlow(ms: number): Promise<TriggerResult> {
  const res = await fetch(`/api/slow?ms=${ms}`, { method: "POST" });
  const data = (await res.json()) as { durationMs: number };
  return { ok: true, message: `Traced request took ~${data.durationMs}ms` };
}

export function PerformancePanel() {
  return (
    <Panel
      title="Performance & Latency"
      segment="Metric Monitors · latency"
      accent="violet"
      description="Generate traced transactions with nested spans. Slow requests drive the p95-latency monitor; bursts build enough volume for a threshold to mean something."
    >
      <TriggerButton
        label="Fast request"
        hint="POST /api/slow?ms=50 — healthy baseline"
        tone="primary"
        onTriggerAction={() => hitSlow(50)}
      />

      <TriggerButton
        label="Slow request (latency spike)"
        hint="POST /api/slow?ms=3000 — trips the latency monitor"
        tone="primary"
        onTriggerAction={() => hitSlow(3000)}
      />

      <TriggerButton
        label="Burst 20 requests"
        hint="Mixed latencies — builds volume for the monitor"
        tone="neutral"
        onTriggerAction={async () => {
          const latencies = Array.from({ length: 20 }, () =>
            Math.random() < 0.3 ? 1500 + Math.random() * 2000 : 50 + Math.random() * 200,
          );
          await Promise.all(latencies.map((ms) => hitSlow(Math.round(ms))));
          return { ok: true, message: "Fired 20 traced requests (mixed latency)" };
        }}
      />
    </Panel>
  );
}
