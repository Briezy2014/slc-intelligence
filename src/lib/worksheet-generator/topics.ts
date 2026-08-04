import type { WorksheetSubject } from "@/lib/worksheet-generator/options";
import {
  DIFFERENTIATION_LEVELS,
  GRADE_BANDS,
  INSTRUCTIONAL_LEVELS,
} from "@/lib/worksheet-generator/options";

export type GradeBand = (typeof GRADE_BANDS)[number];
export type InstructionalLevel = (typeof INSTRUCTIONAL_LEVELS)[number];
export type DifferentiationLevel = (typeof DIFFERENTIATION_LEVELS)[number];

export type MeasurementMethod =
  | "work samples"
  | "teacher observation"
  | "curriculum-based measures"
  | "structured observation"
  | "task analysis data"
  | "probe data / progress-monitoring probes";

export type WorksheetTopic = {
  id: string;
  label: string;
  subjects: WorksheetSubject[];
  /** If set, topic only appears for these grade bands. */
  gradeBands?: GradeBand[];
  /** If set, topic only appears for these instructional levels. */
  instructionalLevels?: InstructionalLevel[];
  /** Prefer for Level 1 / heavy visual support. */
  maxSupportFriendly?: boolean;
  /** Phrase after “the student will …” */
  skillPhrase: string;
  measuredBy: MeasurementMethod;
  tags?: string[];
};

const EARLY_LEVELS: InstructionalLevel[] = [
  "Pre-reader",
  "Emergent",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
];
const MID_LEVELS: InstructionalLevel[] = [
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade level",
];
const UPPER_LEVELS: InstructionalLevel[] = [
  "Grade 4",
  "Grade 5",
  "Grade 6+",
  "Grade level",
  "Custom",
];

const EARLY_BANDS: GradeBand[] = [
  "Pre-K",
  "Kindergarten",
  "Grades 1–2",
  "Grades 3–5",
  "Grades 6–8",
];
const MIDDLE_BANDS: GradeBand[] = ["Grades 3–5", "Grades 6–8", "Grades 9–12", "Transition Age"];
const SECONDARY_BANDS: GradeBand[] = ["Grades 6–8", "Grades 9–12", "Transition Age"];

function topic(
  id: string,
  label: string,
  subjects: WorksheetSubject[],
  skillPhrase: string,
  measuredBy: MeasurementMethod,
  extras: Partial<
    Omit<WorksheetTopic, "id" | "label" | "subjects" | "skillPhrase" | "measuredBy">
  > = {},
): WorksheetTopic {
  return { id, label, subjects, skillPhrase, measuredBy, ...extras };
}

