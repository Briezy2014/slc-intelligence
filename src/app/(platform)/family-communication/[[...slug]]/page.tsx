import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  CommunicationsWorkspace,
  type FamilyCommunicationView,
} from "@/components/domain/application-modules";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { Alert } from "@/components/ui/alert";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Family communication" };

const RESERVED_SLUGS = new Set(["contacts", "communications", "templates", "exports"]);

function viewFromSlug(slug: string[]): FamilyCommunicationView {
  if (slug[0] === "contacts") return "contacts";
  if (slug[0] === "communications") return "communications";
  if (slug[0] === "templates") return "templates";
  return "dashboard";
}

export default async function FamilyCommunicationPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listCommunications({
    communicationId: slug[0] && !RESERVED_SLUGS.has(slug[0]) ? slug[0] : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Family Communication" }]} />
      <PageHeader
        title="Family Communication"
        description="Add contacts, choose a professional template, write the message, and track letters by date and time."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Start here to send something home" tone="info">
            Tap <strong>Contacts</strong> to add who can receive notes,{" "}
            <strong>Message templates</strong> for ready-to-use letters, then{" "}
            <strong>Write a message</strong> to insert, set date/time, and save.{" "}
            <Link href="/parent-share" className="text-highlight font-semibold underline">
              Messages for families
            </Link>{" "}
            stays blank until you save a family-visible note here.
          </Alert>
          <ModuleLinkGrid
            links={[
              {
                href: "/family-communication",
                label: "Start here",
                description: "Pick what you want to do.",
              },
              {
                href: "/family-communication/contacts",
                label: "Contacts",
                description: "Add and review who can receive school-to-home messages.",
              },
              {
                href: "/family-communication/templates",
                label: "Message templates",
                description: "Dozens of professional family letters ready to customize.",
              },
              {
                href: "/family-communication/communications",
                label: "Write a message",
                description: "Student, template, date/time, then save and track.",
              },
              {
                href: "/parent-share",
                label: "Messages for families",
                description: "Checklist of notes already marked okay to send home.",
              },
            ]}
          />
          <CommunicationsWorkspace data={state.data} view={view} />
        </div>
      )}
    </main>
  );
}
