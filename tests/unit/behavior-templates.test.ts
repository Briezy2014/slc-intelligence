import { describe, expect, it } from "vitest";
import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  getBehaviorDefinitionTemplate,
} from "@/lib/catalogs/behavior-templates";

describe("behavior templates", () => {
  it("includes starter definitions with strategies", () => {
    expect(BEHAVIOR_DEFINITION_TEMPLATES.length).toBeGreaterThanOrEqual(5);
    const template = getBehaviorDefinitionTemplate("task-refusal");
    expect(template?.operationalDefinition.length).toBeGreaterThan(20);
    expect(template?.suggestedStrategies.length).toBeGreaterThan(0);
  });

  it("provides observation setting dropdown options", () => {
    expect(BEHAVIOR_SETTING_OPTIONS.length).toBeGreaterThan(5);
  });
});
