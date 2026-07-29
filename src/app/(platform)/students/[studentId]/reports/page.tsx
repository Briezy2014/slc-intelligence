import type { Metadata } from "next";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ReportCreateForm, ReportingTables } from "@/components/domain/phase-modules";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listReporting } from "@/lib/data/reporting";

export const metadata: Metadata = { title: "Student reports" };

export default async function StudentReportsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const state = await listReporting({ studentId });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/students", label: "Students" }, { label: "Reports" }]} />
      <PageHeader title="Student reports" description="Progress reports available in your authorized student scope." />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardTitle>Create report draft</CardTitle>
            <CardDescription>Only authorized periods and IEP cycles are shown.</CardDescription>
            <div className="mt-4"><ReportCreateForm data={{ ...state.data, students: state.data.students.filter((student) => student.id === studentId) }} /></div>
          </Card>
          <ReportingTables data={state.data} />
        </div>
      )}
    </main>
  );
}
