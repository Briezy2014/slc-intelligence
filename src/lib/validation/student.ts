import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const studentSchema = z.object({
  organizationId: z.string().uuid(),
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  preferredName: optionalText,
  localIdentifier: z.string().trim().min(1, "Local identifier is required.").max(80),
  gradeLevel: optionalText,
  enrollmentStatus: z.enum(["active", "inactive", "archived"]).default("active"),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export const studentEnrollmentSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  schoolId: z.string().uuid("Choose a school."),
  status: z.enum(["active", "inactive"]).default("active"),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
});

export const studentProgramAssignmentSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  programId: z.string().uuid("Choose a program."),
  status: z.enum(["active", "inactive"]).default("active"),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
});

export const studentClassroomAssignmentSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  classroomId: z.string().uuid("Choose a classroom."),
  status: z.enum(["active", "inactive"]).default("active"),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
});

export const studentStaffAssignmentSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  userId: z.string().uuid("Choose a staff member."),
  assignmentRole: z.enum([
    "case_manager",
    "intervention_specialist",
    "related_service_provider",
    "paraprofessional",
    "teacher",
    "other",
  ]),
  status: z.enum(["active", "inactive"]).default("active"),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
});

export type StudentValues = z.infer<typeof studentSchema>;
export type StudentEnrollmentValues = z.infer<typeof studentEnrollmentSchema>;
export type StudentProgramAssignmentValues = z.infer<typeof studentProgramAssignmentSchema>;
export type StudentClassroomAssignmentValues = z.infer<typeof studentClassroomAssignmentSchema>;
export type StudentStaffAssignmentValues = z.infer<typeof studentStaffAssignmentSchema>;
