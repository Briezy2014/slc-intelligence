import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const accommodationLibrarySchema = z.object({
  organizationId: z.string().uuid(),
  libraryItemId: optionalUuid,
  name: z.string().trim().min(1, "Accommodation name is required.").max(180),
  accommodationArea: z.string().trim().max(120).optional(),
  description: z.string().trim().min(1, "Description is required.").max(4000),
  defaultImplementationNotes: z.string().trim().max(4000).optional(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const studentAccommodationSchema = z
  .object({
    organizationId: z.string().uuid(),
    accommodationId: optionalUuid,
    studentId: z.string().uuid(),
    iepCycleId: optionalUuid,
    libraryItemId: optionalUuid,
    title: z.string().trim().min(1, "Accommodation title is required.").max(180),
    accommodationArea: z.string().trim().max(120).optional(),
    description: z.string().trim().min(1, "Description is required.").max(4000),
    implementationNotes: z.string().trim().max(4000).optional(),
    status: z.enum(["draft", "active", "under_review", "revised", "ended", "archived"]).default("draft"),
    startDate: z.string().date().optional().or(z.literal("")),
    endDate: z.string().date().optional().or(z.literal("")),
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const accommodationImplementationLogSchema = z.object({
  organizationId: z.string().uuid(),
  accommodationId: z.string().uuid(),
  studentId: z.string().uuid(),
  logDate: z.string().date(),
  setting: z.string().trim().max(180).optional(),
  implementationStatus: z.enum([
    "implemented",
    "partially_implemented",
    "not_implemented",
    "not_applicable",
    "student_declined",
  ]),
  status: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
  notes: z.string().trim().max(4000).optional(),
});

export const accommodationReviewSchema = z.object({
  organizationId: z.string().uuid(),
  accommodationId: z.string().uuid(),
  studentId: z.string().uuid(),
  reviewDate: z.string().date(),
  reviewSummary: z.string().trim().min(1, "Review summary is required.").max(4000),
  recommendation: z.string().trim().max(2000).optional(),
  nextReviewDate: z.string().date().optional().or(z.literal("")),
});
