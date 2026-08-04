import { getAiProviderConfig } from "@/lib/ai/config";

/**
 * Optional OpenAI image generation for worksheet theme visuals.
 * Uses AI_API_KEY (same as text). Falls back silently when unavailable.
 */

function imageModel(): string {
  return (process.env.AI_IMAGE_MODEL ?? "gpt-image-1").trim() || "gpt-image-1";
}

export async function generateThemeImageDataUrl(input: {
  subject: string;
  topicOrSkill: string;
  theme?: string;
}): Promise<string | null> {
  const config = getAiProviderConfig();
  if (!config.configured) return null;

  const theme = input.theme?.trim() || "friendly classroom";
  const prompt = [
    "Create a clean, colorful educational illustration for a special education worksheet.",
    "Style: bold shapes, high contrast, simple background, child-friendly but age-respectful for older students,",
    "no text, no letters, no watermarks, no logos, no realistic faces of real people.",
    `Subject: ${input.subject}.`,
    `Skill focus: ${input.topicOrSkill}.`,
    `Theme: ${theme}.`,
    "Single clear focal image suitable for printing in color or grayscale.",
  ].join(" ");

  try {
    const response = await fetch(`${config.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: imageModel(),
        prompt,
        n: 1,
        size: "1024x1024",
        // gpt-image-1 returns b64; dall-e-3 may ignore this and return url.
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      // Retry with dall-e-3 URL mode for keys that don't support gpt-image-1.
      return await generateDalle3UrlAsDataUrl(config.baseUrl, config.apiKey, prompt);
    }

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const first = payload.data?.[0];
    if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
    if (first?.url) return await fetchImageAsDataUrl(first.url);
    return null;
  } catch {
    return null;
  }
}

async function generateDalle3UrlAsDataUrl(
  baseUrl: string,
  apiKey: string,
  prompt: string,
): Promise<string | null> {
  try {
    const response = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      data?: Array<{ url?: string; b64_json?: string }>;
    };
    const first = payload.data?.[0];
    if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
    if (first?.url) return await fetchImageAsDataUrl(first.url);
    return null;
  } catch {
    return null;
  }
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/png";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function aiImageMarker(id: string): string {
  return `[[AIIMAGE:${id}]]`;
}

export function replaceAiImageMarkers(
  text: string,
  assets: Record<string, string> | undefined,
): string {
  if (!assets) return text.replace(/\[\[AIIMAGE:[^\]]+\]\]/gi, "");
  return text.replace(/\[\[AIIMAGE:([a-z0-9_-]+)\]\]/gi, (_match, id: string) => {
    const src = assets[id];
    if (!src) return "";
    return `<figure class="visual visual-photo" role="img" aria-label="Theme illustration">
<img src="${src}" alt="Theme illustration" width="420" height="420" style="width:min(100%,420px);height:auto;border-radius:12px;border:1px solid #333;display:block;background:#fff"/>
</figure>`;
  });
}
