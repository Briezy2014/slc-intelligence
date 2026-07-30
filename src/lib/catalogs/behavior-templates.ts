export type BehaviorDefinitionTemplate = {
  id: string;
  name: string;
  category: string;
  operationalDefinition: string;
  examples: string[];
  nonexamples: string[];
  suggestedStrategies: string[];
};

export const BEHAVIOR_SETTING_OPTIONS = [
  "Classroom · whole group",
  "Classroom · small group",
  "Classroom · independent work",
  "Hallway / transition",
  "Cafeteria",
  "Specials / related arts",
  "Recess / unstructured",
  "Arrival / dismissal",
  "Related service session",
  "Bus / transportation",
] as const;

export const BEHAVIOR_ACTIVITY_OPTIONS = [
  "Instructional lesson",
  "Independent seatwork",
  "Transition between activities",
  "Waiting / downtime",
  "Peer interaction",
  "Adult direction / demand",
  "Non-preferred task",
  "Preferred activity ending",
  "Group discussion",
  "Technology use",
] as const;

export const BEHAVIOR_ANTECEDENT_OPTIONS = [
  "Adult presented a demand or non-preferred task",
  "Preferred activity ended or was interrupted",
  "Peer conflict or social bid occurred",
  "Wait time / delay before access",
  "Transition cue given",
  "Noise / sensory change in environment",
  "Unclear expectation or materials not ready",
  "Attention diverted away from student",
] as const;

export const BEHAVIOR_CONSEQUENCE_OPTIONS = [
  "Adult attention / redirect",
  "Peer attention",
  "Task removed or delayed",
  "Access to preferred item/activity",
  "Break provided",
  "Proximity support",
  "Ignore / planned ignoring",
  "Prompt to use replacement skill",
] as const;

export const BEHAVIOR_TRY_NEXT_SUGGESTIONS = [
  "Precorrect expectations before the trigger setting",
  "Teach and practice a replacement request (help, break, wait)",
  "Increase opportunities for preferred choice within the demand",
  "Use a visual schedule / first-then board",
  "Reduce task length and build behavioral momentum",
  "Provide a calm-down protocol with clear re-entry criteria",
  "Add differential reinforcement for the replacement skill",
  "Check setting events (sleep, hunger, sensory load) with the team",
] as const;

