import { ErrorsPanel } from "./components/ErrorsPanel";
import { MetricsPanel } from "./components/MetricsPanel";
import { PerformancePanel } from "./components/PerformancePanel";
import { SamplingInspector } from "./components/SamplingInspector";

export default function ControlCenter() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-white/10">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Sentry 201 · Workshop Control Center
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          Trigger Sentry events on demand
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Each button fires one specific kind of telemetry — errors, traces, or
          metrics — so you can click here, then switch to Sentry to show the feature
          live. Panels map one-to-one to the workshop segments.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ErrorsPanel />
        <PerformancePanel />
        <MetricsPanel />
        <SamplingInspector />
      </div>

      <footer className="mt-10 text-xs text-zinc-600">
        Set <code className="text-zinc-500">NEXT_PUBLIC_SENTRY_DSN</code> in{" "}
        <code className="text-zinc-500">.env.local</code> before triggering events.
        See the README for the full workshop runbook.
      </footer>
    </main>
  );
}
