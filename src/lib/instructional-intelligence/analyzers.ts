/**
 * Instructional intelligence helpers for educator-reviewed drafting and checks.
 * These are decision-support tools — not eligibility, placement, or legal compliance engines.
 */

export type MeasurabilityFlag = {
  severity: "info" | "warning" | "critical";
  code: string;
  message: string;
};

export type GoalNeedMatch = {
  needSnippet: string;
  suggestedGoalFocus: string;
  rationale: string;
  alignmentScore: number;
};

export type ConsistencyFinding = {
  severity: "info" | "warning" | "critical";
  area: string;
  message: string;
};

const VAGUE_PHRASES = [
  "do better",
  "improve",
  "try harder",
  "be successful",
  "make progress",
  "understand",
  "appreciate",
  "participate appropriately",
  "as needed",
  "when appropriate",
  "to the best of their ability",
];

const MEASURABLE_CUES = [
  "%",
  "percent",
  "accuracy",
  "trials",
  "opportunities",
  "minutes",
  "seconds",
  "times per",
  "out of",
  "with no more than",
  "independent",
  "prompt",
  "baseline",
  "by ",
];

export function flagNonMeasurableGoal(goalStatement: string): MeasurabilityFlag[] {
  const text = goalStatement.trim();
  const flags: MeasurabilityFlag[] = [];
  if (!text) {
    return [{ severity: "critical", code: "empty", message: "Goal statement is empty." }];
  }

  const lower = text.toLowerCase();
  const hasMeasurableCue = MEASURABLE_CUES.some((cue) => lower.includes(cue));
  const hasCondition = /\b(given|when|during|with|using)\b/i.test(text);
  const hasCriterion = /\d/.test(text) || /percent|%|out of|times/i.test(text);
  const hasTimeframe = /\b(by|within|over|across|in \d+)\b/i.test(text);

  for (const phrase of VAGUE_PHRASES) {
    if (lower.includes(phrase)) {
      flags.push({
        severity: "warning",
        code: "vague_phrase",
        message: `Contains vague language (“${phrase}”). Replace with an observable skill and criterion.`,
      });
    }
  }

  if (!hasCondition) {
    flags.push({
      severity: "warning",
      code: "missing_condition",
      message: "Add a condition (Given… / When… / During…) so the goal is teachable and observable.",
    });
  }
  if (!hasCriterion) {
    flags.push({
      severity: "critical",
      code: "missing_criterion",
      message: "No clear numeric criterion found (for example %, trials correct, minutes, prompt level).",
    });
  }
  if (!hasTimeframe) {
    flags.push({
      severity: "info",
      code: "missing_timeframe",
      message: "Consider adding a timeframe or progress window (for example by annual review).",
    });
  }
  if (!hasMeasurableCue && hasCriterion === false) {
    flags.push({
      severity: "critical",
      code: "not_measurable",
      message: "Goal does not appear measurable as written. Draft a replacement with condition + skill + criterion.",
    });
  }

  if (flags.length === 0) {
    flags.push({
      severity: "info",
      code: "looks_measurable",
      message: "No major measurability gaps detected. Still review with the IEP team before finalizing.",
    });
  }

  return flags;
}

export function draftPresentLevelsFromEvidence(evidence: string, focusArea?: string): string {
  const lines = evidence
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const focus = focusArea?.trim() || "current instructional needs";
  const strengths = lines.filter((line) => /strength|independ|success|master|can\b/i.test(line)).slice(0, 4);
  const needs = lines.filter((line) => /need|deficit|struggle|difficulty|require|support/i.test(line)).slice(0, 4);
  const data = lines.filter((line) => /\d|%|trial|baseline|probe|accuracy/i.test(line)).slice(0, 4);
  const other = lines.filter((line) => !strengths.includes(line) && !needs.includes(line) && !data.includes(line)).slice(0, 4);

  return [
    `Present Levels draft (educator review required) — focus: ${focus}`,
    "",
    "Strengths:",
    ...(strengths.length ? strengths.map((line) => `- ${line}`) : ["- [Add observed strengths from classroom/evidence]"]),
    "",
    "Needs related to the disability / support needs:",
    ...(needs.length ? needs.map((line) => `- ${line}`) : ["- [Add documented needs tied to evidence]"]),
    "",
    "Current performance / data points:",
    ...(data.length ? data.map((line) => `- ${line}`) : ["- [Add recent probes, percentages, prompt levels, or observations]"]),
    "",
    "How the need affects involvement and progress in the general curriculum:",
    ...(other.length
      ? other.map((line) => `- ${line}`)
      : ["- [Describe impact on classroom participation, access, or progress]"]),
    "",
    "Source notes: Drafted only from the evidence text provided. Do not invent assessments or scores.",
  ].join("\n");
}

