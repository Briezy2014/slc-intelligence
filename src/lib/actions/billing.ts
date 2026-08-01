"use server";

import { z } from "zod";
import {
  BILLING_PLAN_NAME,
  formatMonthlyPriceLabel,
  getStripePriceId,
  isStripeBillingConfigured,
} from "@/lib/billing/config";
import { getStripeClient } from "@/lib/billing/stripe";
import {
  getOrganizationSubscription,
  upsertOrganizationSubscription,
} from "@/lib/billing/subscriptions";
import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";
import {
  auditAndRevalidate,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  validationError,
} from "@/lib/actions/shared";
import { getPublicEnv } from "@/lib/env/public-env";

const orgSchema = z.object({
  organizationId: z.string().uuid(),
});

function appBaseUrl() {
  return (getPublicEnv().NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL).replace(/\/$/, "");
}

export async function createBillingCheckoutSessionAction(
  formData: FormData,
): Promise<ActionState & { url?: string }> {
  if (!isStripeBillingConfigured()) {
    return {
      status: "error",
      message:
        "Billing is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID in the server environment.",
    };
  }

  const parsed = orgSchema.safeParse({
    organizationId: String(formData.get("organizationId") ?? ""),
  });
  if (!parsed.success) return validationError(parsed.error);

  const context = await getActionContext(parsed.data.organizationId, "org.manage");
  if (!("supabase" in context)) return context;

  const stripe = getStripeClient();
  const priceId = getStripePriceId();
  if (!stripe || !priceId) {
    return { status: "error", message: "Stripe billing is not fully configured." };
  }

  try {
    const existing = await getOrganizationSubscription(context.supabase, context.organizationId);
    let customerId = existing?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: context.user.email ?? undefined,
        metadata: {
          organization_id: context.organizationId,
          app: "slc-intelligence",
        },
        name: context.user.email ?? undefined,
      });
      customerId = customer.id;
      await upsertOrganizationSubscription(context.supabase, {
        organization_id: context.organizationId,
        stripe_customer_id: customerId,
        status: existing?.status ?? "inactive",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appBaseUrl()}/billing?checkout=success`,
      cancel_url: `${appBaseUrl()}/billing?checkout=cancel`,
      allow_promotion_codes: true,
      client_reference_id: context.organizationId,
      metadata: {
        organization_id: context.organizationId,
        plan: BILLING_PLAN_NAME,
      },
      subscription_data: {
        metadata: {
          organization_id: context.organizationId,
          plan: BILLING_PLAN_NAME,
        },
      },
    });

    if (!session.url) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "billing.checkout_started",
      resourceType: "organization_subscription",
      resourceId: context.organizationId,
      newState: { price: formatMonthlyPriceLabel(), session_id: session.id },
      paths: ["/billing", "/organization/settings"],
    });

    return {
      status: "success",
      message: "Redirecting to secure checkout.",
      url: session.url,
    };
  } catch {
    return { status: "error", message: "Could not start checkout. Try again shortly." };
  }
}

export async function createBillingPortalSessionAction(
  formData: FormData,
): Promise<ActionState & { url?: string }> {
  if (!isStripeBillingConfigured()) {
    return {
      status: "error",
      message: "Billing portal is unavailable until Stripe keys are configured.",
    };
  }

  const parsed = orgSchema.safeParse({
    organizationId: String(formData.get("organizationId") ?? ""),
  });
  if (!parsed.success) return validationError(parsed.error);

  const context = await getActionContext(parsed.data.organizationId, "org.manage");
  if (!("supabase" in context)) return context;

  const stripe = getStripeClient();
  if (!stripe) return { status: "error", message: "Stripe billing is not configured." };

  try {
    const existing = await getOrganizationSubscription(context.supabase, context.organizationId);
    if (!existing?.stripe_customer_id) {
      return {
        status: "error",
        message: "No billing customer yet. Start a subscription checkout first.",
      };
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: existing.stripe_customer_id,
      return_url: `${appBaseUrl()}/billing`,
    });

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "billing.portal_opened",
      resourceType: "organization_subscription",
      resourceId: context.organizationId,
      paths: ["/billing"],
    });

    return {
      status: "success",
      message: "Opening billing portal.",
      url: portal.url,
    };
  } catch {
    return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
  }
}
