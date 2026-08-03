import type { Metadata } from "next";
import Link from "next/link";
import {
  BrainCircuit,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  MessageCircle,
  Goal,
  LibraryBig,
  LineChart,
  NotebookText,
  Puzzle,
  Speech,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import { getCommandCenterSummary } from "@/lib/data/analytics";
import { getAdministrativeIntelligence } from "@/lib/data/administrative";

export const metadata: Metadata = {
  title: "Home",
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

  const [{ membership, memberships, organization }, summaryState, adminState] = await Promise.all([
    requireActiveMembership(),
    getCommandCenterSummary(),
    getAdministrativeIntelligence(),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Home" }]} />
      <PageHeader
        title="Home"
        description={`Welcome to ${organization?.name ?? "your classroom workspace"}. Pick one job below.`}
      />
      <div className="space-y-6">
        <Card className="brand-glow">
          <CardTitle>Start here</CardTitle>
          <CardDescription className="mt-1">
            {ROLE_LABELS[membership.role_code]} · {memberships.length} active membership
            {memberships.length === 1 ? "" : "s"}. Tap one job — libraries and dropdowns are ready.
          </CardDescription>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/students", label: "Students", hint: "Open caseload → pick a student" },
              {
                href: "/classroom-operations",
                label: "Classroom",
                hint: "Schedules, notes, routines",
              },
              { href: "/supports", label: "Supports", hint: "Accommodations & interventions" },
              {
                href: "/progress/enter",
                label: "Progress entry",
                hint: "Student → goal → today’s score",
              },
              { href: "/behavior-detective", label: "Behavior", hint: "Log what you saw" },
              {
                href: "/family-communication",
                label: "Families",
                hint: "Home note from templates",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-border hover:border-highlight/50 hover:bg-surface-subtle rounded-[var(--radius-md)] border px-3 py-3 transition-colors"
              >
                <span className="text-foreground block text-sm font-semibold">{item.label}</span>
                <span className="text-muted block text-xs">{item.hint}</span>
                <span className="text-highlight mt-1 block text-xs font-semibold">
                  Tap to open →
                </span>
              </Link>
            ))}
          </div>
        </Card>
        <Alert title="Counts below are summaries only" tone="neutral">
          They help you scan your caseload. They are not automated recommendations.
        </Alert>
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
            <SummaryCard
              value={summaryState.data.draftReportsCount}
              label={summaryState.data.labels.draftReports}
              icon={NotebookText}
            />
            <SummaryCard
              value={summaryState.data.reportsReadyForReviewCount}
              label={summaryState.data.labels.reportsReadyForReview}
              icon={ClipboardList}
            />
            <SummaryCard
              value={summaryState.data.draftBehaviorObservationsCount}
              label={summaryState.data.labels.draftBehaviorObservations}
              icon={BrainCircuit}
            />
            <SummaryCard
              value={summaryState.data.activeInterventionPlansCount}
              label={summaryState.data.labels.activeInterventionPlans}
              icon={LibraryBig}
            />
            <SummaryCard
              value={summaryState.data.accommodationsNeedingReviewCount}
              label={summaryState.data.labels.accommodationsNeedingReview}
              icon={Puzzle}
            />
            <SummaryCard
              value={summaryState.data.draftServiceLogsCount}
              label={summaryState.data.labels.draftServiceLogs}
              icon={Speech}
            />
            <SummaryCard
              value={summaryState.data.communicationFollowupsDueCount}
              label={summaryState.data.labels.communicationFollowupsDue}
              icon={MessageCircle}
            />
            <SummaryCard
              value={summaryState.data.meetingsUpcomingCount}
              label={summaryState.data.labels.meetingsUpcoming}
              icon={CalendarDays}
            />
            <SummaryCard
              value={summaryState.data.dailyNotesDraftCount}
              label={summaryState.data.labels.dailyNotesDraft}
              icon={ClipboardList}
            />
            <SummaryCard
              value={summaryState.data.classroomAnnouncementsDraftCount}
              label={summaryState.data.labels.classroomAnnouncementsDraft}
              icon={NotebookText}
            />
          </div>
        )}
        {adminState.configured && !adminState.error && adminState.data.canRead ? (
          <Card className="brand-glow">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChartColumn className="text-highlight size-5" aria-hidden={true} />
                  Administrative Intelligence
                </CardTitle>
                <CardDescription>
                  Authorized workflow summaries with privacy-aware suppression. Not a staff or
                  student ranking.
                </CardDescription>
              </div>
              <Badge tone="success">Authorized</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {adminState.data.metrics
                .filter((metric) =>
                  [
                    "goals_without_recent_finalized_data",
                    "reports_ready_for_review",
                    "open_family_follow_ups",
                    "upcoming_meetings",
                  ].includes(metric.key),
                )
                .map((metric) => (
                  <div
                    key={metric.key}
                    className="border-border rounded-[var(--radius-md)] border p-3"
                  >
                    <p className="text-muted text-xs font-semibold tracking-[0.1em] uppercase">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums">
                      {metric.result.display}
                    </p>
                  </div>
                ))}
            </div>
            <p className="mt-4">
              <Link
                href="/administrative-intelligence"
                className="text-highlight text-sm font-medium underline-offset-4 hover:underline"
              >
                Open Administrative Intelligence
              </Link>
            </p>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
