"use client";

import * as Sentry from "@sentry/nextjs";

import {
  CheckoutRenderError,
  InventorySyncError,
  PaymentGatewayError,
  SearchTimeoutError,
} from "@/lib/demo-errors";
import { enrichDemoContext } from "@/lib/sentry-context";

import { Panel } from "./Panel";
import { TriggerButton, type TriggerResult } from "./TriggerButton";

async function triggerServerError(type?: "new"): Promise<TriggerResult> {
  const res = await fetch(`/api/error${type ? `?type=${type}` : ""}`, { method: "POST" });
  const data = (await res.json()) as { eventId?: string; name?: string; message?: string };
  return { ok: true, message: `${data.name} (server)`, eventId: data.eventId };
}

export function ErrorsPanel() {
  return (
    <Panel
      title="Errors & Issues"
      segment="Integrations · GitHub / Slack / Linear"
      accent="rose"
      description="Generate distinct issues — each enriched with user, tags, and breadcrumbs — to demo suspect commits, Slack routing, and Linear tickets."
    >
      <TriggerButton
        label="Throw client error"
        hint="CheckoutRenderError in the browser (client SDK + replay)"
        tone="danger"
        onTriggerAction={async () => {
          enrichDemoContext("checkout");
          const eventId = Sentry.captureException(new CheckoutRenderError());
          return { ok: true, message: "Client exception captured", eventId };
        }}
      />

      <TriggerButton
        label="Trigger server error"
        hint="DatabaseConnectionError in /api/error (server stack trace)"
        tone="danger"
        onTriggerAction={() => triggerServerError()}
      />

      <TriggerButton
        label="Throw search timeout"
        hint="SearchTimeoutError in the browser (tagged feature=search)"
        tone="danger"
        onTriggerAction={async () => {
          enrichDemoContext("search");
          const eventId = Sentry.captureException(new SearchTimeoutError());
          return { ok: true, message: "Search timeout captured", eventId };
        }}
      />

      <TriggerButton
        label="Throw inventory sync error"
        hint="InventorySyncError in the browser (tagged feature=inventory)"
        tone="danger"
        onTriggerAction={async () => {
          enrichDemoContext("inventory");
          const eventId = Sentry.captureException(new InventorySyncError());
          return { ok: true, message: "Inventory sync error captured", eventId };
        }}
      />

      <TriggerButton
        label="Unhandled promise rejection"
        hint="PaymentGatewayError, never awaited — caught automatically"
        tone="danger"
        onTriggerAction={async () => {
          enrichDemoContext("payments");
          // Intentionally floating: nothing handles this rejection, so Sentry's
          // global handler captures it — demonstrating auto-capture.
          void Promise.reject(new PaymentGatewayError());
          return { ok: true, message: "Unhandled rejection dispatched — check Issues" };
        }}
      />

      <TriggerButton
        label="Create a NEW issue"
        hint="Unique fingerprint each press → fires new-issue Slack alert / Linear auto-create"
        tone="primary"
        onTriggerAction={() => triggerServerError("new")}
      />
    </Panel>
  );
}
