import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  AbcCategoryOption,
  AbcObservation,
  AbcObservationCategoryAssignment,
  BehaviorDefinition,
  BehaviorDefinitionExample,
  BehaviorDefinitionNonexample,
  BehaviorObservationSession,
  DurationObservation,
  FbaEvidenceLink,
  FbaEvidenceWorkspace,
  FrequencyObservation,
  IntensityRating,
  IntensityScaleDefinition,
  IntensityScaleLevel,
  IntervalObservation,
  LatencyObservation,
  OrganizationTimeBlock,
  ReplacementBehaviorDefinition,
  Student,
} from "@/lib/supabase/types";

export type BehaviorData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  definitions: BehaviorDefinition[];
  examples: BehaviorDefinitionExample[];
  nonexamples: BehaviorDefinitionNonexample[];
  replacements: ReplacementBehaviorDefinition[];
  sessions: BehaviorObservationSession[];
  abc: AbcObservation[];
  frequency: FrequencyObservation[];
  duration: DurationObservation[];
  latency: LatencyObservation[];
  interval: IntervalObservation[];
  intensityRatings: IntensityRating[];
  intensityScales: IntensityScaleDefinition[];
  intensityLevels: IntensityScaleLevel[];
  abcCategories: AbcCategoryOption[];
  abcAssignments: AbcObservationCategoryAssignment[];
  timeBlocks: OrganizationTimeBlock[];
  fbaWorkspaces: FbaEvidenceWorkspace[];
  fbaEvidence: FbaEvidenceLink[];
  permissions: {
    canDefine: boolean;
    canObserve: boolean;
    canFinalize: boolean;
    canConfigure: boolean;
    canRead: boolean;
    canManageFba: boolean;
    canReadFba: boolean;
  };
};

const emptyBehaviorData: BehaviorData = {
  organizationId: null,
  organizationName: null,
  students: [],
  definitions: [],
  examples: [],
  nonexamples: [],
  replacements: [],
  sessions: [],
  abc: [],
  frequency: [],
  duration: [],
  latency: [],
  interval: [],
  intensityRatings: [],
  intensityScales: [],
  intensityLevels: [],
  abcCategories: [],
  abcAssignments: [],
  timeBlocks: [],
  fbaWorkspaces: [],
  fbaEvidence: [],
  permissions: {
    canDefine: false,
    canObserve: false,
    canFinalize: false,
    canConfigure: false,
    canRead: false,
    canManageFba: false,
    canReadFba: false,
  },
};

