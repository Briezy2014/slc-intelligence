import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type { ObservationPoint } from "@/lib/analytics/calculations";
import { canAccessStudent, canEnterProgress } from "@/lib/permissions/check";
import type {
  IepGoal,
  InterventionPhase,
  ProgressDataPoint,
  ProgressMonitoringSession,
  Student,
} from "@/lib/supabase/types";

export type ProgressSessionWithValue = ProgressMonitoringSession & {
  value: number | null;
  dataPoint: ProgressDataPoint | null;
};

export type ProgressData = {
  organizationId: string | null;
  organizationName: string | null;
  sessions: ProgressSessionWithValue[];
  goals: IepGoal[];
  students: Student[];
  phases: InterventionPhase[];
  canEnter: boolean;
  canFinalize: boolean;
};

const emptyProgress: ProgressData = {
  organizationId: null,
  organizationName: null,
  sessions: [],
  goals: [],
  students: [],
  phases: [],
  canEnter: false,
  canFinalize: false,
};

export function valueFromDataPoint(point: ProgressDataPoint | null): number | null {
  if (!point) return null;
  return (
    point.calculated_percentage ??
    point.calculated_rate ??
    point.words_correct_per_minute ??
    point.accuracy_percentage ??
    point.independence_value ??
    point.custom_numeric_value ??
    point.rubric_score ??
    point.duration_value ??
    point.latency_value ??
    point.count_value ??
    point.task_independent_steps ??
    null
  );
}

export async function listProgress(
  options: { studentId?: string; goalId?: string } = {},
): Promise<DataState<ProgressData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyProgress);

  try {
    if (options.studentId) {
      const canRead = await canAccessStudent(
        context.supabase,
        context.organizationId,
        options.studentId,
      );
      if (!canRead)
        return safeDataError(emptyProgress, "You are not authorized to view this progress.");
    }

    const permissions = await getPermissionFlags(context, ["progress.enter", "progress.finalize"]);
    let sessionsQuery = context.supabase
      .from("progress_monitoring_sessions")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("session_date", { ascending: false });

    if (options.studentId) sessionsQuery = sessionsQuery.eq("student_id", options.studentId);
    if (options.goalId) sessionsQuery = sessionsQuery.eq("goal_id", options.goalId);

    const [sessionsResult, goalsResult, studentsResult, phasesResult] = await Promise.all([
      sessionsQuery,
      context.supabase
        .from("iep_goals")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("intervention_phases")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
    ]);

    if (sessionsResult.error || goalsResult.error || studentsResult.error || phasesResult.error) {
      return safeDataError(emptyProgress);
    }

    const sessions = sessionsResult.data ?? [];
    const { data: points, error: pointsError } = sessions.length
      ? await context.supabase
          .from("progress_data_points")
          .select("*")
          .in(
            "session_id",
            sessions.map((session) => session.id),
          )
      : { data: [] as ProgressDataPoint[], error: null };

    if (pointsError) return safeDataError(emptyProgress);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        sessions: sessions.map((session) => {
          const dataPoint = points?.find((point) => point.session_id === session.id) ?? null;
          return { ...session, dataPoint, value: valueFromDataPoint(dataPoint) };
        }),
        goals: goalsResult.data ?? [],
        students: studentsResult.data ?? [],
        phases: phasesResult.data ?? [],
        canEnter: permissions["progress.enter"],
        canFinalize: permissions["progress.finalize"],
      },
    };
  } catch {
    return safeDataError(emptyProgress);
  }
}

export type ProgressSessionData = ProgressData & {
  session: ProgressSessionWithValue | null;
};

export async function getProgressSession(
  sessionId: string,
): Promise<DataState<ProgressSessionData>> {
  const progress = await listProgress();
  if (!progress.configured || progress.error) {
    return { ...progress, data: { ...progress.data, session: null } };
  }

  return {
    configured: true,
    data: {
      ...progress.data,
      session: normalizeMaybeSingle(
        progress.data.sessions.find((session) => session.id === sessionId) ?? null,
      ),
    },
  };
}

export function toObservationPoints(sessions: ProgressSessionWithValue[]): ObservationPoint[] {
  return sessions.map((session) => ({
    date: session.session_date,
    value: session.value,
    measurementType: session.measurement_type,
    phaseId: session.intervention_phase_id,
    setting: session.setting,
    promptLevel: session.dataPoint?.prompt_level ?? null,
    status: session.status,
  }));
}

export async function canEnterProgressForStudent(studentId: string): Promise<boolean> {
  const context = await getOrgDataContext();
  if (!context) return false;
  return canEnterProgress(context.supabase, context.organizationId, studentId);
}