export const BEHAVIOR_DEFINITION_TEMPLATES: BehaviorDefinitionTemplate[] = [
  {
    id: "task-refusal",
    name: "Task refusal",
    category: "Escape / avoidance",
    operationalDefinition:
      "Student verbally or nonverbally refuses a presented academic or routine demand (says no, pushes materials away, or leaves the instructional area) within 10 seconds of the demand.",
    examples: [
      "Pushes worksheet off desk after teacher prompt to begin",
      "Says “I’m not doing that” and turns away from materials",
      "Leaves seat and walks to doorway after a demand",
    ],
    nonexamples: [
      "Asks a clarifying question then starts work",
      "Takes a brief pause then resumes with prompt",
      "Requests help using an approved break/help card",
    ],
    suggestedStrategies: [
      "Precorrection + first-then",
      "Break/help card replacement skill",
      "Task chunking with behavioral momentum",
    ],
  },
  {
    id: "elopement",
    name: "Elopement from assigned area",
    category: "Escape / access",
    operationalDefinition:
      "Student leaves the assigned instructional area without adult permission by moving more than 3 feet beyond the designated boundary.",
    examples: [
      "Runs out of classroom doorway during instruction",
      "Walks into hallway without a pass during seatwork",
    ],
    nonexamples: [
      "Goes to designated calm-down spot with permission",
      "Transitions with the class when dismissed",
    ],
    suggestedStrategies: [
      "Active supervision near exits",
      "Teach request for break/space",
      "High-probability request sequence before transitions",
    ],
  },
  {
    id: "disruption",
    name: "Verbal disruption",
    category: "Attention",
    operationalDefinition:
      "Student produces loud vocalizations, calling out, or side conversations that interrupt instruction for 3 or more seconds without being called on.",
    examples: [
      "Calls out answers repeatedly without raising hand",
      "Makes loud noises during independent work",
    ],
    nonexamples: ["Participates when called on", "Uses whisper voice during approved partner talk"],
    suggestedStrategies: [
      "Teach hand-raise / talk-move expectations",
      "Differential reinforcement of appropriate participation",
      "Planned ignoring paired with praise for quiet starts",
    ],
  },
  {
    id: "aggression-contact",
    name: "Physical aggression (peer/adult contact)",
    category: "Safety",
    operationalDefinition:
      "Student makes forceful physical contact with another person using hands, feet, or body (hit, kick, shove, bite) that is not accidental play contact.",
    examples: [
      "Hits peer on the arm during conflict",
      "Kicks adult when redirected from preferred item",
    ],
    nonexamples: [
      "Accidental bump while walking in line",
      "High-five during approved social routine",
    ],
    suggestedStrategies: [
      "Safety protocol + team crisis plan",
      "Teach alternative protest/communication",
      "Reduce known setting-event load; increase staff proximity",
    ],
  },
  {
    id: "property-destruction",
    name: "Property destruction",
    category: "Escape / expression",
    operationalDefinition:
      "Student damages or attempts to damage materials or furniture by throwing, tearing, or striking objects with intent beyond normal use.",
    examples: ["Tears worksheet into pieces", "Throws chair or chromebook onto floor"],
    nonexamples: ["Drops pencil accidentally", "Crumples paper while erasing and then continues"],
    suggestedStrategies: [
      "Clear start expectations and materials staging",
      "Teach request for help/break before escalation",
      "Reinforce calm material use with specific praise",
    ],
  },
  {
    id: "self-injury",
    name: "Self-injurious behavior",
    category: "Safety",
    operationalDefinition:
      "Student engages in self-directed forceful contact (head hit, bite to self, scratch) that can cause tissue damage or is repeated in a burst of 2+ within 10 seconds.",
    examples: ["Hits own head with hand", "Bites own wrist during escalation"],
    nonexamples: ["Rubs eyes due to fatigue", "Taps desk rhythmically without self-harm"],
    suggestedStrategies: [
      "Immediate safety response per team plan",
      "Function-based replacement communication",
      "Sensory/regulation supports reviewed with team",
    ],
  },
  {
    id: "noncompliance-delay",
    name: "Delayed compliance",
    category: "Escape / control",
    operationalDefinition:
      "Student does not begin the requested action within 30 seconds of a clear adult directive after one reminder.",
    examples: [
      "Stares at materials for over 30 seconds after start prompt",
      "Continues preferred app after shutdown request",
    ],
    nonexamples: ["Starts within 10 seconds", "Asks for clarification then starts"],
    suggestedStrategies: [
      "Countdown + visual timer",
      "Two-minute start commitment",
      "Choice within demand (which problem first)",
    ],
  },
  {
    id: "social-withdrawal",
    name: "Social withdrawal / shutdown",
    category: "Escape / regulation",
    operationalDefinition:
      "Student ceases responding to peers/adults and instructional materials for 2+ minutes (head down, no verbal response, no task engagement) following a demand or social bid.",
    examples: [
      "Puts head down and stops responding after group question",
      "Refuses all communication for several minutes after peer conflict",
    ],
    nonexamples: [
      "Quiet independent work while still responding to prompts",
      "Approved calm-down with check-in card",
    ],
    suggestedStrategies: [
      "Co-regulation script and re-entry steps",
      "Reduced verbal load; offer nonverbal response options",
      "Teach request for space with time limit",
    ],
  },
];

export function getBehaviorDefinitionTemplate(id: string) {
  return BEHAVIOR_DEFINITION_TEMPLATES.find((entry) => entry.id === id) ?? null;
}
