import type { Metadata } from "next";
import { StudentForm } from "@/components/domain/forms";
import { DemoStudentCard } from "@/components/domain/demo-student-card";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { listStudents } from "@/lib/data/students";

export const metadata: Metadata = { title: "New student" };

export default async function NewStudentPage() {
  const state = await listStudents();
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "New" },
        ]}
      />
      <PageHeader
        title="New student"
        description="Add a student record for classroom practice (example code: S1)."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error || !state.data.organizationId || !state.data.canCreate ? (
        <SafeErrorState message={state.error ?? "You are not authorized to create students."} />
      ) : (
        <div className="space-y-6">
          <DemoStudentCard organizationId={state.data.organizationId} />
          <Card>
            <StudentForm organizationId={state.data.organizationId} />
          </Card>
        </div>
      )}
    </main>
  );
}
