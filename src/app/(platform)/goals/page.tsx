import type { Metadata } from "next";
import { GoalList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listGoals } from "@/lib/data/goals";

export const metadata: Metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const state = await listGoals();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Goals" }]} />
      <PageHeader title="Goals" description="Authorized IEP goals across the selected organization." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : <GoalList goals={state.data.rows} students={state.data.students} />}
    </main>
  );
}
