export const WORKSHEET_SUBJECTS = [
  "Reading",
  "Writing",
  "Math",
  "Science",
  "Social Studies",
  "Life Skills",
  "Social Skills",
  "Communication",
  "Vocational Skills",
  "Functional Academics",
  "Other",
] as const;

export const GRADE_BANDS = [
  "Pre-K",
  "Kindergarten",
  "Grades 1–2",
  "Grades 3–5",
  "Grades 6–8",
  "Grades 9–12",
  "Transition Age",
] as const;

export const INSTRUCTIONAL_LEVELS = [
  "Pre-reader",
  "Emergent",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6+",
  "Grade level",
  "Custom",
] as const;

export const DIFFERENTIATION_LEVELS = [
  "Level 1: Maximum Support",
  "Level 2: Moderate Support",
  "Level 3: Minimal Support",
  "Create All Three Levels",
  "Custom",
] as const;

export const SUPPORT_NEEDS = [
  "Visual supports",
  "Simplified directions",
  "Large print",
  "Reduced answer choices",
  "Picture-supported responses",
  "AAC-compatible choices",
  "Cut and paste",
  "Matching",
  "Multiple choice",
  "Fill in the blank",
  "Short answer",
  "Errorless learning",
  "Reduced visual clutter",
  "Extra writing space",
  "Read-aloud-friendly wording",
] as const;

export const WORKSHEET_TYPES = [
  "Skill introduction",
  "Guided practice",
  "Independent practice",
  "Matching",
  "Multiple choice",
  "Fill in the blank",
  "Sorting",
  "Sequencing",
  "Cut and paste",
  "Picture-supported questions",
  "Reading passage",
  "Comprehension questions",
  "Functional scenarios",
  "Real-world word problems",
  "Task cards",
  "Review page",
  "Pre-assessment",
  "Post-assessment",
  "Progress-monitoring probe",
  "Data sheet",
  "Answer key",
] as const;

export const PACKET_LENGTHS = [
  "5 pages",
  "10 pages",
  "15 pages",
  "20 pages",
  "25 pages",
  "Custom",
] as const;

export const PRINTING_FORMATS = [
  "Standard",
  "Black and white",
  "Low ink",
  "Large print",
  "Reduced visual clutter",
] as const;

export const WORKSHEET_PACKET_FOOTER =
  "AI-generated instructional material. Review for accuracy and appropriateness before student use.";

export const WORKSHEET_PRIVACY_NOTICE =
  "Do not enter student names, initials, birthdates, student ID numbers, addresses, medical information, parent information, or other personally identifiable student information. Enter generalized learning information only.";

export type WorksheetSubject = (typeof WORKSHEET_SUBJECTS)[number];
export type WorksheetType = (typeof WORKSHEET_TYPES)[number];

/** Select recommended worksheet types from subject, goal, instructional level, and differentiation. */
export function selectRecommendedWorksheetTypes(input: {
  subject: string;
  learningGoal: string;
  instructionalLevel: string;
  differentiationLevel: string;
}): WorksheetType[] {
  const subject = input.subject;
  const goal = input.learningGoal.toLowerCase();
  const level = input.instructionalLevel;
  const diff = input.differentiationLevel;
  const recommended = new Set<WorksheetType>([
    "Skill introduction",
    "Guided practice",
    "Independent practice",
    "Review page",
  ]);

  const early =
    level === "Pre-reader" ||
    level === "Emergent" ||
    level === "Kindergarten" ||
    level === "Grade 1" ||
    level === "Grade 2";
  const maxSupport = diff.startsWith("Level 1") || goal.includes("errorless") || early;

  if (maxSupport) {
    recommended.add("Matching");
    recommended.add("Cut and paste");
    recommended.add("Picture-supported questions");
    recommended.add("Multiple choice");
  } else if (diff.startsWith("Level 2")) {
    recommended.add("Multiple choice");
    recommended.add("Fill in the blank");
    recommended.add("Sorting");
  } else {
    recommended.add("Functional scenarios");
    recommended.add("Fill in the blank");
    recommended.add("Real-world word problems");
  }

  if (subject === "Reading" || subject === "Communication") {
    recommended.add("Reading passage");
    recommended.add("Comprehension questions");
    recommended.add("Picture-supported questions");
  }
  if (subject === "Math" || subject === "Functional Academics" || subject === "Life Skills") {
    recommended.add("Real-world word problems");
    recommended.add("Task cards");
    recommended.add("Sorting");
  }
  if (subject === "Writing") {
    recommended.add("Fill in the blank");
    recommended.add("Sequencing");
  }
  if (subject === "Life Skills" || subject === "Social Skills" || subject === "Vocational Skills") {
    recommended.add("Functional scenarios");
    recommended.add("Sequencing");
    recommended.add("Task cards");
  }
  if (goal.includes("coin") || goal.includes("money") || goal.includes("count")) {
    recommended.add("Matching");
    recommended.add("Sorting");
    recommended.add("Real-world word problems");
    recommended.add("Task cards");
  }
  if (diff === "Create All Three Levels") {
    recommended.add("Pre-assessment");
    recommended.add("Post-assessment");
  }

  recommended.add("Answer key");
  return WORKSHEET_TYPES.filter((type) => recommended.has(type));
}

export function parsePacketPageCount(packetLength: string, customPages?: number): number {
  if (packetLength === "Custom") {
    const value = Number(customPages);
    if (!Number.isFinite(value)) return 10;
    return Math.min(40, Math.max(1, Math.round(value)));
  }
  const match = packetLength.match(/(\d+)/);
  return match ? Number(match[1]) : 10;
}
