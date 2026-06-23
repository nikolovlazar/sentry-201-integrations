"use client";

import { submitDemoFeedback } from "@/lib/demo-feedback";

import { Panel } from "./Panel";
import { TriggerButton } from "./TriggerButton";

export function FeedbackPanel() {
  return (
    <Panel
      title="User Feedback"
      segment="Feedback · Slack RCA bot"
      accent="amber"
      description="Submit fake feedback that's about a real error and shares its trace. Sentry fires a 'feedback received' Slack alert — then ask the Sentry Slack bot to find the linked issue and run a root-cause analysis."
    >
      <TriggerButton
        label="“Search is broken” feedback"
        hint="SearchTimeoutError + linked feedback in one trace"
        tone="primary"
        onTriggerAction={async () => {
          const { feedbackId, addresses } = submitDemoFeedback("search");
          return {
            ok: true,
            message: `Feedback sent → addresses ${addresses}`,
            eventId: feedbackId,
          };
        }}
      />

      <TriggerButton
        label="“Checkout is blank” feedback"
        hint="CheckoutRenderError + linked feedback in one trace"
        tone="primary"
        onTriggerAction={async () => {
          const { feedbackId, addresses } = submitDemoFeedback("checkout");
          return {
            ok: true,
            message: `Feedback sent → addresses ${addresses}`,
            eventId: feedbackId,
          };
        }}
      />
    </Panel>
  );
}
