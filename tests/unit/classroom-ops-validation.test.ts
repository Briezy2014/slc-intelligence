import { describe, expect, it } from "vitest";
import {
  classroomRoutineSchema,
  classroomScheduleBlockSchema,
  classroomScheduleSchema,
  dailyStudentNoteSchema,
} from "@/lib/validation/classroom-operations";

const organizationId = "11111111-1111-4111-8111-111111111111";
const classroomId = "22222222-2222-4222-8222-222222222222";
const scheduleId = "33333333-3333-4333-8333-333333333333";
const studentId = "44444444-4444-4444-8444-444444444444";

describe("classroom operations validation", () => {
  it("accepts a classroom schedule", () => {
    const parsed = classroomScheduleSchema.safeParse({
      organizationId,
      classroomId,
      name: "Weekday schedule",
      status: "active",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a schedule block with optional day", () => {
    const parsed = classroomScheduleBlockSchema.safeParse({
      organizationId,
      scheduleId,
      classroomId,
      label: "Literacy",
      startTime: "08:30",
      endTime: "09:30",
      sortOrder: 1,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a schedule block with end before start", () => {
    const parsed = classroomScheduleBlockSchema.safeParse({
      organizationId,
      scheduleId,
      classroomId,
      label: "Literacy",
      startTime: "09:30",
      endTime: "08:30",
      sortOrder: 1,
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts a daily note and routine", () => {
    expect(
      dailyStudentNoteSchema.safeParse({
        organizationId,
        studentId,
        noteDate: "2026-07-31",
        noteText: "S1 completed arrival with one prompt.",
        status: "draft",
      }).success,
    ).toBe(true);
    expect(
      classroomRoutineSchema.safeParse({
        organizationId,
        classroomId,
        name: "Arrival routine",
        description: "Hang backpack, check schedule, join meeting.",
        status: "active",
      }).success,
    ).toBe(true);
  });
});
