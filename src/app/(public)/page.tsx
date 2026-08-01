import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, FileCheck2, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import {
  ACTIVE_CAPABILITIES,
  BENEFIT_POINTS,
  FUTURE_GATED_CAPABILITIES,
} from "@/lib/content/capabilities";
import { PILOT_DEIDENTIFIED_USE_SUMMARY } from "@/lib/content/pilot-deidentified-use";

export default function HomePage() {
  return (
    <main id="main-content" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="brand-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <section className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="motion-safe-rise grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BrandLogo href={null} size="lg" showWordmark={false} priority />
            <p className="text-highlight mt-6 text-sm font-semibold tracking-[0.18em] uppercase">
              {APP_NAME}
            </p>
            <h1 className="text-foreground mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {APP_TAGLINE}
            </h1>
            <p className="text-muted mt-5 max-w-2xl text-base sm:text-lg">
              Built for special education teams—intervention specialists, teachers, and service
              providers—to collect daily data, monitor goals, document behavior, plan instruction,
              and communicate with families in one professional workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="bg-accent text-accent-foreground hover:bg-accent-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 py-2 text-sm font-semibold transition-colors"
              >
                Sign in
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/capabilities"
                className="border-border bg-background-elevated/80 text-foreground hover:border-highlight/40 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold transition-colors"
              >
                View capabilities
              </Link>
            </div>
          </div>
          <div className="motion-safe-fade-in flex justify-center lg:justify-end">
            <div className="brand-glow relative rounded-[2rem] border border-[rgb(255_255_255/12%)] bg-[rgb(26_11_63/70%)] p-6">
              <Image
                src="/brand/slc-logo.png"
                alt={`${APP_NAME} logo`}
                width={320}
                height={320}
                priority
                className="rounded-[1.5rem]"
              />
              <p className="text-muted mt-4 text-center text-xs tracking-[0.16em] uppercase">
                Official brand mark
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-6 px-4 pb-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Time savings",
              body: "One-entry classroom workflows reduce duplicate documentation across goals, behavior, and family updates.",
              icon: Clock3,
            },
            {
              title: "Better documentation",
              body: "Structured special education records support clearer progress evidence and team review.",
              icon: FileCheck2,
            },
            {
              title: "AI assistance",
              body: "Draft lesson plans, IEP goal language, and parent communications—always educator-reviewed.",
              icon: Sparkles,
            },
          ].map((item, index) => (
            <article
              key={item.title}
              className="border-border bg-background-elevated/90 brand-glow motion-safe-rise rounded-[var(--radius-xl)] border p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <item.icon className="text-highlight size-5" aria-hidden="true" />
              <h2 className="text-foreground mt-3 font-serif text-xl font-semibold">
                {item.title}
              </h2>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-4 px-4 pb-10 sm:px-6">
        <h2 className="text-foreground font-serif text-2xl font-semibold">
          Special education capabilities
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVE_CAPABILITIES.slice(0, 9).map((item) => (
            <article
              key={item.title}
              className="border-border bg-background-elevated/80 rounded-[var(--radius-lg)] border p-4"
            >
              <h3 className="text-foreground text-sm font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
            </article>
          ))}
        </div>
        <Link href="/capabilities" className="text-highlight text-sm font-semibold underline">
          See full capabilities, benefits, and future roadmap
        </Link>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-4 px-4 pb-10 sm:px-6">
        <h2 className="text-foreground font-serif text-2xl font-semibold">
          Benefits for intervention specialists and teams
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFIT_POINTS.map((item) => (
            <article
              key={item.title}
              className="border-border bg-background-elevated/80 rounded-[var(--radius-lg)] border p-4"
            >
              <h3 className="text-foreground text-sm font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-4 px-4 pb-10 sm:px-6">
        <h2 className="text-foreground font-serif text-2xl font-semibold">Current pilot rule</h2>
        <article className="border-border bg-background-elevated/90 rounded-[var(--radius-xl)] border p-5">
          <p className="text-muted text-sm sm:text-base">{PILOT_DEIDENTIFIED_USE_SUMMARY}</p>
          <p className="mt-4">
            <Link href="/pilot-use" className="text-highlight text-sm font-semibold underline">
              Read full pilot use rules
            </Link>
          </p>
        </article>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-4 px-4 pb-16 sm:px-6">
        <h2 className="text-foreground font-serif text-2xl font-semibold">
          Not activated for general use yet
        </h2>
        <p className="text-muted max-w-3xl text-sm sm:text-base">
          These stay off until district and legal approval. Everyday classroom tools above are
          available now for practice.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_GATED_CAPABILITIES.map((item) => (
            <article
              key={item.title}
              className="border-border rounded-[var(--radius-lg)] border border-dashed p-4"
            >
              <h3 className="text-foreground text-sm font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
              <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                Not activated yet
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
