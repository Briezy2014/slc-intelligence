import { describe, expect, it } from "vitest";
import {
  accuracyPercentForDifferentiation,
  buildIepLearningGoal,
  getWorksheetTopic,
  listTopicsForFilters,
  WORKSHEET_TOPICS,
} from "@/lib/worksheet-generator/topics";

describe("worksheet topic catalog and IEP goals", () => {
  it("filters topics by subject, grade band, and instructional level", () => {
    const topics = listTopicsForFilters({
      subject: "Reading",
      gradeBand: "Grades 6–8",
      instructionalLevel: "Grade 2",
      differentiationLevel: "Level 2: Moderate Support",
      supportNeeds: ["Visual supports"],
    });
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.every((topic) => topic.subjects.includes("Reading"))).toBe(true);
    expect(topics.some((topic) => topic.id === "reading-sight-words")).toBe(true);
  });

  it("builds IEP-format learning goals from a topic", () => {
    const topic = getWorksheetTopic("math-coins");
    expect(topic).toBeTruthy();
    const goal = buildIepLearningGoal({
      topic: topic!,
      differentiationLevel: "Level 2: Moderate Support",
    });
    expect(goal).toBe(
      "By the end of the IEP, the student will identify the name and value of a penny, nickel, dime, and quarter with 80% accuracy as measured by work samples.",
    );
  });

  it("uses lower accuracy for Level 1 differentiation", () => {
    expect(accuracyPercentForDifferentiation("Level 1: Maximum Support")).toBe(70);
    const topic = getWorksheetTopic("reading-sight-words")!;
    const goal = buildIepLearningGoal({
      topic,
      differentiationLevel: "Level 1: Maximum Support",
    });
    expect(goal).toContain("with 70% accuracy");
    expect(goal.startsWith("By the end of the IEP, the student will ")).toBe(true);
    expect(goal).toMatch(/as measured by .+\.$/);
  });

  it("includes a substantial multi-subject catalog", () => {
    expect(WORKSHEET_TOPICS.length).toBeGreaterThanOrEqual(20);
    const subjects = new Set(WORKSHEET_TOPICS.flatMap((topic) => topic.subjects));
    expect(subjects.has("Math")).toBe(true);
    expect(subjects.has("Reading")).toBe(true);
    expect(subjects.has("Life Skills")).toBe(true);
  });
});
