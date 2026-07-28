import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Health",
};

export default function HealthPage() {
  const supabaseConfigured = isSupabaseConfigured();
  const generatedAt = new Date().toISOString();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-foreground font-serif text-3xl font-semibold">Application health</h1>
        <p className="text-muted mt-2">
          Lightweight readiness view for Bundle 1. No database connection is required in this phase.
        </p>
        <dl className="border-border bg-background-elevated mt-8 space-y-4 rounded-[var(--radius-lg)] border p-6 shadow-[var(--shadow-soft)]">
          <div>
            <dt className="text-foreground text-sm font-semibold">Status</dt>
            <dd className="text-muted">ok</dd>
          </div>
          <div>
            <dt className="text-foreground text-sm font-semibold">Service</dt>
            <dd className="text-muted">slc-intelligence</dd>
          </div>
          <div>
            <dt className="text-foreground text-sm font-semibold">Phase bundle</dt>
            <dd className="text-muted">Bundle 1 (Phase 1 and Phase 2)</dd>
          </div>
          <div>
            <dt className="text-foreground text-sm font-semibold">Supabase configured</dt>
            <dd className="text-muted">{supabaseConfigured ? "yes" : "no"}</dd>
          </div>
          <div>
            <dt className="text-foreground text-sm font-semibold">Generated at (UTC)</dt>
            <dd className="text-muted">{generatedAt}</dd>
          </div>
        </dl>
      </main>
    </div>
  );
}
