import type { Metadata } from "next";
import Link from "next/link";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "AI Assist" };

const MODULE_LINKS = [
  { href: "/family-communication", label: "Family Communication", domain: "communication drafts" },
  { href: "/accommodations", label: "Accommodations", domain: "support suggestions" },
  { href: "/interventions", label: "Interventions", domain: "plan suggestions" },
  { href: "/goals", label: "Goals", domain: "goal language" },
  { href: "/executive-function", label: "Executive Function", domain: "EF focuses" },
  { href: "/progress/enter", label: "Rapid Progress", domain: "session prompts" },
] as const;

export default function AiAssistPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "AI Assist" }]} />
      <PageHeader
        title="AI Assist"
        description="Generate reviewable drafts and suggestions across SLC Intelligence. Educators stay in control of every final decision."
      />
      <div className="space-y-6">
        <Alert title="Assistive, not autonomous" tone="info">
          AI Assist drafts communications, accommodations, interventions, goals, and EF ideas for
          your review. It does not diagnose, determine eligibility/placement, or auto-finalize IEP
          decisions.
        </Alert>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-border bg-background-elevated hover:border-highlight/50 rounded-[var(--radius-lg)] border p-4 transition-colors"
            >
              <CardTitle className="text-base">{link.label}</CardTitle>
              <CardDescription>Open module AI Assist for {link.domain}.</CardDescription>
            </Link>
          ))}
        </div>
        <Card>
          <CardTitle>Try a draft here</CardTitle>
          <CardDescription>
            Use this hub to generate ideas quickly, then apply or copy them into the matching module
            form.
          </CardDescription>
          <div className="mt-4">
            <AiAssistPanel domain="communication" title="Quick communication draft" />
          </div>
        </Card>
      </div>
    </main>
  );
}
