import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  GOAL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  applyCommunicationTemplate,
} from "@/lib/catalogs";
import { getEducationDocumentTemplate } from "@/lib/catalogs/education-document-templates";
import { BEHAVIOR_DEFINITION_TEMPLATES } from "@/lib/catalogs/behavior-templates";
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

function extractFieldFromText(text: string, labels: string[]): string {
  const lower = text.toLowerCase();
  for (const label of labels) {
    const idx = lower.indexOf(label.toLowerCase());
    if (idx < 0) continue;
    const slice = text.slice(idx + label.length).replace(/^[\s:.\-–—]+/, "");
    const line = slice.split(/\n+/)[0]?.trim() ?? "";
    if (line.length > 3) return line.slice(0, 1200);
  }
  return "";
}

function buildEducationDocumentFields(
  documentType: EducationDocumentType,
  sourceText: string,
): Record<string, string> {
  const template = getEducationDocumentTemplate(documentType);
  const fields: Record<string, string> = {};
  for (const section of template.sections) {
    for (const field of section.fields) {
      const extracted = extractFieldFromText(sourceText, [field.label, field.key]);
      if (extracted) fields[field.key] = extracted;
    }
  }
  if (!fields.strengths) {
    fields.strengths = extractFieldFromText(sourceText, ["strengths", "student strengths"]);
  }
  if (!fields.needs) {
    fields.needs = extractFieldFromText(sourceText, ["needs", "areas of need", "present levels"]);
  }
  if (!fields.goalSummary) {
    fields.goalSummary = extractFieldFromText(sourceText, [
      "annual goals",
      "goals",
      "measurable annual goals",
    ]);
  }
  if (!fields.howDisabilityAffects) {
    fields.howDisabilityAffects = extractFieldFromText(sourceText, [
      "how the disability affects",
      "effect of the disability",
      "impact on involvement",
    ]);
  }
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value.length > 0));
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
      const fields = buildEducationDocumentFields(documentType, sourceText);
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
  ];
}
