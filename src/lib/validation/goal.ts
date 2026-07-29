import { z } from "zod";

export const measurementTypeSchema = z.enum([
  "percentage",
  "frequency",
  "rate",
  "duration",
  "latency",
  "rubric",
  "prompt_level",
  "task_analysis",
  "reading_fluency",
  "reading_accuracy",
  "independence",
  "custom_numeric",
]);

export const iepCycleSchema = z
  .object({
    organizationId: z.string().uuid(),
    studentId: z.string().uuid(),
    label: z.string().trim().min(2, "IEP cycle label is required.").max(120),
    startDate: z.string().date(),
    endDate: z.string().date().optional(),
    reviewDate: z.string().date().optional(),
    status: z.enum(["active", "inactive", "archived"]).default("active"),
  })
  .refine((values) => !values.endDate || values.endDate >= values.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export const iepGoalSchema = z
  .object({
    organizationId: z.string().uuid(),
    studentId: z.string().uuid(),
    iepCycleId: z.string().uuid("Choose an IEP cycle."),
    goalArea: z.string().trim().min(1, "Goal area is required.").max(120),
    goalStatement: z.string().trim().min(10, "Goal statement is required.").max(4000),
    measurementType: measurementTypeSchema,
    unitOfMeasurement: z.string().trim().max(80).optional(),
    evaluationFrequency: z.string().trim().max(120).optional(),
    targetValue: z.coerce.number().optional(),
    targetDirection: z.enum(["increase", "decrease"]).default("increase"),
    startDate: z.string().date().optional(),
    targetDate: z.string().date().optional(),
    status: z.enum(["active", "inactive", "archived", "mastered_review"]).default("active"),
    responsibleUserId: z.string().uuid().optional().or(z.literal("")),
  })
  .refine(
    (values) => !values.startDate || !values.targetDate || values.targetDate >= values.startDate,
    {
      message: "Target date must be on or after the start date.",
      path: ["targetDate"],
    },
  );

export const iepObjectiveSchema = z.object({
  organizationId: z.string().uuid(),
  goalId: z.string().uuid(),
  sequenceNo: z.coerce.number().int().positive().default(1),
  objectiveStatement: z.string().trim().min(5, "Objective statement is required.").max(2000),
  targetValue: z.coerce.number().optional(),
  measurementType: measurementTypeSchema.optional(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  startDate: z.string().date().optional(),
  targetDate: z.string().date().optional(),
});

export type MeasurementTypeValues = z.infer<typeof measurementTypeSchema>;
export type IepCycleValues = z.infer<typeof iepCycleSchema>;
export type IepGoalValues = z.infer<typeof iepGoalSchema>;
export type IepObjectiveValues = z.infer<typeof iepObjectiveSchema>;
