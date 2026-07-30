import type { Metadata } from "next";
import Link from "next/link";
import { ClassroomList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listClassrooms } from "@/lib/data/classrooms";

export const metadata: Metadata = {
  title: "Classrooms",
};

export default async function ClassroomsPage() {
  const state = await listClassrooms();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Classrooms" }]} />
      <PageHeader
        title="Classrooms"
        description="Manage authorized classroom scopes and service locations."
        actions={
          state.configured && state.data.canManage ? (
            <Link
              href="/classrooms/new"
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              New classroom
            </Link>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <ClassroomList
          classrooms={state.data.rows}
          schools={state.data.schools}
          programs={state.data.programs}
        />
      )}
    </main>
  );
}
