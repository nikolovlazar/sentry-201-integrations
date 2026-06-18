import type { ReactNode } from "react";

import { ACCENT_STYLES, type Accent } from "./accents";

type PanelProps = {
  title: string;
  /** The workshop segment this panel maps to, shown as a chip. */
  segment: string;
  description: string;
  accent: Accent;
  children: ReactNode;
};

/** Presentational card wrapper for one control-center section. */
export function Panel({ title, segment, description, accent, children }: PanelProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <section
      className={`flex flex-col gap-4 rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-inset transition ${styles.ring}`}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className={`flex items-center gap-2 text-lg font-semibold ${styles.title}`}>
            <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
            {title}
          </h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${styles.chip}`}
          >
            {segment}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
      </header>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}
