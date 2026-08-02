import type { Metadata } from "next";
import { EducationDocumentsWorkspace } from "@/components/domain/education-documents-workspace";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { listEducationDocuments } from "@/lib/data/education-documents";
import type { EducationDocumentType } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "IEP & docs" };

function tabFromSlug(slug?: string[]): EducationDocumentType {
  const value = slug?.[0];
  if (value === "etr" || value === "progress-reports") {
    return value === "etr" ? "etr" : "progress_report";
  }
  return "iep";
}

export default async function EducationDocumentsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const state = await listEducationDocuments();
  const initialTab = tabFromSlug(slug);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "IEP & docs" }]} />
      <PageHeader
        title="IEP & docs"
        description="Draft IEP/ETR/progress documents here. Use the related links for goals, meetings, and reports."
      />
      <div className="mb-6 space-y-3">
        <p className="text-muted text-sm font-semibold tracking-wide uppercase">Related</p>
        <HubLinkGrid
          links={[
            { href: "/goals", label: "Goals", description: "IEP goals for your caseload." },
            { href: "/meetings", label: "Meetings", description: "Meeting notes and follow-ups." },
            { href: "/deadlines", label: "Deadlines", description: "Upcoming due dates." },
            { href: "/reports", label: "Reports", description: "Progress report drafts." },
            {
              href: "/parent-share",
              label: "Ready for families",
              description: "Notes already marked okay to send home.",
            },
          ]}
        />
      </div>
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : !state.data.permissions.canRead ? (
        <SafeErrorState message="You are not authorized to view education documents." />
      ) : (
        <EducationDocumentsWorkspace data={state.data} initialTab={initialTab} />
      )}
    </main>
  );
}
