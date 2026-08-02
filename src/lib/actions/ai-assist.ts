"use server";

import { z } from "zod";
import { suggestWithAiAssist } from "@/lib/ai/suggest";
import type { AiSuggestResult } from "@/lib/ai/types";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";

const suggestSchema = z.object({
  domain: z.enum([
    "communication",
    "accommodation",
    "intervention",
    "goal",
    "executive_function",
    "progress",
    "education_document",
    "behavior",
    "lesson_plan",
  ]),
  focusArea: z.string().trim().max(200).optional().or(z.literal("")),
  studentContext: z.string().trim().max(400).optional().or(z.literal("")),
  extraNotes: z.string().trim().max(20000).optional().or(z.literal("")),
  behaviorTemplateId: z.string().trim().max(120).optional().or(z.literal("")),
  studentFirstName: z.string().trim().max(120).optional().or(z.literal("")),
  contactFirstName: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function generateAiAssistSuggestionsAction(
  input: z.infer<typeof suggestSchema>,
): Promise<AiSuggestResult> {
  const parsed = suggestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      enabled: false,
      mode: "disabled",
      disclaimer: "Invalid assist request.",
      suggestions: [],
      message: "Check the focus area and try again.",
    };
  }

  // Require an authenticated membership before generating assist drafts in-platform.
  if (isServerSupabaseConfigured()) {
    try {
      await requireActiveMembership();
    } catch {
      return {
        enabled: false,
        mode: "disabled",
        disclaimer: "Sign in with an active membership to use AI Assist.",
        suggestions: [],
        message: "Authorization required.",
      };
    }
  }

  return suggestWithAiAssist({
    domain: parsed.data.domain,
    focusArea: parsed.data.focusArea || undefined,
    studentContext: parsed.data.studentContext || undefined,
    extraNotes: parsed.data.extraNotes || undefined,
    behaviorTemplateId: parsed.data.behaviorTemplateId || undefined,
    studentFirstName: parsed.data.studentFirstName || undefined,
    contactFirstName: parsed.data.contactFirstName || undefined,
  });
}
