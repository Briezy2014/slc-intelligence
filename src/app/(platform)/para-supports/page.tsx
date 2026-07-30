import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ParaSupportsExplainerPanel } from "@/components/domain/para-supports-explainer-panel";

export const metadata: Metadata = {
  title: "Para supports",
  description: "Plain-language approved supports for paraprofessionals.",
};

export default function ParaSupportsPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Para supports" }]} />
      <PageHeader
        title="Para supports"
        description="Understand approved accommodations and classroom supports in plain language. Follow the written plan — do not invent new supports."
      />
      <div className="space-y-6">
        <Alert title="Approved supports only" tone="info">
          Use this page to clarify supports already on the student’s plan. Ask the intervention
          specialist before changing anything.
        </Alert>
        <Card>
          <CardTitle>Quick rules for classroom support staff</CardTitle>
          <CardDescription className="mt-2 space-y-2">
            <p>1. Follow the written accommodation / behavior support as approved.</p>
            <p>2. Use the least help needed, then fade help when the plan says so.</p>
            <p>3. Record what happened; do not diagnose or invent new goals.</p>
            <p>
              4. If safety is at risk, follow the crisis plan and get an adult lead immediately.
            </p>
          </CardDescription>
        </Card>
        <ParaSupportsExplainerPanel />
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/accommodations" className="text-highlight underline">
            Accommodation tracker
          </Link>
          <Link href="/interventions" className="text-highlight underline">
            Interventions & fidelity
          </Link>
          <Link href="/behavior-detective" className="text-highlight underline">
            Behavior Detective
          </Link>
          <Link href="/instructional-intelligence" className="text-highlight underline">
            Instructional intelligence
          </Link>
        </div>
      </div>
    </main>
  );
}
