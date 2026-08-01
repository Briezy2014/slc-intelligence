import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import {
  ACTIVE_CAPABILITIES,
  BENEFIT_POINTS,
  FUTURE_GATED_CAPABILITIES,
  INSTRUCTIONAL_CAPABILITIES,
} from "@/lib/content/capabilities";
import { INSTRUCTIONAL_STATUS_LABEL } from "@/lib/instructional-intelligence/matrix";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "SLC Intelligence special education classroom capabilities, instructional intelligence differentiators, and future district integrations.",
};

export default function CapabilitiesPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Capabilities" }]} />
      <PageHeader
        title="Special education classroom capabilities"
        description="Built for intervention specialists, special education teachers, and related service providers."
      />

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-foreground font-serif text-2xl font-semibold">
            Instructional intelligence
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {INSTRUCTIONAL_CAPABILITIES.map((item) => (
              <article
                key={item.id}
                className="border-border bg-background-elevated/80 rounded-[var(--radius-lg)] border p-4"
              >
                <h3 className="text-foreground font-semibold">{item.title}</h3>
                <p className="text-muted mt-2 text-sm">{item.body}</p>
                <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                  {INSTRUCTIONAL_STATUS_LABEL[item.status]}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-foreground font-serif text-2xl font-semibold">What teams can use</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ACTIVE_CAPABILITIES.map((item) => (
              <article
                key={item.title}
                className="border-border bg-background-elevated/80 rounded-[var(--radius-lg)] border p-4"
              >
                <h3 className="text-foreground font-semibold">{item.title}</h3>
                <p className="text-muted mt-2 text-sm">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-foreground font-serif text-2xl font-semibold">
            Why it helps special education teams
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFIT_POINTS.map((item) => (
              <article
                key={item.title}
                className="border-border bg-background-elevated/80 rounded-[var(--radius-lg)] border p-4"
              >
                <h3 className="text-foreground font-semibold">{item.title}</h3>
                <p className="text-muted mt-2 text-sm">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-foreground font-serif text-2xl font-semibold">
            Not activated yet
          </h2>
          <p className="text-muted text-sm">
            Also summarized on the{" "}
            <Link href="/" className="text-highlight underline">
              homepage
            </Link>
            .
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FUTURE_GATED_CAPABILITIES.map((item) => (
              <article
                key={item.title}
                className="border-border rounded-[var(--radius-lg)] border border-dashed p-4"
              >
                <h3 className="text-foreground font-semibold">{item.title}</h3>
                <p className="text-muted mt-2 text-sm">{item.body}</p>
                <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                  Not activated
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/request-access"
            className="bg-accent text-accent-foreground hover:bg-accent-secondary inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-5 py-2 text-sm font-semibold"
          >
            Request access
          </Link>
          <Link
            href="/pilot-use"
            className="border-border bg-background-elevated inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold"
          >
            Read pilot use rules
          </Link>
        </div>
      </div>
    </main>
  );
}
