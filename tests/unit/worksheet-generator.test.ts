import { describe, expect, it } from "vitest";
import { generateWorksheetPacket } from "@/lib/worksheet-generator/generate";
import { buildPrintablePacketHtml } from "@/lib/worksheet-generator/print";
import {
  hasVisualMarkers,
  renderVisualSvg,
  replaceVisualMarkersWithSvg,
  selectVisualIdsForContext,
} from "@/lib/worksheet-generator/visuals";

describe("worksheet generator visuals and print", () => {
  it("selects coin and space visuals for coin topic + space theme", () => {
    const ids = selectVisualIdsForContext({
      topicOrSkill: "Identifying coins",
      subject: "Math",
      studentInterestOrTheme: "Space",
      pageIndex: 0,
    });
    expect(ids.some((id) => id.includes("coin") || id === "coins-set")).toBe(true);
    expect(ids.some((id) => id.startsWith("space"))).toBe(true);
  });

  it("renders real SVG markup for coin visuals", () => {
    const svg = renderVisualSvg("coin-penny");
    expect(svg).toContain("<svg");
    expect(svg.toLowerCase()).toContain("penny");
  });

  it("builds a local packet with visual markers", async () => {
    const packet = await generateWorksheetPacket({
      packetTitle: "Coin pack",
      subject: "Math",
      topicOrSkill: "Identifying coins",
      learningGoal: "Identify penny, nickel, dime, and quarter.",
      gradeBand: "Grades 6–8",
      instructionalLevel: "Grade 2",
      differentiationLevel: "Level 2: Moderate Support",
      supportNeeds: ["Visual supports"],
      worksheetTypes: ["Guided practice", "Matching", "Answer key"],
      packetLength: "5 pages",
      studentInterestOrTheme: "Space",
      printingFormat: "Standard",
      includeAnswerKey: true,
      includeProgressMonitoring: false,
    });
    expect(hasVisualMarkers(packet.content)).toBe(true);
    expect(packet.content).toMatch(/\[\[VISUAL:/);
    expect(packet.content.toLowerCase()).toContain("visual supports");
  });

  it("builds printable HTML with SVG drawings and page breaks", () => {
    const html = buildPrintablePacketHtml({
      title: "Coin pack",
      content: [
        "Cover\n[[VISUAL:coins-set]]\n[[VISUAL:space-rocket]]",
        "---------- PAGE BREAK ----------",
        "Practice\n[[VISUAL:coin-penny]]",
      ].join("\n"),
      printingFormat: "Large print",
    });
    expect(html).toContain("<svg");
    expect(html).toContain("page-break-after");
    expect(html).toContain("Save as PDF");
    expect(html).not.toContain("[[VISUAL:");
    expect(replaceVisualMarkersWithSvg("[[VISUAL:coin-dime]]")).toContain("<svg");
  });

  it("never prints the AI disclaimer footer on student pages", async () => {
    const packet = await generateWorksheetPacket({
      packetTitle: "Coin pack",
      subject: "Math",
      topicOrSkill: "Identifying coins",
      learningGoal: "Identify penny, nickel, dime, and quarter.",
      gradeBand: "Grades 6–8",
      instructionalLevel: "Grade 2",
      differentiationLevel: "Level 2: Moderate Support",
      supportNeeds: ["Visual supports"],
      worksheetTypes: ["Guided practice", "Matching", "Answer key"],
      packetLength: "5 pages",
      studentInterestOrTheme: "Space",
      printingFormat: "Standard",
      includeAnswerKey: true,
      includeProgressMonitoring: false,
    });
    expect(packet.content).not.toMatch(/AI-generated instructional material/i);
    expect(packet.content).not.toMatch(/Review for accuracy and appropriateness/i);

    const html = buildPrintablePacketHtml({
      title: packet.title,
      content: `${packet.content}\nAI-generated instructional material. Review for accuracy and appropriateness before student use.`,
      printingFormat: "Standard",
    });
    expect(html).not.toMatch(/AI-generated instructional material/i);
    expect(html).not.toMatch(/Review for accuracy and appropriateness/i);
    expect(html).toContain("<svg");
  });

  it("embeds AI theme images in printable HTML when provided", () => {
    const html = buildPrintablePacketHtml({
      title: "Theme pack",
      content: "Page one\n[[AIIMAGE:theme-hero]]\n[[VISUAL:school]]",
      imageAssets: {
        "theme-hero": "data:image/png;base64,AAAA",
      },
    });
    expect(html).toContain('src="data:image/png;base64,AAAA"');
    expect(html).toContain("<svg");
    expect(html).not.toContain("[[AIIMAGE:");
  });
});
