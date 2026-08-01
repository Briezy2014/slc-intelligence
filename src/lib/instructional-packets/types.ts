export const PACKET_DIFFICULTIES = [
  "easy",
  "moderate",
  "challenging",
  "errorless",
  "task_analysis",
  "aba",
  "udl",
] as const;

export type PacketDifficulty = (typeof PACKET_DIFFICULTIES)[number];

export const PACKET_SIZE_TARGETS = [30, 40, 60, 80, 100] as const;
export type PacketSizeTarget = (typeof PACKET_SIZE_TARGETS)[number];

export type StudentPacketProfile = {
  gradeLevel: string;
  supportNeeds: string;
  readingLevel: string;
  skillGoal: string;
  iepGoal: string;
  preferredInterests: string;
  studentCode?: string;
};

export type PacketSection = {
  pageNumber: number;
  sectionType: string;
  title: string;
  body: string;
};

export type GeneratedInstructionalPacket = {
  title: string;
  estimatedPages: number;
  difficulty: PacketDifficulty;
  profile: StudentPacketProfile;
  overview: string;
  sections: PacketSection[];
  answerKey: string;
  educatorNotes: string;
};
