"use server";

import { z } from "zod";
import {
  detectDocumentInconsistencies,
  draftPresentLevelsFromEvidence,
  explainApprovedSupports,
  flagNonMeasurableGoal,
  instructionalPlanFromGoal,
  matchGoalsToNeeds,
  meetingPrepSummary,
  toParentFriendlySummary,
  type ConsistencyFinding,
  type GoalNeedMatch,
  type MeasurabilityFlag,
} from "@/lib/instructional-intelligence/analyzers";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";

async function requireAssistAccess(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isServerSupabaseConfigured()) return { ok: true };
  try {
    await requireActiveMembership();
    return { ok: true };
  } catch {
    return { ok: false, message: "Sign in with an active membership to use instructional intelligence tools." };
  }
}

export type InstructionalToolResult = {
  ok: boolean;
  title: string;
  draftText: string;
  flags?: MeasurabilityFlag[];
  matches?: GoalNeedMatch[];
  findings?: ConsistencyFinding[];
  message?: string;
};

export async function runPresentLevelsDraftAction(input: {
  evidence: string;
  focusArea?: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Present levels", draftText: "", message: access.message };
  const parsed = z
    .object({
      evidence: z.string().trim().min(1).max(20000),
      focusArea: z.string().trim().max(200).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Present levels", draftText: "", message: "Paste evidence text to draft present levels." };
  }
  return {
    ok: true,
    title: "Present levels draft",
    draftText: draftPresentLevelsFromEvidence(parsed.data.evidence, parsed.data.focusArea),
  };
}

export async function runGoalNeedMatchAction(input: {
  needsText: string;
  goalIdeasText?: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Goal–need match", draftText: "", message: access.message };
  const parsed = z
    .object({
      needsText: z.string().trim().min(1).max(12000),
      goalIdeasText: z.string().trim().max(12000).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Goal–need match", draftText: "", message: "Paste documented needs to match goals." };
  }
  const matches = matchGoalsToNeeds(parsed.data.needsText, parsed.data.goalIdeasText);
  return {
    ok: true,
    title: "Goal–need match",
    matches,
    draftText: matches
      .map(
        (match, index) =>
          `${index + 1}. Need: ${match.needSnippet}\n   Goal focus: ${match.suggestedGoalFocus}\n   Alignment: ${match.alignmentScore}% · ${match.rationale}`,
      )
      .join("\n\n"),
  };
}

export async function runMeasurableGoalCheckAction(input: {
  goalStatement: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Measurable goal check", draftText: "", message: access.message };
  const parsed = z.object({ goalStatement: z.string().trim().min(1).max(4000) }).safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Measurable goal check", draftText: "", message: "Enter a goal statement to check." };
  }
  const flags = flagNonMeasurableGoal(parsed.data.goalStatement);
  return {
    ok: true,
    title: "Measurable goal check",
    flags,
    draftText: flags.map((flag) => `[${flag.severity}] ${flag.message}`).join("\n"),
  };
}

export async function runConsistencyCheckAction(input: {
  etrText?: string;
  iepText?: string;
  progressText?: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Consistency check", draftText: "", message: access.message };
  const parsed = z
    .object({
      etrText: z.string().trim().max(12000).optional(),
      iepText: z.string().trim().max(12000).optional(),
      progressText: z.string().trim().max(12000).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Consistency check", draftText: "", message: "Paste at least one document excerpt." };
  }
  const findings = detectDocumentInconsistencies(parsed.data);
  return {
    ok: true,
    title: "ETR / IEP / progress consistency check",
    findings,
    draftText: findings.map((finding) => `[${finding.severity}] ${finding.area}: ${finding.message}`).join("\n"),
  };
}

export async function runParentFriendlySummaryAction(input: {
  technicalText: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Parent-friendly summary", draftText: "", message: access.message };
  const parsed = z.object({ technicalText: z.string().trim().min(1).max(12000) }).safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      title: "Parent-friendly summary",
      draftText: "",
      message: "Paste technical language to rewrite.",
    };
  }
  return {
    ok: true,
    title: "Parent-friendly summary",
    draftText: toParentFriendlySummary(parsed.data.technicalText),
  };
}

export async function runInstructionalPlanAction(input: {
  goalStatement: string;
  setting?: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Instructional plan", draftText: "", message: access.message };
  const parsed = z
    .object({
      goalStatement: z.string().trim().min(1).max(4000),
      setting: z.string().trim().max(200).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Instructional plan", draftText: "", message: "Enter an IEP goal to build a plan." };
  }
  return {
    ok: true,
    title: "Instructional plan from IEP goal",
    draftText: instructionalPlanFromGoal(parsed.data.goalStatement, parsed.data.setting),
  };
}

export async function runParaSupportsExplainerAction(input: {
  supportsText: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Para supports", draftText: "", message: access.message };
  const parsed = z.object({ supportsText: z.string().trim().min(1).max(8000) }).safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      title: "Para supports",
      draftText: "",
      message: "Paste approved supports to explain.",
    };
  }
  return {
    ok: true,
    title: "Para-friendly approved supports",
    draftText: explainApprovedSupports(parsed.data.supportsText),
  };
}

export async function runMeetingPrepAction(input: {
  focusArea?: string;
  strengths?: string;
  needs?: string;
  progressNotes?: string;
  familyQuestions?: string;
}): Promise<InstructionalToolResult> {
  const access = await requireAssistAccess();
  if (!access.ok) return { ok: false, title: "Meeting prep", draftText: "", message: access.message };
  const parsed = z
    .object({
      focusArea: z.string().trim().max(200).optional(),
      strengths: z.string().trim().max(4000).optional(),
      needs: z.string().trim().max(4000).optional(),
      progressNotes: z.string().trim().max(4000).optional(),
      familyQuestions: z.string().trim().max(4000).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    return { ok: false, title: "Meeting prep", draftText: "", message: "Add meeting context to generate a prep summary." };
  }
  return {
    ok: true,
    title: "Meeting preparation summary",
    draftText: meetingPrepSummary(parsed.data),
  };
}
