import type {
  GeneratedInstructionalPacket,
  PacketDifficulty,
  PacketSection,
  PacketSizeTarget,
  StudentPacketProfile,
} from "@/lib/instructional-packets/types";

const COIN_SET = [
  { name: "penny", value: "1¢", worth: "$0.01" },
  { name: "nickel", value: "5¢", worth: "$0.05" },
  { name: "dime", value: "10¢", worth: "$0.10" },
  { name: "quarter", value: "25¢", worth: "$0.25" },
] as const;

function interestTheme(interest: string): string {
  const value = interest.trim() || "preferred interest";
  return value;
}

function studentLabel(profile: StudentPacketProfile): string {
  return profile.studentCode?.trim() || "Student";
}

function difficultyLabel(difficulty: PacketDifficulty): string {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "moderate":
      return "Moderate";
    case "challenging":
      return "Challenging";
    case "errorless":
      return "Errorless learning";
    case "task_analysis":
      return "Task analysis";
    case "aba":
      return "ABA style";
    case "udl":
      return "UDL style";
    default:
      return difficulty;
  }
}

function scaffoldNote(difficulty: PacketDifficulty): string {
  switch (difficulty) {
    case "easy":
      return "High visual support · fewer choices · larger response spaces · adult model first.";
    case "moderate":
      return "Balanced independence · 2–3 step directions · mixed practice.";
    case "challenging":
      return "Reduced prompts · multi-step combinations · generalization across settings.";
    case "errorless":
      return "Errorless: model → guided · prevent incorrect practice · reinforce correct response immediately.";
    case "task_analysis":
      return "Break skill into numbered steps; teach one step at a time; chain forward/backward as planned.";
    case "aba":
      return "ABA style: clear SD, prompt hierarchy (I→VP→PP→GP→I), discrete trials, reinforcement notes.";
    case "udl":
      return "UDL: multiple means of engagement, representation, and action/expression; offer choice boards.";
    default:
      return "Differentiate supports to the learner profile.";
  }
}

function pushSection(
  sections: PacketSection[],
  sectionType: string,
  title: string,
  body: string,
): void {
  sections.push({
    pageNumber: sections.length + 1,
    sectionType,
    title,
    body,
  });
}

function buildVisualSupports(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  count: number,
): void {
  for (let i = 0; i < count; i += 1) {
    const coin = COIN_SET[i % COIN_SET.length];
    pushSection(
      sections,
      "visual_support",
      `Visual support ${i + 1}: ${coin.name} (${theme})`,
      [
        `Learner: ${studentLabel(profile)} · Reading access: ${profile.readingLevel}`,
        `Theme: ${theme} station card`,
        "",
        `COIN CARD — ${coin.name.toUpperCase()}`,
        `[Picture box: large ${coin.name} · ${theme} background sticker]`,
        `Name: ${coin.name}`,
        `Value: ${coin.value} (${coin.worth})`,
        "Color cue: ________________",
        "Size cue: ________________",
        "",
        "Student says/points:",
        `□ “${coin.name}”   □ “${coin.value}”`,
        "",
        "Adult script: “Show me the {coin}. What is it worth?”",
      ].join("\n"),
    );
  }
}

function buildTaskAnalysis(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  difficulty: PacketDifficulty,
): void {
  pushSection(
    sections,
    "task_analysis",
    "Task analysis: Identify a U.S. coin",
    [
      `Goal focus: ${profile.skillGoal}`,
      `IEP goal alignment: ${profile.iepGoal}`,
      `Style: ${difficultyLabel(difficulty)} · Theme: ${theme}`,
      "",
      "Steps:",
      "1. Look at the coin (or picture).",
      "2. Check color (copper / silver).",
      "3. Check size (small / medium / large).",
      "4. Say or point to the coin name.",
      "5. Say or match the value.",
      `6. Place coin in the correct ${theme} sorting mat.`,
      "",
      "Data: + independent · V verbal · G gestural · M model · P physical",
      "Trials: 1 __  2 __  3 __  4 __  5 __",
    ].join("\n"),
  );

  pushSection(
    sections,
    "task_analysis",
    "Task analysis: Count coin combinations to $5.00",
    [
      `IEP goal: ${profile.iepGoal}`,
      `Theme: ${theme} checkout`,
      "",
      "Steps:",
      "1. Gather coins for the price card.",
      "2. Sort by type (pennies, nickels, dimes, quarters).",
      "3. Count quarters first (skip-count by 25).",
      "4. Count dimes (skip-count by 10).",
      "5. Count nickels (skip-count by 5).",
      "6. Count pennies by 1.",
      "7. Write/total the amount.",
      "8. Compare to price: enough / not enough / exact.",
      "",
      "Prompt hierarchy: Independent → Gesture → Verbal → Model → Partial physical",
      "Mastery criterion example: 4/5 trials correct across 3 sessions.",
    ].join("\n"),
  );
}

