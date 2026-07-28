import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { Card } from "@/components/ui/card";
import { SignInFormShell } from "@/components/forms/sign-in-form-shell";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section>
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Sign in" }]} />
          <PageHeader
            title="Sign in design"
            description="Visual and accessible form shell only. Authentication is deferred to Phase 3 and is not connected to Supabase yet."
          />
          <DevelopmentNotice />
        </section>
        <Card>
          <h2 className="text-foreground font-serif text-2xl font-semibold">Sign in</h2>
          <p className="text-muted mt-1 text-sm">
            Submitting this form will not authenticate a user or create a session.
          </p>
          <SignInFormShell />
        </Card>
      </div>
    </main>
  );
}
