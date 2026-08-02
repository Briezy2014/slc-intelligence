import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  CommunicationsWorkspace,
  type FamilyCommunicationView,
} from "@/components/domain/application-modules";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Student family communication" };

function viewFromSlug(slug: string[]): FamilyCommunicationView {
  if (slug[0] === "contacts") return "contacts";
  if (slug[0] === "communications") return "communications";
  return "dashboard";
}

export default async function StudentFamilyCommunicationPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const view = viewFromSlug(slug);
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
        description="Tap Write a message, use the student and behavior dropdowns, then save a family-visible note."
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
                href: `/students/${studentId}/family-communication`,
                label: "Start here",
                description: "Pick what you want to do for this student.",
              },
              {
                href: `/students/${studentId}/family-communication/contacts`,
                label: "Contacts",
                description: "Who can receive messages for this student.",
              },
              {
                href: `/students/${studentId}/family-communication/communications`,
                label: "Write a message",
                description: "Student + behavior dropdowns, draft, and save.",
              },
              {
                href: "/parent-share",
                label: "Messages for families",
                description: "Checklist of notes already marked okay to send home.",
              },
            ]}
          />
          <CommunicationsWorkspace data={state.data} studentId={studentId} view={view} />
        </div>
      )}
    </main>
  );
}
