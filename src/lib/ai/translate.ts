import { getAiProviderConfig, isAiAssistEnabled } from "@/lib/ai/config";
import {
  COMMUNICATION_LANGUAGES,
  communicationLanguageLabel,
  getCommunicationLanguage,
} from "@/lib/catalogs/communication-languages";

export type TranslateDraftResult = {
  ok: boolean;
  mode: "model_assist" | "local_passthrough" | "disabled";
  subject: string;
  summary: string;
  languageCode: string;
  message: string;
};

function languageName(code: string): string {
  return getCommunicationLanguage(code)?.name ?? code;
}

async function translateWithModel(args: {
  subject: string;
  summary: string;
  targetLanguageCode: string;
}): Promise<{ subject: string; summary: string } | null> {
  const config = getAiProviderConfig();
  if (!config.configured) return null;

  const target = communicationLanguageLabel(args.targetLanguageCode);
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "You translate school-to-family education letters for educator review.",
              'Return ONLY valid JSON: {"subject":"","summary":""}',
              "Preserve meaning, tone, and placeholders. Do not add legal conclusions.",
              "Do not invent student facts. Keep greeting/sign-off natural for the target language.",
            ].join(" "),
          },
          {
            role: "user",
            content: [
              `Target language: ${target}`,
              `Subject:\n${args.subject}`,
              `Body:\n${args.summary}`,
            ].join("\n\n"),
          },
        ],
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as { subject?: string; summary?: string };
    if (!parsed.subject?.trim() || !parsed.summary?.trim()) return null;
    return { subject: parsed.subject.trim(), summary: parsed.summary.trim() };
  } catch {
    return null;
  }
}

/**
 * Translate a communication draft into one of the supported family languages.
 * Prefers model assist when configured; otherwise tags language and keeps English for staff review.
 */
export async function translateCommunicationDraft(args: {
  subject: string;
  summary: string;
  targetLanguageCode: string;
}): Promise<TranslateDraftResult> {
  const target =
    COMMUNICATION_LANGUAGES.find((language) => language.code === args.targetLanguageCode)?.code ??
    "en";

  if (target === "en") {
    return {
      ok: true,
      mode: "local_passthrough",
      subject: args.subject,
      summary: args.summary,
      languageCode: "en",
      message: "English selected — no translation needed.",
    };
  }

  if (!isAiAssistEnabled()) {
    return {
      ok: false,
      mode: "disabled",
      subject: args.subject,
      summary: args.summary,
      languageCode: target,
      message: "AI Assist is disabled, so automatic translation is unavailable.",
    };
  }

  const model = await translateWithModel({
    subject: args.subject,
    summary: args.summary,
    targetLanguageCode: target,
  });

  if (model) {
    return {
      ok: true,
      mode: "model_assist",
      subject: model.subject,
      summary: model.summary,
      languageCode: target,
      message: `Draft translated to ${languageName(target)} for educator review. Verify accuracy before sending or logging as family-visible.`,
    };
  }

  return {
    ok: false,
    mode: "local_passthrough",
    subject: args.subject,
    summary: args.summary,
    languageCode: target,
    message: `Automatic translation to ${languageName(target)} needs AI Assist (AI_API_KEY). Language is tagged for this draft — paste a human translation or enable model assist.`,
  };
}
