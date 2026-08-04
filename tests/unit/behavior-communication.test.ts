import { describe, expect, it } from "vitest";
import {
  familyFriendlyBehaviorDescription,
  familyFriendlyConcernLabel,
  enrichCommunicationDraftContext,
} from "@/lib/catalogs/behavior-communication";
import { getBehaviorDefinitionTemplate } from "@/lib/catalogs/behavior-templates";
import { applyCommunicationTemplate, getCommunicationTemplate } from "@/lib/catalogs";

describe("family behavior communication wording", () => {
  it("uses concern-focused labels instead of desired-skill wording", () => {
    const behavior = getBehaviorDefinitionTemplate("verbal-disruption");
    expect(behavior).toBeTruthy();
    const label = familyFriendlyConcernLabel(behavior!);
    expect(label).toContain("calling out");
    expect(label.toLowerCase()).not.toContain("expected classroom voice");
  });

  it("writes a professional incident description that makes sense", () => {
    const behavior = getBehaviorDefinitionTemplate("verbal-disruption");
    const description = familyFriendlyBehaviorDescription(behavior!);
    expect(description).toContain("school concern regarding calling out");
    expect(description).toContain("Staff observed situations such as");
    expect(description).toContain("Calls out answers repeatedly without raising hand");
    expect(description.toLowerCase()).not.toContain("related to using an expected classroom voice");
    expect(description).toMatch(/calm, planned approach/);
  });

  it("fills behavior incident templates with professional concern language", () => {
    const behavior = getBehaviorDefinitionTemplate("task-refusal");
    const context = enrichCommunicationDraftContext({}, behavior!.id);
    const template = getCommunicationTemplate("behavior-incident-notice");
    const draft = applyCommunicationTemplate(template!, {
      studentFirstName: "Alex",
      contactFirstName: "Jordan",
      staffName: "Ms. Rivera",
      ...context,
    });
    expect(draft.summary).toContain("The concern relates to refusing to start or complete assigned work");
    expect(draft.summary).toContain("school concern regarding refusing to start or complete assigned work");
    expect(draft.summary.toLowerCase()).not.toContain("related to starting and completing assigned work");
    expect(draft.summary).not.toContain("{{");
  });
});
