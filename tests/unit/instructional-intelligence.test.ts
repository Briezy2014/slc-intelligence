import { describe, expect, it } from "vitest";
import {
  detectDocumentInconsistencies,
  draftPresentLevelsFromEvidence,
  flagNonMeasurableGoal,
  instructionalPlanFromGoal,
  matchGoalsToNeeds,
  toParentFriendlySummary,
} from "@/lib/instructional-intelligence/analyzers";
import { INSTRUCTIONAL_CAPABILITIES } from "@/lib/instructional-intelligence/matrix";

describe("instructional intelligence analyzers", () => {
  it("flags non-measurable goals", () => {
    const flags = flagNonMeasurableGoal("Student will improve reading and do better in class.");
    expect(
      flags.some((flag) => flag.code === "vague_phrase" || flag.code === "missing_criterion"),
    ).toBe(true);
  });

  it("accepts clearer measurable goals with info-level notes", () => {
    const flags = flagNonMeasurableGoal(
      "Given a 2nd-grade passage, the student will read 90 words correct per minute with 95% accuracy across 3 consecutive probes by annual review.",
    );
    expect(flags.some((flag) => flag.severity === "critical")).toBe(false);
  });

  it("drafts present levels from evidence without inventing scores", () => {
    const draft = draftPresentLevelsFromEvidence(
      "Strength: greets peers independently.\nNeed: struggles with multi-step directions.\nBaseline probe 2/5 correct.",
      "listening comprehension",
    );
    expect(draft).toContain("Present Levels draft");
    expect(draft).toContain("Baseline probe 2/5 correct");
    expect(draft).toContain("Do not invent assessments or scores");
  });

  it("matches goals to needs", () => {
    const matches = matchGoalsToNeeds(
      "Needs support with reading fluency\nNeeds help requesting a break",
      "Given a passage, student will improve reading fluency to 90 wcpm.\nUnrelated math goal.",
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(matches[0]?.suggestedGoalFocus.toLowerCase()).toContain("fluency");
  });

  it("detects possible uncovered needs across excerpts", () => {
    const findings = detectDocumentInconsistencies({
      etrText: "Student has difficulty with reading fluency and decoding multisyllabic words.",
      iepText:
        "Present levels note classroom participation. Goal: student will raise hand to request help.",
      progressText: "Student raised hand more often this quarter.",
    });
    expect(
      findings.some((finding) => /uncovered need|coverage/i.test(finding.message + finding.area)),
    ).toBe(true);
  });

  it("creates parent-friendly and instructional plan drafts", () => {
    expect(toParentFriendlySummary("The PLAAFP shows baseline accuracy of 40%.")).toContain(
      "Parent-friendly summary",
    );
    expect(instructionalPlanFromGoal("Student will request a break using a card.")).toContain(
      "I do",
    );
  });

  it("lists all instructional differentiator capabilities", () => {
    expect(INSTRUCTIONAL_CAPABILITIES.length).toBeGreaterThanOrEqual(13);
  });

  it("makes every capability openable via href", () => {
    for (const item of INSTRUCTIONAL_CAPABILITIES) {
      expect(item.href.length).toBeGreaterThan(1);
      expect(item.howTo.length).toBeGreaterThan(10);
      if (item.toolId) {
        expect(item.href).toContain(`tool=${item.toolId}`);
      }
    }
  });
});
