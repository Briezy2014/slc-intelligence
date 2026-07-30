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
        description="Contacts, template-and-language drafting (20 languages), parent sign links, receipt e-signatures, and family-visible exports."
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
                label: "Template & language",
                description: "Choose a template and translate into one of 20 languages.",
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
