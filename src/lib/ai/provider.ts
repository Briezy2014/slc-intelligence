import type { AiSuggestInput, AiSuggestion } from "@/lib/ai/types";
import { getAiProviderConfig } from "@/lib/ai/config";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function systemPrompt(): string {
  return [
    "You are SLC Intelligence Assist for specialized learning classroom educators.",
    "Return ONLY valid JSON: {\"suggestions\":[{\"title\":\"\",\"summary\":\"\",\"draftText\":\"\",\"fields\":{},\"rationale\":\"\"}]}",
    "Provide 3 practical, educator-reviewable drafts. No diagnoses, eligibility, placement, or legal conclusions.",
    "Keep language professional, family-appropriate when drafting communications, and clearly draft-quality.",
    "Do not invent student data. Use placeholders when specifics are missing.",
  ].join(" ");
}

function userPrompt(input: AiSuggestInput): string {
  return [
    `Domain: ${input.domain}`,
    `Focus area: ${input.focusArea || "not specified"}`,
    `Student context (minimized): ${input.studentContext || "not specified"}`,
    `Extra notes: ${input.extraNotes || "none"}`,
    "Generate assistive drafts for this domain.",
  ].join("\n");
}

export async function generateModelSuggestions(input: AiSuggestInput): Promise<AiSuggestion[] | null> {
  const config = getAiProviderConfig();
  if (!config.configured) return null;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt() },
    { role: "user", content: userPrompt(input) },
  ];

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as {
      suggestions?: Array<{
        title?: string;
        summary?: string;
        draftText?: string;
        fields?: Record<string, string>;
        rationale?: string;
      }>;
    };

    return (parsed.suggestions ?? []).slice(0, 4).map((suggestion, index) => ({
      id: `model-${input.domain}-${index}`,
      domain: input.domain,
      title: suggestion.title?.trim() || `Suggestion ${index + 1}`,
      summary: suggestion.summary?.trim() || "Model-assisted draft",
      draftText: suggestion.draftText?.trim() || "",
      fields: suggestion.fields ?? {},
      rationale: suggestion.rationale?.trim() || "Generated with model assist for educator review.",
      source: "model_assist" as const,
      requiresReview: true as const,
    })).filter((suggestion) => suggestion.draftText.length > 0);
  } catch {
    return null;
  }
}
