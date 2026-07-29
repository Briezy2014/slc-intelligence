import type { Metadata } from "next";
import { ProgramForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { listPrograms } from "@/lib/data/programs";

export const metadata: Metadata = { title: "New program" };

export default async function NewProgramPage() {
  const state = await listPrograms();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }, { label: "New" }]} />
      <PageHeader title="New program" description="Create a program or service grouping." />
      {!state.configured ? <ConfigurationState /> : state.error || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState message={state.error ?? "You are not authorized to create programs."} />
      ) : (
        <Card><ProgramForm organizationId={state.data.organizationId} schools={state.data.schools} /></Card>
      )}
    </main>
  );
}
