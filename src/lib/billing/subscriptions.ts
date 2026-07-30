import type {
  OrganizationSubscription,
  OrganizationSubscriptionStatus,
} from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export function isSubscriptionAccessActive(
  status: OrganizationSubscriptionStatus | string | null | undefined,
): boolean {
  return status === "active" || status === "trialing";
}

export async function getOrganizationSubscription(
  supabase: SupabaseClient<Database>,
  organizationId: string,
): Promise<OrganizationSubscription | null> {
  const { data, error } = await supabase
    .from("organization_subscriptions")
    .select("*")
    .eq("organization_id", organizationId)
    .maybeSingle();
  if (error) return null;
  return (data as OrganizationSubscription | null) ?? null;
}

export async function upsertOrganizationSubscription(
  supabase: SupabaseClient<Database>,
  values: {
    organization_id: string;
    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    stripe_price_id?: string | null;
    status: OrganizationSubscriptionStatus;
    current_period_start?: string | null;
    current_period_end?: string | null;
    cancel_at_period_end?: boolean;
    canceled_at?: string | null;
    latest_invoice_id?: string | null;
    raw_status?: string | null;
  },
) {
  const { error } = await supabase.from("organization_subscriptions").upsert(
    {
      organization_id: values.organization_id,
      stripe_customer_id: values.stripe_customer_id ?? null,
      stripe_subscription_id: values.stripe_subscription_id ?? null,
      stripe_price_id: values.stripe_price_id ?? null,
      status: values.status,
      current_period_start: values.current_period_start ?? null,
      current_period_end: values.current_period_end ?? null,
      cancel_at_period_end: values.cancel_at_period_end ?? false,
      canceled_at: values.canceled_at ?? null,
      latest_invoice_id: values.latest_invoice_id ?? null,
      raw_status: values.raw_status ?? values.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id" },
  );
  return { error };
}
