import { z } from "zod";
import { ROLE_CODES } from "@/lib/permissions/matrix";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const statusSchema = z.enum(["active", "inactive", "archived"]);

export const organizationSchema = z.object({
  name: z.string().trim().min(2, "Organization name is required.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const schoolSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().trim().min(2, "School name is required.").max(120),
  schoolCode: optionalText,
  schoolType: z.enum(["public", "private", "charter", "other"]).default("public"),
  status: statusSchema.default("active"),
});

export const programSchema = z.object({
  organizationId: z.string().uuid(),
  schoolId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Program name is required.").max(120),
  description: optionalText,
  programType: z
    .enum(["specialized_learning", "related_services", "inclusion", "other"])
    .default("specialized_learning"),
  status: statusSchema.default("active"),
});

export const classroomSchema = z.object({
  organizationId: z.string().uuid(),
  schoolId: z.string().uuid("Choose a school."),
  programId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Classroom name is required.").max(120),
  description: optionalText,
  academicYear: optionalText,
  status: statusSchema.default("active"),
});

export const staffAssignmentSchema = z.object({
  organizationId: z.string().uuid(),
  userId: z.string().uuid("Choose a staff member."),
  roleCode: z.enum(ROLE_CODES),
  schoolId: z.string().uuid().optional().or(z.literal("")),
  programId: z.string().uuid().optional().or(z.literal("")),
  classroomId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export type OrganizationValues = z.infer<typeof organizationSchema>;
export type SchoolValues = z.infer<typeof schoolSchema>;
export type ProgramValues = z.infer<typeof programSchema>;
export type ClassroomValues = z.infer<typeof classroomSchema>;
export type StaffAssignmentValues = z.infer<typeof staffAssignmentSchema>;