export async function listBehavior(options: { studentId?: string; behaviorId?: string } = {}): Promise<DataState<BehaviorData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyBehaviorData);

  try {
    const permissions = await getPermissionFlags(context, [
      "behavior.define",
      "behavior.observe",
      "behavior.finalize",
      "behavior.configure",
      "behavior.read",
      "fba.manage",
      "fba.read",
    ]);
    let definitionsQuery = context.supabase
      .from("behavior_definitions")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let sessionsQuery = context.supabase
      .from("behavior_observation_sessions")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("session_date", { ascending: false });
    let workspacesQuery = context.supabase
      .from("fba_evidence_workspaces")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });

    if (options.studentId) {
      definitionsQuery = definitionsQuery.eq("student_id", options.studentId);
      sessionsQuery = sessionsQuery.eq("student_id", options.studentId);
      workspacesQuery = workspacesQuery.eq("student_id", options.studentId);
    }
    if (options.behaviorId) {
      definitionsQuery = definitionsQuery.eq("id", options.behaviorId);
      sessionsQuery = sessionsQuery.eq("behavior_definition_id", options.behaviorId);
      workspacesQuery = workspacesQuery.eq("behavior_definition_id", options.behaviorId);
    }

    const [
      studentsResult,
      definitionsResult,
      replacementsResult,
      sessionsResult,
      scalesResult,
      categoriesResult,
      timeBlocksResult,
      workspacesResult,
    ] = await Promise.all([
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      definitionsQuery,
      context.supabase
        .from("replacement_behavior_definitions")
        .select("*")
        .eq("organization_id", context.organizationId),
      sessionsQuery,
      context.supabase
        .from("intensity_scale_definitions")
        .select("*")
        .eq("organization_id", context.organizationId),
      context.supabase
        .from("abc_category_options")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("active", true),
      context.supabase
        .from("organization_time_blocks")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("sort_order"),
      workspacesQuery,
    ]);

    if (
      studentsResult.error ||
      definitionsResult.error ||
      replacementsResult.error ||
      sessionsResult.error ||
      scalesResult.error ||
      categoriesResult.error ||
      timeBlocksResult.error ||
      workspacesResult.error
    ) {
      return safeDataError(emptyBehaviorData);
    }

    const definitions = definitionsResult.data ?? [];
    const definitionIds = definitions.map((definition) => definition.id);
    const sessions = sessionsResult.data ?? [];
    const sessionIds = sessions.map((session) => session.id);
    const scaleIds = (scalesResult.data ?? []).map((scale) => scale.id);
    const workspaceIds = (workspacesResult.data ?? []).map((workspace) => workspace.id);

    const [
      examplesResult,
      nonexamplesResult,
      abcResult,
      frequencyResult,
      durationResult,
      latencyResult,
      intervalResult,
      intensityRatingsResult,
      intensityLevelsResult,
      abcAssignmentsResult,
      fbaEvidenceResult,
    ] = await Promise.all([
      definitionIds.length
        ? context.supabase.from("behavior_definition_examples").select("*").in("behavior_definition_id", definitionIds)
        : { data: [] as BehaviorDefinitionExample[], error: null },
      definitionIds.length
        ? context.supabase.from("behavior_definition_nonexamples").select("*").in("behavior_definition_id", definitionIds)
        : { data: [] as BehaviorDefinitionNonexample[], error: null },
      sessionIds.length ? context.supabase.from("abc_observations").select("*").in("session_id", sessionIds) : { data: [] as AbcObservation[], error: null },
      sessionIds.length ? context.supabase.from("frequency_observations").select("*").in("session_id", sessionIds) : { data: [] as FrequencyObservation[], error: null },
      sessionIds.length ? context.supabase.from("duration_observations").select("*").in("session_id", sessionIds) : { data: [] as DurationObservation[], error: null },
      sessionIds.length ? context.supabase.from("latency_observations").select("*").in("session_id", sessionIds) : { data: [] as LatencyObservation[], error: null },
      sessionIds.length ? context.supabase.from("interval_observations").select("*").in("session_id", sessionIds) : { data: [] as IntervalObservation[], error: null },
      sessionIds.length ? context.supabase.from("intensity_ratings").select("*").in("session_id", sessionIds) : { data: [] as IntensityRating[], error: null },
      scaleIds.length ? context.supabase.from("intensity_scale_levels").select("*").in("scale_id", scaleIds) : { data: [] as IntensityScaleLevel[], error: null },
      sessionIds.length ? context.supabase.from("abc_observation_category_assignments").select("*").in("session_id", sessionIds) : { data: [] as AbcObservationCategoryAssignment[], error: null },
      workspaceIds.length ? context.supabase.from("fba_evidence_links").select("*").in("workspace_id", workspaceIds) : { data: [] as FbaEvidenceLink[], error: null },
    ]);

    if (
      examplesResult.error ||
      nonexamplesResult.error ||
      abcResult.error ||
      frequencyResult.error ||
      durationResult.error ||
      latencyResult.error ||
      intervalResult.error ||
      intensityRatingsResult.error ||
      intensityLevelsResult.error ||
      abcAssignmentsResult.error ||
      fbaEvidenceResult.error
    ) {
      return safeDataError(emptyBehaviorData);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        definitions,
        examples: examplesResult.data ?? [],
        nonexamples: nonexamplesResult.data ?? [],
        replacements: replacementsResult.data ?? [],
        sessions,
        abc: abcResult.data ?? [],
        frequency: frequencyResult.data ?? [],
        duration: durationResult.data ?? [],
        latency: latencyResult.data ?? [],
        interval: intervalResult.data ?? [],
        intensityRatings: intensityRatingsResult.data ?? [],
        intensityScales: scalesResult.data ?? [],
        intensityLevels: intensityLevelsResult.data ?? [],
        abcCategories: categoriesResult.data ?? [],
        abcAssignments: abcAssignmentsResult.data ?? [],
        timeBlocks: timeBlocksResult.data ?? [],
        fbaWorkspaces: workspacesResult.data ?? [],
        fbaEvidence: fbaEvidenceResult.data ?? [],
        permissions: {
          canDefine: permissions["behavior.define"],
          canObserve: permissions["behavior.observe"],
          canFinalize: permissions["behavior.finalize"],
          canConfigure: permissions["behavior.configure"],
          canRead: permissions["behavior.read"],
          canManageFba: permissions["fba.manage"],
          canReadFba: permissions["fba.read"],
        },
      },
    };
  } catch {
    return safeDataError(emptyBehaviorData);
  }
}
