import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <PageHeader
        title="About SLC Intelligence"
        description="A special education platform vision focused on authentic classroom workflows and human professional authority."
      />
      <div className="text-muted space-y-6">
        <p>
          Special education teams often document progress, behavior, interventions, accommodations,
          services, and communication across disconnected tools. That fragmentation increases
          workload and weakens the usability of classroom evidence.
        </p>
        <p>
          Repeated data entry makes it harder to keep records consistent. Educators need a way to
          enter information once and reuse it only where authorized and educationally appropriate.
        </p>
        <p>
          Classroom data is frequently collected, but turning it into understandable, actionable
          insight for instruction and IEP team review remains difficult. SLC Intelligence is being
          designed around a planned one-entry architecture and evidence-first analytics.
        </p>
        <p>
          Decision support will remain educator-centered. The platform is intended to support
          professional judgment and must not replace the IEP team, evaluation team, administrator,
          intervention specialist, psychologist, related service provider, parent, or other
          qualified decision-maker.
        </p>
      </div>
      <div className="mt-8">
        <DevelopmentNotice />
      </div>
    </main>
  );
}
