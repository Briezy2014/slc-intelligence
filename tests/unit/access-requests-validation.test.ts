import { describe, expect, it } from "vitest";
import {
  accessRequestSignupSchema,
  reviewAccessRequestSchema,
} from "@/lib/validation/access-requests";

describe("access request validation", () => {
  it("requires role checkboxes and matching passwords", () => {
    const parsed = accessRequestSignupSchema.safeParse({
      fullName: "Kara Williams",
      email: "kara.williams@example.test",
      password: "password123",
      confirmPassword: "password123",
      organizationSlug: "slc-intelligence-production",
      requestedRoleCodes: ["special_education_teacher", "case_manager"],
      message: "Middle school SLC",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects platform_admin self-request and empty roles", () => {
    const noRoles = accessRequestSignupSchema.safeParse({
      fullName: "Test User",
      email: "test@example.test",
      password: "password123",
      confirmPassword: "password123",
      organizationSlug: "demo-org",
      requestedRoleCodes: [],
    });
    expect(noRoles.success).toBe(false);

    const platformAdmin = accessRequestSignupSchema.safeParse({
      fullName: "Test User",
      email: "test@example.test",
      password: "password123",
      confirmPassword: "password123",
      organizationSlug: "demo-org",
      requestedRoleCodes: ["platform_admin"],
    });
    expect(platformAdmin.success).toBe(false);
  });

  it("validates approve/deny review payloads", () => {
    const approved = reviewAccessRequestSchema.safeParse({
      organizationId: "11111111-1111-4111-8111-111111111111",
      requestId: "22222222-2222-4222-8222-222222222222",
      decision: "approved",
      grantedRoleCode: "paraprofessional",
    });
    expect(approved.success).toBe(true);

    const denied = reviewAccessRequestSchema.safeParse({
      organizationId: "11111111-1111-4111-8111-111111111111",
      requestId: "22222222-2222-4222-8222-222222222222",
      decision: "denied",
    });
    expect(denied.success).toBe(true);
  });
});
