import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { APP_NAME } from "@/lib/constants";
import { BENEFIT_POINTS, CAPABILITY_GUARDRAIL } from "@/lib/content/capabilities";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <div className="mb-6">
        <Image
          src="/brand/slc-logo.png"
          alt={`${APP_NAME} logo`}
          width={88}
          height={88}
          className="rounded-[22%] shadow-[0_12px_30px_rgb(139_61_255/0.28)]"
          priority
        />
      </div>
      <PageHeader
        title={`About ${APP_NAME}`}
        description="A special education classroom intelligence platform focused on authentic workflows, stronger documentation, and human professional authority."
      />
      <div className="text-muted space-y-6">
        <p>
          Special education teams often document progress, behavior, interventions, accommodations,
          services, and family communication across disconnected tools. That fragmentation costs
          time and weakens the usability of classroom evidence for instruction and IEP team review.
        </p>
        <p>
          {APP_NAME} is designed for intervention specialists, special education teachers,
          paraprofessionals, and related service providers. It brings daily data collection, goal
          tracking, Behavior Detective, progress monitoring, accommodation tracking, AI drafting
          support, Ohio-aligned blank IEP/ETR/progress templates, parent communication, signature
          workflows, parent share packets, and timeline reminders into one professional workspace.
        </p>
        <p>
          The platform emphasizes time savings, better documentation, more consistent progress
          monitoring, AI assistance with educator review, clearer parent communication, and
          instructional intelligence tools, and practical compliance reminders—while keeping
          educational decisions with qualified
          professionals and the IEP team.
        </p>
        <div className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Benefits for special education</h2>
          <ul className="list-disc space-y-2 pl-5">
            {BENEFIT_POINTS.map((item) => (
              <li key={item.title}>
                <span className="text-foreground font-medium">{item.title}:</span> {item.body}
              </li>
            ))}
          </ul>
        </div>
        <p>{CAPABILITY_GUARDRAIL}</p>
        <p>
          Advanced district integrations such as SIS, EMIS, expanded Section 504, compliance
          reports, OCR reporting packages, and state reporting are on the roadmap and remain not
          activated until district and legal counsel approve.
        </p>
        <p>
          <Link href="/capabilities" className="text-highlight font-semibold underline">
            Review the full capabilities page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
