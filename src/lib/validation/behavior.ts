import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const behaviorDefinitionSchema = z.object({
  organizationId: z.string().uuid(),
  behaviorId: optionalUuid,
  studentId: z.string().uuid(),
  name: z.string().trim().min(1, "Behavior name is required.").max(160),
  operationalDefinition: z.string().trim().min(1, "Operational definition is required.").max(4000),
  measurementNotes: z.string().trim().max(2000).optional(),
  examples: z.string().trim().max(2000).optional(),
  nonexamples: z.string().trim().max(2000).optional(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

const baseObservationSchema = z.object({
  organizationId: z.string().uuid(),
  sessionId: optionalUuid,
  studentId: z.string().uuid(),
  behaviorDefinitionId: z.string().uuid(),
  sessionDate: z.string().date(),
  sessionTime: z.string().optional().or(z.literal("")),
  setting: z.string().trim().max(160).optional(),
  activity: z.string().trim().max(160).optional(),
  peoplePresent: z.string().trim().max(300).optional(),
  status: z.enum(["draft", "finalized"]).default("draft"),
  notes: z.string().trim().max(2000).optional(),
});

export const behaviorObservationSchema = z.discriminatedUnion("measurementMethod", [
  baseObservationSchema.extend({
    measurementMethod: z.literal("abc"),
    recordedAntecedent: z.string().trim().min(1, "Antecedent is required.").max(1000),
    observableBehavior: z.string().trim().min(1, "Observable behavior is required.").max(1000),
    recordedConsequence: z.string().trim().min(1, "Consequence is required.").max(1000),
    durationSeconds: z.coerce.number().min(0).optional(),
    replacementObserved: z.coerce.boolean().default(false),
  }),
  baseObservationSchema.extend({
    measurementMethod: z.literal("frequency"),
    count: z.coerce.number().int().min(0),
    observationDurationSeconds: z.coerce.number().positive(),
  }),
  baseObservationSchema.extend({
    measurementMethod: z.literal("duration"),
    totalDurationSeconds: z.coerce.number().min(0),
    episodeCount: z.coerce.number().int().min(0),
  }),
  baseObservationSchema.extend({
    measurementMethod: z.literal("latency"),
    triggerDescription: z.string().trim().min(1, "Trigger description is required.").max(1000),
    latencySeconds: z.coerce.number().min(0),
    responseDescription: z.string().trim().max(1000).optional(),
  }),
  baseObservationSchema.extend({
    measurementMethod: z.literal("interval"),
    recordingMethod: z.enum(["whole", "partial", "momentary"]).default("partial"),
    intervalDurationSeconds: z.coerce.number().positive(),
    intervalCount: z.coerce.number().int().positive(),
    intervalsPositive: z.coerce.number().int().min(0),
  }),
  baseObservationSchema.extend({
    measurementMethod: z.literal("intensity"),
    intensityLevelId: z.string().uuid(),
  }),
]);

export const behaviorStatusSchema = z.object({
  organizationId: z.string().uuid(),
  sessionId: z.string().uuid(),
  studentId: z.string().uuid(),
  note: z.string().trim().max(1000).optional(),
});

export const fbaWorkspaceSchema = z
  .object({
    organizationId: z.string().uuid(),
    workspaceId: optionalUuid,
    studentId: z.string().uuid(),
    behaviorDefinitionId: z.string().uuid(),
    dateRangeStart: z.string().date(),
    dateRangeEnd: z.string().date(),
    status: z.enum(["draft", "in_review", "archived"]).default("draft"),
    educatorHypothesis: z.string().trim().max(3000).optional(),
    teamNotes: z.string().trim().max(3000).optional(),
  })
  .refine((value) => value.dateRangeEnd >= value.dateRangeStart, {
    message: "End date must be on or after start date.",
    path: ["dateRangeEnd"],
  });

export type BehaviorObservationValues = z.infer<typeof behaviorObservationSchema>;
