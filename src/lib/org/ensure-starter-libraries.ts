import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  SERVICE_TEMPLATES,
  getStarterCatalogCounts,
} from "@/lib/catalogs";
import { writeAuditEvent } from "@/lib/audit/log";
import type { Database } from "@/lib/supabase/types";

type DbClient = SupabaseClient<Database>;

async function existingNames(
  supabase: DbClient,
  organizationId: string,
  table:
    | "intervention_library_items"
    | "accommodation_library_items"
    | "executive_function_skill_areas"
    | "communication_templates"
    | "service_definitions",
) {
  const { data, error } = await supabase
    .from(table)
    .select("name")
    .eq("organization_id", organizationId);
  if (error || !data) return new Set<string>();
  return new Set(data.map((row) => row.name));
}

/**
 * Idempotently fill org libraries from code catalogs.
 * Safe to call on every page load — only inserts missing names.
 */
export async function ensureStarterLibrariesForOrganization(args: {
  supabase: DbClient;
  organizationId: string;
  actorUserId: string;
  audit?: boolean;
}): Promise<{
  imported: number;
  interventions: number;
  accommodations: number;
  executiveFunctionSkills: number;
  communicationTemplates: number;
  services: number;
}> {
  const { supabase, organizationId, actorUserId } = args;
  const counts = getStarterCatalogCounts();

  const [interventionNames, accommodationNames, efNames, communicationNames, serviceNames] =
    await Promise.all([
      existingNames(supabase, organizationId, "intervention_library_items"),
      existingNames(supabase, organizationId, "accommodation_library_items"),
      existingNames(supabase, organizationId, "executive_function_skill_areas"),
      existingNames(supabase, organizationId, "communication_templates"),
      existingNames(supabase, organizationId, "service_definitions"),
    ]);

  // Fast path: catalogs already fully present.
  if (
    interventionNames.size >= INTERVENTION_TEMPLATES.length &&
    accommodationNames.size >= ACCOMMODATION_TEMPLATES.length &&
    efNames.size >= EF_SKILL_TEMPLATES.length &&
    communicationNames.size >= COMMUNICATION_TEMPLATES.length &&
    serviceNames.size >= SERVICE_TEMPLATES.length
  ) {
    return {
      imported: 0,
      interventions: 0,
      accommodations: 0,
      executiveFunctionSkills: 0,
      communicationTemplates: 0,
      services: 0,
    };
  }

  const interventions = INTERVENTION_TEMPLATES.filter(
    (item) => !interventionNames.has(item.name),
  ).map((item) => ({
    organization_id: organizationId,
    name: item.name,
    category: item.category,
    description: item.description,
    evidence_level: item.evidenceLevel,
    status: "active" as const,
    created_by: actorUserId,
  }));

  const accommodations = ACCOMMODATION_TEMPLATES.filter(
    (item) => !accommodationNames.has(item.name),
  ).map((item) => ({
    organization_id: organizationId,
    name: item.name,
    accommodation_area: item.accommodationArea,
    description: item.description,
    default_implementation_notes: item.defaultImplementationNotes,
    status: "active" as const,
    created_by: actorUserId,
  }));

  const efSkills = EF_SKILL_TEMPLATES.filter((item) => !efNames.has(item.name)).map((item) => ({
    organization_id: organizationId,
    name: item.name,
    description: item.description,
    active: true,
    created_by: actorUserId,
  }));

  const communications = COMMUNICATION_TEMPLATES.filter(
    (item) => !communicationNames.has(item.name),
  ).map((item) => ({
    organization_id: organizationId,
    name: item.name,
    default_visibility: item.defaultVisibility,
    method: item.method,
    subject_template: item.subjectTemplate,
    body_template: item.bodyTemplate,
    active: true,
    created_by: actorUserId,
  }));

  const services = SERVICE_TEMPLATES.filter((item) => !serviceNames.has(item.name)).map((item) => ({
    organization_id: organizationId,
    name: item.name,
    service_area: item.serviceArea,
    description: item.description,
    default_delivery_type: item.defaultDeliveryType,
    status: "active" as const,
    created_by: actorUserId,
  }));

  if (interventions.length) {
    const { error } = await supabase.from("intervention_library_items").insert(interventions);
    if (error) throw error;
  }
  if (accommodations.length) {
    const { error } = await supabase.from("accommodation_library_items").insert(accommodations);
    if (error) throw error;
  }
  if (efSkills.length) {
    const { error } = await supabase.from("executive_function_skill_areas").insert(efSkills);
    if (error) throw error;
  }
  if (communications.length) {
    const { error } = await supabase.from("communication_templates").insert(communications);
    if (error) throw error;
  }
  if (services.length) {
    const { error } = await supabase.from("service_definitions").insert(services);
    if (error) throw error;
  }

  const imported =
    interventions.length +
    accommodations.length +
    efSkills.length +
    communications.length +
    services.length;

  if (imported > 0 && args.audit !== false) {
    await writeAuditEvent({
      organizationId,
      actorUserId,
      actionType: "starter_libraries.ensure",
      resourceType: "organization",
      resourceId: organizationId,
      newState: {
        imported,
        catalogTotals: counts,
        interventions: interventions.length,
        accommodations: accommodations.length,
        executiveFunctionSkills: efSkills.length,
        communicationTemplates: communications.length,
        services: services.length,
      },
    });
  }

  return {
    imported,
    interventions: interventions.length,
    accommodations: accommodations.length,
    executiveFunctionSkills: efSkills.length,
    communicationTemplates: communications.length,
    services: services.length,
  };
}
