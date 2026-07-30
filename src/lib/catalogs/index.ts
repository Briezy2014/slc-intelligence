import { ACCOMMODATION_TEMPLATES } from "@/lib/catalogs/accommodation-templates";
import { COMMUNICATION_TEMPLATES } from "@/lib/catalogs/communication-templates";
import { EF_SKILL_TEMPLATES } from "@/lib/catalogs/ef-skill-templates";
import { GOAL_TEMPLATES } from "@/lib/catalogs/goal-templates";
import { INTERVENTION_TEMPLATES } from "@/lib/catalogs/intervention-templates";
import { getLearningProgressionCounts } from "@/lib/catalogs/learning-progressions";

export * from "@/lib/catalogs/types";
export * from "@/lib/catalogs/goal-templates";
export * from "@/lib/catalogs/intervention-templates";
export * from "@/lib/catalogs/accommodation-templates";
export * from "@/lib/catalogs/ef-skill-templates";
export * from "@/lib/catalogs/communication-templates";
export * from "@/lib/catalogs/learning-progressions";
export * from "@/lib/catalogs/education-document-templates";
export * from "@/lib/catalogs/behavior-templates";

export function getStarterCatalogCounts() {
  const progressions = getLearningProgressionCounts();
  return {
    goals: GOAL_TEMPLATES.length,
    interventions: INTERVENTION_TEMPLATES.length,
    accommodations: ACCOMMODATION_TEMPLATES.length,
    executiveFunctionSkills: EF_SKILL_TEMPLATES.length,
    communicationTemplates: COMMUNICATION_TEMPLATES.length,
    learningProgressions: progressions.nodes,
    total:
      GOAL_TEMPLATES.length +
      INTERVENTION_TEMPLATES.length +
      ACCOMMODATION_TEMPLATES.length +
      EF_SKILL_TEMPLATES.length +
      COMMUNICATION_TEMPLATES.length +
      progressions.nodes,
  };
}
