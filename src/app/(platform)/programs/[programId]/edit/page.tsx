import type { Metadata } from "next";
import { ProgramForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Edit program" };

export default async function EditProgramPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const state = await getProgram(programId);
  const program = state.data.program;

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }, { label: "Edit" }]} />
      <PageHeader title="Edit program" description="Update program details." />
      {!state.configured ? <ConfigurationState /> : state.error || !program || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState message={state.error ?? "Program not found or you are not authorized to edit it."} />
      ) : (
        <Card><ProgramForm organizationId={state.data.organizationId} program={program} schools={state.data.schools} /></Card>
      )}
    </main>
  );
}
