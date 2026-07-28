import type { Metadata } from "next";
import { ClassroomForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { listClassrooms } from "@/lib/data/classrooms";

export const metadata: Metadata = { title: "New classroom" };

export default async function NewClassroomPage() {
  const state = await listClassrooms();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/classrooms", label: "Classrooms" }, { label: "New" }]} />
      <PageHeader title="New classroom" description="Create a classroom scope." />
      {!state.configured ? <ConfigurationState /> : state.error || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState message={state.error ?? "You are not authorized to create classrooms."} />
      ) : (
        <Card><ClassroomForm organizationId={state.data.organizationId} schools={state.data.schools} programs={state.data.programs} /></Card>
      )}
    </main>
  );
}
