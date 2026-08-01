import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  getBehaviorDefinitionTemplate,
  type BehaviorDefinitionTemplate,
} from "@/lib/catalogs/behavior-templates";
import type { CommunicationDraftContext } from "@/lib/catalogs/communication-templates";

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

export function familyFriendlyBehaviorDescription(behavior: BehaviorDefinitionTemplate): string {
  const example = behavior.examples[0]?.trim();
  const exampleClause = example
    ? ` For example, staff may see situations such as: ${example.replace(/\.$/, "")}.`
    : "";
  return `We are supporting ${behavior.name.toLowerCase()} at school.${exampleClause} We respond with a calm, planned approach and teach a safer or more appropriate way for needs to be met.`;
}

export function familyFriendlyClassroomSupports(behavior: BehaviorDefinitionTemplate): string {
  const strategies = behavior.suggestedStrategies.filter(Boolean).slice(0, 3);
  if (!strategies.length) {
    return "planned prompts, visual supports, practice of replacement skills, and adult check-ins";
  }
  return strategies.join("; ");
}

export function buildCommunicationContextFromBehavior(
  behavior: BehaviorDefinitionTemplate,
  base: CommunicationDraftContext = {},
): CommunicationDraftContext {
  return {
    ...base,
    focusArea: behavior.name.toLowerCase(),
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
