import type { Metadata } from "next";
import {
  ClipboardList,
  Goal,
  LineChart,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import { getCommandCenterSummary } from "@/lib/data/analytics";

export const metadata: Metadata = {
  title: "Command Center",
};

function SummaryCard({
  value,
  label,
  icon: Icon,
}: {
  value: number | string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Card className="brand-glow motion-safe-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">{label}</p>
          <CardTitle className="mt-2 text-3xl tabular-nums">{value}</CardTitle>
          <CardDescription>Calculated summary for your authorized scope.</CardDescription>
        </div>
        <span className="bg-success-soft text-highlight rounded-[var(--radius-md)] p-2">
          <Icon className="size-5" aria-hidden={true} />
        </span>
      </div>
    </Card>
  );
}

export default async function CommandCenterPage() {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Command Center" }]} />
        <PageHeader
          title="Command Center"
          description="Supabase configuration is required before protected workflows can load."
        />
        <ConfigurationState />
      </main>
    );
  }

  const [{ membership, memberships, organization }, summaryState] = await Promise.all([
    requireActiveMembership(),
    getCommandCenterSummary(),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Command Center" }]} />
      <PageHeader
        title="Command Center"
        description={`Signed in with ${organization?.name ?? "your organization"} context.`}
      />
      <div className="space-y-6">
        <DevelopmentNotice>
          Command Center summaries are calculated from authorized organization rows and are not
          high-stakes alerts or recommendations.
        </DevelopmentNotice>
        <Card className="brand-glow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Membership context</CardTitle>
              <CardDescription>
                Current role: {ROLE_LABELS[membership.role_code]}. Active memberships:{" "}
                {memberships.length}.
              </CardDescription>
            </div>
            <Badge tone="success">Authenticated</Badge>
          </div>
        </Card>
        {summaryState.error ? (
          <SafeErrorState message={summaryState.error} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              value={summaryState.data.assignedStudentsCount}
              label={summaryState.data.labels.assignedStudents}
              icon={Users}
            />
            <SummaryCard
              value={summaryState.data.draftSessionsCount}
              label={summaryState.data.labels.draftSessions}
              icon={ClipboardList}
            />
            <SummaryCard
              value={summaryState.data.recentSessionsCount}
              label={summaryState.data.labels.recentSessions}
              icon={LineChart}
            />
            <SummaryCard
              value={summaryState.data.goalsNeedingDataCount}
              label={summaryState.data.labels.goalsNeedingData}
              icon={Goal}
            />
          </div>
        )}
      </div>
    </main>
  );
}
