import { z } from "zod";
import { measurementTypeSchema } from "@/lib/validation/goal";

const baseProgressSessionSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  goalId: z.string().uuid(),
  objectiveId: z.string().uuid().optional().or(z.literal("")),
  sessionDate: z.string().date(),
  collectorUserId: z.string().uuid().optional().or(z.literal("")),
  setting: z.string().trim().max(160).optional(),
  activity: z.string().trim().max(160).optional(),
  interventionPhaseId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
  notes: z.string().trim().max(2000).optional(),
});

export const percentageProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("percentage"),
  correctCount: z.coerce.number().int().min(0),
  totalOpportunities: z.coerce.number().int().positive(),
});

export const frequencyProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("frequency"),
  countValue: z.coerce.number().int().min(0),
  observationDurationSeconds: z.coerce.number().positive().optional(),
});

export const rateProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("rate"),
  countValue: z.coerce.number().int().min(0),
  observationDurationSeconds: z.coerce.number().positive(),
  rateUnit: z.string().trim().min(1, "Rate unit is required.").max(80),
});

export const durationProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("duration"),
  durationValue: z.coerce.number().min(0),
  durationUnit: z.enum(["seconds", "minutes", "hours"]).default("minutes"),
});

export const latencyProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("latency"),
  latencyValue: z.coerce.number().min(0),
  latencyUnit: z.enum(["seconds", "minutes"]).default("seconds"),
});

export const rubricProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("rubric"),
  rubricScore: z.coerce.number().min(0),
  rubricMax: z.coerce.number().positive().optional(),
  rubricLevel: z.string().trim().max(80).optional(),
});

export const promptLevelProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("prompt_level"),
  promptLevel: z.string().trim().min(1, "Prompt level is required.").max(80),
  promptHierarchyPosition: z.coerce.number().int().optional(),
  independenceValue: z.coerce.number().optional(),
});

export const taskAnalysisProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("task_analysis"),
  taskIndependentSteps: z.coerce.number().int().min(0),
  taskPromptedSteps: z.coerce.number().int().min(0).default(0),
  taskIncorrectSteps: z.coerce.number().int().min(0).default(0),
  taskNotAttemptedSteps: z.coerce.number().int().min(0).default(0),
  stepResponses: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const readingFluencyProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("reading_fluency"),
  wordsRead: z.coerce.number().int().min(0),
  errorCount: z.coerce.number().int().min(0).default(0),
  readingTimeSeconds: z.coerce.number().positive(),
});

export const readingAccuracyProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("reading_accuracy"),
  correctCount: z.coerce.number().int().min(0),
  totalOpportunities: z.coerce.number().int().positive(),
});

export const independenceProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("independence"),
  independenceValue: z.coerce.number().min(0),
  promptLevel: z.string().trim().max(80).optional(),
});

export const customNumericProgressSchema = baseProgressSessionSchema.extend({
  measurementType: z.literal("custom_numeric"),
  customNumericValue: z.coerce.number(),
  customUnit: z.string().trim().min(1, "Unit is required.").max(80),
  higherIsBetter: z.coerce.boolean().default(true),
});

export const progressSessionSchema = z.discriminatedUnion("measurementType", [
  percentageProgressSchema,
  frequencyProgressSchema,
  rateProgressSchema,
  durationProgressSchema,
  latencyProgressSchema,
  rubricProgressSchema,
  promptLevelProgressSchema,
  taskAnalysisProgressSchema,
  readingFluencyProgressSchema,
  readingAccuracyProgressSchema,
  independenceProgressSchema,
  customNumericProgressSchema,
]);

export const progressFilterSchema = z.object({
  measurementType: measurementTypeSchema.optional(),
  studentId: z.string().uuid().optional(),
  goalId: z.string().uuid().optional(),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
});

export type ProgressSessionValues = z.infer<typeof progressSessionSchema>;
export type ProgressFilterValues = z.infer<typeof progressFilterSchema>;