function buildCutAndPaste(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  count: number,
): void {
  for (let i = 0; i < count; i += 1) {
    const target = COIN_SET[i % COIN_SET.length];
    pushSection(
      sections,
      "cut_and_paste",
      `Cut-and-paste ${i + 1}: Match ${target.name} · ${theme}`,
      [
        `Reading level support: ${profile.readingLevel} (picture + short labels)`,
        "",
        `Cut the coin pictures below. Paste onto the matching ${theme} pockets.`,
        "",
        "Pockets:",
        `□ ${target.name} landing pad (${target.value})`,
        "□ Not this coin (distractors)",
        "",
        "Cut bank:",
        `[ ] ${target.name}   [ ] distractor coin A   [ ] distractor coin B`,
        "",
        "Extension: Paste the value label next to the coin.",
        `Labels: ${target.value} · ${target.worth} · ${target.name}`,
      ].join("\n"),
    );
  }
}

function buildGames(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  count: number,
): void {
  const games = [
    {
      title: `${theme} Coin Sort Race`,
      body: [
        "Players: 1 student + adult/para",
        "Materials: coin cards, 4 sorting mats, timer",
        "Rules: Draw a card, name it, place on correct mat.",
        "Win: 8/10 correct placements.",
        "Data: record independent vs prompted.",
      ].join("\n"),
    },
    {
      title: `${theme} Market: Pay the Price`,
      body: [
        `Set up a pretend ${theme} shop with price tags under $5.00.`,
        "Student selects coins to meet or beat the price.",
        "Levels: exact change · closest without going under · make change from $1/$5.",
        `IEP link: ${profile.iepGoal}`,
      ].join("\n"),
    },
    {
      title: "Coin Memory Match",
      body: [
        "Match coin picture ↔ name ↔ value.",
        "Start with 4 pairs (easy), build to 8 pairs (challenging).",
        "Say the match aloud before keeping the pair.",
      ].join("\n"),
    },
    {
      title: `${theme} Bingo: Coin Values`,
      body: [
        "Bingo board with coin names/values.",
        "Caller shows a coin picture; student covers matching square.",
        `Celebrate with preferred ${theme} token.`,
      ].join("\n"),
    },
  ];

  for (let i = 0; i < count; i += 1) {
    const game = games[i % games.length];
    pushSection(
      sections,
      "game",
      `Game ${i + 1}: ${game.title}`,
      `${game.body}\n\nSupport needs note: ${profile.supportNeeds}`,
    );
  }
}

function buildPracticePages(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  difficulty: PacketDifficulty,
  count: number,
): void {
  for (let i = 0; i < count; i += 1) {
    const level =
      difficulty === "easy" || difficulty === "errorless"
        ? "Level A (high support)"
        : difficulty === "challenging"
          ? "Level C (low support)"
          : i % 3 === 0
            ? "Level A"
            : i % 3 === 1
              ? "Level B"
              : "Level C";
    const amountTargets = [
      "$0.25",
      "$0.40",
      "$0.75",
      "$1.00",
      "$1.35",
      "$2.50",
      "$3.00",
      "$4.75",
      "$5.00",
    ];
    const target = amountTargets[i % amountTargets.length];
    pushSection(
      sections,
      "practice",
      `Practice page ${i + 1}: ${level} · Make ${target}`,
      [
        `Theme: ${theme} checkout ticket #${i + 1}`,
        `Skill goal: ${profile.skillGoal}`,
        `IEP goal: ${profile.iepGoal}`,
        `Differentiation: ${scaffoldNote(difficulty)}`,
        "",
        `Price to make: ${target}`,
        "",
        "Show coins with tallies or drawings:",
        "Quarters: ____   Dimes: ____   Nickels: ____   Pennies: ____",
        "",
        "Total: $ ______.__",
        "Check: □ Exact  □ Too little  □ Too much",
        "",
        difficulty === "errorless"
          ? "Errorless support: Adult places first correct coin, student completes remaining with immediate praise."
          : "Independent attempt first; prompt only after wait time.",
        "",
        "Quick ID warm-up (circle): penny · nickel · dime · quarter",
      ].join("\n"),
    );
  }
}

