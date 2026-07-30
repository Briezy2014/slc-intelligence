import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { CommunicationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
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
        description="Log family communications, create parent sign links, and capture receipt e-signatures for behavior letters and other home notes."
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
                href: "/family-communication/contacts",
                label: "Contacts",
                description: "Manage authorized contact records.",
              },
              {
                href: "/family-communication/communications",
                label: "Communications",
                description: "Record communication summaries.",
              },
              {
                href: "/family-communication/exports",
                label: "Family-visible exports",
                description: "Export only family_visible records.",
              },
            ]}
          />
          <CommunicationsWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
