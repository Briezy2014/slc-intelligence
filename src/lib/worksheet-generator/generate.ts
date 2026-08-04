import { getAiProviderConfig } from "@/lib/ai/config";
import { aiImageMarker, generateThemeImageDataUrl } from "@/lib/worksheet-generator/ai-images";
import {
  parsePacketPageCount,
  type WorksheetType,
} from "@/lib/worksheet-generator/options";
import {
  hasVisualMarkers,
  selectVisualIdsForContext,
  visualMarker,
} from "@/lib/worksheet-generator/visuals";

export type WorksheetGeneratorInput = {
  packetTitle: string;
  subject: string;
  topicOrSkill: string;
  learningGoal: string;
  gradeBand: string;
  instructionalLevel: string;
  instructionalLevelCustom?: string;
  differentiationLevel: string;
  differentiationCustom?: string;
  supportNeeds: string[];
  worksheetTypes: WorksheetType[] | string[];
  packetLength: string;
  customPages?: number;
  studentInterestOrTheme?: string;
  printingFormat: string;
  includeAnswerKey: boolean;
  includeProgressMonitoring: boolean;
};

function visualsForPage(input: WorksheetGeneratorInput, pageIndex: number): string {
  const ids = selectVisualIdsForContext({
    topicOrSkill: input.topicOrSkill,
    studentInterestOrTheme: input.studentInterestOrTheme,
    subject: input.subject,
    pageIndex,
  });
  return ids.map((id) => visualMarker(id)).join("\n");
}

export type WorksheetGeneratorResult = {
  title: string;
  content: string;
  pageCount: number;
  mode: "model_assist" | "local_intelligence";
  /** Optional AI-generated theme images (data URLs) keyed by marker id. */
  imageAssets?: Record<string, string>;
};

function resolvedInstructionalLevel(input: WorksheetGeneratorInput): string {
  return input.instructionalLevel === "Custom"
    ? input.instructionalLevelCustom?.trim() || "Custom"
    : input.instructionalLevel;
}

function resolvedDifferentiation(input: WorksheetGeneratorInput): string {
  return input.differentiationLevel === "Custom"
    ? input.differentiationCustom?.trim() || "Custom"
    : input.differentiationLevel;
}

function pageBreak(): string {
  return "\n\n---------- PAGE BREAK ----------\n\n";
}


