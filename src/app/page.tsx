import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert } from "@/components/ui/alert";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_20%_20%,rgb(31_111_120/0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgb(42_95_143/0.12),transparent_35%)]"
        />
        <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
          <p className="text-foreground font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            SLC Intelligence
          </p>
          <h1 className="text-foreground mt-4 max-w-3xl text-2xl font-medium sm:text-3xl">
            The Intelligence Platform for Specialized Learning Classrooms
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-base sm:text-lg">
            A calm, evidence-first workspace for intervention specialists, classroom teams, and
            special education leaders—designed for privacy-conscious educational workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-in"
              className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-5 py-2 text-sm font-semibold"
            >
              View sign-in design
            </Link>
            <Link
              href="/command-center"
              className="border-border bg-background-elevated text-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold"
            >
              Open Command Center shell
            </Link>
          </div>
        </section>
        <section className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Alert title="Development status" tone="info">
            Bundle 1 provides the application scaffold and public shell only. Authentication,
            tenants, and student data begin in later authorized phases. This repository is not
            approved for production use or real student data.
          </Alert>
        </section>
      </main>
    </div>
  );
}
