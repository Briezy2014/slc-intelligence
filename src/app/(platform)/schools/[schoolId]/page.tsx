import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getSchool } from "@/lib/data/schools";

export const metadata: Metadata = { title: "School detail" };

export default async function SchoolDetailPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = await params;
  const state = await getSchool(schoolId);
  const school = state.data.school;

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/schools", label: "Schools" }, { label: "School detail" }]} />
      <PageHeader
        title={school?.name ?? "School detail"}
        description="School details and operational status."
        actions={school && state.data.canManage ? (
          <Link href={`/schools/${school.id}/edit`} className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold">
            Edit school
          </Link>
        ) : null}
      />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : school ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>{school.name}</CardTitle>
            <CardDescription>School code: {school.school_code ?? "Not set"}. Status: {school.status}.</CardDescription>
          </Card>
          <TableShell
            caption="School metadata"
            headers={["Field", "Value"]}
            rows={[
              ["Type", school.school_type],
              ["Status", school.status],
              ["Created", new Date(school.created_at).toLocaleString()],
              ["Updated", new Date(school.updated_at).toLocaleString()],
            ]}
          />
        </div>
      ) : <SafeErrorState message="School not found or unavailable to your role." />}
    </main>
  );
}