function buildLocalPacket(input: WorksheetGeneratorInput): WorksheetGeneratorResult {
  const pageCount = parsePacketPageCount(input.packetLength, input.customPages);
  const title =
    input.packetTitle.trim() ||
    `${input.subject} · ${input.topicOrSkill || "Skill practice"}`.trim();
  const instructionalLevel = resolvedInstructionalLevel(input);
  const differentiation = resolvedDifferentiation(input);
  const theme = input.studentInterestOrTheme?.trim() || "everyday classroom examples";
  const types = input.worksheetTypes.length
    ? input.worksheetTypes
    : ["Skill introduction", "Guided practice", "Independent practice", "Answer key"];
  const supports = input.supportNeeds.length
    ? input.supportNeeds.join(", ")
    : "Simplified directions, Visual supports";

  const pages: string[] = [];
  pages.push(
    [
      title,
      `Subject: ${input.subject}`,
      `Topic / skill: ${input.topicOrSkill || "General skill practice"}`,
      `Grade band: ${input.gradeBand}`,
      `Instructional level: ${instructionalLevel}`,
      `Differentiation: ${differentiation}`,
      `Printing format: ${input.printingFormat}`,
      `Theme (age-respectful): ${theme}`,
      `Supports: ${supports}`,
      "",
      "Learning goal:",
      input.learningGoal,
      "",
      "Cover visuals (print/PDF includes drawings):",
      visualsForPage(input, 0),
      "",
      "Teacher directions:",
      "1. Preview vocabulary and visuals.",
      "2. Model one item.",
      "3. Complete guided items together.",
      "4. Assign independent items.",
      "5. Collect data on the goal criterion.",
    ].join("\n"),
  );

  // Dedicated visual support page so packets always include printable drawings.
  pages.push(
    [
      `${title} · Visual supports`,
      "Worksheet type: Visual supports",
      "",
      "Directions: Look at each picture. Name it. Point to or circle the matching item when prompted.",
      "",
      visualsForPage(input, 1),
      "",
      visualsForPage(input, 2),
      "",
      `Theme cue: ${theme}`,
      `Goal check: ${input.learningGoal}`,
    ].join("\n"),
  );

  const contentTypes = types.filter((type) => type !== "Answer key");
  while (pages.length < pageCount) {
    const type = contentTypes[(pages.length - 1) % Math.max(contentTypes.length, 1)] || "Practice";
    const n = pages.length;
    const isMax = differentiation.startsWith("Level 1") || instructionalLevel === "Pre-reader";
    const isMin = differentiation.startsWith("Level 3");

    if (type === "Matching" || type === "Cut and paste" || type === "Picture-supported questions") {
      pages.push(
        [
          `${title} · Page ${n + 1}`,
          `Worksheet type: ${type}`,
          "",
          `Directions: ${isMax ? "Point to or paste the correct answer. Use the pictures." : "Match each item to the correct answer."}`,
          "",
          "Pictures for this page:",
          visualsForPage(input, n),
          "",
          `Theme cue: ${theme}`,
          "",
          "1. _____________  →  (A) _____________",
          "2. _____________  →  (B) _____________",
          "3. _____________  →  (C) _____________",
          "4. _____________  →  (D) _____________",
          isMax ? "\nChoices shown with pictures / reduced options." : "",
          "",
          `Goal check: ${input.learningGoal}`,
                  ].join("\n"),
      );
      continue;
    }

    if (type === "Multiple choice" || type === "Fill in the blank") {
      pages.push(
        [
          `${title} · Page ${n + 1}`,
          `Worksheet type: ${type}`,
          "",
          "Directions: Read each item. Choose or write the best answer.",
          "",
          `1. Related to ${input.topicOrSkill || "the skill"} (${theme} example)`,
          isMax ? "   A) ○   B) ○" : "   A) ______  B) ______  C) ______  D) ______",
          "",
          "2. _______________________________________________",
          isMax ? "   A) ○   B) ○" : "   A) ______  B) ______  C) ______",
          "",
          "3. _______________________________________________",
          type === "Fill in the blank"
            ? "   Answer: ____________________"
            : "   A) ______  B) ______  C) ______",
          "",
          isMin
            ? "4. Explain your answer in one sentence: _______________________________"
            : "4. _______________________________________________",
                  ].join("\n"),
      );
      continue;
    }

    if (
      type === "Reading passage" ||
      type === "Comprehension questions" ||
      type === "Functional scenarios" ||
      type === "Real-world word problems"
    ) {
      pages.push(
        [
          `${title} · Page ${n + 1}`,
          `Worksheet type: ${type}`,
          "",
          `Short ${theme}-themed scenario / passage (age-respectful):`,
          `A student is practicing ${input.topicOrSkill || "the target skill"} during a ${theme} activity.`,
          "Read or listen. Then answer.",
          "",
          "1. What is the main idea or task? _______________________________",
          "2. What should the student do first? ____________________________",
          "3. Circle the correct choice: A   B   C",
          "4. Goal-aligned item: __________________________________________",
          "",
          `Learning goal: ${input.learningGoal}`,
                  ].join("\n"),
      );
      continue;
    }

    if (
      type === "Pre-assessment" ||
      type === "Post-assessment" ||
      type === "Progress-monitoring probe"
    ) {
      pages.push(
        [
          `${title} · Page ${n + 1}`,
          `Worksheet type: ${type}`,
          "",
          "Date: __________   Assessor: __________",
          "",
          "Items:",
          "1. __________   (+ / -)   Prompt: I V G M P",
          "2. __________   (+ / -)   Prompt: I V G M P",
          "3. __________   (+ / -)   Prompt: I V G M P",
          "4. __________   (+ / -)   Prompt: I V G M P",
          "5. __________   (+ / -)   Prompt: I V G M P",
          "",
          "Score: ____ / 5    % correct: ____",
          `Goal: ${input.learningGoal}`,
                  ].join("\n"),
      );
      continue;
    }

    if (type === "Data sheet") {
      pages.push(
        [
          `${title} · Page ${n + 1}`,
          "Data sheet",
          "",
          "Trial | Target | +/- | Prompt | Notes",
          "1     |        |     |        |",
          "2     |        |     |        |",
          "3     |        |     |        |",
          "4     |        |     |        |",
          "5     |        |     |        |",
          "6     |        |     |        |",
          "7     |        |     |        |",
          "8     |        |     |        |",
          "9     |        |     |        |",
          "10    |        |     |        |",
          "",
          `% correct: ____   Goal: ${input.learningGoal}`,
                  ].join("\n"),
      );
      continue;
    }

    pages.push(
      [
        `${title} · Page ${n + 1}`,
        `Worksheet type: ${type}`,
        `Differentiation focus: ${differentiation}`,
        "",
        `Directions: Practice ${input.topicOrSkill || "the skill"} using clear, simple steps.`,
        "",
        visualsForPage(input, n),
        "",
        "Warm-up: ______________________________________________",
        "1. ___________________________________________________",
        "2. ___________________________________________________",
        "3. ___________________________________________________",
        "4. ___________________________________________________",
        "5. ___________________________________________________",
        "",
        isMax
          ? "Response mode: point / match / circle (reduced choices)."
          : "Response mode: write, choose, or explain as appropriate.",
        "",
        `Theme: ${theme}`,
              ].join("\n"),
    );
  }

  if (input.includeProgressMonitoring) {
    pages.push(
      [
        `${title} · Progress monitoring`,
        "",
        `Goal: ${input.learningGoal}`,
        "Date: __________",
        "Probe 1: ____   Probe 2: ____   Probe 3: ____",
        "Accuracy: ____%   Independence: ____%",
        "Notes: ______________________________________________",
              ].join("\n"),
    );
  }

  if (input.includeAnswerKey || types.includes("Answer key")) {
    pages.push(
      [
        `${title} · Answer key`,
        "",
        "Educator use only.",
        `Aligned to: ${input.learningGoal}`,
        "",
        "Accept responses that correctly demonstrate the target skill.",
        "For multiple choice/matching: award credit for the accurate selection.",
        "For open responses: award credit for accurate, goal-aligned answers.",
        "Adjust keys after you customize student-facing items.",
              ].join("\n"),
    );
  }

  // Keep near requested length without unnecessary filler: trim extras beyond requested + optional sheets
  const maxPages =
    pageCount +
    (input.includeProgressMonitoring ? 1 : 0) +
    (input.includeAnswerKey || types.includes("Answer key") ? 1 : 0);
  const finalPages = pages.slice(0, Math.max(pageCount, Math.min(pages.length, maxPages)));

  return {
    title,
    content: finalPages.join(pageBreak()),
    pageCount: finalPages.length,
    mode: "local_intelligence",
  };
}

