import { describe, expect, it } from "vitest";
import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  COMMON_CLASSROOM_BEHAVIOR_TEMPLATE_IDS,
  OBSERVATION_METHOD_OPTIONS,
  getBehaviorDefinitionTemplate,
  observationMethodLabel,
} from "@/lib/catalogs/behavior-templates";

describe("behavior templates", () => {
  it("includes starter definitions with strategies", () => {
    expect(BEHAVIOR_DEFINITION_TEMPLATES.length).toBeGreaterThanOrEqual(40);
    const template = getBehaviorDefinitionTemplate("task-refusal");
    expect(template?.operationalDefinition.length).toBeGreaterThan(20);
    expect(template?.suggestedStrategies.length).toBeGreaterThan(0);
  });

  it("includes attention-seeking and physical/sexualized boundary starters", () => {
    expect(getBehaviorDefinitionTemplate("attention-calling-out")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("aggression-kick")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("property-furniture")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("profanity")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("sexualized-touch-breasts")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("sexualized-touch-buttocks")).toBeTruthy();
    expect(getBehaviorDefinitionTemplate("sexualized-touch-crotch")).toBeTruthy();
  });

  it("provides expanded observation dropdown options", () => {
    expect(BEHAVIOR_SETTING_OPTIONS.length).toBeGreaterThanOrEqual(20);
  });

  it("exposes common classroom starters and plain-language methods", () => {
    expect(COMMON_CLASSROOM_BEHAVIOR_TEMPLATE_IDS.length).toBeGreaterThanOrEqual(5);
    for (const id of COMMON_CLASSROOM_BEHAVIOR_TEMPLATE_IDS) {
      expect(getBehaviorDefinitionTemplate(id)).toBeTruthy();
    }
    expect(OBSERVATION_METHOD_OPTIONS.some((option) => option.value === "abc" && option.primary)).toBe(
      true,
    );
    expect(observationMethodLabel("frequency")).toMatch(/how many times/i);
  });
});
