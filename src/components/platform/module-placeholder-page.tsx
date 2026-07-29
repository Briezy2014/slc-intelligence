import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState } from "@/components/domain/page-states";
import { EmptyState } from "@/components/feedback/empty-state";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";

export async function ModulePlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
        <PageHeader title={title} description="Supabase configuration is required." />
        <ConfigurationState />
      </main>
    );
  }

  const { organization } = await requireActiveMembership();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
      <PageHeader title={title} description={description} />
      <div className="mt-6">
        <EmptyState
          title={`${title} is unavailable`}
          description={`No records are available for ${organization?.name ?? "the selected organization"} in this module.`}
        />
      </div>
    </main>
  );
}
