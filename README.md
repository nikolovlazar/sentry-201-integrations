# Sentry 201 — Workshop Control Center

A single-page **control center** for the Sentry 201 workshop. Every button fires
one specific kind of telemetry — an error, a trace, or a metric — so you can
click here and immediately switch to Sentry to show the feature live. No fake
app to navigate; the panels map one-to-one to the workshop segments.

Built on Next.js 16 (App Router) + `@sentry/nextjs`, instrumented across all
three runtimes (browser, Node.js server, edge).

---

## Setup

1. **Install** (already done if you cloned with `node_modules`):
   ```bash
   npm install
   ```

2. **Configure Sentry** — copy the env template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Needed for |
   |----------|-----------|
   | `NEXT_PUBLIC_SENTRY_DSN` | Events to reach Sentry (required) |
   | `SENTRY_AUTH_TOKEN` | Source-map upload on `next build` (suspect commits + line-linking) |
   | `SENTRY_ORG` / `SENTRY_PROJECT` | Where source maps + releases are uploaded |

3. **Run**:
   ```bash
   npm run dev      # http://localhost:3000
   npm run build    # uploads source maps if SENTRY_AUTH_TOKEN is set
   ```

> The control center shows event IDs even without a DSN (the SDK still mints
> them), but events only actually transmit once `NEXT_PUBLIC_SENTRY_DSN` is set.

---

## Where the Sentry config lives

| File | Purpose |
|------|---------|
| `lib/sampling.ts` | **Single source of truth** for the 4 sampling rates — imported by every `Sentry.init()` *and* the Sampling Inspector, so the UI always shows the real values |
| `instrumentation-client.ts` | Browser SDK init (errors + traces + replay) |
| `sentry.server.config.ts` / `sentry.edge.config.ts` | Server / edge SDK init |
| `instrumentation.ts` | Loads the right config per runtime + `onRequestError` |
| `next.config.ts` | `withSentryConfig` — source maps, release, ad-blocker tunnel |
| `lib/demo-errors.ts` | Named error classes → distinct, well-grouped issues |
| `lib/sentry-context.ts` | `enrichDemoContext()` — sets user, tags, breadcrumbs |

---

## Runbook — button → Sentry screen → talking point

### 🟥 Errors & Issues — *Integrations (GitHub / Slack / Linear)*

| Button | What it does | Show in Sentry | Talking point |
|--------|--------------|----------------|---------------|
| **Throw client error** | `CheckoutRenderError` in the browser | Issue + **Replay** + **suspect commit** + GitHub line-link | "We know the user, the feature, the last actions, *and* the commit that likely caused it." |
| **Trigger server error** | `DatabaseConnectionError` from `/api/error` | Server stack trace w/ local variables | Stack-trace line-linking jumps straight to the file/line on GitHub. |
| **Unhandled promise rejection** | floating `PaymentGatewayError` | Issue captured automatically | Sentry catches what you *didn't* wrap. |
| **Create a NEW issue** | unique fingerprint every click | a brand-new issue group | This is what fires the **Slack new-issue alert** and **auto-creates a Linear ticket**. Click it live, then watch Slack/Linear. |

Each error is pre-enriched with user + `feature`/`plan` tags + breadcrumbs — the
"enriched setup" pillar, made visible.

### 🟪 Performance & Latency — *Metric Monitors (latency)*

| Button | What it does | Talking point |
|--------|--------------|---------------|
| **Fast request** | `/api/slow?ms=50` traced transaction | Healthy baseline in the trace view. |
| **Slow request (latency spike)** | `/api/slow?ms=3000` w/ nested DB + HTTP spans | This is what a **p95-latency Metric Monitor** watches. |
| **Burst 20 requests** | mixed latencies | Builds enough volume for a threshold to be meaningful. |

### 🟩 Custom Metrics — *Metric Monitors (custom)*

Emitted via `Sentry.metrics.*` (count / gauge / distribution):

| Button | Metric | Talking point |
|--------|--------|---------------|
| **Record an order value** | `checkout.order_value` (distribution) | Business signal, not an error. |
| **Increment orders placed** | `orders.placed` (count) | |
| **Set queue depth** | `queue.depth` (gauge) | |
| **Spike order value** | 10× high values | Trips a threshold-based monitor on demand — "something trending wrong before it breaks." |

### 🟦 Sampling Inspector — *Sampling without surprises*

- Four cards show the **live** rates from `lib/sampling.ts`: `sampleRate` (errors),
  `tracesSampleRate` (traces), `replaysSessionSampleRate` /
  `replaysOnErrorSampleRate` (replays) — the three independently-sampled data types.
- **Fire 10 traced events** — lower `tracesSampleRate` in `lib/sampling.ts` and
  re-fire to watch events get dropped.
- **Usage & Billing** link — the place to start before tuning any rate.

---

## Pre-workshop checklist (configure in Sentry / GitHub — the workshop content itself)

These are dashboard/org settings; the app only emits the matching data.

- [ ] Push this repo to GitHub and connect it to the Sentry project (enables
      **suspect commits**, **stack-trace line-linking**, **PR comments**).
      Requires releases — the `withSentryConfig` release pipeline handles this on build.
- [ ] Set up the **Slack** integration + an alert rule routing *new issues* to a channel.
- [ ] Set up the **Linear** integration + auto-create-on-alert.
- [ ] Create the **Metric Monitors** ahead of time:
  - error rate (from the Errors panel)
  - p95 latency on the `/api/slow` transaction
  - a custom monitor on `checkout.order_value`
- [ ] Confirm Session Replay is enabled on the project.
