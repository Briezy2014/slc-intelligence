import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { InstructionalIntelligenceWorkspace } from "@/components/domain/instructional-intelligence-workspace";

export const metadata: Metadata = {
  title: "Instructional intelligence",
  description:
    "Draft present levels, match goals to needs, flag non-measurable goals, check document consistency, and more — with human review.",
};

export default function InstructionalIntelligencePage() {
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { label: "Instructional intelligence" }]}
      />
      <PageHeader
        title="Instructional intelligence"
        description="Go beyond compliance paperwork: evidence-based drafting, goal quality checks, family-friendly language, instructional plans, and meeting prep — while educators keep decision authority."
      />
      <InstructionalIntelligenceWorkspace />
    </main>
  );
}