function buildAssessments(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
  count: number,
): void {
  for (let i = 0; i < count; i += 1) {
    pushSection(
      sections,
      "assessment",
      `Assessment ${i + 1}: Coin ID + combinations`,
      [
        `Student code: ${studentLabel(profile)}`,
        `Date: __________  Assessor: __________`,
        `Theme context (optional): ${theme}`,
        "",
        "Part A — Identify (point/say)",
        "1. penny ____   2. nickel ____   3. dime ____   4. quarter ____",
        "",
        "Part B — Values",
        "5. nickel = ____¢   6. dime = ____¢   7. quarter = ____¢",
        "",
        "Part C — Combinations (aligned to IEP goal)",
        `IEP: ${profile.iepGoal}`,
        "8. Make $0.30 ____",
        "9. Make $1.00 ____",
        "10. Make $2.45 ____",
        i % 2 === 0 ? "11. Make $5.00 ____" : "11. Which set equals $0.75? (A/B/C) ____",
        "",
        "Score: ____ / 11    % correct: ____",
        "Prompt level summary: I __ V __ G __ M __ P __",
      ].join("\n"),
    );
  }
}

function buildProgressAndData(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  count: number,
): void {
  for (let i = 0; i < count; i += 1) {
    pushSection(
      sections,
      "progress_monitoring",
      `Progress monitoring sheet ${i + 1}`,
      [
        `Student: ${studentLabel(profile)} · Grade ${profile.gradeLevel}`,
        `Goal: ${profile.iepGoal}`,
        `Reading access: ${profile.readingLevel}`,
        "",
        "Session date: __________",
        "Setting: □ classroom □ small group □ 1:1 □ community",
        "",
        "Probe 1: __________  Probe 2: __________  Probe 3: __________",
        "Accuracy: ____%   Independence: ____%   Trials correct: ____ / ____",
        "",
        "Notes / error patterns:",
        "______________________________________________",
        "Next instructional adjustment:",
        "______________________________________________",
      ].join("\n"),
    );
  }

  for (let i = 0; i < Math.max(2, Math.floor(count / 2)); i += 1) {
    pushSection(
      sections,
      "data_collection",
      `Data collection form ${i + 1} (ABA trial log)`,
      [
        `Student: ${studentLabel(profile)}`,
        `SD examples: “What coin?” / “Make ${profile.iepGoal.includes("$") ? "$X.XX" : "the amount"}”`,
        "",
        "Trial | Target | Response (+/-) | Prompt | Reinforcer | Notes",
        "1     |        |               |        |            |",
        "2     |        |               |        |            |",
        "3     |        |               |        |            |",
        "4     |        |               |        |            |",
        "5     |        |               |        |            |",
        "6     |        |               |        |            |",
        "7     |        |               |        |            |",
        "8     |        |               |        |            |",
        "9     |        |               |        |            |",
        "10    |        |               |        |            |",
        "",
        "% independent: ____   % correct (any prompt): ____",
      ].join("\n"),
    );
  }
}

