import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { CommunicationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Student family communication" };

export default async function StudentFamilyCommunicationPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const state = await listCommunications({
    studentId,
    communicationId:
      slug[0] && !["contacts", "communications", "exports"].includes(slug[0]) ? slug[0] : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Family Communication" },
        ]}
      />
      <PageHeader
        title="Student family communication"
        description="Student contacts, family-visible communications, and internal/restricted separation."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <ModuleLinkGrid
            links={[
              {
                href: `/students/${studentId}/family-communication/contacts`,
                label: "Contacts",
                description: "Student contact records.",
              },
              {
                href: `/students/${studentId}/family-communication/communications`,
                label: "Communications",
                description: "Communication summaries.",
              },
              {
                href: `/students/${studentId}/family-communication/exports`,
                label: "Exports",
                description: "Family-visible exports only.",
              },
            ]}
          />
          <CommunicationsWorkspace data={state.data} studentId={studentId} />
        </div>
      )}
    </main>
  );
}
