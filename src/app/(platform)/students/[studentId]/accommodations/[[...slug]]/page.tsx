import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { AccommodationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { listAccommodations } from "@/lib/data/accommodations";

export const metadata: Metadata = { title: "Student accommodations" };

export default async function StudentAccommodationsPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const state = await listAccommodations({
    studentId,
    accommodationId: slug[0] && !["logs", "reviews"].includes(slug[0]) ? slug[0] : undefined,
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
        description="Student-scoped supports, implementation records, and review history."
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
                label: "Supports",
                description: "Review and create supports.",
              },
              {
                href: `/students/${studentId}/accommodations/logs`,
                label: "Logs",
                description: "Record implementation information.",
              },
              {
                href: `/students/${studentId}/accommodations/reviews`,
                label: "Reviews",
                description: "Review accommodation use descriptively.",
              },
            ]}
          />
          <AccommodationsWorkspace data={state.data} studentId={studentId} />
        </div>
      )}
    </main>
  );
}
