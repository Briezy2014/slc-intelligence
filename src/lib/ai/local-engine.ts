import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  GOAL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  applyCommunicationTemplate,
} from "@/lib/catalogs";
import {
  enrichCommunicationDraftContext,
  findBehaviorDefinitionForFocus,
} from "@/lib/catalogs/behavior-communication";
import { BEHAVIOR_DEFINITION_TEMPLATES } from "@/lib/catalogs/behavior-templates";
import { mapDocumentTextToFields } from "@/lib/documents/map-document-text";
import type { AiAssistDomain, AiSuggestInput, AiSuggestion } from "@/lib/ai/types";
import type { EducationDocumentType } from "@/lib/supabase/types";

function tokens(value: string | undefined): string[] {
  return (value ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function scoreText(haystack: string, needleTokens: string[]): number {
  if (!needleTokens.length) return 1;
  const hay = haystack.toLowerCase();
  return needleTokens.reduce((score, token) => score + (hay.includes(token) ? 2 : 0), 0);
}

function topScored<T>(
  items: T[],
  scoreFn: (item: T) => number,
  limit: number,
): Array<{ item: T; score: number }> {
  return items
    .map((item) => ({ item, score: scoreFn(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function contextBlob(input: AiSuggestInput): string {
  return [input.focusArea, input.studentContext, input.extraNotes].filter(Boolean).join(" ");
}

export function buildLocalSuggestions(input: AiSuggestInput): AiSuggestion[] {
  const needle = tokens(contextBlob(input));
  const domain = input.domain;

  switch (domain) {
    case "communication": {
      const matchedBehavior = findBehaviorDefinitionForFocus(
        input.focusArea,
        input.behaviorTemplateId,
      );
      const focusArea =
        matchedBehavior?.name.toLowerCase() ||
        input.focusArea?.trim() ||
        "the current support focus";
      const studentFirstName =
        input.studentFirstName?.trim() ||
        input.studentContext?.trim().split(/\s+/)[0] ||
        "your student";
      const draftContext = enrichCommunicationDraftContext(
        {
          focusArea,
          studentFirstName,
          contactFirstName: input.contactFirstName?.trim() || "family",
          staffName: "SLC Intelligence team",
        },
        matchedBehavior?.id ?? input.behaviorTemplateId,
      );
      const behaviorBoostTokens = matchedBehavior
        ? tokens(
            `${matchedBehavior.name} ${matchedBehavior.category} behavior support incident safety boundary bus`,
          )
        : [];
      return topScored(
        COMMUNICATION_TEMPLATES,
        (template) => {
          const base = scoreText(
            `${template.name} ${template.subjectTemplate} ${template.bodyTemplate}`,
            needle.length ? needle : behaviorBoostTokens,
          );
          const behaviorTemplateBoost =
            matchedBehavior && template.id.startsWith("behavior")
              ? 8
              : matchedBehavior && (template.id.includes("bus") || template.id.includes("bully"))
                ? 4
                : 0;
          return base + behaviorTemplateBoost;
        },
        4,
      ).map(({ item }, index) => {
        const draft = applyCommunicationTemplate(item, draftContext);
        return {
          id: `local-communication-${item.id}-${index}`,
          domain,
          title: item.name,
          summary: matchedBehavior
            ? `Family letter draft for specific behavior: ${matchedBehavior.name}.`
            : "Family communication draft based on starter intelligence templates.",
          draftText: `${draft.subject}\n\n${draft.summary}`,
          fields: {
            subject: draft.subject,
            summary: draft.summary,
            visibility: draft.visibility,
            method: draft.method,
            focusArea,
            behaviorTemplateId: matchedBehavior?.id ?? "",
          },
          rationale: matchedBehavior
            ? `Used the selected behavior (${matchedBehavior.name}) with parent-friendly supports from the behavior catalog.`
            : "Matched communication templates to your focus area and context.",
          source: "local_intelligence",
          requiresReview: true,
        };
      });
    }

    case "accommodation":
      return topScored(
        ACCOMMODATION_TEMPLATES,
        (template) =>
          scoreText(
            `${template.name} ${template.accommodationArea} ${template.description}`,
            needle,
          ),
        5,
      ).map(({ item }, index) => ({
        id: `local-accommodation-${item.id}-${index}`,
        domain,
        title: item.name,
        summary: item.accommodationArea,
        draftText: item.description,
        fields: {
          name: item.name,
          category: item.accommodationArea,
          description: item.description,
          implementationNotes: item.defaultImplementationNotes,
        },
        rationale: "Suggested accommodations aligned to your focus area.",
        source: "local_intelligence",
        requiresReview: true,
      }));

    case "intervention":
      return topScored(
        INTERVENTION_TEMPLATES,
        (template) =>
          scoreText(`${template.name} ${template.category} ${template.description}`, needle),
        5,
      ).map(({ item }, index) => ({
        id: `local-intervention-${item.id}-${index}`,
        domain,
        title: item.name,
        summary: `${item.category} · ${item.evidenceLevel.replaceAll("_", " ")}`,
        draftText: item.description,
        fields: {
          name: item.name,
          category: item.category,
          description: item.description,
          title: item.name,
          evidenceLevel: item.evidenceLevel,
        },
        rationale: "Suggested intervention approaches aligned to your focus area.",
        source: "local_intelligence",
        requiresReview: true,
      }));

    case "goal":
      return topScored(
        GOAL_TEMPLATES,
        (template) => scoreText(`${template.area} ${template.statement}`, needle),
        5,
      ).map(({ item }, index) => ({
        id: `local-goal-${item.id}-${index}`,
        domain,
        title: item.area,
        summary: `${item.measurementType.replaceAll("_", " ")} · target ${item.targetDirection}`,
        draftText: item.statement,
        fields: {
          goalArea: item.area,
          goalStatement: item.statement,
          measurementType: item.measurementType,
          targetDirection: item.targetDirection,
          targetValue: item.targetValue == null ? "" : String(item.targetValue),
        },
        rationale: "Goal language drafted from the SLC starter goal intelligence set.",
        source: "local_intelligence",
        requiresReview: true,
      }));

    case "executive_function":
      return topScored(
        EF_SKILL_TEMPLATES,
        (template) => scoreText(`${template.name} ${template.description}`, needle),
        5,
      ).map(({ item }, index) => ({
        id: `local-ef-${item.id}-${index}`,
        domain,
        title: item.name,
        summary: "Executive function skill focus",
        draftText: `${item.name}: ${item.description}`,
        fields: {
          title: `${item.name} support plan`,
          skillName: item.name,
          description: item.description,
        },
        rationale: "Matched EF skill areas to the described need.",
        source: "local_intelligence",
        requiresReview: true,
      }));

    case "progress":
      return [
        {
          id: "local-progress-1",
          domain,
          title: "Progress monitoring prompt set",
          summary: "Suggested measurement focus for the next rapid progress session",
          draftText: [
            `Focus: ${input.focusArea || "current IEP goal"}`,
            "1. Confirm the measurement type matches the goal.",
            "2. Collect the minimum probes needed for a reliable trend.",
            "3. Note setting/activity so comparisons stay fair.",
            "4. Mark draft until educator review is complete.",
          ].join("\n"),
          fields: {
            activity: input.focusArea || "Goal practice",
            notes: `AI Assist suggested focus: ${input.focusArea || "current IEP goal"}`,
          },
          rationale: "Operational checklist generated from progress-monitoring practice.",
          source: "local_intelligence",
          requiresReview: true,
        },
      ];

    case "education_document": {
      const documentType: EducationDocumentType =
        input.focusArea === "etr"
          ? "etr"
          : input.focusArea === "progress_report"
            ? "progress_report"
            : "iep";
      const sourceText = input.extraNotes || input.studentContext || "";
      const fields = mapDocumentTextToFields(documentType, sourceText);
      const filled = Object.keys(fields).length;
      return [
        {
          id: `local-education-document-${documentType}`,
          domain,
          title: `Populate ${documentType.toUpperCase()} draft fields`,
          summary:
            filled > 0
              ? `Mapped ${filled} field(s) from the pasted document text.`
              : "No clear section labels found — model assist can enrich when AI_API_KEY is set.",
          draftText:
            filled > 0
              ? Object.entries(fields)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")
              : "Paste more of the IEP/ETR text (present levels, goals, services) and run again.",
          fields,
          rationale:
            "Local extraction looks for common IEP/ETR section labels. Always review before team use.",
          source: "local_intelligence",
          requiresReview: true,
        },
      ];
    }

    case "behavior":
      return topScored(
        BEHAVIOR_DEFINITION_TEMPLATES,
        (template) =>
          scoreText(
            `${template.name} ${template.category} ${template.operationalDefinition}`,
            needle,
          ),
        5,
      ).map(({ item }, index) => ({
        id: `local-behavior-${item.id}-${index}`,
        domain,
        title: item.name,
        summary: item.category,
        draftText: item.operationalDefinition,
        fields: {
          name: item.name,
          operationalDefinition: item.operationalDefinition,
          examples: item.examples.join("\n"),
          nonexamples: item.nonexamples.join("\n"),
        },
        rationale: `Suggested strategies: ${item.suggestedStrategies.join("; ")}`,
        source: "local_intelligence",
        requiresReview: true,
      }));

    case "lesson_plan": {
      const focus = input.focusArea || "the current instructional focus";
      const context = input.studentContext || "specialized learning classroom";
      const drafts = [
        {
          title: `Explicit instruction lesson · ${focus}`,
          summary: "I do / We do / You do lesson frame with scaffolds.",
          draftText: [
            `Lesson focus: ${focus}`,
            `Setting: ${context}`,
            "",
            "Objective: Students will practice the target skill with decreasing prompts.",
            "Warm-up (3–5 min): Activate prior knowledge with a quick visual/example.",
            "I do: Model the skill with clear language and think-alouds.",
            "We do: Guided practice with prompt hierarchy and error correction.",
            "You do: Independent/paired practice with accommodations as needed.",
            "Closure: Students show one example of the skill; note data for progress monitoring.",
            "Materials: Visual supports, manipulatives, data sheet.",
          ].join("\n"),
        },
        {
          title: `Stations / rotation lesson · ${focus}`,
          summary: "Small-group rotation plan with adult-led and independent work.",
          draftText: [
            `Lesson focus: ${focus}`,
            `Setting: ${context}`,
            "",
            "Station 1 (teacher-led): Targeted instruction with modeling and choral response.",
            "Station 2 (para/support): Structured practice with visual checklist.",
            "Station 3 (independent/technology): Fluency or maintenance task with clear finished criteria.",
            "Data: Collect 3–5 trials on accuracy/independence during teacher-led station.",
            "Differentiation: Adjust prompt level, response mode, and time.",
          ].join("\n"),
        },
        {
          title: `Functional / routines lesson · ${focus}`,
          summary: "Routine-based instruction for functional skill application.",
          draftText: [
            `Lesson focus: ${focus}`,
            `Setting: ${context}`,
            "",
            "Routine context: Embed skill practice in a meaningful classroom routine.",
            "Pre-teach: Preview vocabulary, visuals, and expected behavior.",
            "Practice: Use task analysis steps with least-to-most prompting.",
            "Generalization: Practice in a second setting or with a second adult.",
            "Family connection: Optional one-sentence home practice suggestion.",
          ].join("\n"),
        },
      ];
      return drafts.map((draft, index) => ({
        id: `local-lesson-plan-${index}`,
        domain,
        title: draft.title,
        summary: draft.summary,
        draftText: draft.draftText,
        fields: {
          focusArea: focus,
          lessonPlan: draft.draftText,
        },
        rationale: "Local lesson-planning frames for specialized learning classroom instruction.",
        source: "local_intelligence" as const,
        requiresReview: true as const,
      }));
    }

    default:
      return [];
  }
}

export function domainsSupported(): AiAssistDomain[] {
  return [
    "communication",
    "accommodation",
    "intervention",
    "goal",
    "executive_function",
    "progress",
    "education_document",
    "behavior",
    "lesson_plan",
  ];
}
