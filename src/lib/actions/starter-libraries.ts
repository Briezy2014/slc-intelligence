"use server";

import {
  auditAndRevalidate,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionContext,
  type ActionState,
} from "@/lib/actions/shared";
import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  getStarterCatalogCounts,
} from "@/lib/catalogs";
import { hasPermission } from "@/lib/permissions/check";
import { UNAUTHORIZED_ACTION_MESSAGE } from "@/lib/actions/shared";

async function existingNames(
  context: ActionContext,
  table:
    | "intervention_library_items"
    | "accommodation_library_items"
    | "executive_function_skill_areas"
    | "communication_templates",
) {
  const { data, error } = await context.supabase.from(table).select("name").eq("organization_id", context.organizationId);
  if (error || !data) return new Set<string>();
  return new Set(data.map((row) => row.name));
}

export async function importStarterLibrariesAction(formData: FormData): Promise<ActionState> {
  const organizationId = String(formData.get("organizationId") ?? "");
  if (!organizationId) {
    return { status: "error", message: "Organization is required." };
  }

  const context = await getActionContext(organizationId);
  if (!("supabase" in context)) return context;

  const allowed =
    (await hasPermission(context.supabase, context.organizationId, "org.members.manage")) ||
    (await hasPermission(context.supabase, context.organizationId, "intervention.library.manage"));

  if (!allowed) {
    return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
  }

  try {
    const counts = getStarterCatalogCounts();
    const [interventionNames, accommodationNames, efNames, communicationNames] = await Promise.all([
      existingNames(context, "intervention_library_items"),
      existingNames(context, "accommodation_library_items"),
      existingNames(context, "executive_function_skill_areas"),
      existingNames(context, "communication_templates"),
    ]);

    const interventions = INTERVENTION_TEMPLATES.filter((item) => !interventionNames.has(item.name)).map((item) => ({
      organization_id: context.organizationId,
      name: item.name,
      category: item.category,
      description: item.description,
      evidence_level: item.evidenceLevel,
      status: "active" as const,
      created_by: context.user.id,
    }));

    const accommodations = ACCOMMODATION_TEMPLATES.filter((item) => !accommodationNames.has(item.name)).map((item) => ({
      organization_id: context.organizationId,
      name: item.name,
      accommodation_area: item.accommodationArea,
      description: item.description,
      default_implementation_notes: item.defaultImplementationNotes,
      status: "active" as const,
      created_by: context.user.id,
    }));

    const efSkills = EF_SKILL_TEMPLATES.filter((item) => !efNames.has(item.name)).map((item) => ({
      organization_id: context.organizationId,
      name: item.name,
      description: item.description,
      active: true,
      created_by: context.user.id,
    }));

    const communications = COMMUNICATION_TEMPLATES.filter((item) => !communicationNames.has(item.name)).map((item) => ({
      organization_id: context.organizationId,
      name: item.name,
      default_visibility: item.defaultVisibility,
      method: item.method,
      subject_template: item.subjectTemplate,
      body_template: item.bodyTemplate,
      active: true,
      created_by: context.user.id,
    }));

    if (interventions.length) {
      const { error } = await context.supabase.from("intervention_library_items").insert(interventions);
      if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }
    if (accommodations.length) {
      const { error } = await context.supabase.from("accommodation_library_items").insert(accommodations);
      if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }
    if (efSkills.length) {
      const { error } = await context.supabase.from("executive_function_skill_areas").insert(efSkills);
      if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }
    if (communications.length) {
      const { error } = await context.supabase.from("communication_templates").insert(communications);
      if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    const imported =
      interventions.length + accommodations.length + efSkills.length + communications.length;

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "starter_libraries.import",
      resourceType: "organization",
      resourceId: context.organizationId,
      newState: {
        imported,
        catalogTotals: counts,
        interventions: interventions.length,
        accommodations: accommodations.length,
        executiveFunctionSkills: efSkills.length,
        communicationTemplates: communications.length,
      },
      paths: [
        "/organization/settings",
        "/interventions",
        "/accommodations",
        "/executive-function",
        "/family-communication",
        "/goals",
        "/progress/enter",
      ],
    });

    if (imported === 0) {
      return {
        status: "success",
        message: `Starter libraries already loaded. Goal starter templates (${counts.goals}) are always available when creating goals.`,
      };
    }

    return {
      status: "success",
      message: `Imported ${imported} starter library items. Goal templates (${counts.goals}) are available on the student Goals page.`,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
