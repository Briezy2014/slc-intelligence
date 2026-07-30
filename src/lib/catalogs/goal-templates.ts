import type { GoalTemplate, MeasurementTypeCode } from "@/lib/catalogs/types";

function goal(
  id: string,
  area: string,
  statement: string,
  measurementType: MeasurementTypeCode,
  targetDirection: "increase" | "decrease",
  targetValue: number | null,
  tags: string[],
): GoalTemplate {
  return { id, area, statement, measurementType, targetDirection, targetValue, tags };
}

const readingTargets = [
  "CVC words",
  "consonant digraphs",
  "blends",
  "silent-e patterns",
  "vowel teams",
  "r-controlled vowels",
  "multisyllabic words",
  "irregular high-frequency words",
  "prefix and suffix patterns",
  "grade-level decodable passages",
];

const comprehensionSkills = [
  "identify the main idea",
  "retell key details in sequence",
  "answer literal questions",
  "answer inferential questions",
  "cite text evidence",
  "compare two characters",
  "summarize a short passage",
  "identify cause and effect",
  "determine author's purpose",
  "monitor understanding and reread",
];

const writingSkills = [
  "write a complete sentence with capitalization and end punctuation",
  "expand a simple sentence with details",
  "organize ideas with a graphic organizer",
  "write a three-sentence paragraph",
  "revise for clarity with a checklist",
  "use transition words between ideas",
  "spell previously taught word patterns",
  "edit capitalization and punctuation",
  "respond to a prompt with a topic sentence",
  "produce a short constructed response",
];

const mathSkills = [
  "add within 20 with fluency",
  "subtract within 20 with fluency",
  "solve one-step word problems",
  "solve two-step word problems",
  "identify place value to hundreds",
  "compare multi-digit numbers",
  "add multi-digit numbers with regrouping",
  "subtract multi-digit numbers with regrouping",
  "represent fractions on a number line",
  "solve multiplication facts through 10",
  "solve division facts through 10",
  "measure length using standard units",
  "interpret a simple bar graph",
  "identify elapsed time to the hour",
  "count money amounts to one dollar",
];

const communicationSkills = [
  "request a preferred item using a complete phrase",
  "request help during a nonpreferred task",
  "greet a peer or adult appropriately",
  "answer a personal information question",
  "follow a two-step verbal direction",
  "follow a three-step verbal direction",
  "use a communication device to make a choice",
  "participate in a turn-taking conversation",
  "describe a familiar event with two details",
  "ask a clarifying question when confused",
];

const socialEmotionalSkills = [
  "identify a feeling using a feelings chart",
  "use a calm-down strategy when escalated",
  "accept a nonpreferred directive with support",
  "wait for a turn during a preferred activity",
  "use expected language when frustrated",
  "join a peer activity with an invitation",
  "repair a social misunderstanding with a prompt",
  "transition between activities with a visual schedule",
  "remain in the instructional area during group work",
  "complete a check-in/check-out rating honestly",
];

const adaptiveSkills = [
  "complete a morning arrival routine with a checklist",
  "pack and unpack materials with visual supports",
  "follow a hygiene routine with decreasing prompts",
  "manage a personal schedule with timer support",
  "prepare materials for the next activity",
  "clean up a work area after instruction",
  "navigate the cafeteria line with staff proximity",
  "complete a classroom job with a task card",
  "use a locker or cubby independently",
  "organize a binder or folder system",
];

const behaviorSkills = [
  "remain on-task during independent work",
  "request a break using an agreed signal",
  "use replacement language instead of protest behavior",
  "return to task after a prompt",
  "follow the classroom expectation matrix",
  "complete a transition without property disruption",
  "use a break card before leaving the area",
  "participate in a restorative conversation after conflict",
  "keep hands and body safe during group activities",
  "complete a cool-down routine and re-enter class",
];

const motorSkills = [
  "cut along a straight line with scissors",
  "copy letters from a near-point model",
  "write first and last name legibly",
  "open and close containers needed for lunch",
  "complete a fastening task with clothing",
  "maintain a functional pencil grasp during writing",
  "navigate stairs using a railing safely",
  "carry materials between classrooms safely",
  "complete a fine-motor warm-up sequence",
  "place materials in designated classroom locations",
];

function percentGoals(
  prefix: string,
  area: string,
  skills: string[],
  tags: string[],
  stem: (skill: string) => string,
): GoalTemplate[] {
  return skills.map((skill, index) =>
    goal(
      `${prefix}-${index + 1}`,
      area,
      stem(skill),
      "percentage",
      "increase",
      80,
      tags,
    ),
  );
}

