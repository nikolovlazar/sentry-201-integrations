// Full, static Tailwind class strings per accent. Tailwind v4 only emits CSS
// for class names it can see literally in source, so we never interpolate
// color names into class strings — we look them up here.

export type Accent = "rose" | "violet" | "emerald" | "sky";

export const ACCENT_STYLES: Record<
  Accent,
  { ring: string; chip: string; title: string; dot: string }
> = {
  rose: {
    ring: "ring-rose-500/20 hover:ring-rose-500/40",
    chip: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30",
    title: "text-rose-300",
    dot: "bg-rose-400",
  },
  violet: {
    ring: "ring-violet-500/20 hover:ring-violet-500/40",
    chip: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/30",
    title: "text-violet-300",
    dot: "bg-violet-400",
  },
  emerald: {
    ring: "ring-emerald-500/20 hover:ring-emerald-500/40",
    chip: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
    title: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  sky: {
    ring: "ring-sky-500/20 hover:ring-sky-500/40",
    chip: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30",
    title: "text-sky-300",
    dot: "bg-sky-400",
  },
};
