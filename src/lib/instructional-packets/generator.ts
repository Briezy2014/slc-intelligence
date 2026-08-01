import type {
  GeneratedInstructionalPacket,
  PacketDifficulty,
  PacketSection,
  PacketSizeTarget,
  StudentPacketProfile,
} from "@/lib/instructional-packets/types";
import { visualMarker, type WorksheetVisualId } from "@/lib/worksheet-generator/visuals";

const COIN_SET = [
  { name: "penny", value: "1¢", worth: "$0.01", visual: "coin-penny" as const },
  { name: "nickel", value: "5¢", worth: "$0.05", visual: "coin-nickel" as const },
  { name: "dime", value: "10¢", worth: "$0.10", visual: "coin-dime" as const },
  { name: "quarter", value: "25¢", worth: "$0.25", visual: "coin-quarter" as const },
] as const;

const PRINT_PAGE_BREAK = "---------- PAGE BREAK ----------";

function themeVisual(theme: string, pageIndex: number): WorksheetVisualId {
  const value = theme.toLowerCase();
  if (/space|rocket|planet|star|moon|astronaut/.test(value)) {
    const space: WorksheetVisualId[] = ["space-rocket", "space-planet", "space-stars"];
    return space[pageIndex % space.length]!;
  }
  if (/animal|dog|cat|pet/.test(value)) {
    return pageIndex % 2 === 0 ? "animal-dog" : "animal-cat";
  }
  if (/sport|ball|swim/.test(value)) return "sports-ball";
  if (/cook|food|apple/.test(value)) return "cooking-apple";
  return "theme-banner";
}

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
      `${coin.name} card · ${theme}`,
      [
        visualMarker(themeVisual(theme, i)),
        visualMarker(coin.visual),
        "",
        `Name: ${coin.name}`,
        `Value: ${coin.value}  (${coin.worth})`,
        "",
        "Circle the answer:",
        `□ ${coin.name}     □ ${coin.value}`,
        "",
        "Trace / write:",
        `${coin.name} ________________`,
        `${coin.value} ________________`,
      ].join("\n"),
    );
  }
}

