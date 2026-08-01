import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { CommunicationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { Alert } from "@/components/ui/alert";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Family communication" };

export default async function FamilyCommunicationPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const state = await listCommunications({
    communicationId:
      slug[0] && !["contacts", "communications", "templates", "exports"].includes(slug[0])
        ? slug[0]
        : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Family Communication" }]} />
      <PageHeader
        title="Family Communication"
        description="Write notes and letters for families here. Save with Visibility = Family visible, then review the ready-to-send list under Messages for families."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Start here to send something home" tone="info">
            Use Template & language below to draft, keep Visibility on Family visible, and save.{" "}
            <Link href="/parent-share" className="text-highlight font-semibold underline">
              Messages for families
            </Link>{" "}
            is only the checklist of notes already marked okay for parents — it stays blank until
            you save one here.
          </Alert>
          <ModuleLinkGrid
            links={[
              {
                href: "/family-communication/contacts",
                label: "Contacts",
                description: "Who can receive school-to-home messages.",
              },
              {
                href: "/family-communication/communications",
                label: "Write a message",
                description: "Choose a template, draft the note, and save it for the family.",
              },
              {
                href: "/parent-share",
                label: "Messages for families",
                description: "Checklist of notes already marked okay to send home.",
              },
            ]}
          />
          <CommunicationsWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
