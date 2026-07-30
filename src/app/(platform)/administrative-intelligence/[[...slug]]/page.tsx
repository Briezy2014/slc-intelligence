import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { AdministrativeIntelligenceWorkspace } from "@/components/domain/administrative-intelligence";
import { getAdministrativeIntelligence } from "@/lib/data/administrative";

export const metadata: Metadata = {
  title: "Administrative Intelligence",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function resolveView(slug: string[] = []) {
  if (!slug.length) return "organization";
  if (slug[0] === "schools" && slug[1]) return "schools";
  if (slug[0] === "programs" && slug[1]) return "programs";
  if (slug[0] === "classrooms" && slug[1]) return "classrooms";
  return slug[0] ?? "organization";
}

function resolveFilters(
  slug: string[] = [],
  searchParams: Record<string, string | string[] | undefined>,
) {
  const schoolId = slug[0] === "schools" && slug[1] ? slug[1] : first(searchParams.schoolId);
  const programId = slug[0] === "programs" && slug[1] ? slug[1] : first(searchParams.programId);
  const classroomId =
    slug[0] === "classrooms" && slug[1] ? slug[1] : first(searchParams.classroomId);
  return {
    schoolId,
    programId,
    classroomId,
    startDate: first(searchParams.startDate),
    endDate: first(searchParams.endDate),
  };
}

function titleForView(view: string) {
  const titles: Record<string, string> = {
    organization: "Organization dashboard",
    schools: "School dashboard",
    programs: "Program dashboard",
    classrooms: "Classroom dashboard",
    caseloads: "Caseload dashboard",
    reporting: "Progress-report readiness",
    services: "Service documentation",
    accommodations: "Accommodation documentation",
    behavior: "Behavior data dashboard",
    interventions: "Intervention and fidelity",
    meetings: "Meeting and action-item dashboard",
    "data-quality": "Data-quality dashboard",
    audit: "Audit activity dashboard",
  };
  return titles[view] ?? "Administrative Intelligence";
}

export default async function AdministrativeIntelligencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: SearchParams;
}) {
  const { slug = [] } = await params;
  const query = await searchParams;
  const view = resolveView(slug);
  const filters = resolveFilters(slug, query);
  const state = await getAdministrativeIntelligence(filters);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/administrative-intelligence", label: "Administrative Intelligence" },
          ...(slug.length ? [{ label: titleForView(view) }] : []),
        ]}
      />
      <PageHeader
        title={titleForView(view)}
        description="Role-aware administrative analytics for authorized school, program, organization, and classroom scopes."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <AdministrativeIntelligenceWorkspace data={state.data} view={view} />
      )}
    </main>
  );
}
