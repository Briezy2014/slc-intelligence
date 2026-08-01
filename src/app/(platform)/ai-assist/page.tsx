import type { Metadata } from "next";
import Link from "next/link";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "AI Assist" };

const MODULE_LINKS = [
  {
    href: "/family-communication",
    label: "Family Communication",
    description: "Draft family updates, meeting notes, and parent messages.",
  },
  {
    href: "/accommodations",
    label: "Accommodations",
    description: "Build classroom and testing accommodation plans.",
  },
  {
    href: "/interventions",
    label: "Interventions",
    description: "Plan interventions, track fidelity, and review dosage.",
  },
  {
    href: "/goals",
    label: "Goals",
    description: "Create measurable IEP goals and learning progressions.",
  },
  {
    href: "/executive-function",
    label: "Executive Function",
    description: "Support planning, organization, and self-management skills.",
  },
  {
    href: "/progress/enter",
    label: "Rapid Progress",
    description: "Enter progress data and prepare monitoring prompts.",
  },
  {
    href: "/classroom-operations",
    label: "Lesson planning",
    description: "Generate AI lesson ideas for specialized learning classrooms.",
  },
  {
    href: "/instructional-intelligence",
    label: "Instructional intelligence",
    description: "Present levels, goal checks, consistency review, meeting prep, and more.",
  },
  {
    href: "/instructional-packets",
    label: "Instructional packets",
    description: "Generate 30–100 page differentiated packets from learner profiles and IEP goals.",
  },
  {
    href: "/para-supports",
    label: "Para supports",
    description: "Plain-language approved supports for paraprofessionals.",
  },
] as const;

export default function AiAssistPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "AI Assist" }]} />
      <PageHeader
        title="AI Assist"
        description="Create starting drafts for classroom workflows, then edit and save in the matching module."
      />
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-border bg-background-elevated hover:border-highlight/50 rounded-[var(--radius-lg)] border p-4 transition-colors"
            >
              <CardTitle className="text-base">{link.label}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </Link>
          ))}
        </div>
        <Card>
          <CardTitle>Start a draft</CardTitle>
          <CardDescription>
            Generate a starting draft here, then move it into the matching module to complete and
            save.
          </CardDescription>
          <div className="mt-4 space-y-6">
            <AiAssistPanel
              domain="lesson_plan"
              title="AI lesson planning"
              description="Create a reviewable specialized learning classroom lesson plan draft."
            />
            <AiAssistPanel
              domain="goal"
              title="AI draft IEP goals"
              description="Create measurable goal language for educator and IEP team review."
            />
            <AiAssistPanel
              domain="communication"
              title="Family communication draft"
              description="Create a clear parent or guardian message for review."
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
