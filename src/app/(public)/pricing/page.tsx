import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BILLING_PLAN_NAME, formatMonthlyPriceLabel } from "@/lib/billing/config";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple monthly subscription for SLC Intelligence. One plan, no tiers.",
};

export default function PricingPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Pricing" }]} />
      <PageHeader
        title="Simple monthly pricing"
        description="One plan for your organization. No Free/Pro tiers."
      />
      <Card>
        <CardTitle>{BILLING_PLAN_NAME}</CardTitle>
        <CardDescription className="text-foreground mt-2 text-lg font-semibold">
          {formatMonthlyPriceLabel()}
        </CardDescription>
        <ul className="text-muted mt-4 list-disc space-y-2 pl-5 text-sm">
          <li>Organization workspace for specialized learning classrooms</li>
          <li>Instructional tools, documentation support, and classroom workflows</li>
          <li>Cancel anytime from the billing portal</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/billing"
            className="bg-accent text-accent-foreground hover:bg-accent-secondary inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-5 py-2 text-sm font-semibold"
          >
            Go to billing
          </Link>
          <Link
            href="/request-access"
            className="border-border bg-background-elevated inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold"
          >
            Request access
          </Link>
        </div>
      </Card>
    </main>
  );
}
