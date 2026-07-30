import type { Metadata } from "next";
import { ConfigurationState } from "@/components/domain/page-states";
import { StarterLibrariesCard } from "@/components/domain/starter-libraries-card";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Organization settings" };

export default async function OrganizationSettingsPage() {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization settings" }]} />
        <PageHeader title="Organization settings" description="Selected tenant context." />
        <ConfigurationState />
      </main>
    );
  }

  const { organization, membership } = await requireActiveMembership();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization settings" }]} />
      <PageHeader title="Organization settings" description="Selected tenant context and your active role." />
      <div className="space-y-6">
        <Card>
          <CardTitle>{organization?.name ?? "Selected organization"}</CardTitle>
          <CardDescription>
            Slug: {organization?.slug ?? "not available"}. Your role: {ROLE_LABELS[membership.role_code]}.
          </CardDescription>
        </Card>
        {organization?.id ? <StarterLibrariesCard organizationId={organization.id} /> : null}
      </div>
    </main>
  );
}
