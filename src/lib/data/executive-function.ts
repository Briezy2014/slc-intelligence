import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  ExecutiveFunctionObservation,
  ExecutiveFunctionSkillArea,
  ExecutiveFunctionSupport,
  Student,
  StudentChecklist,
  StudentChecklistItem,
  StudentChecklistResponse,
  StudentExecutiveFunctionPlan,
  StudentSchedule,
  StudentScheduleBlock,
  StudentTaskAssignment,
  TaskAnalysis,
  TaskCompletionLog,
} from "@/lib/supabase/types";

export type ExecutiveFunctionData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  skillAreas: ExecutiveFunctionSkillArea[];
  plans: StudentExecutiveFunctionPlan[];
  supports: ExecutiveFunctionSupport[];
  observations: ExecutiveFunctionObservation[];
  checklists: StudentChecklist[];
  checklistItems: StudentChecklistItem[];
  checklistResponses: StudentChecklistResponse[];
  taskAnalyses: TaskAnalysis[];
  taskAssignments: StudentTaskAssignment[];
  taskLogs: TaskCompletionLog[];
  schedules: StudentSchedule[];
  scheduleBlocks: StudentScheduleBlock[];
  permissions: {
    canManagePlans: boolean;
    canObserve: boolean;
    canRead: boolean;
    canManageChecklists: boolean;
    canRespondChecklists: boolean;
  };
};

const emptyExecutiveFunctionData: ExecutiveFunctionData = {
  organizationId: null,
  organizationName: null,
  students: [],
  skillAreas: [],
  plans: [],
  supports: [],
  observations: [],
  checklists: [],
  checklistItems: [],
  checklistResponses: [],
  taskAnalyses: [],
  taskAssignments: [],
  taskLogs: [],
  schedules: [],
  scheduleBlocks: [],
  permissions: {
    canManagePlans: false,
    canObserve: false,
    canRead: false,
    canManageChecklists: false,
    canRespondChecklists: false,
  },
};

export async function listExecutiveFunction(
  options: { studentId?: string; planId?: string } = {},
): Promise<DataState<ExecutiveFunctionData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyExecutiveFunctionData);

  try {
    const permissions = await getPermissionFlags(context, [
      "ef.plan.manage",
      "ef.observe",
      "ef.read",
      "checklist.manage",
      "checklist.respond",
    ]);

    let plansQuery = context.supabase
      .from("student_executive_function_plans")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let checklistsQuery = context.supabase
      .from("student_checklists")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let schedulesQuery = context.supabase
      .from("student_schedules")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let assignmentsQuery = context.supabase
      .from("student_task_assignments")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });

    if (options.studentId) {
      plansQuery = plansQuery.eq("student_id", options.studentId);
      checklistsQuery = checklistsQuery.eq("student_id", options.studentId);
      schedulesQuery = schedulesQuery.eq("student_id", options.studentId);
      assignmentsQuery = assignmentsQuery.eq("student_id", options.studentId);
    }
    if (options.planId) plansQuery = plansQuery.eq("id", options.planId);

    const [
      studentsResult,
      skillAreasResult,
      plansResult,
      checklistsResult,
      schedulesResult,
      assignmentsResult,
      taskAnalysesResult,
    ] = await Promise.all([
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("executive_function_skill_areas")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      plansQuery,
      checklistsQuery,
      schedulesQuery,
      assignmentsQuery,
      context.supabase
        .from("task_analyses")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
    ]);

    if (
      studentsResult.error ||
      skillAreasResult.error ||
      plansResult.error ||
      checklistsResult.error ||
      schedulesResult.error ||
      assignmentsResult.error ||
      taskAnalysesResult.error
    ) {
      return safeDataError(emptyExecutiveFunctionData);
    }

    const planIds = (plansResult.data ?? []).map((plan) => plan.id);
    const checklistIds = (checklistsResult.data ?? []).map((checklist) => checklist.id);
    const scheduleIds = (schedulesResult.data ?? []).map((schedule) => schedule.id);
    const assignmentIds = (assignmentsResult.data ?? []).map((assignment) => assignment.id);

    const [
      supportsResult,
      observationsResult,
      checklistItemsResult,
      checklistResponsesResult,
      scheduleBlocksResult,
      taskLogsResult,
    ] = await Promise.all([
      planIds.length
        ? context.supabase.from("executive_function_supports").select("*").in("ef_plan_id", planIds)
        : { data: [] as ExecutiveFunctionSupport[], error: null },
      planIds.length
        ? context.supabase
            .from("executive_function_observations")
            .select("*")
            .in("ef_plan_id", planIds)
            .order("observation_date", { ascending: false })
        : { data: [] as ExecutiveFunctionObservation[], error: null },
      checklistIds.length
        ? context.supabase
            .from("student_checklist_items")
            .select("*")
            .in("checklist_id", checklistIds)
            .order("sort_order")
        : { data: [] as StudentChecklistItem[], error: null },
      checklistIds.length
        ? context.supabase
            .from("student_checklist_responses")
            .select("*")
            .in("checklist_id", checklistIds)
            .order("response_date", { ascending: false })
        : { data: [] as StudentChecklistResponse[], error: null },
      scheduleIds.length
        ? context.supabase
            .from("student_schedule_blocks")
            .select("*")
            .in("student_schedule_id", scheduleIds)
            .order("start_time")
        : { data: [] as StudentScheduleBlock[], error: null },
      assignmentIds.length
        ? context.supabase
            .from("task_completion_logs")
            .select("*")
            .in("task_assignment_id", assignmentIds)
            .order("log_date", { ascending: false })
        : { data: [] as TaskCompletionLog[], error: null },
    ]);

    if (
      supportsResult.error ||
      observationsResult.error ||
      checklistItemsResult.error ||
      checklistResponsesResult.error ||
      scheduleBlocksResult.error ||
      taskLogsResult.error
    ) {
      return safeDataError(emptyExecutiveFunctionData);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        skillAreas: skillAreasResult.data ?? [],
        plans: plansResult.data ?? [],
        supports: supportsResult.data ?? [],
        observations: observationsResult.data ?? [],
        checklists: checklistsResult.data ?? [],
        checklistItems: checklistItemsResult.data ?? [],
        checklistResponses: checklistResponsesResult.data ?? [],
        taskAnalyses: taskAnalysesResult.data ?? [],
        taskAssignments: assignmentsResult.data ?? [],
        taskLogs: taskLogsResult.data ?? [],
        schedules: schedulesResult.data ?? [],
        scheduleBlocks: scheduleBlocksResult.data ?? [],
        permissions: {
          canManagePlans: permissions["ef.plan.manage"],
          canObserve: permissions["ef.observe"],
          canRead: permissions["ef.read"],
          canManageChecklists: permissions["checklist.manage"],
          canRespondChecklists: permissions["checklist.respond"],
        },
      },
    };
  } catch {
    return safeDataError(emptyExecutiveFunctionData);
  }
}
