import { describe, expect, it } from "vitest";
import { iepCycleSchema, iepGoalSchema } from "@/lib/validation/goal";
import { percentageProgressSchema, readingFluencyProgressSchema } from "@/lib/validation/progress";
import { studentSchema } from "@/lib/validation/student";

const organizationId = "00000000-0000-4000-8000-000000000001";
const studentId = "00000000-0000-4000-8000-000000000002";
const goalId = "00000000-0000-4000-8000-000000000003";
const iepCycleId = "00000000-0000-4000-8000-000000000004";

describe("student, goal, and progress validation", () => {
  it("validates student date/status payloads", () => {
    const parsed = studentSchema.parse({
      organizationId,
      firstName: "Fictional",
      lastName: "Learner",
      localIdentifier: "DEV-1",
      enrollmentStatus: "active",
    });
    expect(parsed.firstName).toBe("Fictional");
    expect(
      studentSchema.safeParse({ organizationId, firstName: "", lastName: "Learner" }).success,
    ).toBe(false);
  });

  it("validates IEP cycle date ordering", () => {
    expect(
      iepCycleSchema.safeParse({
        organizationId,
        studentId,
        label: "Annual",
        startDate: "2026-01-10",
        endDate: "2026-01-01",
      }).success,
    ).toBe(false);
  });

  it("validates IEP goals with target dates", () => {
    expect(
      iepGoalSchema.safeParse({
        organizationId,
        studentId,
        iepCycleId,
        goalArea: "Reading",
        goalStatement: "Given fictional passages, the student will improve reading accuracy.",
        measurementType: "reading_accuracy",
        targetDirection: "increase",
        startDate: "2026-01-01",
        targetDate: "2026-02-01",
        status: "active",
      }).success,
    ).toBe(true);
  });

  it("validates percentage and reading fluency progress", () => {
    expect(
      percentageProgressSchema.parse({
        organizationId,
        studentId,
        goalId,
        sessionDate: "2026-01-01",
        measurementType: "percentage",
        correctCount: "4",
        totalOpportunities: "5",
        status: "draft",
      }).correctCount,
    ).toBe(4);
    expect(
      readingFluencyProgressSchema.safeParse({
        organizationId,
        studentId,
        goalId,
        sessionDate: "2026-01-01",
        measurementType: "reading_fluency",
        wordsRead: 10,
        errorCount: 1,
        readingTimeSeconds: 0,
      }).success,
    ).toBe(false);
  });
});
