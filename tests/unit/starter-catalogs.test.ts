import { describe, expect, it } from "vitest";
import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  GOAL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  applyCommunicationTemplate,
  getStarterCatalogCounts,
} from "@/lib/catalogs";

describe("starter catalogs", () => {
  it("provides substantial pre-populated catalogs", () => {
    const counts = getStarterCatalogCounts();
    expect(counts.goals).toBeGreaterThanOrEqual(100);
    expect(counts.interventions).toBeGreaterThanOrEqual(40);
    expect(counts.accommodations).toBeGreaterThanOrEqual(30);
    expect(counts.executiveFunctionSkills).toBeGreaterThanOrEqual(20);
    expect(counts.communicationTemplates).toBeGreaterThanOrEqual(40);
    expect(GOAL_TEMPLATES.every((item) => item.area && item.statement)).toBe(true);
    expect(INTERVENTION_TEMPLATES.every((item) => item.name && item.description)).toBe(true);
    expect(ACCOMMODATION_TEMPLATES.every((item) => item.name && item.description)).toBe(true);
    expect(EF_SKILL_TEMPLATES.every((item) => item.name)).toBe(true);
    expect(COMMUNICATION_TEMPLATES.every((item) => item.bodyTemplate)).toBe(true);
  });

  it("applies communication template placeholders for educator review drafts", () => {
    const template = COMMUNICATION_TEMPLATES[0];
    const draft = applyCommunicationTemplate(template, {
      studentFirstName: "Alex",
      contactFirstName: "Jordan",
      staffName: "Ms. Rivera",
      focusArea: "reading fluency",
    });
    expect(draft.subject).toContain("Alex");
    expect(draft.summary).toContain("Jordan");
    expect(draft.summary).toContain("reading fluency");
    expect(draft.summary).toContain("Ms. Rivera");
    expect(draft.summary).not.toContain("{{");
  });

  it("fills enriched behavior letter placeholders with parent-friendly supports", () => {
    const template = COMMUNICATION_TEMPLATES.find((item) => item.id === "behavior-incident-notice");
    expect(template).toBeTruthy();
    const draft = applyCommunicationTemplate(template!, {
      studentFirstName: "Alex",
      contactFirstName: "Jordan",
      staffName: "Ms. Rivera",
      focusArea: "task refusal",
      behaviorDescription:
        "We are supporting task refusal at school. We respond with a calm, planned approach.",
      classroomSupports: "precorrection; break/help card; task chunking",
      homePartnership: "Please share what is working at home.",
    });
    expect(draft.summary).toContain("task refusal");
    expect(draft.summary).toContain("break/help card");
    expect(draft.summary).toContain("calm, planned approach");
    expect(draft.summary).not.toContain("{{");
    expect(draft.summary.toLowerCase()).not.toContain("related to behavior");
  });
});