export const WORKSHEET_TOPICS: WorksheetTopic[] = [
  // Math / Functional Academics
  topic(
    "math-coins",
    "Identifying coins",
    ["Math", "Functional Academics", "Life Skills"],
    "identify the name and value of a penny, nickel, dime, and quarter",
    "work samples",
    {
      gradeBands: EARLY_BANDS,
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Custom"],
      maxSupportFriendly: true,
      tags: ["money", "coins", "visual"],
    },
  ),
  topic(
    "math-coin-values",
    "Counting coin combinations",
    ["Math", "Functional Academics", "Life Skills"],
    "count mixed coin combinations up to one dollar",
    "work samples",
    {
      gradeBands: ["Grades 1–2", "Grades 3–5", "Grades 6–8", "Grades 9–12", "Transition Age"],
      instructionalLevels: [
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6+",
        "Grade level",
        "Custom",
      ],
      tags: ["money", "coins"],
    },
  ),
  topic(
    "math-count-20",
    "Counting to 20",
    ["Math", "Functional Academics"],
    "count objects to 20 with one-to-one correspondence",
    "teacher observation",
    {
      gradeBands: ["Pre-K", "Kindergarten", "Grades 1–2", "Grades 3–5", "Grades 6–8"],
      instructionalLevels: EARLY_LEVELS,
      maxSupportFriendly: true,
      tags: ["counting", "visual"],
    },
  ),
  topic(
    "math-add-within-10",
    "Addition within 10",
    ["Math", "Functional Academics"],
    "solve addition problems within 10 using manipulatives or visuals as needed",
    "work samples",
    {
      gradeBands: EARLY_BANDS,
      instructionalLevels: [...EARLY_LEVELS, "Grade 3"],
      maxSupportFriendly: true,
      tags: ["addition"],
    },
  ),
  topic(
    "math-subtract-within-10",
    "Subtraction within 10",
    ["Math", "Functional Academics"],
    "solve subtraction problems within 10 using manipulatives or visuals as needed",
    "work samples",
    {
      gradeBands: EARLY_BANDS,
      instructionalLevels: [...EARLY_LEVELS, "Grade 3"],
      tags: ["subtraction"],
    },
  ),
  topic(
    "math-word-problems",
    "One-step word problems",
    ["Math", "Functional Academics"],
    "solve one-step real-world word problems using the correct operation",
    "work samples",
    {
      gradeBands: MIDDLE_BANDS,
      instructionalLevels: MID_LEVELS.concat(UPPER_LEVELS),
      tags: ["word-problems"],
    },
  ),
  topic(
    "math-time",
    "Telling time to the hour/half hour",
    ["Math", "Functional Academics", "Life Skills"],
    "tell time to the hour and half hour on analog and digital clocks",
    "work samples",
    {
      gradeBands: EARLY_BANDS.concat(["Grades 9–12", "Transition Age"]),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Grade 4", "Custom"],
      maxSupportFriendly: true,
      tags: ["time"],
    },
  ),
  topic(
    "math-shapes",
    "Identifying basic shapes",
    ["Math", "Functional Academics"],
    "identify circle, square, triangle, and rectangle in pictures and objects",
    "teacher observation",
    {
      gradeBands: EARLY_BANDS,
      instructionalLevels: EARLY_LEVELS,
      maxSupportFriendly: true,
      tags: ["shapes", "visual"],
    },
  ),

  // Reading
  topic(
    "reading-sight-words",
    "Sight words",
    ["Reading", "Functional Academics", "Communication"],
    "read a targeted set of high-frequency sight words in isolation and in short phrases",
    "curriculum-based measures",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Custom"],
      maxSupportFriendly: true,
      tags: ["sight-words", "decoding"],
    },
  ),
  topic(
    "reading-main-idea",
    "Main idea",
    ["Reading", "Functional Academics"],
    "identify the main idea of a short grade-appropriate passage",
    "work samples",
    {
      gradeBands: MIDDLE_BANDS,
      instructionalLevels: MID_LEVELS.concat(UPPER_LEVELS),
      tags: ["comprehension"],
    },
  ),
  topic(
    "reading-details",
    "Key details",
    ["Reading", "Functional Academics"],
    "answer literal comprehension questions about key details in a short passage",
    "work samples",
    {
      gradeBands: MIDDLE_BANDS,
      instructionalLevels: MID_LEVELS.concat(["Grade 1", "Grade 2", "Custom"]),
      tags: ["comprehension"],
    },
  ),
  topic(
    "reading-grocery-signs",
    "Reading grocery store signs",
    ["Reading", "Life Skills", "Functional Academics"],
    "read and match common grocery store signs and labels to the correct meaning",
    "teacher observation",
    {
      gradeBands: SECONDARY_BANDS.concat(["Grades 3–5"]),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Grade 4", "Grade 5", "Custom"],
      maxSupportFriendly: true,
      tags: ["functional-reading", "visual"],
    },
  ),
  topic(
    "reading-community-signs",
    "Community safety signs",
    ["Reading", "Life Skills", "Functional Academics"],
    "identify common community and safety signs and state what each sign means",
    "structured observation",
    {
      gradeBands: SECONDARY_BANDS.concat(["Grades 3–5"]),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Grade 4", "Custom"],
      maxSupportFriendly: true,
      tags: ["functional-reading", "safety"],
    },
  ),
  topic(
    "reading-sequence",
    "Story sequence",
    ["Reading", "Communication"],
    "sequence three to four events from a short story in the correct order",
    "work samples",
    {
      gradeBands: EARLY_BANDS.concat(["Grades 9–12"]),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Grade 4", "Custom"],
      tags: ["comprehension", "sequence"],
    },
  ),

  // Writing
  topic(
    "writing-sentence",
    "Complete sentences",
    ["Writing", "Communication", "Functional Academics"],
    "write or construct a complete sentence with a capital letter and end punctuation",
    "work samples",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Grade 4", "Custom"],
      tags: ["writing"],
    },
  ),
  topic(
    "writing-opinion",
    "Opinion sentence",
    ["Writing"],
    "write an opinion sentence with a reason to support the opinion",
    "work samples",
    {
      gradeBands: MIDDLE_BANDS,
      instructionalLevels: MID_LEVELS.concat(UPPER_LEVELS),
      tags: ["writing"],
    },
  ),
  topic(
    "writing-sequence-steps",
    "Writing steps in order",
    ["Writing", "Life Skills", "Vocational Skills"],
    "write or arrange three sequential steps to complete a familiar task",
    "work samples",
    {
      gradeBands: MIDDLE_BANDS,
      instructionalLevels: MID_LEVELS.concat(["Grade 1", "Grade 2", "Custom"]),
      tags: ["writing", "sequence"],
    },
  ),

  // Life Skills / Vocational
  topic(
    "life-hygiene",
    "Handwashing routine",
    ["Life Skills", "Vocational Skills"],
    "complete the steps of a handwashing routine in the correct order with fading prompts",
    "task analysis data",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: [...EARLY_LEVELS, "Grade 3", "Custom"],
      maxSupportFriendly: true,
      tags: ["hygiene", "sequence", "visual"],
    },
  ),
  topic(
    "life-grocery-list",
    "Using a shopping list",
    ["Life Skills", "Vocational Skills", "Functional Academics"],
    "locate listed items in a store aisle or picture set using a shopping list",
    "structured observation",
    {
      gradeBands: SECONDARY_BANDS.concat(["Grades 3–5"]),
      instructionalLevels: MID_LEVELS.concat(EARLY_LEVELS),
      tags: ["community", "functional"],
    },
  ),
  topic(
    "life-job-steps",
    "Following job steps",
    ["Vocational Skills", "Life Skills"],
    "follow a three- to five-step job routine using a visual checklist",
    "task analysis data",
    {
      gradeBands: SECONDARY_BANDS,
      instructionalLevels: [...EARLY_LEVELS, ...MID_LEVELS, "Custom"],
      maxSupportFriendly: true,
      tags: ["vocational", "visual"],
    },
  ),

  // Social / Communication
  topic(
    "social-emotions",
    "Identifying emotions",
    ["Social Skills", "Communication"],
    "identify basic emotions (happy, sad, mad, scared) from pictures or scenarios",
    "structured observation",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: EARLY_LEVELS.concat(["Grade 3", "Custom"]),
      maxSupportFriendly: true,
      tags: ["emotions", "visual"],
    },
  ),
  topic(
    "social-turn-taking",
    "Turn-taking",
    ["Social Skills", "Communication"],
    "take turns during a structured activity with a peer or adult using an expected cue",
    "teacher observation",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: EARLY_LEVELS.concat(["Grade 3", "Custom"]),
      maxSupportFriendly: true,
      tags: ["social"],
    },
  ),
  topic(
    "comm-request",
    "Making a request",
    ["Communication", "Social Skills"],
    "make a clear request for a needed item or help using words, AAC, or an approved communication method",
    "structured observation",
    {
      gradeBands: EARLY_BANDS.concat(SECONDARY_BANDS),
      instructionalLevels: EARLY_LEVELS.concat(["Grade 3", "Custom"]),
      maxSupportFriendly: true,
      tags: ["communication", "aac"],
    },
  ),
  topic(
    "comm-wh-questions",
    "Answering WH questions",
    ["Communication", "Reading"],
    "answer who/what/where questions about a short passage or familiar activity",
    "probe data / progress-monitoring probes",
    {
      gradeBands: EARLY_BANDS.concat(MIDDLE_BANDS),
      instructionalLevels: EARLY_LEVELS.concat(MID_LEVELS),
      tags: ["communication", "comprehension"],
    },
  ),

  // Science / Social Studies
  topic(
    "science-weather",
    "Weather words",
    ["Science", "Functional Academics"],
    "match weather words (sunny, rainy, cloudy, snowy) to the correct picture",
    "work samples",
    {
      gradeBands: EARLY_BANDS,
      instructionalLevels: EARLY_LEVELS,
      maxSupportFriendly: true,
      tags: ["science", "visual"],
    },
  ),
  topic(
    "ss-community-helpers",
    "Community helpers",
    ["Social Studies", "Life Skills"],
    "match community helpers to their jobs and tools",
    "work samples",
    {
      gradeBands: EARLY_BANDS.concat(["Grades 6–8"]),
      instructionalLevels: EARLY_LEVELS.concat(["Grade 3", "Custom"]),
      maxSupportFriendly: true,
      tags: ["community", "visual"],
    },
  ),

  // Other catch-alls available broadly
  topic(
    "other-following-directions",
    "Following 2-step directions",
    ["Other", "Life Skills", "Communication", "Vocational Skills"],
    "follow two-step directions related to a classroom or community task",
    "teacher observation",
    {
      maxSupportFriendly: true,
      tags: ["directions"],
    },
  ),
  topic(
    "other-matching",
    "Picture-to-word matching",
    ["Other", "Reading", "Functional Academics", "Communication"],
    "match pictures to the corresponding word or label from a field of choices",
    "work samples",
    {
      instructionalLevels: EARLY_LEVELS.concat(["Grade 3", "Custom"]),
      maxSupportFriendly: true,
      tags: ["matching", "visual"],
    },
  ),
];

