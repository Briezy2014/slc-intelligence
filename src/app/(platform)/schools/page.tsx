import type { Metadata } from "next";
import Link from "next/link";
import { SchoolList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listSchools } from "@/lib/data/schools";

export const metadata: Metadata = {
  title: "Schools",
};

export default async function SchoolsPage() {
  const state = await listSchools();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Schools" }]} />
      <PageHeader
        title="Schools"
        description="Manage authorized schools for the selected organization."
        actions={
          state.configured && state.data.canManage ? (
            <Link
              href="/schools/new"
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              New school
            </Link>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <SchoolList schools={state.data.rows} />
      )}
    </main>
  );
}
