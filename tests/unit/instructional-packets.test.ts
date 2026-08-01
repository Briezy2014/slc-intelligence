import { describe, expect, it } from "vitest";
import {
  EXAMPLE_COIN_SPACE_PROFILE,
  generateInstructionalPacket,
  packetToPlainText,
} from "@/lib/instructional-packets/generator";

describe("instructional packet generator", () => {
  it("builds a ~40 page differentiated coin/space packet from the example profile", () => {
    const packet = generateInstructionalPacket({
      profile: EXAMPLE_COIN_SPACE_PROFILE,
      difficulty: "moderate",
      targetPages: 40,
    });

    expect(packet.estimatedPages).toBeGreaterThanOrEqual(30);
    expect(packet.estimatedPages).toBeLessThanOrEqual(50);
    expect(packet.title.toLowerCase()).toContain("space");
    expect(packet.sections.some((section) => section.sectionType === "visual_support")).toBe(true);
    expect(packet.sections.some((section) => section.sectionType === "cut_and_paste")).toBe(true);
    expect(packet.sections.some((section) => section.sectionType === "game")).toBe(true);
    expect(packet.sections.some((section) => section.sectionType === "assessment")).toBe(true);
    expect(packet.sections.some((section) => section.sectionType === "progress_monitoring")).toBe(
      true,
    );
    expect(packet.sections.some((section) => section.sectionType === "data_collection")).toBe(true);
    expect(packet.sections.some((section) => section.sectionType === "answer_key")).toBe(true);
    expect(packet.answerKey).toContain("penny");
  });

  it("supports errorless, ABA, UDL, and task-analysis styles", () => {
    for (const difficulty of ["errorless", "aba", "udl", "task_analysis"] as const) {
      const packet = generateInstructionalPacket({
        profile: EXAMPLE_COIN_SPACE_PROFILE,
        difficulty,
        targetPages: 30,
      });
      expect(packet.estimatedPages).toBeGreaterThanOrEqual(30);
      const text = packetToPlainText(packet);
      expect(text).toContain("Identify U.S. coins");
      expect(text).toContain("$5.00");
    }
  });

  it("can target about 100 pages", () => {
    const packet = generateInstructionalPacket({
      profile: EXAMPLE_COIN_SPACE_PROFILE,
      difficulty: "challenging",
      targetPages: 100,
    });
    expect(packet.estimatedPages).toBeGreaterThanOrEqual(95);
    expect(packet.estimatedPages).toBeLessThanOrEqual(105);
  });
});
