import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { AccommodationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { listAccommodations } from "@/lib/data/accommodations";

export const metadata: Metadata = { title: "Accommodations" };

export default async function AccommodationsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const state = await listAccommodations({
    libraryItemId: slug[0] === "library" && slug[1] && slug[1] !== "new" ? slug[1] : undefined,
    accommodationId: slug[0] && !["library", "logs", "reviews"].includes(slug[0]) ? slug[0] : undefined,
  });

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Accommodations" }]} />
      <PageHeader title="Accommodations" description="Accommodation library, student supports, implementation logs, and reviews." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <ModuleLinkGrid links={[
            { href: "/accommodations", label: "Dashboard", description: "Review authorized accommodation supports." },
            { href: "/accommodations/library", label: "Library", description: "Manage reusable accommodation descriptions." },
            { href: "/accommodations/logs", label: "Implementation", description: "Record accommodation availability and implementation." },
          ]} />
          <AccommodationsWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