export function matchGoalsToNeeds(needsText: string, goalIdeasText = ""): GoalNeedMatch[] {
  const needs = needsText
    .split(/\n+|;\s*|•\s*/)
    .map((part) => part.trim())
    .filter((part) => part.length > 8);
  const goalHints = goalIdeasText
    .split(/\n+|;\s*|•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  return needs.slice(0, 8).map((need, index) => {
    const tokens = need
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3);
    const matchedGoal = goalHints.find((goal) => {
      const lower = goal.toLowerCase();
      return tokens.some((token) => lower.includes(token));
    });
    const overlap = matchedGoal
      ? tokens.filter((token) => matchedGoal.toLowerCase().includes(token)).length
      : 0;
    const alignmentScore = matchedGoal
      ? Math.min(100, 40 + overlap * 12)
      : Math.max(15, 30 - index * 2);

    return {
      needSnippet: need,
      suggestedGoalFocus: matchedGoal
        ? matchedGoal
        : `Write a measurable goal targeting: ${need.slice(0, 120)}`,
      rationale: matchedGoal
        ? "Matched an existing goal idea to shared vocabulary in the documented need."
        : "No existing goal idea clearly matched this need — draft a new measurable goal tied to this need.",
      alignmentScore,
    };
  });
}

export function detectDocumentInconsistencies(input: {
  etrText?: string;
  iepText?: string;
  progressText?: string;
}): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];
  const etr = (input.etrText ?? "").trim();
  const iep = (input.iepText ?? "").trim();
  const progress = (input.progressText ?? "").trim();

  if (!etr && !iep && !progress) {
    return [
      {
        severity: "info",
        area: "inputs",
        message: "Paste ETR, IEP, and/or progress report excerpts to run consistency checks.",
      },
    ];
  }

  const etrNeeds = extractNeedish(etr);
  const iepGoals = extractGoalish(iep);
  const iepNeeds = extractNeedish(iep);
  const progressMentions = extractGoalish(progress);

  if (etr && iep && etrNeeds.length && iepGoals.length === 0) {
    findings.push({
      severity: "warning",
      area: "ETR → IEP goals",
      message: "ETR-like needs were found, but the IEP excerpt does not clearly show goal statements.",
    });
  }

  for (const need of etrNeeds.slice(0, 5)) {
    const tokens = significantTokens(need);
    const covered =
      iepGoals.some((goal) => tokens.some((token) => goal.toLowerCase().includes(token))) ||
      iepNeeds.some((item) => tokens.some((token) => item.toLowerCase().includes(token)));
    if (!covered) {
      findings.push({
        severity: "warning",
        area: "Need coverage",
        message: `Possible uncovered need from ETR/needs text: “${truncate(need, 140)}”. Confirm an IEP goal or service addresses it.`,
      });
    }
  }

  if (iepGoals.length && progress) {
    for (const goal of iepGoals.slice(0, 5)) {
      const tokens = significantTokens(goal);
      const mentioned = progressMentions.some((line) =>
        tokens.some((token) => line.toLowerCase().includes(token)),
      );
      if (!mentioned && tokens.length) {
        findings.push({
          severity: "info",
          area: "Progress report coverage",
          message: `IEP goal language may be missing from the progress excerpt: “${truncate(goal, 140)}”.`,
        });
      }
    }
  }

  if (iep && /eligible|eligibility/i.test(etr) && !/present level|plaafp|current performance/i.test(iep)) {
    findings.push({
      severity: "warning",
      area: "Present levels",
      message: "IEP excerpt may be missing present levels language while evaluation content is present.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: "info",
      area: "summary",
      message:
        "No obvious inconsistencies detected from the pasted excerpts. This is a drafting aid, not a legal compliance determination.",
    });
  }

  return findings.slice(0, 12);
}

export function toParentFriendlySummary(technicalText: string): string {
  const text = technicalText.trim();
  if (!text) return "Paste technical IEP/ETR/progress language to create a parent-friendly summary.";

  let summary = text
    .replace(/\bPLAAFP\b/gi, "present levels (how your child is doing now)")
    .replace(/\bETR\b/gi, "evaluation team report")
    .replace(/\bIEP\b/gi, "individualized education program (IEP)")
    .replace(/\bFAPE\b/gi, "a free appropriate public education")
    .replace(/\bLRE\b/gi, "learning with peers as much as appropriate")
    .replace(/\bSDI\b/gi, "specially designed instruction")
    .replace(/\baccommodations?\b/gi, "classroom supports")
    .replace(/\bmodifications?\b/gi, "changes to what is taught or expected")
    .replace(/\bbaseline\b/gi, "starting point")
    .replace(/\bprobe(s)?\b/gi, "short check(s)")
    .replace(/\bprompt(s|ing)?\b/gi, "adult help")
    .replace(/\bindependent(ly)?\b/gi, "on their own")
    .replace(/\bcriterion\b/gi, "goal target")
    .replace(/\bprogress monitoring\b/gi, "regular progress checks");

  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 8);

  return [
    "Parent-friendly summary (educator review required):",
    "",
    ...sentences.map((sentence) => `• ${sentence}`),
    "",
    "Next step we suggest discussing together: what is working, what still needs practice, and how home and school can stay consistent.",
  ].join("\n");
}