async function generateModelPacket(
  input: WorksheetGeneratorInput,
): Promise<WorksheetGeneratorResult | null> {
  const config = getAiProviderConfig();
  if (!config.configured) return null;

  const pageCount = parsePacketPageCount(input.packetLength, input.customPages);
  const instructionalLevel = resolvedInstructionalLevel(input);
  const differentiation = resolvedDifferentiation(input);
  const title =
    input.packetTitle.trim() ||
    `${input.subject} · ${input.topicOrSkill || "Skill practice"}`.trim();

  const system = [
    "You are SLC Intelligence Worksheet Generator for specialized learning classroom teachers.",
    'Return ONLY valid JSON: {"title":"","content":"","pageCount":number}',
    "Create original printable worksheet packet content for educator review.",
    "Do not invent student identities. Do not include student PII.",
    "Use clear directions. Keep content age-respectful.",
    "Avoid unnecessary filler pages.",
    `Separate pages with exactly: ${pageBreak().trim()}`,
    "Do NOT include any AI disclaimer, bulb icon, review-for-accuracy footer, or meta notes on student pages.",
    "Student pages are for students only — no educator reminders.",
    "If answer key is requested, include a final answer key section.",
    "If progress monitoring is requested, include a progress-monitoring page.",
    "Include printable visual markers on student pages using exactly this syntax: [[VISUAL:coin-penny]], [[VISUAL:coin-nickel]], [[VISUAL:coin-dime]], [[VISUAL:coin-quarter]], [[VISUAL:coins-set]], [[VISUAL:space-rocket]], [[VISUAL:space-planet]], [[VISUAL:space-stars]], [[VISUAL:animal-dog]], [[VISUAL:animal-cat]], [[VISUAL:sports-ball]], [[VISUAL:cooking-apple]], [[VISUAL:number-card]], [[VISUAL:shape-set]], [[VISUAL:bus]], [[VISUAL:school]], [[VISUAL:hands-wash]], [[VISUAL:emotion-happy]], [[VISUAL:emotion-calm]], [[VISUAL:theme-banner]].",
    "Put at least one [[VISUAL:...]] marker on every student practice page. Choose visuals that match the topic and theme.",
  ].join(" ");

  const user = [
    `Packet title: ${title}`,
    `Subject: ${input.subject}`,
    `Topic or skill: ${input.topicOrSkill}`,
    `Learning goal: ${input.learningGoal}`,
    `Grade band: ${input.gradeBand}`,
    `Instructional level: ${instructionalLevel}`,
    `Differentiation level: ${differentiation}`,
    `Support needs: ${input.supportNeeds.join(", ") || "none listed"}`,
    `Worksheet types: ${input.worksheetTypes.join(", ") || "teacher default practice set"}`,
    `Target pages: ${pageCount}`,
    `Theme/interest (optional, age-respectful): ${input.studentInterestOrTheme || "none"}`,
    `Printing format: ${input.printingFormat}`,
    `Include answer key: ${input.includeAnswerKey ? "yes" : "no"}`,
    `Include progress monitoring: ${input.includeProgressMonitoring ? "yes" : "no"}`,
    "Generate the full packet content now.",
  ].join("\n");

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      title?: string;
      content?: string;
      pageCount?: number;
    };
    const content = (parsed.content ?? "").trim();
    if (!content) return null;
    return {
      title: parsed.title?.trim() || title,
      content,
      pageCount: Number(parsed.pageCount) || pageCount,
      mode: "model_assist",
    };
  } catch {
    return null;
  }
}