export type TopicFilterInput = {
  subject: string;
  gradeBand: string;
  instructionalLevel: string;
  differentiationLevel: string;
  supportNeeds?: string[];
};

function matchesList<T extends string>(value: T, allowed?: T[]): boolean {
  if (!allowed || allowed.length === 0) return true;
  return allowed.includes(value);
}

/** Prefer Level 1 topics that are max-support friendly; never hide everything. */
function differentiationRank(topic: WorksheetTopic, differentiationLevel: string): number {
  const level1 = differentiationLevel.startsWith("Level 1");
  const level3 = differentiationLevel.startsWith("Level 3");
  if (level1) return topic.maxSupportFriendly ? 0 : 2;
  if (level3) return topic.maxSupportFriendly ? 1 : 0;
  return topic.maxSupportFriendly ? 0 : 1;
}

function supportRank(topic: WorksheetTopic, supportNeeds: string[] = []): number {
  const wantsVisual =
    supportNeeds.includes("Visual supports") ||
    supportNeeds.includes("Picture-supported responses") ||
    supportNeeds.includes("AAC-compatible choices");
  if (!wantsVisual) return 0;
  const visualFriendly = Boolean(
    topic.maxSupportFriendly ||
    topic.tags?.some((tag) => ["visual", "aac", "matching"].includes(tag)),
  );
  return visualFriendly ? 0 : 1;
}

