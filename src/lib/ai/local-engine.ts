import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  GOAL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  applyCommunicationTemplate,
} from "@/lib/catalogs";
import type { AiAssistDomain, AiSuggestInput, AiSuggestion } from "@/lib/ai/types";

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
    case "communication":
      return topScored(
        COMMUNICATION_TEMPLATES,
        (template) =>
          scoreText(
            `${template.name} ${template.subjectTemplate} ${template.bodyTemplate}`,
            needle,
          ),
        4,
      ).map(({ item }, index) => {
        const draft = applyCommunicationTemplate(item, {
          focusArea: input.focusArea || "the current instructional focus",
          studentFirstName: "the student",
          contactFirstName: "there",
          staffName: "SLC Intelligence team",
        });
        return {
          id: `local-communication-${item.id}-${index}`,
          domain,
          title: item.name,
          summary: "Family communication draft based on starter intelligence templates.",
          draftText: `${draft.subject}\n\n${draft.summary}`,
          fields: {
            subject: draft.subject,
            summary: draft.summary,
            visibility: draft.visibility,
            method: draft.method,
          },
          rationale: "Matched communication templates to your focus area and context.",
          source: "local_intelligence",
          requiresReview: true,
        };
      });

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
        draftText: `${item.description}\n\nImplementation notes: ${item.defaultImplementationNotes}`,
        fields: {
          name: item.name,
          accommodationArea: item.accommodationArea,
          description: item.description,
          title: item.name,
        },
        rationale: "Ranked accommodation library intelligence for the stated focus.",
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
  ];
}
