"use client";

import { useState } from "react";

export type TriggerResult = {
  ok: boolean;
  /** Short human-readable summary shown under the button. */
  message?: string;
  /** Sentry event ID, rendered monospace for cross-referencing in the UI. */
  eventId?: string;
};

type Tone = "danger" | "primary" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  danger:
    "bg-rose-600/90 hover:bg-rose-500 text-white ring-1 ring-inset ring-rose-400/30",
  primary:
    "bg-indigo-600/90 hover:bg-indigo-500 text-white ring-1 ring-inset ring-indigo-400/30",
  neutral:
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 ring-1 ring-inset ring-white/10",
};

type TriggerButtonProps = {
  label: string;
  hint?: string;
  tone?: Tone;
  // The async work to run on click. Named with the `Action` suffix to satisfy
  // Next.js's client-boundary lint — it is a plain client-side callback (only
  // ever passed between Client Components), NOT a Server Action.
  onTriggerAction: () => Promise<TriggerResult>;
};

export function TriggerButton({
  label,
  hint,
  tone = "neutral",
  onTriggerAction,
}: TriggerButtonProps) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TriggerResult | null>(null);

  async function handleClick() {
    setRunning(true);
    setResult(null);
    try {
      setResult(await onTriggerAction());
    } catch (err) {
      // A thrown client error is itself a valid demo (Sentry catches it), so we
      // report it rather than swallow it.
      setResult({
        ok: false,
        message: err instanceof Error ? `${err.name}: ${err.message}` : "Triggered",
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={running}
        className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${TONE_CLASSES[tone]}`}
      >
        <span className="flex flex-col">
          <span>{label}</span>
          {hint ? <span className="text-xs font-normal opacity-75">{hint}</span> : null}
        </span>
        <span aria-hidden className="text-base leading-none opacity-80">
          {running ? "···" : "→"}
        </span>
      </button>

      {result ? (
        <p
          className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 px-1 text-xs ${
            result.ok ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          <span>{result.ok ? "✓" : "⚑"}</span>
          {result.message ? <span>{result.message}</span> : null}
          {result.eventId ? (
            <span className="font-mono text-[11px] text-zinc-500">
              event {result.eventId.slice(0, 12)}…
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