export function listTopicsForFilters(input: TopicFilterInput): WorksheetTopic[] {
  const subject = input.subject as WorksheetSubject;
  const matched = WORKSHEET_TOPICS.filter((entry) => {
    const subjectMatch =
      entry.subjects.includes(subject) || (subject === "Other" && entry.subjects.includes("Other"));
    if (!subjectMatch) return false;
    if (!matchesList(input.gradeBand as GradeBand, entry.gradeBands)) return false;
    if (!matchesList(input.instructionalLevel as InstructionalLevel, entry.instructionalLevels)) {
      return false;
    }
    return true;
  });

  const ranked = matched.sort((a, b) => {
    const diff =
      differentiationRank(a, input.differentiationLevel) -
      differentiationRank(b, input.differentiationLevel);
    if (diff !== 0) return diff;
    const support = supportRank(a, input.supportNeeds) - supportRank(b, input.supportNeeds);
    if (support !== 0) return support;
    return a.label.localeCompare(b.label);
  });

  if (ranked.length > 0) return ranked;

  // Fallback so the dropdown is never empty for an odd filter combo.
  return WORKSHEET_TOPICS.filter((entry) => entry.subjects.includes(subject)).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export function getWorksheetTopic(id: string): WorksheetTopic | undefined {
  return WORKSHEET_TOPICS.find((entry) => entry.id === id);
}

export function accuracyPercentForDifferentiation(differentiationLevel: string): number {
  if (differentiationLevel.startsWith("Level 1")) return 70;
  if (differentiationLevel.startsWith("Level 3")) return 85;
  return 80;
}

export function buildIepLearningGoal(input: {
  topic: WorksheetTopic;
  differentiationLevel: string;
  accuracyPercent?: number;
  measuredBy?: MeasurementMethod;
}): string {
  const percent =
    input.accuracyPercent ?? accuracyPercentForDifferentiation(input.differentiationLevel);
  const measuredBy = input.measuredBy ?? input.topic.measuredBy;
  const skill = input.topic.skillPhrase.trim().replace(/\.$/, "");
  return `By the end of the IEP, the student will ${skill} with ${percent}% accuracy as measured by ${measuredBy}.`;
}
