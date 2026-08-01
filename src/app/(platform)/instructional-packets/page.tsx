import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { InstructionalPacketGenerator } from "@/components/domain/instructional-packet-generator";

export const metadata: Metadata = {
  title: "Instructional packets",
  description:
    "Generate differentiated 30–100 page instructional packets from learner profiles, IEP goals, and interests.",
};

export default function InstructionalPacketsPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Instructional packets" }]} />
      <PageHeader
        title="Instructional packet generator"
        description="Turn a learner profile and IEP goal into a differentiated activity packet with visuals, games, assessments, and data sheets."
      />
      <InstructionalPacketGenerator />
      <p className="text-muted mt-6 text-sm">
        Related:{" "}
        <Link href="/instructional-intelligence" className="text-highlight underline">
          Instructional intelligence
        </Link>
        {" · "}
        <Link href="/ai-assist" className="text-highlight underline">
          AI Assist
        </Link>
        {" · "}
        <Link href="/para-supports" className="text-highlight underline">
          Para supports
        </Link>
      </p>
    </main>
  );
}
