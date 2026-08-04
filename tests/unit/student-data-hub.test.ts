import { describe, expect, it } from "vitest";
import { studentDataHubLinks } from "@/lib/navigation/student-data-hub";

describe("student data hub links", () => {
  it("returns per-student links for core data areas", () => {
    const links = studentDataHubLinks("00000000-0000-4000-8000-000000000099");
    const labels = links.map((link) => link.label);
    expect(labels).toContain("Behavior");
    expect(labels).toContain("Progress");
    expect(labels).toContain("Family communication");
    expect(labels).toContain("Services / providers");
    expect(labels).toContain("Progress reports");
    expect(
      links.every((link) => link.href.includes("/students/00000000-0000-4000-8000-000000000099/")),
    ).toBe(true);
  });
});
