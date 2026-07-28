import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
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
        <DevelopmentNotice title="Configuration needed">
          Add Supabase environment values to enable protected platform modules.
        </DevelopmentNotice>
      </main>
    );
  }

  const { organization } = await requireActiveMembership();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
      <PageHeader title={title} description={description} />
      <DevelopmentNotice>
        {title} is connected to authenticated membership context for{" "}
        {organization?.name ?? "the selected organization"}, but detailed workflows are reserved for
        later phases.
      </DevelopmentNotice>
      <div className="mt-6">
        <EmptyState
          title={`${title} workflow placeholder`}
          description="No real student or operational data is displayed in this development placeholder."
        />
      </div>
    </main>
  );
}
