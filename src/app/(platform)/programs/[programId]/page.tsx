import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { TableShell } from "@/components/data-display/table-shell";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Program detail" };

export default async function ProgramDetailPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const state = await getProgram(programId);
  const program = state.data.program;
  const school = state.data.schools.find((entry) => entry.id === program?.school_id);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }, { label: "Program detail" }]} />
      <PageHeader
        title={program?.name ?? "Program detail"}
        description="Program metadata and school scope."
        actions={program && state.data.canManage ? (
          <Link href={`/programs/${program.id}/edit`} className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold">Edit program</Link>
        ) : null}
      />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : program ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>{program.name}</CardTitle>
            <CardDescription>{program.description ?? "No description provided."}</CardDescription>
          </Card>
          <TableShell
            caption="Program metadata"
            headers={["Field", "Value"]}
            rows={[
              ["School", school?.name ?? "Organization-wide"],
              ["Type", program.program_type.replaceAll("_", " ")],
              ["Status", program.status],
              ["Updated", new Date(program.updated_at).toLocaleString()],
            ]}
          />
        </div>
      ) : <SafeErrorState message="Program not found or unavailable to your role." />}
    </main>
  );
}
