"use client";

import { SAMPLING_DIALS, TRACES_SAMPLE_RATE } from "@/lib/sampling";

import { Panel } from "./Panel";
import { TriggerButton, type TriggerResult } from "./TriggerButton";

// Static per-dial color classes (Tailwind needs literal class names).
const DIAL_COLORS: Record<string, string> = {
  rose: "text-rose-300 border-rose-500/30",
  violet: "text-violet-300 border-violet-500/30",
  sky: "text-sky-300 border-sky-500/30",
  amber: "text-amber-300 border-amber-500/30",
};

const asPercent = (rate: number) => `${Math.round(rate * 100)}%`;

async function fireTracedEvents(): Promise<TriggerResult> {
  await Promise.all(
    Array.from({ length: 10 }, () => fetch("/api/slow?ms=40", { method: "POST" })),
  );
  const kept = asPercent(TRACES_SAMPLE_RATE);
  return {
    ok: true,
    message: `Fired 10 traces · tracesSampleRate=${kept} → ~${kept} kept`,
  };
}

export function SamplingInspector() {
  return (
    <Panel
      title="Sampling Inspector"
      segment="Sampling without surprises"
      accent="sky"
      description="Sentry samples three data types independently. These are the LIVE rates from lib/sampling.ts — the exact values the SDK is running with, not a hardcoded copy."
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SAMPLING_DIALS.map((dial) => (
          <div
            key={dial.option}
            className={`flex flex-col gap-1 rounded-xl border bg-zinc-950/40 p-3 ${
              DIAL_COLORS[dial.accent] ?? "text-zinc-300 border-white/10"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-zinc-400">{dial.dataType}</span>
              <span className="text-lg font-semibold tabular-nums">
                {asPercent(dial.value)}
              </span>
            </div>
            <code className="text-[11px] text-zinc-500">{dial.option}</code>
            <p className="text-[11px] leading-snug text-zinc-500">{dial.governs}</p>
          </div>
        ))}
      </div>

      <TriggerButton
        label="Fire 10 traced events"
        hint="See sampling in action — lower tracesSampleRate to watch events drop"
        tone="neutral"
        onTriggerAction={fireTracedEvents}
      />

      <a
        href="https://sentry.io/orgredirect/organizations/:orgslug/stats/"
        target="_blank"
        rel="noreferrer"
        className="rounded-xl bg-zinc-800/70 px-4 py-2.5 text-sm text-sky-300 ring-1 ring-inset ring-white/10 transition hover:bg-zinc-800"
      >
        Open Usage &amp; Billing → start here before tuning rates
      </a>
    </Panel>
  );
}
