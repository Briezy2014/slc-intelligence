import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { InstructionalIntelligenceWorkspace } from "@/components/domain/instructional-intelligence-workspace";

export const metadata: Metadata = {
  title: "Instruction",
  description:
    "Draft present levels, match goals to needs, flag non-measurable goals, check document consistency, and more — with human review.",
};

export default function InstructionalIntelligencePage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Instruction" }]} />
      <PageHeader
        title="Instruction"
        description="Use a drafting tool below, or open packets / worksheets when you need printables."
      />
      <div className="mb-6 space-y-3">
        <p className="text-muted text-sm font-semibold tracking-wide uppercase">Related tools</p>
        <HubLinkGrid
          links={[
            {
              href: "/instructional-packets",
              label: "Packets",
              description: "Long printable student packets with visuals.",
            },
            {
              href: "/worksheet-generator",
              label: "Worksheets",
              description: "Shorter printable practice pages.",
            },
            {
              href: "/para-supports",
              label: "Para help",
              description: "Plain-language support scripts for paras.",
            },
            {
              href: "/ai-assist",
              label: "AI Assist",
              description: "Draft helpers that save into other modules.",
            },
          ]}
        />
      </div>
      <Suspense fallback={<p className="text-muted text-sm">Loading tools…</p>}>
        <InstructionalIntelligenceWorkspace />
      </Suspense>
    </main>
  );
}
