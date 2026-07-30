import { describe, expect, it } from "vitest";
import { classroomSchema, programSchema, schoolSchema } from "@/lib/validation/organization";

const organizationId = "00000000-0000-4000-8000-000000000001";

describe("organization validation schemas", () => {
  it("validates schools", () => {
    expect(
      schoolSchema.parse({
        organizationId,
        name: "Fictional School",
        schoolType: "public",
        status: "active",
      }).name,
    ).toBe("Fictional School");
    expect(schoolSchema.safeParse({ organizationId, name: "" }).success).toBe(false);
  });

  it("validates programs with optional school scope", () => {
    expect(
      programSchema.parse({
        organizationId,
        name: "SLC Program",
        schoolId: "",
        programType: "inclusion",
        status: "active",
      }).schoolId,
    ).toBe("");
  });

  it("requires classroom school scope", () => {
    expect(
      classroomSchema.safeParse({ organizationId, name: "Room A", schoolId: "", status: "active" })
        .success,
    ).toBe(false);
  });
});
