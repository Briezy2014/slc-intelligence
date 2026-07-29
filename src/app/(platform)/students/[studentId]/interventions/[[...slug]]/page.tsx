import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import {
  InterventionDashboard,
  InterventionEvidenceForms,
  InterventionPlanForm,
  ModuleLinkGrid,
} from "@/components/domain/phase-modules";
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Student interventions" };

export default async function StudentInterventionsPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const planId = slug[0] && !["fidelity", "dosage", "analytics", "reviews"].includes(slug[0]) ? slug[0] : undefined;
  const state = await listInterventions({ studentId, planId });
  const section = slug[0] ?? "overview";

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/students", label: "Students" }, { label: "Interventions" }]} />
      <PageHeader title="Student interventions" description="Plans, components, fidelity, dosage, analytics, and reviews for the selected student." />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <ModuleLinkGrid
            links={[
              { href: `/students/${studentId}/interventions`, label: "Plans", description: "Review and create intervention plans." },
              { href: `/students/${studentId}/interventions/fidelity`, label: "Fidelity", description: "Enter implementation fidelity evidence." },
              { href: `/students/${studentId}/interventions/dosage`, label: "Dosage", description: "Record planned versus delivered intervention exposure." },
              { href: `/students/${studentId}/interventions/analytics`, label: "Analytics", description: "View fidelity and dosage summaries with readiness notes." },
              { href: `/students/${studentId}/interventions/reviews`, label: "Reviews", description: "Record team review outcomes and next review dates." },
            ]}
          />
          {section === "overview" ? (
            <Card>
              <CardTitle>New intervention plan</CardTitle>
              <CardDescription>Plans save as drafts unless an authorized activation role changes status.</CardDescription>
              <div className="mt-4"><InterventionPlanForm data={state.data} studentId={studentId} /></div>
            </Card>
          ) : null}
          {["fidelity", "dosage", "reviews"].includes(section) || planId ? (
            <InterventionEvidenceForms data={state.data} planId={planId} />
          ) : null}
          <InterventionDashboard data={state.data} />
        </div>
      )}
    </main>
  );
}
