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
  "Classroom · 1:1 instruction",
  "Hallway / transition",
  "Cafeteria",
  "Specials / related arts",
  "PE / gym",
  "Recess / unstructured",
  "Arrival / dismissal",
  "Bus / transportation",
  "Bus stop / loading zone",
  "Related service session",
  "Office / main office",
  "Nurse / clinic",
  "Classroom calm-down / break space",
  "Sensory room / regulation space",
  "Restroom / locker room",
  "Assembly / large gathering",
  "Library / media center",
  "Computer lab / technology area",
  "Playground equipment area",
  "Community outing / field trip",
  "After-school / extended day",
  "Home visit / virtual session",
] as const;

export const BEHAVIOR_ACTIVITY_OPTIONS = [
  "Instructional lesson",
  "Independent seatwork",
  "Small-group instruction",
  "1:1 adult support",
  "Transition between activities",
  "Waiting / downtime",
  "Peer interaction",
  "Adult direction / demand",
  "Non-preferred task",
  "Preferred activity ending",
  "Group discussion",
  "Technology use",
  "Assessment / testing",
  "Lunch / snack",
  "Recess game / free play",
  "Arrival routine",
  "Dismissal routine",
  "Bus ride",
  "Bathroom routine",
  "Cleanup / materials put-away",
  "Fire / safety drill",
  "Substitute teacher present",
  "Visitor / unfamiliar adult present",
  "Choice time / preferred activity",
  "Homework review",
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
  "Peer received attention / praise nearby",
  "Adult was attending to another student",
  "Denied access to item, person, or activity",
  "Told “no,” “stop,” or “not now”",
  "Corrective feedback or redirection given",
  "Academic task difficulty increased",
  "Task length or workload increased",
  "Crowding / proximity of peers increased",
  "Unexpected schedule change",
  "Substitute or unfamiliar staff present",
  "Peer teased, mocked, or excluded student",
  "Lost a game / competitive activity",
  "Physical prompt or hand-over-hand support",
  "Asked to share materials or space",
  "Asked to wait in line",
  "Technology removed or timed out",
  "Setting event suspected (fatigue, hunger, pain, missed meds)",
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
  "Verbal reprimand / corrective statement",
  "Loss of privilege / preferred activity",
  "Sent to calm-down / break space",
  "Office referral / administrator contact",
  "Parent/guardian contacted",
  "Physical intervention per crisis plan",
  "Materials removed for safety",
  "Peer moved away / seating change",
  "Help provided (adult completes part of task)",
  "Choice offered within demand",
  "Visual support re-presented",
  "Timer / countdown started",
  "Reinforcer delivered after compliance",
  "Class continued without response (extinction)",
  "Safety protocol activated",
  "Nurse / counselor contacted",
  "Bus / transportation consequence applied",
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
  "Increase noncontingent attention on a dense schedule",
  "Teach an attention-seeking replacement (raise hand, help card)",
  "Practice functional communication for escape (break card)",
  "Use high-probability request sequence before hard demand",
  "Add active supervision near exits and high-risk zones",
  "Teach protest language instead of aggression or property damage",
  "Review crisis / safety plan with all assigned staff",
  "Pair peer attention with appropriate social bids",
  "Use planned ignoring for low-risk attention-maintained behavior",
  "Offer sensory regulation options before escalation",
  "Clarify body boundaries and consent language with team script",
  "Increase proximity and scanning during unstructured times",
  "Coordinate home–school consistency for the replacement skill",
  "Collect ABC data across 3+ settings before changing the plan",
  "Schedule preference assessment for reinforcers",
  "Reduce public correction; use quiet redirect when safe",
  "Plan re-entry after removal so escape is not the only payoff",
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
    id: "work-avoidance-delay",
    name: "Work avoidance / stalling",
    category: "Escape / avoidance",
    operationalDefinition:
      "Student delays starting or completing assigned work for 2+ minutes by sharpening pencils, asking off-topic questions, organizing materials repeatedly, or other stall behaviors after a clear start cue.",
    examples: [
      "Repeatedly asks to use the restroom when independent work begins",
      "Spends several minutes rearranging materials instead of starting",
    ],
    nonexamples: ["Starts within 30 seconds", "Uses approved break card then returns"],
    suggestedStrategies: [
      "Timed start commitment",
      "First-then with short work interval",
      "Reduce task length; increase check-ins",
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
    id: "elopement-building",
    name: "Elopement from building / campus",
    category: "Safety",
    operationalDefinition:
      "Student exits the school building or leaves designated campus boundaries without permission or staff escort.",
    examples: ["Runs out exterior door to parking lot", "Leaves playground fence line"],
    nonexamples: ["Exits with class for recess under supervision"],
    suggestedStrategies: [
      "Immediate safety protocol",
      "Door/exit supervision plan",
      "Teach safe request for space indoors",
    ],
  },
  {
    id: "attention-calling-out",
    name: "Calling out / blurting for attention",
    category: "Attention",
    operationalDefinition:
      "Student produces loud vocalizations, calling out, or side talk for 3+ seconds without being called on, resulting in adult or peer attention.",
    examples: [
      "Calls out answers repeatedly without raising hand",
      "Makes loud noises during independent work until adult responds",
    ],
    nonexamples: ["Participates when called on", "Uses whisper voice during approved partner talk"],
    suggestedStrategies: [
      "Teach hand-raise / talk-move expectations",
      "Differential reinforcement of appropriate participation",
      "Noncontingent attention on a dense schedule",
    ],
  },
  {
    id: "attention-leave-seat",
    name: "Out-of-seat to obtain adult attention",
    category: "Attention",
    operationalDefinition:
      "Student leaves assigned seat/area without permission and approaches or calls to an adult in a way that reliably produces adult interaction.",
    examples: [
      "Leaves seat to stand by teacher desk during instruction",
      "Walks across room saying teacher’s name until acknowledged",
    ],
    nonexamples: ["Gets materials with permission", "Goes to help station when scheduled"],
    suggestedStrategies: [
      "Teach attention signal / help card",
      "Scheduled check-ins",
      "Reinforce in-seat requests",
    ],
  },
  {
    id: "attention-disruption",
    name: "Disruption to obtain peer attention",
    category: "Attention",
    operationalDefinition:
      "Student engages in loud noises, jokes, faces, or antics that interrupt instruction and produce peer laughter, comments, or looking.",
    examples: ["Makes funny noises until peers laugh", "Drops materials for peer reaction"],
    nonexamples: ["Shares a joke during approved social time"],
    suggestedStrategies: [
      "Planned ignoring of low-risk antics",
      "Teach peer attention for appropriate bids",
      "Seat change / active supervision",
    ],
  },
  {
    id: "attention-tantrum",
    name: "Tantrum / protest for adult attention",
    category: "Attention",
    operationalDefinition:
      "Student cries, yells, stomps, or drops to floor for 30+ seconds following reduced adult attention or after another student receives attention.",
    examples: [
      "Falls to floor crying when teacher helps a peer",
      "Yells teacher’s name repeatedly when ignored briefly",
    ],
    nonexamples: ["Brief frustration then uses break card"],
    suggestedStrategies: [
      "Noncontingent attention",
      "Teach wait / “my turn” language",
      "Reinforce calm attention requests",
    ],
  },
  {
    id: "attention-property-for-attention",
    name: "Property misuse to gain attention",
    category: "Attention",
    operationalDefinition:
      "Student knocks materials, taps loudly, or lightly throws small items in a way that draws adult/peer attention without clear intent to destroy property.",
    examples: ["Repeatedly knocks pencil cup until adult looks", "Slaps desk loudly when ignored"],
    nonexamples: ["Accidental drop", "Approved fidget use"],
    suggestedStrategies: [
      "Teach quiet attention signal",
      "Differential reinforcement of alternative behavior",
      "Remove audience when safe",
    ],
  },
  {
    id: "attention-repeating",
    name: "Repetitive questioning / interruption for attention",
    category: "Attention",
    operationalDefinition:
      "Student repeats the same question or statement 3+ times within 2 minutes after an answer was already provided, interrupting instruction to obtain adult response.",
    examples: [
      "Asks “What are we doing?” repeatedly after explanation",
      "Repeats “Watch me” until adult looks",
    ],
    nonexamples: ["Asks a new clarifying question once"],
    suggestedStrategies: ["Visual answer board", "Teach wait / later card", "Scheduled talk time"],
  },
  {
    id: "access-item",
    name: "Behavior to access preferred item/activity",
    category: "Access / tangible",
    operationalDefinition:
      "Student engages in problem behavior within 10 seconds of denied or delayed access to a preferred item/activity, and access often follows the behavior.",
    examples: ["Grabs tablet after being told wait", "Yells until preferred toy is given"],
    nonexamples: ["Requests item with words/card then waits"],
    suggestedStrategies: [
      "Teach request + wait with timer",
      "First-then access",
      "Preference-based schedule of reinforcement",
    ],
  },
  {
    id: "access-peer",
    name: "Behavior to access peer / social interaction",
    category: "Access / tangible",
    operationalDefinition:
      "Student uses inappropriate physical or verbal behavior to initiate or continue peer interaction after a peer moved away or declined.",
    examples: ["Pulls peer’s arm to force continued play", "Blocks doorway so peer cannot leave"],
    nonexamples: ["Invites peer with words or approved social script"],
    suggestedStrategies: [
      "Teach social initiation script",
      "Structured peer play with adult coaching",
      "Reinforce appropriate invitations",
    ],
  },
  {
    id: "verbal-disruption",
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
    id: "profanity",
    name: "Profanity / cussing",
    category: "Verbal",
    operationalDefinition:
      "Student uses swear words, vulgar language, or sexualized language audible to others during school activities.",
    examples: ["Yells swear words at staff after redirection", "Uses vulgar insults toward peers"],
    nonexamples: ["Reads a swear word aloud when it appears in assigned text as instructed"],
    suggestedStrategies: [
      "Teach replacement protest language",
      "Calm redirect + practice alternate phrase",
      "Reduce audience; reinforce clean language",
    ],
  },
  {
    id: "verbal-threats",
    name: "Verbal threats",
    category: "Verbal",
    operationalDefinition:
      "Student makes statements threatening physical harm to self, peers, or staff (for example “I’ll hit you,” “I’ll kill you”) during conflict or redirection.",
    examples: ["Says “I’m going to beat you up” to a peer", "Threatens staff after a demand"],
    nonexamples: ["Discusses fictional movie violence during assigned media lesson"],
    suggestedStrategies: [
      "Safety assessment per district protocol",
      "Teach anger/protest script",
      "Team review of threat response plan",
    ],
  },
  {
    id: "name-calling",
    name: "Name-calling / verbal aggression",
    category: "Verbal",
    operationalDefinition:
      "Student directs insults, put-downs, or demeaning labels at peers or adults that interrupt instruction or escalate conflict.",
    examples: [
      "Calls peer stupid/ugly during group work",
      "Uses demeaning nickname after correction",
    ],
    nonexamples: ["Friendly teasing clearly welcomed by peer during free time"],
    suggestedStrategies: [
      "Teach respectful disagreement scripts",
      "Restorative repair when appropriate",
      "Reinforce kind peer language",
    ],
  },
  {
    id: "aggression-hit",
    name: "Hitting / striking others",
    category: "Physical aggression",
    operationalDefinition:
      "Student makes forceful hand contact with another person (hit, slap, punch) that is not accidental play contact.",
    examples: ["Hits peer on the arm during conflict", "Slaps adult when redirected"],
    nonexamples: ["High-five during approved social routine", "Accidental bump in line"],
    suggestedStrategies: [
      "Safety protocol + crisis plan",
      "Teach alternative protest/communication",
      "Increase staff proximity during triggers",
    ],
  },
  {
    id: "aggression-kick",
    name: "Kicking others",
    category: "Physical aggression",
    operationalDefinition:
      "Student uses foot/leg to strike another person with force (kick, stomp on foot) that is not accidental.",
    examples: ["Kicks adult when preferred item removed", "Kicks peer under table during conflict"],
    nonexamples: ["Foot contacts peer accidentally while walking"],
    suggestedStrategies: [
      "Safety positioning",
      "Teach break/help request before escalation",
      "Reduce known triggers; practice calm feet",
    ],
  },
  {
    id: "aggression-bite",
    name: "Biting others",
    category: "Physical aggression",
    operationalDefinition:
      "Student places teeth on another person’s skin/clothing with pressure, with or without breaking skin.",
    examples: ["Bites peer’s arm during toy dispute", "Bites staff during hold/redirection"],
    nonexamples: ["Mouths clothing without contacting another person"],
    suggestedStrategies: [
      "Immediate safety response",
      "Function-based replacement communication",
      "Protective positioning and dense teaching of protest skill",
    ],
  },
  {
    id: "aggression-scratch-spit",
    name: "Scratching / spitting at others",
    category: "Physical aggression",
    operationalDefinition:
      "Student scratches another person with nails or projects saliva toward another person.",
    examples: ["Scratches peer’s face/arm", "Spits at staff after “no”"],
    nonexamples: ["Coughs without directed spit"],
    suggestedStrategies: [
      "Hygiene + safety protocol",
      "Teach replacement protest",
      "Reduce audience; reinforce clean hands/mouth",
    ],
  },
  {
    id: "aggression-push-shove",
    name: "Pushing / shoving",
    category: "Physical aggression",
    operationalDefinition:
      "Student uses hands/body to forcefully move another person from their position without consent.",
    examples: ["Shoves peer out of line", "Pushes adult blocking doorway"],
    nonexamples: ["Gentle tap to get peer attention during approved activity"],
    suggestedStrategies: [
      "Teach wait/space language",
      "Practice line routines",
      "Increase active supervision in congested areas",
    ],
  },
  {
    id: "aggression-throw-objects",
    name: "Throwing objects at people",
    category: "Physical aggression",
    operationalDefinition:
      "Student propels objects (pencils, books, toys, materials) toward a person in a way that could cause harm or interruption.",
    examples: ["Throws pencil at peer", "Hurls workbook toward teacher"],
    nonexamples: ["Passes ball during PE as instructed"],
    suggestedStrategies: [
      "Clear materials staging",
      "Teach protest/break request",
      "Safety distance and remove throwable hazards when escalating",
    ],
  },
  {
    id: "property-furniture",
    name: "Throwing / flipping furniture",
    category: "Property destruction",
    operationalDefinition:
      "Student tips, flips, throws, or forcefully pushes furniture (chair, desk, table) creating a safety risk.",
    examples: ["Flips desk during demand", "Throws chair toward wall/people"],
    nonexamples: ["Moves chair normally to sit"],
    suggestedStrategies: [
      "Safety protocol",
      "Teach early protest signal",
      "Environmental arrangement; reduce heavy loose furniture when indicated",
    ],
  },
  {
    id: "property-destruction",
    name: "Property destruction (materials)",
    category: "Property destruction",
    operationalDefinition:
      "Student damages or attempts to damage materials or classroom items by tearing, breaking, slamming, or striking objects beyond normal use.",
    examples: ["Tears worksheet into pieces", "Throws Chromebook onto floor"],
    nonexamples: ["Drops pencil accidentally", "Crumples paper while erasing then continues"],
    suggestedStrategies: [
      "Clear start expectations and materials staging",
      "Teach request for help/break before escalation",
      "Reinforce calm material use",
    ],
  },
  {
    id: "property-slam",
    name: "Slamming doors / surfaces",
    category: "Property destruction",
    operationalDefinition:
      "Student forcefully slams doors, lockers, or surfaces producing loud impact and interrupting the setting.",
    examples: ["Slams classroom door when leaving", "Pounds fists on table repeatedly"],
    nonexamples: ["Closes door normally"],
    suggestedStrategies: [
      "Teach calm exit routine",
      "Practice quiet close with reinforcement",
      "Address escape/attention function with replacement",
    ],
  },
  {
    id: "aggression-contact",
    name: "Physical aggression (peer/adult contact)",
    category: "Physical aggression",
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
    id: "self-injury-headbang",
    name: "Head-banging",
    category: "Safety",
    operationalDefinition:
      "Student strikes own head against a surface (desk, wall, floor) or with hands/objects with force.",
    examples: ["Bangs head on desk after demand", "Hits head with fist repeatedly"],
    nonexamples: ["Rests head on desk quietly"],
    suggestedStrategies: [
      "Crisis/safety response",
      "Protective environment as indicated",
      "Teach regulation + functional communication",
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
  {
    id: "sexualized-touch-breasts",
    name: "Inappropriate touching — breasts / chest",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student touches another person’s breasts/chest area with hands or body without consent, or attempts to do so, during school activities.",
    examples: [
      "Grabs or gropes a peer’s chest/breasts",
      "Reaches toward adult chest during proximity",
    ],
    nonexamples: [
      "Accidental brush in crowded hallway with immediate stop and apology",
      "Approved contact during nurse/care routine by authorized staff",
    ],
    suggestedStrategies: [
      "Immediate interrupt + body-boundary teaching",
      "Safety/supervision plan; notify team per policy",
      "Teach consent language and replacement greeting/request",
    ],
  },
  {
    id: "sexualized-touch-buttocks",
    name: "Inappropriate touching — buttocks",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student touches, grabs, or pinches another person’s buttocks without consent, or attempts to do so.",
    examples: ["Grabs peer’s butt in line", "Slaps/pinches another student’s buttocks"],
    nonexamples: ["Accidental contact in crowded space with stop and apology"],
    suggestedStrategies: [
      "Clear body-boundary curriculum and visuals",
      "Increased supervision in lines/transitions",
      "Teach hands-to-self and appropriate social greeting",
    ],
  },
  {
    id: "sexualized-touch-crotch",
    name: "Inappropriate touching — genital / crotch area",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student touches another person’s genital/crotch area (over or under clothing) without consent, or attempts to do so.",
    examples: [
      "Grabs peer’s crotch during recess",
      "Reaches toward another person’s genital area in classroom",
    ],
    nonexamples: ["Personal care provided by authorized staff following care plan"],
    suggestedStrategies: [
      "Immediate safety response per district policy",
      "Dense teaching of private-body rules",
      "Supervision plan; team/admin/parent notification as required",
    ],
  },
  {
    id: "sexualized-self-touch-public",
    name: "Public sexual self-touch / masturbation",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student touches own genital area in a sexualized manner that is visible to others in a non-private school setting.",
    examples: ["Rubbing genital area over clothing during class", "Exposed self-touch on bus"],
    nonexamples: ["Brief clothing adjustment", "Medical/itch response that stops with redirect"],
    suggestedStrategies: [
      "Private redirect + teach “bathroom/private place” rule",
      "Sensory/replacement assessment with team",
      "Increase engagement and privacy teaching",
    ],
  },
  {
    id: "sexualized-exposure",
    name: "Exposing private body parts",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student intentionally removes clothing or otherwise exposes breasts, buttocks, or genitals to others outside approved private care contexts.",
    examples: ["Pulls down pants in classroom", "Lifts shirt to expose breasts/chest to peers"],
    nonexamples: ["Changing for PE in designated area with staff supervision as planned"],
    suggestedStrategies: [
      "Immediate privacy/safety response",
      "Teach private vs public body rules",
      "Supervision and clothing supports as needed",
    ],
  },
  {
    id: "sexualized-comments",
    name: "Sexualized comments / gestures",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student makes sexual comments, requests, or gestures directed at peers/adults that are inappropriate for the school setting.",
    examples: [
      "Makes sexual remarks about a peer’s body",
      "Uses sexual gestures toward staff/peers",
    ],
    nonexamples: ["Age-appropriate health lesson discussion with teacher direction"],
    suggestedStrategies: [
      "Teach replacement social language",
      "Clear stop script + practice",
      "Coordinate with counseling/health curriculum as appropriate",
    ],
  },
  {
    id: "sexualized-kiss-hug",
    name: "Unwanted kissing / hugging",
    category: "Sexualized / boundary",
    operationalDefinition:
      "Student kisses, attempts to kiss, or forcefully hugs another person after the person moved away, said no, or did not consent.",
    examples: ["Tries to kiss peer on playground after “no”", "Bear-hugs adult who stepped back"],
    nonexamples: ["Consensual side-hug during approved greeting routine"],
    suggestedStrategies: [
      "Teach consent and greeting options (wave, fist bump)",
      "Practice hands-to-self",
      "Supervise high-risk social times",
    ],
  },
  {
    id: "bullying-physical",
    name: "Bullying / targeted physical intimidation",
    category: "Social / peer",
    operationalDefinition:
      "Student repeatedly uses physical intimidation (blocking, poking, pushing) toward the same peer across incidents to coerce or exclude.",
    examples: [
      "Repeatedly blocks same peer from joining game",
      "Daily poking of same peer after redirects",
    ],
    nonexamples: ["Single conflict that is repaired"],
    suggestedStrategies: [
      "Active supervision + seating/play plans",
      "Teach inclusive play scripts",
      "Document pattern for team review",
    ],
  },
  {
    id: "stealing",
    name: "Taking others’ property",
    category: "Access / tangible",
    operationalDefinition:
      "Student takes another person’s or classroom property without permission and does not return it when prompted once.",
    examples: ["Takes peer’s snack from backpack", "Removes classroom supplies to keep"],
    nonexamples: ["Borrows with permission and returns"],
    suggestedStrategies: [
      "Teach ask/wait for items",
      "Clear ownership labels",
      "Reinforce returning property",
    ],
  },
  {
    id: "technology-misuse",
    name: "Technology misuse / off-task device use",
    category: "Escape / access",
    operationalDefinition:
      "Student uses device for non-approved content/apps or refuses to follow device expectations after one redirect.",
    examples: ["Opens games during instruction", "Refuses to close non-approved site"],
    nonexamples: ["Uses approved educational app as directed"],
    suggestedStrategies: [
      "Device visual expectations",
      "First-then technology access",
      "Supervised device zones",
    ],
  },
  {
    id: "bolting-transition",
    name: "Bolting during transition",
    category: "Escape / access",
    operationalDefinition:
      "Student runs/moves ahead of the group or away from the line during a transition without staying in the designated transition path.",
    examples: ["Sprints down hallway ahead of class", "Runs toward exit during dismissal line"],
    nonexamples: ["Walks in line with class"],
    suggestedStrategies: [
      "Transition helper role + proximity",
      "Visual walking feet expectations",
      "Practice transitions with reinforcement",
    ],
  },
  {
    id: "food-refusal-grab",
    name: "Food stealing / grabbing",
    category: "Access / tangible",
    operationalDefinition: "Student grabs food from peers or serving areas without permission.",
    examples: ["Takes food from peer’s tray", "Grabs extras from serving line without asking"],
    nonexamples: ["Requests seconds appropriately"],
    suggestedStrategies: [
      "Teach ask script",
      "Preferenced snack schedule if related to setting events",
      "Proximity support at meals",
    ],
  },
  {
    id: "flopping",
    name: "Flopping / dropping to floor",
    category: "Escape / avoidance",
    operationalDefinition:
      "Student drops body to floor and remains there for 30+ seconds when presented with a demand or transition, impeding movement or instruction.",
    examples: [
      "Drops to hallway floor when told to line up",
      "Lies on classroom floor refusing to stand for transition",
    ],
    nonexamples: ["Sits on floor during approved floor activity"],
    suggestedStrategies: [
      "Teach break/help before flop",
      "Practice short transitions with reinforcement",
      "Reduce demand length; use first-then",
    ],
  },
  {
    id: "climbing",
    name: "Unsafe climbing",
    category: "Safety",
    operationalDefinition:
      "Student climbs on furniture, railings, fences, or fixtures not intended for climbing, creating a fall risk.",
    examples: ["Climbs on top of shelf", "Scales playground fence"],
    nonexamples: ["Uses playground climbing equipment as designed"],
    suggestedStrategies: [
      "Active supervision",
      "Teach safe play boundaries",
      "Provide approved climbing/sensory alternatives",
    ],
  },
  {
    id: "stereotypy-interfering",
    name: "Interfering stereotypy / repetitive motor",
    category: "Sensory / regulation",
    operationalDefinition:
      "Student engages in repetitive motor movements that interrupt instruction or safety for 1+ continuous minute after one redirect to an alternative.",
    examples: [
      "Hand-flapping that prevents writing after redirect",
      "Body rocking that blocks peer pathway",
    ],
    nonexamples: ["Brief stim that stops with cue and does not block learning"],
    suggestedStrategies: [
      "Offer competing functional alternative",
      "Embed regulation breaks",
      "Teach when/where for sensory needs",
    ],
  },
];

export function getBehaviorDefinitionTemplate(id: string) {
  return BEHAVIOR_DEFINITION_TEMPLATES.find((entry) => entry.id === id) ?? null;
}
