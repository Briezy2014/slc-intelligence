import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  ACTIVE_CAPABILITIES,
  BENEFIT_POINTS,
  CAPABILITY_GUARDRAIL,
  FUTURE_GATED_CAPABILITIES,
  INSTRUCTIONAL_CAPABILITIES,
  INSTRUCTIONAL_POSITIONING,
} from "@/lib/content/capabilities";
import { INSTRUCTIONAL_STATUS_LABEL } from "@/lib/instructional-intelligence/matrix";

export const metadata: Metadata = { title: "Capability roadmap" };

export default function CapabilityRoadmapPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Capability roadmap" }]} />
      <PageHeader
        title="Capability roadmap"
        description="What is available now for special education classroom teams, and what stays gated for later district/legal approval."
      />
      <div className="space-y-6">
        <Alert title="Privacy and authority guardrail" tone="warning">
          {CAPABILITY_GUARDRAIL}
        </Alert>
        <Alert title="Instructional positioning" tone="info">
          {INSTRUCTIONAL_POSITIONING}
        </Alert>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Instructional differentiators</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {INSTRUCTIONAL_CAPABILITIES.map((item) => (
              <Card key={item.title}>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
                <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                  {INSTRUCTIONAL_STATUS_LABEL[item.status]}
                </p>
                <p className="text-muted mt-1 text-xs">{item.where}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Active classroom capabilities</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {ACTIVE_CAPABILITIES.map((item) => (
              <Card key={item.title}>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Special education benefits</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {BENEFIT_POINTS.map((item) => (
              <Card key={item.title}>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Future capabilities — not activated</h2>
          <p className="text-muted text-sm">
            SIS, EMIS, expanded 504, compliance reports, OCR reporting packages, and state reporting
            remain inactive until district and legal counsel approve.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {FUTURE_GATED_CAPABILITIES.map((item) => (
              <Card key={item.title} className="border-dashed opacity-90">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
                <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                  Roadmap · inactive
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/instructional-intelligence" className="text-highlight underline">
            Instructional intelligence toolkit
          </Link>
          <Link href="/para-supports" className="text-highlight underline">
            Para supports
          </Link>
          <Link href="/education-documents" className="text-highlight underline">
            Ohio-aligned IEP / ETR / progress blanks
          </Link>
          <Link href="/deadlines" className="text-highlight underline">
            Deadline tracker
          </Link>
          <Link href="/parent-share" className="text-highlight underline">
            Parent share
          </Link>
          <Link href="/family-communication" className="text-highlight underline">
            Parent communication + signatures
          </Link>
          <Link href="/ai-assist" className="text-highlight underline">
            AI lesson planning & goal drafts
          </Link>
        </div>
      </div>
    </main>
  );
}
