"use server";

import { z } from "zod";
import { AI_DRAFT_DISCLAIMER, isAiAssistEnabled } from "@/lib/ai/config";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import {
  generateWorksheetPacket,
  type WorksheetGeneratorResult,
} from "@/lib/worksheet-generator/generate";
import {
  DIFFERENTIATION_LEVELS,
  GRADE_BANDS,
  INSTRUCTIONAL_LEVELS,
  PACKET_LENGTHS,
  PRINTING_FORMATS,
  SUPPORT_NEEDS,
  WORKSHEET_SUBJECTS,
  WORKSHEET_TYPES,
} from "@/lib/worksheet-generator/options";

const generateSchema = z.object({
  packetTitle: z.string().trim().max(180).optional().or(z.literal("")),
  subject: z.enum(WORKSHEET_SUBJECTS),
  topicOrSkill: z.string().trim().min(1).max(200),
  learningGoal: z.string().trim().min(1).max(2000),
  gradeBand: z.enum(GRADE_BANDS),
  instructionalLevel: z.enum(INSTRUCTIONAL_LEVELS),
  instructionalLevelCustom: z.string().trim().max(120).optional().or(z.literal("")),
  differentiationLevel: z.enum(DIFFERENTIATION_LEVELS),
  differentiationCustom: z.string().trim().max(240).optional().or(z.literal("")),
  supportNeeds: z.array(z.enum(SUPPORT_NEEDS)).default([]),
  worksheetTypes: z.array(z.enum(WORKSHEET_TYPES)).min(1),
  packetLength: z.enum(PACKET_LENGTHS),
  customPages: z.coerce.number().int().min(1).max(40).optional(),
  studentInterestOrTheme: z.string().trim().max(120).optional().or(z.literal("")),
  printingFormat: z.enum(PRINTING_FORMATS),
  includeAnswerKey: z.boolean(),
  includeProgressMonitoring: z.boolean(),
});

export type GenerateWorksheetPacketActionResult = {
  ok: boolean;
  disclaimer: string;
  packet?: WorksheetGeneratorResult;
  message?: string;
};

export async function generateWorksheetPacketAction(
  input: z.infer<typeof generateSchema>,
): Promise<GenerateWorksheetPacketActionResult> {
  if (!isAiAssistEnabled()) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "AI Assist is disabled by the platform kill switch.",
    };
  }

  if (isServerSupabaseConfigured()) {
    try {
      await requireActiveMembership();
    } catch {
      return {
        ok: false,
        disclaimer: AI_DRAFT_DISCLAIMER,
        message: "Sign in with an active membership to generate worksheet packets.",
      };
    }
  }

  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "Check required fields (topic, learning goal, and at least one worksheet type).",
    };
  }

  if (
    parsed.data.instructionalLevel === "Custom" &&
    !parsed.data.instructionalLevelCustom?.trim()
  ) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "Enter a custom instructional level.",
    };
  }
  if (parsed.data.differentiationLevel === "Custom" && !parsed.data.differentiationCustom?.trim()) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "Enter a custom differentiation level.",
    };
  }
  if (parsed.data.packetLength === "Custom" && !parsed.data.customPages) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "Enter a custom page count.",
    };
  }

  const packet = await generateWorksheetPacket({
    packetTitle: parsed.data.packetTitle || "",
    subject: parsed.data.subject,
    topicOrSkill: parsed.data.topicOrSkill,
    learningGoal: parsed.data.learningGoal,
    gradeBand: parsed.data.gradeBand,
    instructionalLevel: parsed.data.instructionalLevel,
    instructionalLevelCustom: parsed.data.instructionalLevelCustom || undefined,
    differentiationLevel: parsed.data.differentiationLevel,
    differentiationCustom: parsed.data.differentiationCustom || undefined,
    supportNeeds: parsed.data.supportNeeds,
    worksheetTypes: parsed.data.worksheetTypes,
    packetLength: parsed.data.packetLength,
    customPages: parsed.data.customPages,
    studentInterestOrTheme: parsed.data.studentInterestOrTheme || undefined,
    printingFormat: parsed.data.printingFormat,
    includeAnswerKey: parsed.data.includeAnswerKey,
    includeProgressMonitoring: parsed.data.includeProgressMonitoring,
  });

  return {
    ok: true,
    disclaimer: AI_DRAFT_DISCLAIMER,
    packet,
    message: packet.mode === "model_assist" ? "Packet generated." : "Packet generated.",
  };
}
