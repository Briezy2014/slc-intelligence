import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  getBehaviorDefinitionTemplate,
  type BehaviorDefinitionTemplate,
} from "@/lib/catalogs/behavior-templates";
import type { CommunicationDraftContext } from "@/lib/catalogs/communication-templates";

/**
 * Parent-facing concern labels — describe the school concern (problem area),
 * never the desired replacement skill. These feed letter subjects/bodies such as
 * “related to {{focusArea}}” / “The concern was {{focusArea}}.”
 */
const FAMILY_CONCERN_LABELS: Record<string, string> = {
  profanity: "use of inappropriate language at school",
  "verbal-threats": "threatening language during conflict",
  "verbal-disruption": "calling out and disrupting instruction",
  "name-calling": "name-calling toward peers or staff",
  "task-refusal": "refusing to start or complete assigned work",
  "work-avoidance-delay": "avoiding or delaying assigned work",
  elopement: "leaving the assigned area without permission",
  "elopement-building": "leaving assigned areas of the building",
  "bolting-transition": "running ahead or leaving the group during transitions",
  "aggression-hit": "physical aggression (hitting)",
  "aggression-kick": "physical aggression (kicking)",
  "aggression-bite": "physical aggression (biting)",
  "aggression-scratch-spit": "physical aggression (scratching or spitting)",
  "aggression-push-shove": "physical aggression (pushing or shoving)",
  "aggression-throw-objects": "throwing objects in an unsafe way",
  "aggression-contact": "unsafe physical contact with others",
  "property-destruction": "damage to classroom materials or property",
  "property-furniture": "unsafe use or damage of classroom furniture",
  "property-slam": "slamming or mishandling materials",
  "self-injury": "self-injurious behavior",
  "self-injury-headbang": "self-injurious behavior",
  "noncompliance-delay": "delayed or incomplete response to adult directions",
  "attention-disruption": "disruptive behavior that interrupts learning",
  "attention-tantrum": "intense frustration responses that interrupt learning",
  "attention-calling-out": "calling out without waiting to be recognized",
  "attention-leave-seat": "leaving the learning area without permission",
  "bullying-physical": "physical peer conflict / bullying concern",
  "sexualized-touch-breasts": "a body-boundary / safe-touch concern",
  "sexualized-touch-buttocks": "a body-boundary / safe-touch concern",
  "sexualized-touch-crotch": "a body-boundary / safe-touch concern",
  "sexualized-self-touch-public": "a body-boundary concern in a public setting",
  "sexualized-exposure": "a body-boundary / privacy concern",
  "sexualized-comments": "inappropriate sexualized comments",
  "sexualized-kiss-hug": "a personal-space / body-boundary concern",
};

const SENSITIVE_BEHAVIOR_IDS = new Set([
  "profanity",
  "verbal-threats",
  "name-calling",
  "self-injury",
  "self-injury-headbang",
  "aggression-hit",
  "aggression-kick",
  "aggression-bite",
  "aggression-scratch-spit",
  "aggression-push-shove",
  "aggression-throw-objects",
  "aggression-contact",
  "sexualized-touch-breasts",
  "sexualized-touch-buttocks",
  "sexualized-touch-crotch",
  "sexualized-self-touch-public",
  "sexualized-exposure",
  "sexualized-comments",
  "sexualized-kiss-hug",
  "bullying-physical",
]);

export function findBehaviorDefinitionForFocus(
  focusArea?: string,
  behaviorTemplateId?: string,
): BehaviorDefinitionTemplate | null {
  if (behaviorTemplateId) {
    return getBehaviorDefinitionTemplate(behaviorTemplateId);
  }
  const needle = focusArea?.trim().toLowerCase();
  if (!needle) return null;
  return (
    BEHAVIOR_DEFINITION_TEMPLATES.find((entry) => entry.name.toLowerCase() === needle) ??
    BEHAVIOR_DEFINITION_TEMPLATES.find(
      (entry) =>
        needle.includes(entry.name.toLowerCase()) || entry.name.toLowerCase().includes(needle),
    ) ??
    null
  );
}

/** Short parent-friendly phrase for letter subjects/bodies (not the staff catalog name). */
export function familyFriendlyConcernLabel(behavior: BehaviorDefinitionTemplate): string {
  if (FAMILY_CONCERN_LABELS[behavior.id]) {
    return FAMILY_CONCERN_LABELS[behavior.id];
  }
  const beforeSlash = behavior.name.split("/")[0]?.trim() || behavior.name;
  return beforeSlash.toLowerCase();
}

export function familyFriendlyBehaviorDescription(behavior: BehaviorDefinitionTemplate): string {
  const concern = familyFriendlyConcernLabel(behavior);
  const includeExample =
    !SENSITIVE_BEHAVIOR_IDS.has(behavior.id) &&
    behavior.category !== "Verbal" &&
    Boolean(behavior.examples[0]?.trim());
  const exampleClause = includeExample
    ? ` Staff observed situations such as: ${behavior.examples[0]!.replace(/\.$/, "")}.`
    : "";
  return `We are writing to share a school concern regarding ${concern}.${exampleClause} Our team is responding with a calm, planned approach that prioritizes safety while we teach a safer or more appropriate way for needs to be met.`;
}

export function familyFriendlyClassroomSupports(behavior: BehaviorDefinitionTemplate): string {
  const strategies = behavior.suggestedStrategies.filter(Boolean).slice(0, 3);
  if (!strategies.length) {
    return "planned prompts, visual supports, practice of replacement skills, and adult check-ins";
  }
  return strategies
    .map((strategy) => strategy.charAt(0).toLowerCase() + strategy.slice(1))
    .join("; ");
}

export function buildCommunicationContextFromBehavior(
  behavior: BehaviorDefinitionTemplate,
  base: CommunicationDraftContext = {},
): CommunicationDraftContext {
  return {
    ...base,
    focusArea: familyFriendlyConcernLabel(behavior),
    behaviorDescription: familyFriendlyBehaviorDescription(behavior),
    classroomSupports: familyFriendlyClassroomSupports(behavior),
    homePartnership:
      "Please share what is working at home so we can stay consistent with language, expectations, and supports.",
  };
}

export function enrichCommunicationDraftContext(
  context: CommunicationDraftContext,
  behaviorTemplateId?: string,
): CommunicationDraftContext {
  const behavior = findBehaviorDefinitionForFocus(context.focusArea, behaviorTemplateId);
  if (!behavior) {
    return {
      ...context,
      behaviorDescription:
        context.behaviorDescription ||
        "We are teaching expected skills, practicing replacement behaviors, and using agreed classroom supports.",
      classroomSupports:
        context.classroomSupports ||
        "planned prompts, visual supports, practice of replacement skills, and adult check-ins",
      homePartnership:
        context.homePartnership ||
        "Please share what is working at home so we can stay consistent with language, expectations, and supports.",
    };
  }
  return buildCommunicationContextFromBehavior(behavior, context);
}
