import { AI_DRAFT_DISCLAIMER, isAiAssistEnabled } from "@/lib/ai/config";
import { buildLocalSuggestions } from "@/lib/ai/local-engine";
import { generateModelSuggestions } from "@/lib/ai/provider";
import type { AiSuggestInput, AiSuggestResult } from "@/lib/ai/types";

export async function suggestWithAiAssist(input: AiSuggestInput): Promise<AiSuggestResult> {
  if (!isAiAssistEnabled()) {
    return {
      enabled: false,
      mode: "disabled",
      disclaimer: AI_DRAFT_DISCLAIMER,
      suggestions: [],
      message: "AI Assist is disabled by the platform kill switch.",
    };
  }

  const local = buildLocalSuggestions(input);
  const model = await generateModelSuggestions(input);

  if (model && model.length > 0) {
    return {
      enabled: true,
      mode: "model_assist",
      disclaimer: AI_DRAFT_DISCLAIMER,
      suggestions: [...model, ...local].slice(0, 6),
    };
  }

  return {
    enabled: true,
    mode: "local_intelligence",
    disclaimer: AI_DRAFT_DISCLAIMER,
    suggestions: local,
    message: model === null
      ? "Using SLC local intelligence. Add AI_API_KEY for optional model-enriched drafts."
      : undefined,
  };
}
