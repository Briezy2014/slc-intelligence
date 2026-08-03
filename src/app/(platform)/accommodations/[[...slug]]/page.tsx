import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  AccommodationsWorkspace,
  type AccommodationsView,
} from "@/components/domain/application-modules";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { listAccommodations } from "@/lib/data/accommodations";

export const metadata: Metadata = { title: "Accommodations" };

function viewFromSlug(slug: string[]): AccommodationsView {
  if (slug[0] === "library") return "library";
  if (slug[0] === "logs" || slug[0] === "implementation") return "implementation";
  return "dashboard";
}

export default async function AccommodationsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listAccommodations({
    libraryItemId: slug[0] === "library" && slug[1] && slug[1] !== "new" ? slug[1] : undefined,
    accommodationId:
      slug[0] && !["library", "logs", "reviews", "implementation"].includes(slug[0])
        ? slug[0]
        : undefined,
  });

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Accommodations" }]} />
      <PageHeader
        title="Accommodations"
        description="Assign one or many supports from the dropdown. Descriptions fill in automatically — edit if you want."
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
                href: "/accommodations",
                label: "Assign supports",
                description: "Student + library dropdowns. Add multiple, then save.",
              },
              {
                href: "/accommodations/logs",
                label: "Log use",
                description: "Mark whether a saved support was used today.",
              },
              {
                href: "/accommodations/library",
                label: "Add custom support",
                description: "Optional — only if something is missing from the dropdown.",
              },
            ]}
          />
          <AccommodationsWorkspace data={state.data} view={view} />
        </div>
      )}
    </main>
  );
}
