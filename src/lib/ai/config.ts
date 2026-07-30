/**
 * AI Assist configuration.
 * Kill switch: AI_ASSIST_ENABLED=false disables all assist features.
 * Optional model assist requires AI_API_KEY (OpenAI-compatible Chat Completions).
 */

export function isAiAssistEnabled(): boolean {
  const flag = (
    process.env.AI_ASSIST_ENABLED ??
    process.env.NEXT_PUBLIC_AI_ASSIST_ENABLED ??
    "true"
  )
    .trim()
    .toLowerCase();
  return flag !== "false" && flag !== "0" && flag !== "off";
}

export function getAiProviderConfig():
  { configured: true; apiKey: string; baseUrl: string; model: string } | { configured: false } {
  const apiKey = (process.env.AI_API_KEY ?? "").trim();
  if (!apiKey) return { configured: false };

  const baseUrl = (process.env.AI_API_BASE_URL ?? "https://api.openai.com/v1")
    .trim()
    .replace(/\/$/, "");
  const model = (process.env.AI_MODEL ?? "gpt-4o-mini").trim() || "gpt-4o-mini";
  return { configured: true, apiKey, baseUrl, model };
}

export const AI_DRAFT_DISCLAIMER =
  "AI Assist drafts require educator review. They do not diagnose, determine eligibility/placement, or finalize IEP decisions.";
