import type { Metadata } from "next";
import Link from "next/link";
import { StudentList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { listStudents } from "@/lib/data/students";

export const metadata: Metadata = {
  title: "Students",
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: "active" | "inactive" | "archived" | "all";
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const state = await listStudents({
    search: params.q,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Students" }]} />
      <PageHeader
        title="Students"
        description="Authorized student roster with search, filter, and pagination-ready parameters."
        actions={
          state.configured && state.data.canCreate ? (
            <Link
              href="/students/new"
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              New student
            </Link>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <form
            className="border-border bg-background-elevated grid gap-3 rounded-[var(--radius-lg)] border p-4 sm:grid-cols-[1fr_180px_auto]"
            action="/students"
          >
            <Input
              name="q"
              aria-label="Search students"
              placeholder="Search by name or local ID"
              defaultValue={state.data.filters.search}
            />
            <Select
              name="status"
              aria-label="Enrollment status"
              defaultValue={state.data.filters.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
              <option value="all">All statuses</option>
            </Select>
            <Button type="submit">Filter</Button>
          </form>
          <p className="text-muted text-sm">{state.data.count} matching authorized students.</p>
          <StudentList students={state.data.rows} />
        </div>
      )}
    </main>
  );
}
