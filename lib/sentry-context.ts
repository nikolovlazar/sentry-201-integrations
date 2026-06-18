import * as Sentry from "@sentry/nextjs";

/**
 * Enriches the current Sentry scope before an event is captured.
 *
 * This is the "enriched setup" pillar made tangible: instead of a naked stack
 * trace, every issue arrives tagged with WHO hit it, WHAT feature they were in,
 * and the trail of breadcrumbs that led there. During the workshop you point at
 * an issue and say "we know the user, the feature, and the last 3 actions —
 * nobody has to ask 'how do I reproduce this?'".
 *
 * Works in any runtime (browser or server); call it right before throwing or
 * capturing.
 */

const DEMO_USERS = [
  { id: "u_1024", username: "ada.lovelace", email: "ada@example.com", tier: "enterprise" },
  { id: "u_2048", username: "grace.hopper", email: "grace@example.com", tier: "pro" },
  { id: "u_4096", username: "alan.turing", email: "alan@example.com", tier: "free" },
];

export type DemoFeature = "checkout" | "payments" | "experiments" | "search";

export function enrichDemoContext(feature: DemoFeature) {
  // Pick a "current user" (rotates so successive demos look like different people).
  const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
  Sentry.setUser({ id: user.id, username: user.username, email: user.email });

  // Tags are indexed + filterable in Sentry — perfect for routing alert rules.
  Sentry.setTag("feature", feature);
  Sentry.setTag("plan", user.tier);
  Sentry.setTag("workshop.demo", "true");

  // Breadcrumbs reconstruct the user's path leading up to the event.
  Sentry.addBreadcrumb({
    category: "ui.click",
    message: `User opened the ${feature} flow`,
    level: "info",
  });
  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Navigated to /${feature}`,
    level: "info",
  });

  return { user, feature };
}