const DISCLAIMER_LINE_RE =
  /^\s*(AI-generated instructional material\.?\s*)?Review for accuracy and appropriateness before student use\.?\s*$/gim;

function stripStudentPageDisclaimers(content: string): string {
  return content
    .replace(DISCLAIMER_LINE_RE, "")
    .replace(/AI-generated instructional material\.?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureVisualMarkers(
  packet: WorksheetGeneratorResult,
  input: WorksheetGeneratorInput,
): WorksheetGeneratorResult {
  const cleaned = stripStudentPageDisclaimers(packet.content);
  const parts = cleaned.split(pageBreak()).map((part) => part.trim()).filter(Boolean);

  const withVisuals = parts.map((page, index) => {
    if (hasVisualMarkers(page)) return page;
    // Answer keys can stay text-only; student practice pages get drawings.
    if (/answer key/i.test(page) && !/visual support/i.test(page)) return page;
    return `${page}\n\nPictures for this page:\n${visualsForPage(input, index)}`;
  });

  if (!withVisuals.some((page) => hasVisualMarkers(page))) {
    withVisuals.splice(1, 0, [
      `${packet.title} · Visual supports`,
      "Worksheet type: Visual supports",
      "",
      "Directions: Look at each picture. Name it. Point to or circle the matching item when prompted.",
      "",
      visualsForPage(input, 0),
      "",
      visualsForPage(input, 1),
      "",
      `Theme cue: ${input.studentInterestOrTheme?.trim() || "classroom examples"}`,
    ].join("\n"));
  }

  return {
    ...packet,
    content: withVisuals.join(pageBreak()),
    pageCount: withVisuals.length,
  };
}

async function attachThemeAiImage(
  packet: WorksheetGeneratorResult,
  input: WorksheetGeneratorInput,
): Promise<WorksheetGeneratorResult> {
  const dataUrl = await generateThemeImageDataUrl({
    subject: input.subject,
    topicOrSkill: input.topicOrSkill,
    theme: input.studentInterestOrTheme,
  });
  if (!dataUrl) return packet;

  const marker = aiImageMarker("theme-hero");
  const parts = packet.content.split(pageBreak());
  // Put the AI theme image on the first content/visual page.
  const targetIndex = parts.findIndex((page) =>
    /visual support|page 2|cover visuals/i.test(page),
  );
  const index = targetIndex >= 0 ? targetIndex : Math.min(1, Math.max(parts.length - 1, 0));
  const page = parts[index] ?? "";
  if (!page.includes("[[AIIMAGE:")) {
    parts[index] = `${marker}\n\n${page}`;
  }

  return {
    ...packet,
    content: parts.join(pageBreak()),
    imageAssets: { ...(packet.imageAssets ?? {}), "theme-hero": dataUrl },
  };
}

export async function generateWorksheetPacket(
  input: WorksheetGeneratorInput,
): Promise<WorksheetGeneratorResult> {
  const model = await generateModelPacket(input);
  const packet = ensureVisualMarkers(model ?? buildLocalPacket(input), input);
  return attachThemeAiImage(packet, input);
}
