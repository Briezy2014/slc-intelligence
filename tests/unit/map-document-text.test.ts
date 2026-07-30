import { describe, expect, it } from "vitest";
import { mapDocumentTextToFields } from "@/lib/documents/map-document-text";

describe("mapDocumentTextToFields", () => {
  it("maps common IEP section labels into draft fields", () => {
    const fields = mapDocumentTextToFields(
      "iep",
      [
        "Student strengths: strong visual memory and helpful peer leadership.",
        "Needs: decoding multisyllabic words in grade-level text.",
        "Annual goals: improve oral reading fluency to 90 wcpm on grade passages.",
        "Specially designed instruction: daily small-group phonics intervention.",
        "Related services: speech therapy 30 minutes weekly.",
        "Accommodations: extended time and preferential seating.",
      ].join("\n"),
    );

    expect(fields.strengths?.toLowerCase()).toContain("visual");
    expect(fields.needs?.toLowerCase()).toContain("decoding");
    expect(fields.goalSummary?.toLowerCase()).toContain("fluency");
    expect(fields.speciallyDesignedInstruction?.toLowerCase()).toContain("phonics");
    expect(fields.relatedServices?.toLowerCase()).toContain("speech");
    expect(fields.accommodations?.toLowerCase()).toContain("extended time");
  });
});
