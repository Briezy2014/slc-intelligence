import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState } from "@/components/domain/page-states";
import { BillingActions } from "@/components/domain/billing-actions";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  BILLING_PLAN_NAME,
  formatMonthlyPriceLabel,
  isBillingEnforcementEnabled,
  isStripeBillingConfigured,
} from "@/lib/billing/config";
import {
  getOrganizationSubscription,
  isSubscriptionAccessActive,
} from "@/lib/billing/subscriptions";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { hasPermission } from "@/lib/permissions/check";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;

  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Billing" }]} />
        <PageHeader title="Billing" description="Monthly organization subscription." />
        <ConfigurationState />
      </main>
    );
  }

  const { organization, membership } = await requireActiveMembership();
  const supabase = await createClient();
  const canManage = await hasPermission(supabase, membership.organization_id, "org.manage");
  const subscription = organization?.id
    ? await getOrganizationSubscription(supabase, organization.id)
    : null;
  const active = isSubscriptionAccessActive(subscription?.status);
  const configured = isStripeBillingConfigured();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Billing" }]} />
      <PageHeader
        title="Billing"
        description="One simple monthly subscription for your organization. No plan tiers."
      />
      <div className="space-y-6">
        {params.checkout === "success" ? (
          <Alert title="Checkout completed" tone="info">
            Payment succeeded. Subscription status updates when Stripe confirms the webhook.
          </Alert>
        ) : null}
        {params.checkout === "cancel" ? (
          <Alert title="Checkout canceled" tone="warning">
            No charge was made. You can start the monthly subscription whenever you are ready.
          </Alert>
        ) : null}

        <Card>
          <CardTitle>{BILLING_PLAN_NAME}</CardTitle>
          <CardDescription>
            {formatMonthlyPriceLabel()} per organization · cancel anytime in the billing portal
          </CardDescription>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Organization</dt>
              <dd className="font-semibold">{organization?.name ?? "Selected organization"}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd className="font-semibold">{subscription?.status ?? "inactive"}</dd>
            </div>
            <div>
              <dt className="text-muted">Current period ends</dt>
              <dd className="font-semibold">
                {subscription?.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Access</dt>
              <dd className="font-semibold">{active ? "Active" : "Not active"}</dd>
            </div>
          </dl>
        </Card>

        {!configured ? (
          <Alert title="Stripe not configured yet" tone="warning">
            Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, and
            `SUPABASE_SERVICE_ROLE_KEY` in the server environment to enable live checkout. Your
            classroom can keep working while this stays unset.
          </Alert>
        ) : null}

        {!isBillingEnforcementEnabled() ? (
          <Alert title="Billing ready in the backend" tone="info">
            Subscription checkout is available, but enforcement is off (`BILLING_ENFORCEMENT` is not
            enabled). Turn enforcement on later when outside-classroom users should be required to
            subscribe.
          </Alert>
        ) : null}

        {canManage && organization?.id ? (
          <Card>
            <CardTitle>Subscribe or manage</CardTitle>
            <CardDescription>
              Secure Stripe Checkout for the single monthly plan. Use Manage billing to update the
              card or cancel.
            </CardDescription>
            <div className="mt-4">
              <BillingActions
                organizationId={organization.id}
                hasCustomer={Boolean(subscription?.stripe_customer_id)}
                isActive={active}
              />
            </div>
          </Card>
        ) : (
          <Alert title="Permission needed" tone="warning">
            Only organization managers can start or manage the subscription.
          </Alert>
        )}

        <p className="text-muted text-sm">
          Public pricing page:{" "}
          <Link href="/pricing" className="text-highlight underline">
            /pricing
          </Link>
        </p>
      </div>
    </main>
  );
}