export function instructionalPlanFromGoal(goalStatement: string, setting?: string): string {
  const goal = goalStatement.trim() || "the current IEP goal";
  const context = setting?.trim() || "specialized learning classroom";
  return [
    `Instructional plan draft from IEP goal (educator review required)`,
    `Goal: ${goal}`,
    `Setting: ${context}`,
    "",
    "1. Clarify the observable skill and success criterion from the goal.",
    "2. Pre-teach vocabulary / visuals and show a model (I do).",
    "3. Guided practice with prompt hierarchy and immediate feedback (We do).",
    "4. Independent / paired practice with accommodations listed on the IEP (You do).",
    "5. Collect 3–5 data points matching the goal’s measurement type.",
    "6. End with a 1-sentence family update option if appropriate.",
    "",
    "Para support notes:",
    "- Use only approved prompts/supports for this goal.",
    "- Record what help was needed; do not invent new goals.",
    "- If the student is unsafe or highly escalated, follow the crisis/safety plan.",
  ].join("\n");
}

export function explainApprovedSupports(supportsText: string): string {
  const items = supportsText
    .split(/\n+|;\s*|•\s*/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);

  if (!items.length) {
    return [
      "Para-friendly supports explainer",
      "",
      "Paste accommodations, modifications, or behavior supports from the approved plan.",
      "SLC Intelligence will rewrite them into plain “what to do / what not to do” language.",
    ].join("\n");
  }

  return [
    "Approved supports — para-friendly view (follow the written plan; do not invent new supports)",
    "",
    ...items.slice(0, 12).map((item, index) => {
      const plain = item
        .replace(/\bextended time\b/gi, "give more time to finish")
        .replace(/\bpreferential seating\b/gi, "seat the student where the plan says")
        .replace(/\bvisual supports?\b/gi, "use pictures/visuals already approved")
        .replace(/\bprompt hierarchy\b/gi, "help from least help to more help only as needed")
        .replace(/\bfirst-then\b/gi, "show first-then: work first, then preferred");
      return [
        `${index + 1}. Support: ${item}`,
        `   What this means for me: ${plain}.`,
        "   Do: follow this support the same way each time.",
        "   Don’t: skip it, change it, or add unapproved consequences.",
      ].join("\n");
    }),
    "",
    "If something is unclear, ask the intervention specialist before changing the support.",
  ].join("\n");
}

export function meetingPrepSummary(input: {
  focusArea?: string;
  strengths?: string;
  needs?: string;
  progressNotes?: string;
  familyQuestions?: string;
}): string {
  const focus = input.focusArea?.trim() || "upcoming IEP / team meeting";
  return [
    `Meeting preparation summary (educator review required) — ${focus}`,
    "",
    "1) Purpose of the meeting",
    `- Review progress and supports related to ${focus}.`,
    "",
    "2) Strengths to highlight",
    bulletBlock(input.strengths, "Add 2–3 recent strengths with examples."),
    "",
    "3) Needs / concerns",
    bulletBlock(input.needs, "List current needs tied to classroom evidence."),
    "",
    "4) Progress snapshot",
    bulletBlock(input.progressNotes, "Summarize recent data (not a legal compliance finding)."),
    "",
    "5) Family partnership questions",
    bulletBlock(
      input.familyQuestions,
      "What is working at home? What barriers should the team know about?",
    ),
    "",
    "6) Decision reminders",
    "- Humans make eligibility, placement, and service decisions.",
    "- Bring evidence; do not rely on AI drafts as final determinations.",
  ].join("\n");
}

function bulletBlock(value: string | undefined, fallback: string): string {
  const lines = (value ?? "")
    .split(/\n+|;\s*|•\s*/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return `- ${fallback}`;
  return lines
    .slice(0, 6)
    .map((line) => `- ${line}`)
    .join("\n");
}

function extractNeedish(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /need|deficit|struggle|difficulty|require|support|weak/i.test(line))
    .slice(0, 10);
}

function extractGoalish(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /goal|will |given |when |%|accuracy|independent/i.test(line))
    .slice(0, 12);
}

function significantTokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 4)
    .filter((token) => !["student", "given", "during", "would", "should", "their"].includes(token));
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
