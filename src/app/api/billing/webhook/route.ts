import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeWebhookSecret } from "@/lib/billing/config";
import { getStripeClient } from "@/lib/billing/stripe";
import { upsertOrganizationSubscription } from "@/lib/billing/subscriptions";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import type { OrganizationSubscriptionStatus } from "@/lib/supabase/types";

export const runtime = "nodejs";

function asStatus(value: string | null | undefined): OrganizationSubscriptionStatus {
  const allowed: OrganizationSubscriptionStatus[] = [
    "inactive",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
    "paused",
  ];
  if (value && allowed.includes(value as OrganizationSubscriptionStatus)) {
    return value as OrganizationSubscriptionStatus;
  }
  return "inactive";
}

function periodFromSubscription(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  const start = item?.current_period_start ?? null;
  const end = item?.current_period_end ?? null;
  return {
    current_period_start: start ? new Date(start * 1000).toISOString() : null,
    current_period_end: end ? new Date(end * 1000).toISOString() : null,
  };
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const organizationId =
    subscription.metadata?.organization_id ||
    (typeof subscription.customer === "string" ? undefined : undefined);
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return {
      ok: false as const,
      message: "SUPABASE_SERVICE_ROLE_KEY is required for billing webhooks.",
    };
  }

  let orgId = organizationId;
  if (!orgId) {
    const { data } = await supabase
      .from("organization_subscriptions")
      .select("organization_id")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle();
    orgId = data?.organization_id;
  }
  if (!orgId) {
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    const { data } = await supabase
      .from("organization_subscriptions")
      .select("organization_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    orgId = data?.organization_id;
  }
  if (!orgId) {
    return { ok: false as const, message: "No organization mapped for subscription." };
  }

  const period = periodFromSubscription(subscription);
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  await upsertOrganizationSubscription(supabase, {
    organization_id: orgId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: asStatus(subscription.status),
    current_period_start: period.current_period_start,
    current_period_end: period.current_period_end,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    latest_invoice_id:
      typeof subscription.latest_invoice === "string"
        ? subscription.latest_invoice
        : (subscription.latest_invoice?.id ?? null),
    raw_status: subscription.status,
  });

  return { ok: true as const };
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Billing webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          if (session.metadata?.organization_id && !subscription.metadata?.organization_id) {
            await stripe.subscriptions.update(subscriptionId, {
              metadata: {
                ...subscription.metadata,
                organization_id: session.metadata.organization_id,
              },
            });
          }
          const synced = await syncSubscription(
            await stripe.subscriptions.retrieve(subscriptionId),
          );
          if (!synced.ok) {
            return NextResponse.json({ error: synced.message }, { status: 500 });
          }
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const synced = await syncSubscription(subscription);
        if (!synced.ok) {
          return NextResponse.json({ error: synced.message }, { status: 500 });
        }
        break;
      }
      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
