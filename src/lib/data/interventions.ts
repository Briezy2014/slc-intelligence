import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  BehaviorDefinition,
  FidelityChecklist,
  FidelityChecklistItem,
  FidelityItemResponse,
  FidelityObservation,
  InterventionComponent,
  InterventionDosageLog,
  InterventionLibraryItem,
  InterventionOutcomeLink,
  InterventionPlan,
  InterventionPlanPhase,
  InterventionReviewRecord,
  InterventionSchedule,
  InterventionStaffAssignment,
  InterventionTargetBehavior,
  Student,
} from "@/lib/supabase/types";

export type InterventionData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  behaviorDefinitions: BehaviorDefinition[];
  libraryItems: InterventionLibraryItem[];
  plans: InterventionPlan[];
  components: InterventionComponent[];
  targetBehaviors: InterventionTargetBehavior[];
  staffAssignments: InterventionStaffAssignment[];
  schedules: InterventionSchedule[];
  checklists: FidelityChecklist[];
  checklistItems: FidelityChecklistItem[];
  fidelityObservations: FidelityObservation[];
  fidelityResponses: FidelityItemResponse[];
  dosageLogs: InterventionDosageLog[];
  reviews: InterventionReviewRecord[];
  outcomes: InterventionOutcomeLink[];
  phases: InterventionPlanPhase[];
  permissions: {
    canManageLibrary: boolean;
    canManagePlans: boolean;
    canActivatePlans: boolean;
    canEnterFidelity: boolean;
    canFinalizeFidelity: boolean;
    canEnterDosage: boolean;
    canReview: boolean;
    canRead: boolean;
  };
};

const emptyInterventionData: InterventionData = {
  organizationId: null,
  organizationName: null,
  students: [],
  behaviorDefinitions: [],
  libraryItems: [],
  plans: [],
  components: [],
  targetBehaviors: [],
  staffAssignments: [],
  schedules: [],
  checklists: [],
  checklistItems: [],
  fidelityObservations: [],
  fidelityResponses: [],
  dosageLogs: [],
  reviews: [],
  outcomes: [],
  phases: [],
  permissions: {
    canManageLibrary: false,
    canManagePlans: false,
    canActivatePlans: false,
    canEnterFidelity: false,
    canFinalizeFidelity: false,
    canEnterDosage: false,
    canReview: false,
    canRead: false,
  },
};

