"use server";

import { z } from "zod";
import { AI_DRAFT_DISCLAIMER, isAiAssistEnabled } from "@/lib/ai/config";
import {
  EXAMPLE_COIN_SPACE_PROFILE,
  generateInstructionalPacket,
  packetToPlainText,
} from "@/lib/instructional-packets/generator";
import {
  PACKET_DIFFICULTIES,
  PACKET_SIZE_TARGETS,
  type GeneratedInstructionalPacket,
  type PacketDifficulty,
  type PacketSizeTarget,
} from "@/lib/instructional-packets/types";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";

const generateSchema = z.object({
  gradeLevel: z.string().trim().min(1).max(40),
  supportNeeds: z.string().trim().min(1).max(120),
  readingLevel: z.string().trim().min(1).max(80),
  skillGoal: z.string().trim().min(1).max(200),
  iepGoal: z.string().trim().min(1).max(400),
  preferredInterests: z.string().trim().min(1).max(120),
  studentCode: z.string().trim().max(40).optional().or(z.literal("")),
  difficulty: z.enum(PACKET_DIFFICULTIES),
  targetPages: z.coerce
    .number()
    .refine((value) => PACKET_SIZE_TARGETS.includes(value as PacketSizeTarget)),
});

export type GeneratePacketResult = {
  ok: boolean;
  disclaimer: string;
  packet?: GeneratedInstructionalPacket;
  plainText?: string;
  message?: string;
};

export async function generateInstructionalPacketAction(
  input: z.infer<typeof generateSchema>,
): Promise<GeneratePacketResult> {
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
        message: "Sign in with an active membership to generate instructional packets.",
      };
    }
  }

  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      disclaimer: AI_DRAFT_DISCLAIMER,
      message: "Check the learner profile fields and try again.",
    };
  }

  const packet = generateInstructionalPacket({
    profile: {
      gradeLevel: parsed.data.gradeLevel,
      supportNeeds: parsed.data.supportNeeds,
      readingLevel: parsed.data.readingLevel,
      skillGoal: parsed.data.skillGoal,
      iepGoal: parsed.data.iepGoal,
      preferredInterests: parsed.data.preferredInterests,
      studentCode: parsed.data.studentCode || "S1",
    },
    difficulty: parsed.data.difficulty as PacketDifficulty,
    targetPages: parsed.data.targetPages as PacketSizeTarget,
  });

  return {
    ok: true,
    disclaimer: AI_DRAFT_DISCLAIMER,
    packet,
    plainText: packetToPlainText(packet),
    message: `Generated about ${packet.estimatedPages} pages for educator review.`,
  };
}

export async function loadExamplePacketProfileAction() {
  return EXAMPLE_COIN_SPACE_PROFILE;
}