function buildTaskAnalysis(
  sections: PacketSection[],
  profile: StudentPacketProfile,
  theme: string,
): void {
  pushSection(
    sections,
    "task_analysis",
    "Steps: Name the coin",
    [
      visualMarker("coins-set"),
      visualMarker(themeVisual(theme, 0)),
      "",
      "1. Look at the coin.",
      "2. Check the color.",
      "3. Check the size.",
      "4. Point to or say the name.",
      "5. Point to or say the value.",
      `6. Put it on the ${theme} mat.`,
      "",
      `Goal: ${profile.skillGoal}`,
    ].join("\n"),
  );

  pushSection(
    sections,
    "task_analysis",
    "Steps: Make the amount",
    [
      visualMarker("coins-set"),
      visualMarker(themeVisual(theme, 1)),
      "",
      `Theme: ${theme} checkout`,
      "",
      "1. Look at the price.",
      "2. Sort coins (penny · nickel · dime · quarter).",
      "3. Count quarters.",
      "4. Count dimes.",
      "5. Count nickels.",
      "6. Count pennies.",
      "7. Write the total.",
      "8. Check: enough · not enough · exact",
      "",
      `Goal: ${profile.iepGoal}`,
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
    const distractor = COIN_SET[(i + 1) % COIN_SET.length];
    pushSection(
      sections,
      "cut_and_paste",
      `Cut and paste ${i + 1}: ${target.name}`,
      [
        visualMarker(themeVisual(theme, i)),
        visualMarker(target.visual),
        visualMarker(distractor.visual),
        "",
        `Cut the ${target.name}. Paste it on the ${theme} pocket.`,
        "",
        "Paste here:",
        `□ ${target.name}  (${target.value})`,
        "□ Not this coin",
        "",
        `Write the value: ${target.value} / ${target.worth}`,
        `Reading help: ${profile.readingLevel}`,
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
      title: `${theme} coin sort`,
      body: [
        visualMarker("coins-set"),
        visualMarker(themeVisual(theme, 0)),
        "",
        "Draw a coin card.",
        "Say the name.",
        "Put it on the matching mat.",
        "",
        "Mats: penny · nickel · dime · quarter",
      ].join("\n"),
    },
    {
      title: `${theme} shop`,
      body: [
        visualMarker(themeVisual(theme, 1)),
        visualMarker("coins-set"),
        "",
        `Price under $5.00 at the ${theme} shop.`,
        "Choose coins to pay.",
        "Check: exact · too little · too much",
        "",
        `Goal: ${profile.iepGoal}`,
      ].join("\n"),
    },
    {
      title: "Coin match",
      body: [
        visualMarker("coin-penny"),
        visualMarker("coin-nickel"),
        visualMarker("coin-dime"),
        visualMarker("coin-quarter"),
        "",
        "Match picture → name → value.",
        "Say the match out loud.",
      ].join("\n"),
    },
    {
      title: `${theme} bingo`,
      body: [
        visualMarker(themeVisual(theme, 3)),
        visualMarker("coins-set"),
        "",
        "Cover the matching coin name or value.",
        "Call out: penny · nickel · dime · quarter",
      ].join("\n"),
    },
  ];

  for (let i = 0; i < count; i += 1) {
    const game = games[i % games.length]!;
    pushSection(sections, "game", `Game ${i + 1}: ${game.title}`, game.body);
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
      `Practice ${i + 1}: Make ${target}`,
      [
        visualMarker(themeVisual(theme, i)),
        visualMarker("coins-set"),
        "",
        `${theme} checkout #${i + 1}`,
        `Level: ${level}`,
        "",
        `Price: ${target}`,
        "",
        "Quarters: ____   Dimes: ____   Nickels: ____   Pennies: ____",
        "",
        "Total: $ ______.__",
        "□ Exact   □ Too little   □ Too much",
        "",
        "Circle: penny · nickel · dime · quarter",
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
      `Check-up ${i + 1}`,
      [
        visualMarker("coins-set"),
        visualMarker(themeVisual(theme, i)),
        "",
        `Name: ${studentLabel(profile)}     Date: __________`,
        "",
        "Name the coin:",
        "1. penny ____   2. nickel ____   3. dime ____   4. quarter ____",
        "",
        "Write the value:",
        "5. nickel = ____¢   6. dime = ____¢   7. quarter = ____¢",
        "",
        "Make the amount:",
        "8. $0.30 ____",
        "9. $1.00 ____",
        "10. $2.45 ____",
        i % 2 === 0 ? "11. $5.00 ____" : "11. Which equals $0.75? ____",
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
 * Generate a student-facing instructional packet with printable visuals.
 * Teacher how-to pages are omitted — pages are for the learner to use.
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
    `${theme} Money Skills`,
    [
      visualMarker(themeVisual(theme, 0)),
      visualMarker("coins-set"),
      "",
      `${theme} Money Skills`,
      `Student: ${studentLabel(profile)}`,
      `Goal: ${profile.skillGoal}`,
      `Also practice: ${profile.iepGoal}`,
    ].join("\n"),
  );

  // Student pages only (no teacher how-to / data / answer-key sheets).
  const remaining = Math.max(28, target - 1);
  const visualCount = Math.max(6, Math.round(remaining * 0.18));
  const cutCount = Math.max(5, Math.round(remaining * 0.16));
  const gameCount = Math.max(4, Math.round(remaining * 0.12));
  const assessCount = Math.max(3, Math.round(remaining * 0.1));
  let practiceCount = remaining - visualCount - cutCount - gameCount - assessCount - 2;
  if (practiceCount < 10) practiceCount = 10;

  buildVisualSupports(sections, profile, theme, visualCount);
  buildTaskAnalysis(sections, profile, theme);
  buildCutAndPaste(sections, profile, theme, cutCount);
  buildGames(sections, profile, theme, gameCount);
  buildPracticePages(sections, profile, theme, difficulty, practiceCount);
  buildAssessments(sections, profile, theme, assessCount);

  const answerKey = buildAnswerKey(profile, theme);

  let finalSections = sections;
  if (finalSections.length > target + 5) {
    finalSections = sections.slice(0, target);
  } else {
    while (finalSections.length < target) {
      const n = finalSections.length + 1;
      pushSection(
        finalSections,
        "practice",
        `Bonus practice: ${theme} combinations`,
        [
          visualMarker(themeVisual(theme, n)),
          visualMarker("coins-set"),
          "",
          `Make: $${((n % 20) * 0.25).toFixed(2)}`,
          "Quarters: ____   Dimes: ____   Nickels: ____   Pennies: ____",
          "Total: $ ______.__",
        ].join("\n"),
      );
    }
  }

  finalSections = finalSections.map((section, index) => ({
    ...section,
    pageNumber: index + 1,
  }));

  const overview = [
    `${theme} Money Skills · ${finalSections.length} student pages`,
    `${difficultyLabel(difficulty)} · Grade ${profile.gradeLevel} · Reading ${profile.readingLevel}`,
    `Goals: ${profile.skillGoal} · ${profile.iepGoal}`,
  ].join("\n");

  return {
    title: `${theme} Money Skills Pack`,
    estimatedPages: finalSections.length,
    difficulty,
    profile,
    overview,
    sections: finalSections,
    answerKey,
    educatorNotes: "Student-facing packet pages with printable visuals. Download as PDF to print.",
  };
}

/** Plain text export (includes visual markers for PDF rendering). */
export function packetToPlainText(packet: GeneratedInstructionalPacket): string {
  return packet.sections
    .map((section) => `PAGE ${section.pageNumber}\n${section.title}\n\n${section.body}\n`)
    .join(`\n${PRINT_PAGE_BREAK}\n`);
}

/** Content string for Print / Save as PDF (page breaks + visual markers). */
export function packetToPrintableContent(packet: GeneratedInstructionalPacket): string {
  return packetToPlainText(packet);
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