export async function listInterventions(
  options: { studentId?: string; planId?: string; libraryItemId?: string } = {},
): Promise<DataState<InterventionData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyInterventionData);

  try {
    const permissions = await getPermissionFlags(context, [
      "intervention.library.manage",
      "intervention.plan.manage",
      "intervention.plan.activate",
      "intervention.fidelity.enter",
      "intervention.fidelity.finalize",
      "intervention.dosage.enter",
      "intervention.review",
      "intervention.read",
    ]);
    let plansQuery = context.supabase
      .from("intervention_plans")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let libraryQuery = context.supabase
      .from("intervention_library_items")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("name");

    if (options.studentId) plansQuery = plansQuery.eq("student_id", options.studentId);
    if (options.planId) plansQuery = plansQuery.eq("id", options.planId);
    if (options.libraryItemId) libraryQuery = libraryQuery.eq("id", options.libraryItemId);

    const [studentsResult, behaviorResult, libraryResult, plansResult] = await Promise.all([
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("behavior_definitions")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      libraryQuery,
      plansQuery,
    ]);

    if (studentsResult.error || behaviorResult.error || libraryResult.error || plansResult.error) {
      return safeDataError(emptyInterventionData);
    }

    const plans = plansResult.data ?? [];
    const planIds = plans.map((plan) => plan.id);
    const [
      componentsResult,
      targetBehaviorsResult,
      staffResult,
      schedulesResult,
      checklistsResult,
      fidelityResult,
      dosageResult,
      reviewsResult,
      outcomesResult,
      phasesResult,
    ] = planIds.length
      ? await Promise.all([
          context.supabase
            .from("intervention_components")
            .select("*")
            .in("plan_id", planIds)
            .order("sort_order"),
          context.supabase.from("intervention_target_behaviors").select("*").in("plan_id", planIds),
          context.supabase
            .from("intervention_staff_assignments")
            .select("*")
            .in("plan_id", planIds),
          context.supabase.from("intervention_schedules").select("*").in("plan_id", planIds),
          context.supabase.from("fidelity_checklists").select("*").in("plan_id", planIds),
          context.supabase
            .from("fidelity_observations")
            .select("*")
            .in("plan_id", planIds)
            .order("observation_date", { ascending: false }),
          context.supabase
            .from("intervention_dosage_logs")
            .select("*")
            .in("plan_id", planIds)
            .order("log_date", { ascending: false }),
          context.supabase
            .from("intervention_review_records")
            .select("*")
            .in("plan_id", planIds)
            .order("review_date", { ascending: false }),
          context.supabase.from("intervention_outcome_links").select("*").in("plan_id", planIds),
          context.supabase
            .from("intervention_plan_phases")
            .select("*")
            .in("plan_id", planIds)
            .order("start_date"),
        ])
      : [
          { data: [] as InterventionComponent[], error: null },
          { data: [] as InterventionTargetBehavior[], error: null },
          { data: [] as InterventionStaffAssignment[], error: null },
          { data: [] as InterventionSchedule[], error: null },
          { data: [] as FidelityChecklist[], error: null },
          { data: [] as FidelityObservation[], error: null },
          { data: [] as InterventionDosageLog[], error: null },
          { data: [] as InterventionReviewRecord[], error: null },
          { data: [] as InterventionOutcomeLink[], error: null },
          { data: [] as InterventionPlanPhase[], error: null },
        ];

    if (
      componentsResult.error ||
      targetBehaviorsResult.error ||
      staffResult.error ||
      schedulesResult.error ||
      checklistsResult.error ||
      fidelityResult.error ||
      dosageResult.error ||
      reviewsResult.error ||
      outcomesResult.error ||
      phasesResult.error
    ) {
      return safeDataError(emptyInterventionData);
    }

    const checklistIds = (checklistsResult.data ?? []).map((checklist) => checklist.id);
    const observationIds = (fidelityResult.data ?? []).map((observation) => observation.id);
    const [itemsResult, responsesResult] = await Promise.all([
      checklistIds.length
        ? context.supabase
            .from("fidelity_checklist_items")
            .select("*")
            .in("checklist_id", checklistIds)
            .order("sort_order")
        : { data: [] as FidelityChecklistItem[], error: null },
      observationIds.length
        ? context.supabase
            .from("fidelity_item_responses")
            .select("*")
            .in("observation_id", observationIds)
        : { data: [] as FidelityItemResponse[], error: null },
    ]);

    if (itemsResult.error || responsesResult.error) return safeDataError(emptyInterventionData);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        behaviorDefinitions: behaviorResult.data ?? [],
        libraryItems: libraryResult.data ?? [],
        plans,
        components: componentsResult.data ?? [],
        targetBehaviors: targetBehaviorsResult.data ?? [],
        staffAssignments: staffResult.data ?? [],
        schedules: schedulesResult.data ?? [],
        checklists: checklistsResult.data ?? [],
        checklistItems: itemsResult.data ?? [],
        fidelityObservations: fidelityResult.data ?? [],
        fidelityResponses: responsesResult.data ?? [],
        dosageLogs: dosageResult.data ?? [],
        reviews: reviewsResult.data ?? [],
        outcomes: outcomesResult.data ?? [],
        phases: phasesResult.data ?? [],
        permissions: {
          canManageLibrary: permissions["intervention.library.manage"],
          canManagePlans: permissions["intervention.plan.manage"],
          canActivatePlans: permissions["intervention.plan.activate"],
          canEnterFidelity: permissions["intervention.fidelity.enter"],
          canFinalizeFidelity: permissions["intervention.fidelity.finalize"],
          canEnterDosage: permissions["intervention.dosage.enter"],
          canReview: permissions["intervention.review"],
          canRead: permissions["intervention.read"],
        },
      },
    };
  } catch {
    return safeDataError(emptyInterventionData);
  }
}
