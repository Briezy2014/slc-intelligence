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
  draftReportsCount: number;
  reportsReadyForReviewCount: number;
  draftBehaviorObservationsCount: number;
  activeInterventionPlansCount: number;
  accommodationsNeedingReviewCount: number;
  draftServiceLogsCount: number;
  communicationFollowupsDueCount: number;
  meetingsUpcomingCount: number;
  dailyNotesDraftCount: number;
  classroomAnnouncementsDraftCount: number;
  labels: {
    assignedStudents: string;
    draftSessions: string;
    recentSessions: string;
    goalsNeedingData: string;
    draftReports: string;
    reportsReadyForReview: string;
    draftBehaviorObservations: string;
    activeInterventionPlans: string;
    accommodationsNeedingReview: string;
    draftServiceLogs: string;
    communicationFollowupsDue: string;
    meetingsUpcoming: string;
    dailyNotesDraft: string;
    classroomAnnouncementsDraft: string;
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
  draftReportsCount: 0,
  reportsReadyForReviewCount: 0,
  draftBehaviorObservationsCount: 0,
  activeInterventionPlansCount: 0,
  accommodationsNeedingReviewCount: 0,
  draftServiceLogsCount: 0,
  communicationFollowupsDueCount: 0,
  meetingsUpcomingCount: 0,
  dailyNotesDraftCount: 0,
  classroomAnnouncementsDraftCount: 0,
  labels: {
    assignedStudents: "Students visible to your role in the selected organization",
    draftSessions: "Progress sessions saved as draft",
    recentSessions: "Progress sessions dated in the last 14 days",
    goalsNeedingData: "Active goals with no finalized/corrected data in the last 14 days",
    draftReports: "Progress reports saved as draft",
    reportsReadyForReview: "Progress reports ready for educator review",
    draftBehaviorObservations: "Behavior observations saved as draft",
    activeInterventionPlans: "Active intervention plans in your authorized scope",
    accommodationsNeedingReview: "Active accommodations with review dates due or not yet set",
    draftServiceLogs: "Service delivery logs saved as draft",
    communicationFollowupsDue: "Open communication follow-ups due by today",
    meetingsUpcoming: "Scheduled meetings in the next 14 days",
    dailyNotesDraft: "Daily student notes saved as draft",
    classroomAnnouncementsDraft: "Classroom announcements saved as draft",
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

    const todayDate = new Date().toISOString().slice(0, 10);
    const upcoming = new Date();
    upcoming.setDate(upcoming.getDate() + 14);
    const upcomingIso = upcoming.toISOString();

    const [
      studentsResult,
      sessionsResult,
      goalsResult,
      reportsResult,
      behaviorSessionsResult,
      interventionPlansResult,
      accommodationsResult,
      serviceLogsResult,
      communicationFollowupsResult,
      meetingsResult,
      dailyNotesResult,
      classroomAnnouncementsResult,
    ] = await Promise.all([
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
      context.supabase
        .from("progress_reports")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .in("status", ["draft", "ready_for_review"]),
      context.supabase
        .from("behavior_observation_sessions")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "draft"),
      context.supabase
        .from("intervention_plans")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("accommodation_review_records")
        .select("id,next_review_date")
        .eq("organization_id", context.organizationId)
        .or(`next_review_date.is.null,next_review_date.lte.${todayDate}`),
      context.supabase
        .from("service_delivery_logs")
        .select("id,record_status")
        .eq("organization_id", context.organizationId)
        .eq("record_status", "draft"),
      context.supabase
        .from("communication_followups")
        .select("id,status,due_date")
        .eq("organization_id", context.organizationId)
        .eq("status", "open")
        .lte("due_date", todayDate),
      context.supabase
        .from("meetings")
        .select("id,status,scheduled_start")
        .eq("organization_id", context.organizationId)
        .eq("status", "scheduled")
        .gte("scheduled_start", new Date().toISOString())
        .lte("scheduled_start", upcomingIso),
      context.supabase
        .from("daily_student_notes")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "draft"),
      context.supabase
        .from("classroom_announcements")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "draft"),
    ]);

    if (
      studentsResult.error ||
      sessionsResult.error ||
      goalsResult.error ||
      reportsResult.error ||
      behaviorSessionsResult.error ||
      interventionPlansResult.error ||
      accommodationsResult.error ||
      serviceLogsResult.error ||
      communicationFollowupsResult.error ||
      meetingsResult.error ||
      dailyNotesResult.error ||
      classroomAnnouncementsResult.error
    ) {
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
        draftReportsCount:
          reportsResult.data?.filter((report) => report.status === "draft").length ?? 0,
        reportsReadyForReviewCount:
          reportsResult.data?.filter((report) => report.status === "ready_for_review").length ?? 0,
        draftBehaviorObservationsCount: behaviorSessionsResult.data?.length ?? 0,
        activeInterventionPlansCount: interventionPlansResult.data?.length ?? 0,
        accommodationsNeedingReviewCount: accommodationsResult.data?.length ?? 0,
        draftServiceLogsCount: serviceLogsResult.data?.length ?? 0,
        communicationFollowupsDueCount: communicationFollowupsResult.data?.length ?? 0,
        meetingsUpcomingCount: meetingsResult.data?.length ?? 0,
        dailyNotesDraftCount: dailyNotesResult.data?.length ?? 0,
        classroomAnnouncementsDraftCount: classroomAnnouncementsResult.data?.length ?? 0,
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
