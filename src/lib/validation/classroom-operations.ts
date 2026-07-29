import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const optionalTime = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional().or(z.literal(""));

export const classroomScheduleSchema = z.object({
  organizationId: z.string().uuid(),
  scheduleId: optionalUuid,
  classroomId: z.string().uuid(),
  name: z.string().trim().min(1, "Schedule name is required.").max(180),
  academicYear: z.string().trim().max(40).optional(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const classroomScheduleBlockSchema = z
  .object({
    organizationId: z.string().uuid(),
    scheduleId: z.string().uuid(),
    classroomId: z.string().uuid(),
    dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    label: z.string().trim().min(1, "Block label is required.").max(180),
    blockType: z.string().trim().max(120).optional(),
    location: z.string().trim().max(180).optional(),
    sortOrder: z.coerce.number().int().positive().default(1),
  })
  .refine((value) => value.endTime > value.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export const dailyStudentNoteSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  noteDate: z.string().date(),
  noteText: z.string().trim().min(1, "Daily note text is required.").max(4000),
  status: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
});

export const classroomAnnouncementSchema = z
  .object({
    organizationId: z.string().uuid(),
    classroomId: z.string().uuid(),
    title: z.string().trim().min(1, "Announcement title is required.").max(180),
    body: z.string().trim().min(1, "Announcement body is required.").max(2000),
    containsStudentPii: z.coerce.boolean().default(false),
    audience: z.enum(["staff", "family", "student", "all"]).default("staff"),
    publishAt: z.string().datetime().optional().or(z.literal("")),
    expiresAt: z.string().datetime().optional().or(z.literal("")),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
  })
  .refine((value) => value.containsStudentPii === false, {
    message: "Classroom announcements cannot contain student PII.",
    path: ["containsStudentPii"],
  })
  .refine((value) => !value.publishAt || !value.expiresAt || value.expiresAt >= value.publishAt, {
    message: "Expiration must be after publish time.",
    path: ["expiresAt"],
  });

export const staffDutySchema = z
  .object({
    organizationId: z.string().uuid(),
    userId: z.string().uuid(),
    classroomId: optionalUuid,
    schoolId: optionalUuid,
    dutyName: z.string().trim().min(1, "Duty name is required.").max(180),
    dutyDate: z.string().date().optional().or(z.literal("")),
    startTime: optionalTime,
    endTime: optionalTime,
    status: z.enum(["active", "inactive", "archived"]).default("active"),
  })
  .refine((value) => !value.startTime || !value.endTime || value.endTime >= value.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });
