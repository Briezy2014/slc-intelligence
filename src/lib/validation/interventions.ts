import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const interventionLibrarySchema = z.object({
  organizationId: z.string().uuid(),
  libraryItemId: optionalUuid,
  name: z.string().trim().min(1, "Intervention name is required.").max(180),
  category: z.string().trim().max(120).optional(),
  description: z.string().trim().min(1, "Description is required.").max(4000),
  evidenceLevel: z
    .enum(["evidence_based", "promising", "emerging", "local_practice", "other"])
    .default("promising"),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const interventionPlanSchema = z
  .object({
    organizationId: z.string().uuid(),
    planId: optionalUuid,
    studentId: z.string().uuid(),
    libraryItemId: optionalUuid,
    title: z.string().trim().min(1, "Plan title is required.").max(180),
    description: z.string().trim().max(4000).optional(),
    status: z
      .enum([
        "draft",
        "ready_for_review",
        "active",
        "paused",
        "revised",
        "completed",
        "discontinued",
        "archived",
      ])
      .default("draft"),
    startDate: z.string().date().optional().or(z.literal("")),
    endDate: z.string().date().optional().or(z.literal("")),
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const interventionComponentSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  label: z.string().trim().min(1, "Component label is required.").max(180),
  description: z.string().trim().min(1, "Component description is required.").max(2000),
  implementationNotes: z.string().trim().max(2000).optional(),
  sortOrder: z.coerce.number().int().positive().default(1),
});

export const fidelityObservationSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  checklistId: z.string().uuid(),
  studentId: z.string().uuid(),
  observationDate: z.string().date(),
  status: z.enum(["draft", "finalized"]).default("draft"),
  notes: z.string().trim().max(2000).optional(),
});

export const dosageLogSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  studentId: z.string().uuid(),
  logDate: z.string().date(),
  durationMinutes: z.coerce.number().min(0).optional(),
  sessionsDelivered: z.coerce.number().int().min(0).default(1),
  setting: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const interventionReviewSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  studentId: z.string().uuid(),
  reviewDate: z.string().date(),
  summary: z.string().trim().min(1, "Review summary is required.").max(4000),
  outcome: z.enum(["continue", "revise", "pause", "complete", "discontinue"]),
  nextReviewDate: z.string().date().optional().or(z.literal("")),
});

export type InterventionPlanValues = z.infer<typeof interventionPlanSchema>;
