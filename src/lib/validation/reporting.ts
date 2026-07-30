import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const reportingPeriodSchema = z
  .object({
    organizationId: z.string().uuid(),
    periodId: optionalUuid,
    name: z.string().trim().min(1, "Period name is required.").max(120),
    academicYear: z.string().trim().min(4, "Academic year is required.").max(40),
    startDate: z.string().date(),
    endDate: z.string().date(),
    dueDate: z.string().date().optional().or(z.literal("")),
    schoolId: optionalUuid,
    programId: optionalUuid,
    status: z.enum(["active", "inactive", "archived"]).default("active"),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const reportCreateSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  iepCycleId: z.string().uuid(),
  reportingPeriodId: z.string().uuid(),
});

export const reportStatusSchema = z.object({
  organizationId: z.string().uuid(),
  reportId: z.string().uuid(),
  note: z.string().trim().max(1000).optional(),
});

export const reportSectionSchema = z.object({
  organizationId: z.string().uuid(),
  sectionId: z.string().uuid(),
  reportId: z.string().uuid(),
  studentId: z.string().uuid(),
  currentPerformanceSummary: z.string().trim().max(2000).optional(),
  trendSummary: z.string().trim().max(2000).optional(),
  promptSummary: z.string().trim().max(2000).optional(),
  generalizationSummary: z.string().trim().max(2000).optional(),
  maintenanceSummary: z.string().trim().max(2000).optional(),
  interventionPhaseSummary: z.string().trim().max(2000).optional(),
  dataSufficiencyStatus: z.enum(["not_reviewed", "sufficient", "limited", "insufficient"]),
  dataSufficiencyNotes: z.string().trim().max(1000).optional(),
  educatorNarrative: z.string().trim().max(4000).optional(),
  progressDescriptor: z
    .enum(["exceeded", "met", "progressing", "limited_progress", "insufficient_data"])
    .optional()
    .or(z.literal("")),
});

export const evidenceLinkSchema = z.object({
  organizationId: z.string().uuid(),
  sectionId: z.string().uuid(),
  reportId: z.string().uuid(),
  evidenceType: z.enum([
    "session",
    "data_point",
    "baseline",
    "intervention_phase",
    "analytics_range",
  ]),
  evidenceId: optionalUuid,
  label: z.string().trim().min(1, "Evidence label is required.").max(200),
  dateRangeStart: z.string().date().optional().or(z.literal("")),
  dateRangeEnd: z.string().date().optional().or(z.literal("")),
});

export const reportExportSchema = z.object({
  organizationId: z.string().uuid(),
  reportId: z.string().uuid(),
  exportFormat: z.enum(["print", "pdf"]).default("print"),
});

export type ReportingPeriodValues = z.infer<typeof reportingPeriodSchema>;
export type ReportCreateValues = z.infer<typeof reportCreateSchema>;
