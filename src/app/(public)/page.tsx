import Link from "next/link";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <main id="main-content" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_20%_20%,rgb(31_111_120/0.14),transparent_40%),radial-gradient(circle_at_80%_0%,rgb(42_95_143/0.10),transparent_35%)]"
      />
      <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        <p className="text-foreground font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          {APP_NAME}
        </p>
        <h1 className="text-foreground mt-4 max-w-3xl text-2xl font-medium sm:text-3xl">
          {APP_TAGLINE}
        </h1>
        <p className="text-muted mt-4 max-w-2xl text-base sm:text-lg">
          SLC Intelligence is being designed for Specialized Learning Classrooms, intervention
          specialists, special education programs, building administrators, and district special
          education leadership.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-5 py-2 text-sm font-semibold"
          >
            Learn about the vision
          </Link>
          <Link
            href="/sign-in"
            className="border-border bg-background-elevated text-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold"
          >
            View sign-in design
          </Link>
        </div>
      </section>
      <section className="relative mx-auto max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Planned progress monitoring",
              body: "One-entry progress data designed to support IEP goal graphs, data quality, and reporting readiness.",
            },
            {
              title: "Planned Behavior Detective",
              body: "Observational behavior documentation and pattern summaries without automated diagnostic claims.",
            },
            {
              title: "Planned Command Center",
              body: "Role-aware summaries for classroom teams and administrators within authorized scope.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="border-border bg-background-elevated/90 rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-soft)]"
            >
              <h2 className="text-foreground font-serif text-xl font-semibold">{item.title}</h2>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
            </article>
          ))}
        </div>
        <DevelopmentNotice />
      </section>
    </main>
  );
}
