/**
 * Single monthly subscription plan for SLC Intelligence.
 * No free/pro tiers — one organization monthly price.
 */

export const BILLING_PLAN_NAME = "SLC Intelligence Monthly";
export const BILLING_PLAN_INTERVAL = "month" as const;

/** Display price used in UI when Stripe Price metadata is unavailable. */
export const BILLING_MONTHLY_PRICE_USD = Number(
  (process.env.BILLING_MONTHLY_PRICE_USD ?? "49").trim() || "49",
);

export const BILLING_CURRENCY = "usd";

export function getStripeSecretKey(): string | null {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  return key || null;
}

export function getStripeWebhookSecret(): string | null {
  const key = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  return key || null;
}

export function getStripePriceId(): string | null {
  const priceId = (process.env.STRIPE_PRICE_ID ?? "").trim();
  return priceId || null;
}

export function isStripeBillingConfigured(): boolean {
  return Boolean(getStripeSecretKey() && getStripePriceId());
}

/**
 * When false (default), subscribe/manage billing is available but not required.
 * Set BILLING_ENFORCEMENT=true only after outside-classroom subscriptions should be required.
 */
export function isBillingEnforcementEnabled(): boolean {
  const flag = (process.env.BILLING_ENFORCEMENT ?? "false").trim().toLowerCase();
  return flag === "true" || flag === "1" || flag === "on";
}

export function formatMonthlyPriceLabel(amountUsd = BILLING_MONTHLY_PRICE_USD): string {
  return `$${amountUsd}/month`;
}
