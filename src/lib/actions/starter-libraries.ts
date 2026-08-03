"use server";

import {
  auditAndRevalidate,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
} from "@/lib/actions/shared";
import { getStarterCatalogCounts } from "@/lib/catalogs";
import { ensureStarterLibrariesForOrganization } from "@/lib/org/ensure-starter-libraries";
import { hasPermission } from "@/lib/permissions/check";

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
    const result = await ensureStarterLibrariesForOrganization({
      supabase: context.supabase,
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      audit: false,
    });

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "starter_libraries.import",
      resourceType: "organization",
      resourceId: context.organizationId,
      newState: {
        imported: result.imported,
        catalogTotals: counts,
        interventions: result.interventions,
        accommodations: result.accommodations,
        executiveFunctionSkills: result.executiveFunctionSkills,
        communicationTemplates: result.communicationTemplates,
        services: result.services,
      },
      paths: [
        "/organization/settings",
        "/interventions",
        "/accommodations",
        "/executive-function",
        "/family-communication",
        "/services",
        "/goals",
        "/progress/enter",
      ],
    });

    if (result.imported === 0) {
      return {
        status: "success",
        message: `Libraries already full (${counts.interventions} interventions, ${counts.accommodations} accommodations, ${counts.executiveFunctionSkills} EF skills, ${counts.communicationTemplates} communication templates, ${counts.services} related services). Goal templates (${counts.goals}) are always available when creating goals.`,
      };
    }

    return {
      status: "success",
      message: `Added ${result.imported} library items. Dropdowns across Interventions, Accommodations, Executive Function, Family Communication, and Services are ready.`,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
