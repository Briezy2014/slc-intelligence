import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import { describeSeries, rateOfImprovement } from "@/lib/analytics/calculations";
import { toObservationPoints, valueFromDataPoint } from "@/lib/data/progress";
import type { ProgressDataPoint, ProgressMonitoringSession, Student } from "@/lib/supabase/types";

export type CommandCenterSummary = {
  organizationId: string | null;
  organizationName: string | null;
  assignedStudentsCount: number;
  draftSessionsCount: number;
  recentSessionsCount: number;
  goalsNeedingDataCount: number;
  labels: {
    assignedStudents: string;
    draftSessions: string;
    recentSessions: string;
    goalsNeedingData: string;
  };
  canReadAnalytics: boolean;
};

const emptySummary: CommandCenterSummary = {
  organizationId: null,
  organizationName: null,
  assignedStudentsCount: 0,
  draftSessionsCount: 0,
  recentSessionsCount: 0,
  goalsNeedingDataCount: 0,
  labels: {
    assignedStudents: "Students visible to your role in the selected organization",
    draftSessions: "Progress sessions saved as draft",
    recentSessions: "Progress sessions dated in the last 14 days",
    goalsNeedingData: "Active goals with no finalized/corrected data in the last 14 days",
  },
  canReadAnalytics: false,
};

export async function getCommandCenterSummary(): Promise<DataState<CommandCenterSummary>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptySummary);

  try {
    const permissions = await getPermissionFlags(context, ["analytics.read"]);
    const since = new Date();
    since.setDate(since.getDate() - 14);
    const sinceDate = since.toISOString().slice(0, 10);

    const [studentsResult, sessionsResult, goalsResult] = await Promise.all([
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .neq("enrollment_status", "archived"),
      context.supabase
        .from("progress_monitoring_sessions")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("session_date", { ascending: false })
        .limit(200),
      context.supabase
        .from("iep_goals")
        .select("id")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
    ]);

    if (studentsResult.error || sessionsResult.error || goalsResult.error) {
      return safeDataError(emptySummary);
    }

    const recentFinalizedGoalIds = new Set(
      (sessionsResult.data ?? [])
        .filter(
          (session) =>
            session.session_date >= sinceDate &&
            (session.status === "finalized" || session.status === "corrected"),
        )
        .map((session) => session.goal_id),
    );

    return {
      configured: true,
      data: {
        ...emptySummary,
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        assignedStudentsCount: (studentsResult.data as Student[] | null)?.length ?? 0,
        draftSessionsCount:
          sessionsResult.data?.filter((session) => session.status === "draft").length ?? 0,
        recentSessionsCount:
          sessionsResult.data?.filter((session) => session.session_date >= sinceDate).length ?? 0,
        goalsNeedingDataCount:
          goalsResult.data?.filter((goal) => !recentFinalizedGoalIds.has(goal.id)).length ?? 0,
        canReadAnalytics: permissions["analytics.read"],
      },
    };
  } catch {
    return safeDataError(emptySummary);
  }
}

export type GoalAnalyticsSummary = {
  series: ReturnType<typeof describeSeries>;
  trend: ReturnType<typeof rateOfImprovement>;
};

export function summarizeGoalAnalytics(
  sessions: ProgressMonitoringSession[],
  points: ProgressDataPoint[],
  higherIsBetter: boolean,
): GoalAnalyticsSummary {
  const joined = sessions.map((session) => {
    const dataPoint = points.find((point) => point.session_id === session.id) ?? null;
    return { ...session, dataPoint, value: valueFromDataPoint(dataPoint) };
  });
  const observations = toObservationPoints(joined);

  return {
    series: describeSeries(observations),
    trend: rateOfImprovement(observations, higherIsBetter),
  };
}
