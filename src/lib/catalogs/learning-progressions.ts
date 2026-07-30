import type { MeasurementTypeCode } from "@/lib/catalogs/types";

export const GRADE_LEVELS = [
  "PreK",
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "Transition",
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];

export const PROGRESSION_SUBJECTS = [
  "ela_reading",
  "ela_writing",
  "mathematics",
  "functional_mathematics",
  "science",
  "social_studies",
  "executive_function",
  "communication",
  "asl_communication",
  "general_life_skills",
] as const;

export type ProgressionSubject = (typeof PROGRESSION_SUBJECTS)[number];

export const PROGRESSION_SUBJECT_LABELS: Record<ProgressionSubject, string> = {
  ela_reading: "ELA · Reading",
  ela_writing: "ELA · Writing",
  mathematics: "Mathematics",
  functional_mathematics: "Functional mathematics",
  science: "Science",
  social_studies: "Social studies",
  executive_function: "Executive function",
  communication: "Communication",
  asl_communication: "Communication · ASL",
  general_life_skills: "General life skills",
};

export type LearningProgressionNode = {
  id: string;
  gradeLevel: GradeLevel;
  subject: ProgressionSubject;
  title: string;
  goalArea: string;
  goalStatement: string;
  measurementType: MeasurementTypeCode;
  targetDirection: "increase" | "decrease";
  targetValue: number | null;
  nextIds: string[];
  tags: string[];
};

function node(
  id: string,
  gradeLevel: GradeLevel,
  subject: ProgressionSubject,
  title: string,
  goalStatement: string,
  nextIds: string[] = [],
  measurementType: MeasurementTypeCode = "percentage",
  targetValue: number | null = 80,
): LearningProgressionNode {
  return {
    id,
    gradeLevel,
    subject,
    title,
    goalArea: PROGRESSION_SUBJECT_LABELS[subject],
    goalStatement,
    measurementType,
    targetDirection: "increase",
    targetValue,
    nextIds,
    tags: [subject, `grade-${gradeLevel.toLowerCase()}`],
  };
}

function gradeSequence(): GradeLevel[] {
  return [...GRADE_LEVELS];
}

function nextGrade(grade: GradeLevel): GradeLevel | null {
  const sequence = gradeSequence();
  const index = sequence.indexOf(grade);
  if (index < 0 || index === sequence.length - 1) return null;
  return sequence[index + 1] ?? null;
}

type SkillLadder = {
  subject: ProgressionSubject;
  key: string;
  titleFor: (grade: GradeLevel) => string;
  statementFor: (grade: GradeLevel) => string;
  measurementType?: MeasurementTypeCode;
  targetValue?: number | null;
};

