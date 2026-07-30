import type { Metadata } from "next";
import { SchoolForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { listSchools } from "@/lib/data/schools";

export const metadata: Metadata = { title: "New school" };

export default async function NewSchoolPage() {
  const state = await listSchools();

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/schools", label: "Schools" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New school" description="Create a school in the selected organization." />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState message={state.error ?? "You are not authorized to create schools."} />
      ) : (
        <Card>
          <SchoolForm organizationId={state.data.organizationId} />
        </Card>
      )}
    </main>
  );
}
