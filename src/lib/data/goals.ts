import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import { canAccessStudent, canManageGoal } from "@/lib/permissions/check";
import type { GoalBaseline, IepCycle, IepGoal, IepObjective, Student } from "@/lib/supabase/types";

export type GoalsData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: IepGoal[];
  students: Student[];
  cycles: IepCycle[];
  canManage: boolean;
};

const emptyGoals: GoalsData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  students: [],
  cycles: [],
  canManage: false,
};

export async function listGoals(studentId?: string): Promise<DataState<GoalsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyGoals);

  try {
    if (studentId) {
      const canRead = await canAccessStudent(context.supabase, context.organizationId, studentId);
      if (!canRead) return safeDataError(emptyGoals, "You are not authorized to view these goals.");
    }

    const permissions = await getPermissionFlags(context, ["goal.manage"]);
    let goalsQuery = context.supabase
      .from("iep_goals")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("created_at", { ascending: false });

    if (studentId) goalsQuery = goalsQuery.eq("student_id", studentId);

    const [goalsResult, studentsResult, cyclesResult] = await Promise.all([
      goalsQuery,
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("iep_cycles")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
    ]);

    if (goalsResult.error || studentsResult.error || cyclesResult.error)
      return safeDataError(emptyGoals);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: goalsResult.data ?? [],
        students: studentsResult.data ?? [],
        cycles: cyclesResult.data ?? [],
        canManage: permissions["goal.manage"],
      },
    };
  } catch {
    return safeDataError(emptyGoals);
  }
}

export type GoalDetailData = GoalsData & {
  goal: IepGoal | null;
  student: Student | null;
  objectives: IepObjective[];
  baselines: GoalBaseline[];
  canManageThisGoal: boolean;
};

export async function getGoal(goalId: string): Promise<DataState<GoalDetailData>> {
  const context = await getOrgDataContext();
  if (!context)
    return emptyDataState({
      ...emptyGoals,
      goal: null,
      student: null,
      objectives: [],
      baselines: [],
      canManageThisGoal: false,
    });

  try {
    const goalResult = await context.supabase
      .from("iep_goals")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("id", goalId)
      .maybeSingle();

    if (goalResult.error) {
      return safeDataError({
        ...emptyGoals,
        goal: null,
        student: null,
        objectives: [],
        baselines: [],
        canManageThisGoal: false,
      });
    }

    const goal = goalResult.data;
    if (!goal) {
      return {
        configured: true,
        data: {
          ...emptyGoals,
          organizationId: context.organizationId,
          organizationName: context.organizationName,
          goal: null,
          student: null,
          objectives: [],
          baselines: [],
          canManageThisGoal: false,
        },
      };
    }

    const canRead = await canAccessStudent(
      context.supabase,
      context.organizationId,
      goal.student_id,
    );
    if (!canRead) {
      return safeDataError(
        {
          ...emptyGoals,
          goal: null,
          student: null,
          objectives: [],
          baselines: [],
          canManageThisGoal: false,
        },
        "You are not authorized to view this goal.",
      );
    }

    const [
      permissions,
      studentResult,
      studentsResult,
      cyclesResult,
      objectivesResult,
      baselinesResult,
    ] = await Promise.all([
      getPermissionFlags(context, ["goal.manage"]),
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("id", goal.student_id)
        .maybeSingle(),
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("iep_cycles")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
      context.supabase
        .from("iep_objectives")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("goal_id", goalId)
        .order("sequence_no"),
      context.supabase
        .from("goal_baselines")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("goal_id", goalId)
        .order("baseline_date", { ascending: false }),
    ]);

    if (
      studentResult.error ||
      studentsResult.error ||
      cyclesResult.error ||
      objectivesResult.error ||
      baselinesResult.error
    ) {
      return safeDataError({
        ...emptyGoals,
        goal: null,
        student: null,
        objectives: [],
        baselines: [],
        canManageThisGoal: false,
      });
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: [goal],
        students: studentsResult.data ?? [],
        cycles: cyclesResult.data ?? [],
        canManage: permissions["goal.manage"],
        goal: normalizeMaybeSingle(goal),
        student: normalizeMaybeSingle(studentResult.data),
        objectives: objectivesResult.data ?? [],
        baselines: baselinesResult.data ?? [],
        canManageThisGoal: await canManageGoal(
          context.supabase,
          context.organizationId,
          goal.student_id,
        ),
      },
    };
  } catch {
    return safeDataError({
      ...emptyGoals,
      goal: null,
      student: null,
      objectives: [],
      baselines: [],
      canManageThisGoal: false,
    });
  }
}
