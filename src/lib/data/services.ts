import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  IepCycle,
  ServiceDefinition,
  ServiceDeliveryLog,
  ServiceDeliveryParticipant,
  ServiceExport,
  ServicePlanComponent,
  ServiceReviewRecord,
  ServiceSchedule,
  Student,
  StudentServicePlan,
} from "@/lib/supabase/types";

export type ServiceProviderOption = {
  userId: string;
  label: string;
};

export type ServicesData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  cycles: IepCycle[];
  definitions: ServiceDefinition[];
  plans: StudentServicePlan[];
  components: ServicePlanComponent[];
  schedules: ServiceSchedule[];
  deliveryLogs: ServiceDeliveryLog[];
  participants: ServiceDeliveryParticipant[];
  reviews: ServiceReviewRecord[];
  exports: ServiceExport[];
  providers: ServiceProviderOption[];
  permissions: {
    canManageDefinitions: boolean;
    canManagePlans: boolean;
    canActivatePlans: boolean;
    canEnterLogs: boolean;
    canFinalizeLogs: boolean;
    canRead: boolean;
    canExport: boolean;
  };
};

const emptyServicesData: ServicesData = {
  organizationId: null,
  organizationName: null,
  students: [],
  cycles: [],
  definitions: [],
  plans: [],
  components: [],
  schedules: [],
  deliveryLogs: [],
  participants: [],
  reviews: [],
  exports: [],
  providers: [],
  permissions: {
    canManageDefinitions: false,
    canManagePlans: false,
    canActivatePlans: false,
    canEnterLogs: false,
    canFinalizeLogs: false,
    canRead: false,
    canExport: false,
  },
};

export async function listServices(
  options: { studentId?: string; servicePlanId?: string } = {},
): Promise<DataState<ServicesData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyServicesData);

  try {
    const permissions = await getPermissionFlags(context, [
      "service.definition.manage",
      "service.plan.manage",
      "service.plan.activate",
      "service.log.enter",
      "service.log.finalize",
      "service.read",
      "service.export",
    ]);

    let plansQuery = context.supabase
      .from("student_service_plans")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    if (options.studentId) plansQuery = plansQuery.eq("student_id", options.studentId);
    if (options.servicePlanId) plansQuery = plansQuery.eq("id", options.servicePlanId);

    const [studentsResult, cyclesResult, definitionsResult, plansResult, membershipsResult] =
      await Promise.all([
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
          .from("service_definitions")
          .select("*")
          .eq("organization_id", context.organizationId)
          .order("name"),
        plansQuery,
        context.supabase
          .from("organization_memberships")
          .select("user_id,role_code,status")
          .eq("organization_id", context.organizationId)
          .eq("status", "active"),
      ]);

    if (
      studentsResult.error ||
      cyclesResult.error ||
      definitionsResult.error ||
      plansResult.error ||
      membershipsResult.error
    ) {
      return safeDataError(emptyServicesData);
    }

    const membershipUserIds = Array.from(
      new Set((membershipsResult.data ?? []).map((row) => row.user_id).filter(Boolean)),
    );
    const profilesResult = membershipUserIds.length
      ? await context.supabase
          .from("user_profiles")
          .select("id,display_name,preferred_name,status")
          .in("id", membershipUserIds)
      : { data: [], error: null };
    if (profilesResult.error) return safeDataError(emptyServicesData);

    const profileById = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile]));
    const providers: ServiceProviderOption[] = (membershipsResult.data ?? [])
      .map((membership) => {
        const profile = profileById.get(membership.user_id);
        const label =
          profile?.preferred_name ||
          profile?.display_name ||
          membership.role_code.replaceAll("_", " ");
        return {
          userId: membership.user_id,
          label: `${label} (${membership.role_code.replaceAll("_", " ")})`,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    const planIds = (plansResult.data ?? []).map((plan) => plan.id);
    const [componentsResult, schedulesResult, logsResult, reviewsResult, exportsResult] =
      planIds.length
        ? await Promise.all([
            context.supabase
              .from("service_plan_components")
              .select("*")
              .in("service_plan_id", planIds)
              .order("sort_order"),
            context.supabase.from("service_schedules").select("*").in("service_plan_id", planIds),
            context.supabase
              .from("service_delivery_logs")
              .select("*")
              .in("service_plan_id", planIds)
              .order("service_date", { ascending: false }),
            context.supabase
              .from("service_review_records")
              .select("*")
              .in("service_plan_id", planIds)
              .order("review_date", { ascending: false }),
            context.supabase
              .from("service_exports")
              .select("*")
              .in("service_plan_id", planIds)
              .order("created_at", { ascending: false }),
          ])
        : [
            { data: [] as ServicePlanComponent[], error: null },
            { data: [] as ServiceSchedule[], error: null },
            { data: [] as ServiceDeliveryLog[], error: null },
            { data: [] as ServiceReviewRecord[], error: null },
            { data: [] as ServiceExport[], error: null },
          ];

    if (
      componentsResult.error ||
      schedulesResult.error ||
      logsResult.error ||
      reviewsResult.error ||
      exportsResult.error
    ) {
      return safeDataError(emptyServicesData);
    }

    const logIds = (logsResult.data ?? []).map((log) => log.id);
    const participantsResult = logIds.length
      ? await context.supabase
          .from("service_delivery_participants")
          .select("*")
          .in("delivery_log_id", logIds)
      : { data: [] as ServiceDeliveryParticipant[], error: null };
    if (participantsResult.error) return safeDataError(emptyServicesData);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        cycles: cyclesResult.data ?? [],
        definitions: definitionsResult.data ?? [],
        plans: plansResult.data ?? [],
        components: componentsResult.data ?? [],
        schedules: schedulesResult.data ?? [],
        deliveryLogs: logsResult.data ?? [],
        participants: participantsResult.data ?? [],
        reviews: reviewsResult.data ?? [],
        exports: exportsResult.data ?? [],
        providers,
        permissions: {
          canManageDefinitions: permissions["service.definition.manage"],
          canManagePlans: permissions["service.plan.manage"],
          canActivatePlans: permissions["service.plan.activate"],
          canEnterLogs: permissions["service.log.enter"],
          canFinalizeLogs: permissions["service.log.finalize"],
          canRead: permissions["service.read"],
          canExport: permissions["service.export"],
        },
      },
    };
  } catch {
    return safeDataError(emptyServicesData);
  }
}
