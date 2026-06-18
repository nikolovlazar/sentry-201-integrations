import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Org/project the source maps + releases are uploaded to.
  // Read from env so nothing org-specific is committed.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token used to upload source maps on `next build` (so stack traces
  // resolve to original files and GitHub stack-trace line-linking works).
  // Set SENTRY_AUTH_TOKEN in .env.local (never commit it).
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a wider set of client bundles so production stack traces resolve
  // cleanly to original source (improves GitHub stack-trace line-linking).
  widenClientFileUpload: true,

  // Only print upload logs in CI; keep local builds quiet.
  silent: !process.env.CI,

  // Route Sentry requests through your own domain to dodge ad blockers that
  // would otherwise drop events during a live demo.
  tunnelRoute: "/monitoring",
});
