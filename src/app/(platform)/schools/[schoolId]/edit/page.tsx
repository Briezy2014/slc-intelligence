import type { Metadata } from "next";
import { SchoolForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getSchool } from "@/lib/data/schools";

export const metadata: Metadata = { title: "Edit school" };

export default async function EditSchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  const state = await getSchool(schoolId);
  const school = state.data.school;

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/schools", label: "Schools" },
          { label: "Edit" },
        ]}
      />
      <PageHeader title="Edit school" description="Update school metadata and status." />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error || !school || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState
          message={state.error ?? "School not found or you are not authorized to edit it."}
        />
      ) : (
        <Card>
          <SchoolForm organizationId={state.data.organizationId} school={school} />
        </Card>
      )}
    </main>
  );
}