function buildAnswerKey(profile: StudentPacketProfile, theme: string): string {
  return [
    "ANSWER KEY (educator use)",
    `Packet focus: ${profile.skillGoal} · ${profile.iepGoal}`,
    `Theme: ${theme}`,
    "",
    "Coin values:",
    "- penny = 1¢ ($0.01)",
    "- nickel = 5¢ ($0.05)",
    "- dime = 10¢ ($0.10)",
    "- quarter = 25¢ ($0.25)",
    "",
    "Sample combination keys:",
    "- $0.30 = 1 quarter + 1 nickel  OR  3 dimes  OR  other correct sets",
    "- $1.00 = 4 quarters  OR  10 dimes  OR  mixed correct sets",
    "- $2.45 = 9 quarters + 2 dimes  OR  equivalent correct combinations",
    "- $5.00 = 20 quarters  OR  equivalent correct combinations up to $5.00",
    "",
    "Accept any mathematically correct coin combination unless the page constrains coin types.",
    "For ID items, accept spoken name, pointing, or AAC selection.",
  ].join("\n");
}

/**
 * Generate a differentiated instructional packet outline with printable page content.
 * This is an educator-reviewed draft pack, not an automatic IEP decision.
 */
export function generateInstructionalPacket(input: {
  profile: StudentPacketProfile;
  difficulty: PacketDifficulty;
  targetPages: PacketSizeTarget;
}): GeneratedInstructionalPacket {
  const profile = {
    ...input.profile,
    gradeLevel: input.profile.gradeLevel.trim() || "Grade level not set",
    supportNeeds: input.profile.supportNeeds.trim() || "Support needs not set",
    readingLevel: input.profile.readingLevel.trim() || "Reading level not set",
    skillGoal: input.profile.skillGoal.trim() || "Skill goal not set",
    iepGoal: input.profile.iepGoal.trim() || "IEP goal not set",
    preferredInterests: input.profile.preferredInterests.trim() || "preferred interests",
  };
  const theme = interestTheme(profile.preferredInterests);
  const difficulty = input.difficulty;
  const target = input.targetPages;
  const sections: PacketSection[] = [];

  pushSection(
    sections,
    "cover",
    "Packet cover",
    [
      "SLC Intelligence · Instructional Packet (educator review draft)",
      `Title: ${theme} Money Skills Pack`,
      `Student code: ${studentLabel(profile)}`,
      `Grade: ${profile.gradeLevel} · Support profile: ${profile.supportNeeds}`,
      `Reading access level: ${profile.readingLevel}`,
      `Skill goal: ${profile.skillGoal}`,
      `IEP goal: ${profile.iepGoal}`,
      `Difficulty / style: ${difficultyLabel(difficulty)}`,
      `Target length: about ${target} pages`,
      "",
      "Includes: visual supports · cut-and-paste · games · practice · assessments ·",
      "progress sheets · data forms · answer keys",
    ].join("\n"),
  );

  pushSection(
    sections,
    "overview",
    "Teacher / para overview",
    [
      scaffoldNote(difficulty),
      "",
      "How to use this packet:",
      "1. Start with visual supports and errorless/model trials.",
      "2. Move to cut-and-paste and games for engagement.",
      "3. Use differentiated practice pages for massed/distributed trials.",
      "4. Probe with assessments; log data on PM / ABA sheets.",
      "5. Adjust level (Easy → Moderate → Challenging) based on independence.",
      "",
      "Accommodations to consider:",
      "- Picture-supported directions matching reading level",
      "- Reduced language / first-then visuals",
      "- Manipulatives or coin cards before abstract totals",
      `- Interest-based ${theme} reinforcers and contexts`,
      "",
      "Guardrail: Human educators choose materials, prompts, and mastery decisions.",
    ].join("\n"),
  );

  // Allocate pages toward target (cover+overview already 2).
  const remaining = Math.max(28, target - 2);
  const visualCount = Math.max(4, Math.round(remaining * 0.12));
  const cutCount = Math.max(4, Math.round(remaining * 0.12));
  const gameCount = Math.max(3, Math.round(remaining * 0.1));
  const assessCount = Math.max(3, Math.round(remaining * 0.1));
  const progressCount = Math.max(3, Math.round(remaining * 0.1));
  let practiceCount =
    remaining - visualCount - cutCount - gameCount - assessCount - progressCount - 4; // task analysis x2 + answer key pages later
  if (practiceCount < 8) practiceCount = 8;

  buildVisualSupports(sections, profile, theme, visualCount);
  buildTaskAnalysis(sections, profile, theme, difficulty);
  buildCutAndPaste(sections, profile, theme, cutCount);
  buildGames(sections, profile, theme, gameCount);
  buildPracticePages(sections, profile, theme, difficulty, practiceCount);
  buildAssessments(sections, profile, theme, assessCount);
  buildProgressAndData(sections, profile, progressCount);

  // Differentiated level menu pages
  pushSection(
    sections,
    "differentiation",
    "Differentiated levels menu",
    [
      "Choose a track for today’s session:",
      "",
      "★ Easy — 2 coin types, model-first, errorless options, large visuals",
      "★★ Moderate — all 4 coins, short combinations under $1–$2",
      "★★★ Challenging — combinations to $5.00, mixed coin sets, fewer prompts",
      "",
      "Style overlays (can combine with a level):",
      `- Errorless learning: ${scaffoldNote("errorless")}`,
      `- Task analysis: ${scaffoldNote("task_analysis")}`,
      `- ABA style: ${scaffoldNote("aba")}`,
      `- UDL style: ${scaffoldNote("udl")}`,
      "",
      `Learner interest engine: embed ${theme} in examples, shops, and reinforcers.`,
    ].join("\n"),
  );

  const answerKey = buildAnswerKey(profile, theme);
  pushSection(sections, "answer_key", "Answer key", answerKey);

  // Trim or pad lightly to approach target page count.
  let finalSections = sections;
  if (finalSections.length > target + 5) {
    finalSections = sections.slice(0, target);
    // ensure answer key remains
    if (finalSections[finalSections.length - 1]?.sectionType !== "answer_key") {
      finalSections[finalSections.length - 1] = {
        pageNumber: finalSections.length,
        sectionType: "answer_key",
        title: "Answer key",
        body: answerKey,
      };
    }
  } else {
    while (finalSections.length < target) {
      const n = finalSections.length + 1;
      pushSection(
        finalSections,
        "practice",
        `Bonus practice page ${n}: ${theme} combinations`,
        [
          `Make amount: $${((n % 20) * 0.25).toFixed(2)}`,
          "Coins used: Q __ D __ N __ P __",
          "Total: $ ____.__",
          `IEP alignment: ${profile.iepGoal}`,
        ].join("\n"),
      );
    }
  }

  // Renumerate
  finalSections = finalSections.map((section, index) => ({
    ...section,
    pageNumber: index + 1,
  }));

  const overview = [
    `${theme} Money Skills Pack · ~${finalSections.length} pages`,
    `${difficultyLabel(difficulty)} · Grade ${profile.gradeLevel} · Reading access ${profile.readingLevel}`,
    `Support profile: ${profile.supportNeeds}`,
    `Goals: ${profile.skillGoal} · ${profile.iepGoal}`,
    "Educator review required before classroom use.",
  ].join("\n");

  return {
    title: `${theme} Money Skills Pack`,
    estimatedPages: finalSections.length,
    difficulty,
    profile,
    overview,
    sections: finalSections,
    answerKey,
    educatorNotes:
      "This packet is an assistive draft generated from the learner profile. Customize for the IEP, approved accommodations, and district materials before printing or assigning.",
  };
}

export function packetToPlainText(packet: GeneratedInstructionalPacket): string {
  const pages = packet.sections
    .map(
      (section) =>
        `\n===== PAGE ${section.pageNumber} · ${section.sectionType.toUpperCase()} =====\n` +
        `${section.title}\n\n${section.body}\n`,
    )
    .join("\n");

  return [
    packet.title,
    packet.overview,
    "",
    packet.educatorNotes,
    pages,
    "",
    "===== END OF PACKET =====",
  ].join("\n");
}

export const EXAMPLE_COIN_SPACE_PROFILE: StudentPacketProfile = {
  gradeLevel: "7",
  supportNeeds: "Moderate Autism",
  readingLevel: "2nd grade",
  skillGoal: "Identify U.S. coins",
  iepGoal: "Count combinations up to $5.00",
  preferredInterests: "Space",
  studentCode: "S1",
};
