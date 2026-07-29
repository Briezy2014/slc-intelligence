"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  validationError,
} from "@/lib/actions/shared";
import { buildAdministrativeExportCsv, getAdministrativeIntelligence } from "@/lib/data/administrative";
import type { Json } from "@/lib/supabase/types";
import { z } from "zod";

const exportSchema = z.object({
  organizationId: z.string().uuid(),
  schoolId: z.string().uuid().optional(),
  programId: z.string().uuid().optional(),
  classroomId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type AdministrativeExportActionState = ActionState & {
  csv?: string;
};

export async function exportAdministrativeSummaryAction(
  formData: FormData,
): Promise<AdministrativeExportActionState> {
  const parsed = exportSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "admin.export");
  if (!("supabase" in context)) return context;

  try {
    const canExport = await context.supabase.rpc("can_export_admin_intelligence", {
      p_org_id: context.organizationId,
    });
    if (canExport.error || !canExport.data) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const state = await getAdministrativeIntelligence({
      schoolId: values.schoolId,
      programId: values.programId,
      classroomId: values.classroomId,
      startDate: values.startDate,
      endDate: values.endDate,
    });

    if (!state.configured || state.error || !state.data.canRead) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    const filters = {
      schoolId: values.schoolId ?? null,
      programId: values.programId ?? null,
      classroomId: values.classroomId ?? null,
      startDate: state.data.filters.startDate ?? null,
      endDate: state.data.filters.endDate ?? null,
    } satisfies Json;

    const insert = await context.supabase
      .from("administrative_export_events")
      .insert({
        organization_id: context.organizationId,
        exported_by: context.user.id,
        export_type: "summary_csv",
        filters,
        scope_summary: state.data.scopeLabel,
      })
      .select("id")
      .single();

    if (insert.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "administrative_intelligence.export",
      resourceType: "administrative_export_event",
      resourceId: insert.data.id,
      newState: { filters, scope: state.data.scopeLabel },
      paths: ["/administrative-intelligence", "/administrative-intelligence/audit"],
    });

    return {
      status: "success",
      message: "Export generated with privacy suppression applied.",
      csv: buildAdministrativeExportCsv(state.data),
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
