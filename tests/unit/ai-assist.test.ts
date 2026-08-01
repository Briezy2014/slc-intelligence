import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLocalSuggestions } from "@/lib/ai/local-engine";
import { suggestWithAiAssist } from "@/lib/ai/suggest";

describe("AI Assist local intelligence", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns ranked communication and intervention suggestions for a focus area", () => {
    const communications = buildLocalSuggestions({
      domain: "communication",
      focusArea: "reading fluency progress",
    });
    expect(communications.length).toBeGreaterThan(0);
    expect(communications[0]?.requiresReview).toBe(true);
    expect(communications[0]?.draftText.length).toBeGreaterThan(20);

    const interventions = buildLocalSuggestions({
      domain: "intervention",
      focusArea: "phonics decoding",
    });
    expect(interventions.length).toBeGreaterThan(0);
    expect(interventions.some((item) => item.fields?.category)).toBe(true);
  });

  it("builds behavior family letters from a specific behavior dropdown selection", () => {
    const communications = buildLocalSuggestions({
      domain: "communication",
      focusArea: "Task refusal",
      behaviorTemplateId: "task-refusal",
    });
    expect(communications.length).toBeGreaterThan(0);
    const draft = communications.map((item) => item.draftText).join("\n");
    expect(draft.toLowerCase()).toContain("task refusal");
    expect(draft.toLowerCase()).not.toContain("related to behavior");
    expect(draft.toLowerCase()).not.toContain("practiced behavior");
    expect(communications.some((item) => item.id.includes("behavior"))).toBe(true);
    expect(communications[0]?.fields?.behaviorTemplateId).toBe("task-refusal");
    expect(draft.toLowerCase()).toContain("replacement");
  });

  it("honors the kill switch", async () => {
    vi.stubEnv("AI_ASSIST_ENABLED", "false");
    const result = await suggestWithAiAssist({
      domain: "accommodation",
      focusArea: "extended time",
    });
    expect(result.enabled).toBe(false);
    expect(result.mode).toBe("disabled");
    expect(result.suggestions).toHaveLength(0);
  });

  it("uses local intelligence when no model key is configured", async () => {
    vi.stubEnv("AI_ASSIST_ENABLED", "true");
    vi.stubEnv("AI_API_KEY", "");
    const result = await suggestWithAiAssist({
      domain: "goal",
      focusArea: "reading comprehension main idea",
    });
    expect(result.enabled).toBe(true);
    expect(result.mode).toBe("local_intelligence");
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.disclaimer.toLowerCase()).toContain("review");
  });

  it("maps pasted IEP text into education document fields", () => {
    const suggestions = buildLocalSuggestions({
      domain: "education_document",
      focusArea: "iep",
      extraNotes:
        "Strengths: strong visual memory and peer leadership.\nNeeds: decoding multisyllabic words.\nAnnual goals: improve oral reading fluency to 90 wcpm.",
    });
    expect(suggestions[0]?.fields?.strengths?.toLowerCase()).toContain("visual");
    expect(suggestions[0]?.requiresReview).toBe(true);
  });

  it("suggests behavior definitions from starter templates", () => {
    const suggestions = buildLocalSuggestions({
      domain: "behavior",
      focusArea: "task refusal escape",
    });
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.fields?.operationalDefinition?.length).toBeGreaterThan(20);
  });
});
