import type { Metadata } from "next";
import Link from "next/link";
import { ProgramList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listPrograms } from "@/lib/data/programs";

export const metadata: Metadata = {
  title: "Programs",
};

export default async function ProgramsPage() {
  const state = await listPrograms();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Programs" }]} />
      <PageHeader
        title="Programs"
        description="Manage authorized programs and service groupings."
        actions={
          state.configured && state.data.canManage ? (
            <Link
              href="/programs/new"
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              New program
            </Link>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <ProgramList programs={state.data.rows} schools={state.data.schools} />
      )}
    </main>
  );
}
