import type { Metadata } from "next";
import { Suspense } from "react";
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
        description="Click a tool, paste your notes, and review the draft."
      />
      <Suspense fallback={<p className="text-muted text-sm">Loading tools…</p>}>
        <InstructionalIntelligenceWorkspace />
      </Suspense>
    </main>
  );
}