const curatedGoals: GoalTemplate[] = [
  goal(
    "reading-fluency-1",
    "Reading fluency",
    "Given a grade-level or instructional-level passage, the student will read aloud at an increased words-correct-per-minute rate across three consecutive probes.",
    "reading_fluency",
    "increase",
    90,
    ["reading", "fluency"],
  ),
  goal(
    "reading-accuracy-1",
    "Reading accuracy",
    "Given an instructional-level passage, the student will read with increased accuracy across three consecutive probes.",
    "reading_accuracy",
    "increase",
    95,
    ["reading", "accuracy"],
  ),
  goal(
    "independence-1",
    "Task independence",
    "Given a familiar classroom routine and visual supports, the student will complete the routine with increased independence across opportunities.",
    "independence",
    "increase",
    80,
    ["independence", "routines"],
  ),
  goal(
    "prompt-level-1",
    "Prompt fading",
    "Given a multi-step classroom task, the student will complete the task with a reduced prompt level across opportunities.",
    "prompt_level",
    "decrease",
    null,
    ["prompting", "independence"],
  ),
  goal(
    "duration-1",
    "Sustained attention",
    "Given an independent work task, the student will increase the duration of on-task engagement before needing a break.",
    "duration",
    "increase",
    10,
    ["attention", "engagement"],
  ),
  goal(
    "latency-1",
    "Task initiation",
    "Given a clear start cue, the student will decrease the latency to begin the assigned task.",
    "latency",
    "decrease",
    30,
    ["initiation", "executive-function"],
  ),
  goal(
    "frequency-1",
    "Help requests",
    "Given a difficult academic task, the student will increase appropriate help requests and decrease task refusal behaviors.",
    "frequency",
    "increase",
    3,
    ["communication", "behavior"],
  ),
  goal(
    "task-analysis-1",
    "Multi-step routines",
    "Given a task analysis for a classroom or community routine, the student will complete an increasing percentage of steps independently.",
    "task_analysis",
    "increase",
    80,
    ["task-analysis", "adaptive"],
  ),
  goal(
    "rubric-1",
    "Written expression quality",
    "Given a writing prompt and rubric, the student will improve the overall writing rubric score across consecutive assignments.",
    "rubric",
    "increase",
    3,
    ["writing", "rubric"],
  ),
  goal(
    "custom-1",
    "Custom progress measure",
    "Given a specially designed instruction opportunity, the student will demonstrate progress on an individualized numeric measure defined by the IEP team.",
    "custom_numeric",
    "increase",
    null,
    ["custom"],
  ),
];

export const GOAL_TEMPLATES: GoalTemplate[] = [
  ...curatedGoals,
  ...percentGoals(
    "decoding",
    "Reading decoding",
    readingTargets,
    ["reading", "decoding"],
    (skill) =>
      `Given specially designed phonics instruction and practice opportunities with ${skill}, the student will accurately decode targeted items in 4 of 5 consecutive probes.`,
  ),
  ...percentGoals(
    "comprehension",
    "Reading comprehension",
    comprehensionSkills,
    ["reading", "comprehension"],
    (skill) =>
      `Given an instructional-level text and graphic organizer supports, the student will ${skill} with accuracy in 4 of 5 opportunities.`,
  ),
  ...percentGoals(
    "writing",
    "Written expression",
    writingSkills,
    ["writing"],
    (skill) =>
      `Given a writing prompt, model, and checklist, the student will ${skill} in 4 of 5 consecutive work samples.`,
  ),
  ...percentGoals(
    "math",
    "Mathematics",
    mathSkills,
    ["math"],
    (skill) =>
      `Given specially designed math instruction and manipulatives or visual supports as needed, the student will ${skill} with accuracy in 4 of 5 probes.`,
  ),
  ...percentGoals(
    "communication",
    "Communication",
    communicationSkills,
    ["speech", "language", "communication"],
    (skill) =>
      `Given structured practice and communication supports, the student will ${skill} in 4 of 5 opportunities across settings.`,
  ),
  ...percentGoals(
    "social",
    "Social-emotional",
    socialEmotionalSkills,
    ["social", "emotional", "behavior"],
    (skill) =>
      `Given explicit social-emotional instruction and in-the-moment coaching, the student will ${skill} in 4 of 5 observed opportunities.`,
  ),
  ...percentGoals(
    "adaptive",
    "Adaptive / daily living",
    adaptiveSkills,
    ["adaptive", "independence"],
    (skill) =>
      `Given visual supports and a consistent routine, the student will ${skill} with accuracy in 4 of 5 opportunities.`,
  ),
  ...percentGoals(
    "behavior",
    "Behavior / engagement",
    behaviorSkills,
    ["behavior", "engagement"],
    (skill) =>
      `Given a behavior support plan and explicitly taught replacement skills, the student will ${skill} during structured observations in 4 of 5 sessions.`,
  ),
  ...percentGoals(
    "motor",
    "Motor / functional access",
    motorSkills,
    ["motor", "ot", "pt"],
    (skill) =>
      `Given adapted materials and instructional scaffolding, the student will ${skill} in 4 of 5 opportunities.`,
  ),
];

export function getGoalTemplate(id: string): GoalTemplate | undefined {
  return GOAL_TEMPLATES.find((template) => template.id === id);
}

export function goalTemplatesByArea(): Record<string, GoalTemplate[]> {
  return GOAL_TEMPLATES.reduce<Record<string, GoalTemplate[]>>((groups, template) => {
    groups[template.area] = groups[template.area] ?? [];
    groups[template.area].push(template);
    return groups;
  }, {});
}
