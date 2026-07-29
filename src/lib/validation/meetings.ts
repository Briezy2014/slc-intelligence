import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const optionalDateTime = z.string().datetime().optional().or(z.literal(""));

export const meetingSchema = z
  .object({
    organizationId: z.string().uuid(),
    meetingId: optionalUuid,
    studentId: z.string().uuid(),
    meetingTypeId: optionalUuid,
    title: z.string().trim().min(1, "Meeting title is required.").max(180),
    scheduledStart: optionalDateTime,
    scheduledEnd: optionalDateTime,
    location: z.string().trim().max(180).optional(),
    virtualLinkNote: z.string().trim().max(500).optional(),
    status: z.enum(["draft", "scheduled", "held", "finalized", "canceled", "archived"]).default("draft"),
  })
  .refine((value) => !value.scheduledStart || !value.scheduledEnd || value.scheduledEnd >= value.scheduledStart, {
    message: "Meeting end must be after start.",
    path: ["scheduledEnd"],
  });

export const meetingParticipantSchema = z.object({
  organizationId: z.string().uuid(),
  meetingId: z.string().uuid(),
  studentId: z.string().uuid(),
  participantKind: z.enum(["staff", "contact", "external", "student"]),
  userId: optionalUuid,
  contactId: optionalUuid,
  participantStudentId: optionalUuid,
  externalName: z.string().trim().max(180).optional(),
  externalRole: z.string().trim().max(180).optional(),
});

export const meetingNoteSchema = z.object({
  organizationId: z.string().uuid(),
  meetingId: z.string().uuid(),
  studentId: z.string().uuid(),
  noteKind: z.enum([
    "discussion",
    "data_reviewed",
    "family_input",
    "student_input",
    "staff_input",
    "decision",
    "follow_up",
    "unresolved",
    "internal_prep",
  ]),
  noteText: z.string().trim().min(1, "Note text is required.").max(4000),
});

export const meetingAcknowledgementSchema = z.object({
  organizationId: z.string().uuid(),
  meetingId: z.string().uuid(),
  contactId: optionalUuid,
  acknowledgedByName: z.string().trim().max(180).optional(),
  status: z
    .enum(["received", "reviewed", "acknowledged", "declined", "requested_clarification", "no_response", "other"])
    .default("no_response"),
  note: z.string().trim().max(2000).optional(),
});
