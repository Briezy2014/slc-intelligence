import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  getBehaviorDefinitionTemplate,
  type BehaviorDefinitionTemplate,
} from "@/lib/catalogs/behavior-templates";
import type { CommunicationDraftContext } from "@/lib/catalogs/communication-templates";

/** Parent-facing concern labels — never endorse the problem behavior itself. */
const FAMILY_CONCERN_LABELS: Record<string, string> = {
  profanity: "using school-appropriate language",
  "verbal-threats": "using safe words during conflict",
  "verbal-disruption": "using an expected classroom voice",
  "name-calling": "using kind words with peers and staff",
  "task-refusal": "starting and completing assigned work",
  "work-avoidance-delay": "engaging in assigned work",
  elopement: "staying with the group and in assigned areas",
  "elopement-building": "staying in assigned areas of the building",
  "bolting-transition": "staying with the group during transitions",
  "aggression-hit": "keeping hands safe",
  "aggression-kick": "keeping feet safe",
  "aggression-bite": "keeping body safe around others",
  "aggression-scratch-spit": "keeping body safe around others",
  "aggression-push-shove": "keeping body safe in shared spaces",
  "aggression-throw-objects": "using materials safely",
  "aggression-contact": "keeping hands and body safe",
  "property-destruction": "using materials and classroom items safely",
  "property-furniture": "using classroom furniture safely",
  "property-slam": "handling materials gently",
  "self-injury": "keeping their body safe",
  "self-injury-headbang": "keeping their body safe",
  "noncompliance-delay": "following adult directions",
  "attention-disruption": "participating without interrupting learning",
  "attention-tantrum": "staying calm when frustrated",
  "attention-calling-out": "waiting for a turn to speak",
  "attention-leave-seat": "staying in the learning area",
  "bullying-physical": "treating peers with respect and safety",
  "sexualized-touch-breasts": "respecting body boundaries",
  "sexualized-touch-buttocks": "respecting body boundaries",
  "sexualized-touch-crotch": "respecting body boundaries",
  "sexualized-self-touch-public": "respecting body boundaries in public spaces",
  "sexualized-exposure": "respecting body boundaries",
  "sexualized-comments": "using school-appropriate language",
  "sexualized-kiss-hug": "respecting body boundaries and personal space",
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
    ? ` For example, staff may notice situations such as: ${behavior.examples[0]!.replace(/\.$/, "")}.`
    : "";
  return `We are addressing a school concern related to ${concern}.${exampleClause} We respond with a calm, planned approach and teach a safer or more appropriate way for needs to be met.`;
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
