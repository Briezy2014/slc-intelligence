import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/billing/config";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const secretKey = getStripeSecretKey();
  if (!secretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-08-27.basil",
      typescript: true,
    });
  }
  return stripeClient;
}
