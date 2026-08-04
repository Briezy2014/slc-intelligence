import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const optionalDate = z.string().date().optional().or(z.literal(""));
const optionalTime = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/)
  .optional()
  .or(z.literal(""));

export const serviceDefinitionSchema = z.object({
  organizationId: z.string().uuid(),
  serviceDefinitionId: optionalUuid,
  name: z.string().trim().min(1, "Service name is required.").max(180),
  serviceArea: z.string().trim().min(1, "Service area is required.").max(120),
  description: z.string().trim().max(4000).optional(),
  defaultDeliveryType: z
    .enum(["push_in", "pull_out", "consultation", "individual", "group", "other"])
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const servicePlanSchema = z
  .object({
    organizationId: z.string().uuid(),
    servicePlanId: optionalUuid,
    studentId: z.string().uuid(),
    iepCycleId: optionalUuid,
    serviceDefinitionId: optionalUuid,
    title: z.string().trim().max(180).optional().or(z.literal("")),
    description: z.string().trim().max(4000).optional(),
    notes: z.string().trim().max(4000).optional(),
    providerUserId: optionalUuid,
    providerName: z.string().trim().max(180).optional(),
    providerGoals: z.string().trim().max(4000).optional(),
    serviceMinutes: z.coerce.number().int().positive().optional(),
    frequency: z.string().trim().max(180).optional(),
    deliveryType: z
      .enum(["push_in", "pull_out", "consultation", "individual", "group", "other"])
      .optional()
      .or(z.literal("")),
    status: z
      .enum(["draft", "active", "under_review", "revised", "ended", "archived"])
      .default("draft"),
    startDate: optionalDate,
    endDate: optionalDate,
  })
  .refine((value) => Boolean(value.title?.trim()) || Boolean(value.serviceDefinitionId), {
    message: "Choose a service type or enter a title.",
    path: ["title"],
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const serviceComponentSchema = z.object({
  organizationId: z.string().uuid(),
  servicePlanId: z.string().uuid(),
  componentName: z.string().trim().min(1, "Component name is required.").max(180),
  serviceMinutes: z.coerce.number().int().positive().optional(),
  frequency: z.string().trim().max(180).optional(),
  setting: z.string().trim().max(180).optional(),
  deliveryType: z
    .enum(["push_in", "pull_out", "consultation", "individual", "group", "other"])
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(2000).optional(),
  sortOrder: z.coerce.number().int().positive().default(1),
});

export const serviceDeliveryLogSchema = z
  .object({
    organizationId: z.string().uuid(),
    servicePlanId: z.string().uuid(),
    serviceComponentId: optionalUuid,
    primaryStudentId: z.string().uuid(),
    participantStudentIds: z.string().trim().optional(),
    serviceDate: z.string().date(),
    startTime: optionalTime,
    endTime: optionalTime,
    deliveryType: z.enum(["push_in", "pull_out", "consultation", "individual", "group", "other"]),
    serviceStatus: z.enum([
      "delivered",
      "partially_delivered",
      "rescheduled",
      "canceled",
      "student_absent",
      "provider_absent",
      "school_closed",
      "family_canceled",
      "student_unavailable",
      "other",
    ]),
    recordStatus: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
    providerUserId: optionalUuid,
    notes: z.string().trim().max(4000).optional(),
  })
  .refine((value) => !value.startTime || !value.endTime || value.endTime >= value.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export const serviceReviewSchema = z.object({
  organizationId: z.string().uuid(),
  servicePlanId: z.string().uuid(),
  studentId: z.string().uuid(),
  reviewDate: z.string().date(),
  reviewSummary: z.string().trim().min(1, "Review summary is required.").max(4000),
  recommendation: z.string().trim().max(2000).optional(),
  nextReviewDate: optionalDate,
});
