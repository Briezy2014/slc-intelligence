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

export const metadata: Metadata = { title: "Student accommodations" };

function viewFromSlug(slug: string[]): AccommodationsView {
  if (slug[0] === "logs") return "implementation";
  if (slug[0] === "library") return "library";
  return "dashboard";
}

export default async function StudentAccommodationsPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listAccommodations({
    studentId,
    accommodationId:
      slug[0] && !["logs", "reviews", "library"].includes(slug[0]) ? slug[0] : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Accommodations" },
        ]}
      />
      <PageHeader
        title="Student accommodations"
        description="Pick supports from the dropdown — descriptions fill in. Add several, then save."
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
                href: `/students/${studentId}/accommodations`,
                label: "Assign supports",
                description: "Add one or many library supports for this student.",
              },
              {
                href: `/students/${studentId}/accommodations/logs`,
                label: "Log use",
                description: "Log whether a support was used.",
              },
            ]}
          />
          <AccommodationsWorkspace data={state.data} studentId={studentId} view={view} />
        </div>
      )}
    </main>
  );
}
