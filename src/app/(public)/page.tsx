import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

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
              A premium intelligence platform for Specialized Learning Classroom teams—designed for
              calm decision support, clear progress data, and professional collaboration.
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
                href="/about"
                className="border-border bg-background-elevated/80 text-foreground hover:border-highlight/40 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-5 py-2 text-sm font-semibold transition-colors"
              >
                Learn about the vision
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
      <section className="relative mx-auto max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Progress intelligence",
              body: "Measurement-aware monitoring with transparent analytics—never automated educational decisions.",
              icon: LineChart,
            },
            {
              title: "Secure by design",
              body: "Organization tenancy, scoped assignments, and audit-ready workflows for professional teams.",
              icon: ShieldCheck,
            },
            {
              title: "Command Center",
              body: "A calm SaaS dashboard that surfaces only what the signed-in educator is authorized to view.",
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
    </main>
  );
}
