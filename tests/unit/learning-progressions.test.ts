import { describe, expect, it } from "vitest";
import {
  GRADE_LEVELS,
  LEARNING_PROGRESSIONS,
  PROGRESSION_SUBJECTS,
  getNextProgressions,
  listProgressionsForGrade,
  suggestNextAfterMastery,
} from "@/lib/catalogs/learning-progressions";

describe("learning progressions", () => {
  it("includes grade-level goals across required subjects including functional math and ASL", () => {
    expect(GRADE_LEVELS.length).toBeGreaterThanOrEqual(13);
    expect(PROGRESSION_SUBJECTS).toContain("functional_mathematics");
    expect(PROGRESSION_SUBJECTS).toContain("asl_communication");
    expect(LEARNING_PROGRESSIONS.length).toBeGreaterThan(200);

    const grade3 = listProgressionsForGrade("3");
    expect(grade3.some((entry) => entry.subject === "ela_reading")).toBe(true);
    expect(grade3.some((entry) => entry.subject === "functional_mathematics")).toBe(true);
    expect(grade3.some((entry) => entry.subject === "asl_communication")).toBe(true);
  });

  it("suggests the next progression after mastery", () => {
    const current = listProgressionsForGrade("4", "ela_reading")[0];
    expect(current).toBeTruthy();
    const next = getNextProgressions(current!.id);
    expect(next.length).toBeGreaterThan(0);
    expect(next[0]?.gradeLevel).toBe("5");

    const suggested = suggestNextAfterMastery({
      gradeLevel: "4",
      subject: "functional_mathematics",
      currentProgressionId: listProgressionsForGrade("4", "functional_mathematics")[0]?.id,
    });
    expect(suggested[0]?.gradeLevel).toBe("5");
  });
});