const ladders: SkillLadder[] = [
  {
    subject: "ela_reading",
    key: "decode",
    titleFor: (grade) => `Reading decoding · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} instructional-level phonics/decoding practice, the student will accurately decode targeted words/passages in 4 of 5 probes.`,
    measurementType: "reading_accuracy",
    targetValue: 90,
  },
  {
    subject: "ela_reading",
    key: "fluency",
    titleFor: (grade) => `Reading fluency · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a grade ${grade} instructional-level passage, the student will increase oral reading fluency (words correct per minute) across three consecutive probes.`,
    measurementType: "reading_fluency",
    targetValue: 90,
  },
  {
    subject: "ela_reading",
    key: "comp",
    titleFor: (grade) => `Reading comprehension · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a grade ${grade} instructional-level text and supports, the student will answer literal and inferential questions with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "ela_writing",
    key: "sentence",
    titleFor: (grade) => `Written expression · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a grade ${grade} writing prompt, model, and checklist, the student will produce a complete written response with capitalization, punctuation, and on-topic ideas in 4 of 5 samples.`,
  },
  {
    subject: "ela_writing",
    key: "organize",
    titleFor: (grade) => `Writing organization · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a grade ${grade} prompt and graphic organizer, the student will organize ideas into a coherent written product in 4 of 5 work samples.`,
  },
  {
    subject: "mathematics",
    key: "ops",
    titleFor: (grade) => `Math operations · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} math instruction and visual/manipulative supports as needed, the student will solve targeted computation/problem items with accuracy in 4 of 5 probes.`,
  },
  {
    subject: "mathematics",
    key: "word",
    titleFor: (grade) => `Math word problems · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} word problems and a problem-solving routine, the student will solve problems with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "functional_mathematics",
    key: "money",
    titleFor: (grade) => `Functional math · money · Grade ${grade}`,
    statementFor: (grade) =>
      `Given real or simulated money tasks appropriate for grade ${grade} / transition expectations, the student will count, compare, or make purchases with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "functional_mathematics",
    key: "time",
    titleFor: (grade) => `Functional math · time · Grade ${grade}`,
    statementFor: (grade) =>
      `Given clocks/schedules appropriate for grade ${grade} functional needs, the student will tell time or follow timed routines with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "functional_mathematics",
    key: "measure",
    titleFor: (grade) => `Functional math · measurement · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} functional measurement tasks (length, quantity, recipes, or materials), the student will measure/compare with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "science",
    key: "inquiry",
    titleFor: (grade) => `Science inquiry · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} science content and scaffolds, the student will identify a question, observation, or conclusion using evidence in 4 of 5 opportunities.`,
  },
  {
    subject: "social_studies",
    key: "civics",
    titleFor: (grade) => `Social studies concepts · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade} social studies content and supports, the student will identify key people, places, events, or civic concepts in 4 of 5 opportunities.`,
  },
  {
    subject: "executive_function",
    key: "initiate",
    titleFor: (grade) => `Task initiation · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a clear start cue and grade ${grade} classroom routines, the student will initiate assigned work with increased independence across opportunities.`,
    measurementType: "independence",
    targetValue: 80,
  },
  {
    subject: "executive_function",
    key: "organize",
    titleFor: (grade) => `Organization · Grade ${grade}`,
    statementFor: (grade) =>
      `Given materials checklists appropriate for grade ${grade}, the student will organize and manage materials with accuracy in 4 of 5 opportunities.`,
  },
  {
    subject: "communication",
    key: "request",
    titleFor: (grade) => `Communication requests · Grade ${grade}`,
    statementFor: (grade) =>
      `Given communication opportunities in grade ${grade} settings, the student will request help/items/clarification using an agreed modality in 4 of 5 opportunities.`,
  },
  {
    subject: "communication",
    key: "conversation",
    titleFor: (grade) => `Conversational exchange · Grade ${grade}`,
    statementFor: (grade) =>
      `Given structured practice, the student will participate in a turn-taking conversational exchange appropriate for grade ${grade} expectations in 4 of 5 opportunities.`,
  },
  {
    subject: "asl_communication",
    key: "asl-request",
    titleFor: (grade) => `ASL requesting · Grade ${grade}`,
    statementFor: (grade) =>
      `Given modeled ASL and visual supports, the student will use ASL signs/phrases to request a preferred item or help in grade ${grade} routines in 4 of 5 opportunities.`,
  },
  {
    subject: "asl_communication",
    key: "asl-expressive",
    titleFor: (grade) => `ASL expressive language · Grade ${grade}`,
    statementFor: (grade) =>
      `Given ASL models and practice opportunities, the student will express a grade ${grade}-appropriate idea, need, or response using ASL in 4 of 5 opportunities.`,
  },
  {
    subject: "asl_communication",
    key: "asl-receptive",
    titleFor: (grade) => `ASL receptive understanding · Grade ${grade}`,
    statementFor: (grade) =>
      `Given grade ${grade}-appropriate signed directions/information in ASL, the student will demonstrate understanding through an accurate response in 4 of 5 opportunities.`,
  },
  {
    subject: "general_life_skills",
    key: "routines",
    titleFor: (grade) => `Daily living routines · Grade ${grade}`,
    statementFor: (grade) =>
      `Given visual supports, the student will complete a daily living/classroom routine aligned to grade ${grade} / transition expectations with increasing independence.`,
    measurementType: "task_analysis",
    targetValue: 80,
  },
  {
    subject: "general_life_skills",
    key: "community",
    titleFor: (grade) => `Community / school navigation · Grade ${grade}`,
    statementFor: (grade) =>
      `Given a task analysis, the student will navigate a school/community routine appropriate for grade ${grade} expectations with accuracy in 4 of 5 opportunities.`,
    measurementType: "task_analysis",
    targetValue: 80,
  },
];

function buildProgressions(): LearningProgressionNode[] {
  const nodes: LearningProgressionNode[] = [];

  for (const ladder of ladders) {
    const grades = gradeSequence();
    for (let index = 0; index < grades.length; index += 1) {
      const grade = grades[index]!;
      const id = `${ladder.subject}-${ladder.key}-g${grade.toLowerCase()}`;
      const following = grades[index + 1];
      const nextIds = following
        ? [`${ladder.subject}-${ladder.key}-g${following.toLowerCase()}`]
        : [];
      nodes.push(
        node(
          id,
          grade,
          ladder.subject,
          ladder.titleFor(grade),
          ladder.statementFor(grade),
          nextIds,
          ladder.measurementType ?? "percentage",
          ladder.targetValue ?? 80,
        ),
      );
    }
  }

  return nodes;
}

export const LEARNING_PROGRESSIONS: LearningProgressionNode[] = buildProgressions();

export function listProgressionsForGrade(
  gradeLevel: GradeLevel,
  subject?: ProgressionSubject | "",
): LearningProgressionNode[] {
  return LEARNING_PROGRESSIONS.filter(
    (entry) => entry.gradeLevel === gradeLevel && (!subject || entry.subject === subject),
  );
}

export function getProgression(id: string): LearningProgressionNode | undefined {
  return LEARNING_PROGRESSIONS.find((entry) => entry.id === id);
}

export function getNextProgressions(id: string): LearningProgressionNode[] {
  const current = getProgression(id);
  if (!current) return [];
  return current.nextIds
    .map((nextId) => getProgression(nextId))
    .filter((entry): entry is LearningProgressionNode => Boolean(entry));
}

export function suggestNextAfterMastery(args: {
  gradeLevel?: GradeLevel | "";
  subject?: ProgressionSubject | "";
  currentProgressionId?: string;
}): LearningProgressionNode[] {
  if (args.currentProgressionId) {
    const direct = getNextProgressions(args.currentProgressionId);
    if (direct.length) return direct;
  }

  if (!args.gradeLevel || !args.subject) return [];
  const upcoming = nextGrade(args.gradeLevel);
  if (!upcoming) return listProgressionsForGrade(args.gradeLevel, args.subject).slice(0, 3);
  return listProgressionsForGrade(upcoming, args.subject).slice(0, 4);
}

export function getLearningProgressionCounts() {
  return {
    grades: GRADE_LEVELS.length,
    subjects: PROGRESSION_SUBJECTS.length,
    nodes: LEARNING_PROGRESSIONS.length,
  };
}
