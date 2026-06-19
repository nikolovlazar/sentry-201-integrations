/**
 * Named error classes for the workshop.
 *
 * Why custom classes instead of `new Error("...")`?
 *  - Each class name becomes the issue *type* in Sentry, so client/server/
 *    payment errors group into clearly distinct issues (good for the
 *    integrations demo — each can route to its own Slack channel / Linear team).
 *  - They live in this one well-named file, so when you demo GitHub
 *    stack-trace line-linking, the top frame jumps somewhere meaningful.
 */

/** Thrown in the browser while "rendering checkout" — exercises client SDK + replay. */
export class CheckoutRenderError extends Error {
  constructor(message = "Failed to render checkout summary: cart total is undefined") {
    super(message);
    this.name = "CheckoutRenderError";
  }
}

/** Thrown on the server, simulating a dropped DB connection — server stack trace. */
export class DatabaseConnectionError extends Error {
  constructor(message = "Connection to orders database timed out after 5000ms") {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

/** Thrown from an unhandled promise — exercises global rejection handling. */
export class PaymentGatewayError extends Error {
  constructor(message = "Payment gateway rejected the charge: card_declined") {
    super(message);
    this.name = "PaymentGatewayError";
  }
}

/** Thrown in the browser when the product search request exceeds its budget. */
export class SearchTimeoutError extends Error {
  constructor(message = "Product search timed out after 3000ms — no results returned") {
    super(message);
    this.name = "SearchTimeoutError";
  }
}

/** A deliberately unique error so every click creates a brand-new Sentry issue. */
export class FlakyExperimentError extends Error {
  constructor(public readonly variant: string) {
    super(`Experiment "${variant}" threw an unexpected state transition`);
    this.name = "FlakyExperimentError";
  }
}
