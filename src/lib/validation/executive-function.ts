import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const optionalDate = z.string().date().optional().or(z.literal(""));

export const executiveFunctionPlanSchema = z
  .object({
    organizationId: z.string().uuid(),
    planId: optionalUuid,
    studentId: z.string().uuid(),
    skillAreaId: optionalUuid,
    title: z.string().trim().min(1, "Plan title is required.").max(180),
    description: z.string().trim().max(4000).optional(),
    status: z.enum(["draft", "active", "under_review", "revised", "ended", "archived"]).default("draft"),
    startDate: optionalDate,
    endDate: optionalDate,
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const executiveFunctionObservationSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  supportId: optionalUuid,
  studentId: z.string().uuid(),
  observationDate: z.string().date(),
  promptLevel: z.enum([
    "independent",
    "visual",
    "gestural",
    "verbal",
    "modeled",
    "partial_physical",
    "full_physical",
    "not_observed",
    "not_applicable",
  ]),
  observationNote: z.string().trim().max(2000).optional(),
  status: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
});

export const checklistResponseSchema = z.object({
  organizationId: z.string().uuid(),
  checklistId: z.string().uuid(),
  checklistItemId: z.string().uuid(),
  studentId: z.string().uuid(),
  responseDate: z.string().date(),
  response: z.enum(["yes", "partial", "no", "not_observed", "not_applicable"]),
  note: z.string().trim().max(1000).optional(),
});
