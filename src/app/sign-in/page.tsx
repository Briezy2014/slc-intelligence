import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center"
      >
        <section className="flex-1">
          <p className="text-foreground font-serif text-4xl font-semibold">SLC Intelligence</p>
          <h1 className="text-foreground mt-3 text-2xl font-medium">Sign in design</h1>
          <p className="text-muted mt-3 max-w-xl">
            This page is a visual and accessibility shell only. Authentication is deferred to Phase
            3. No credentials are processed here.
          </p>
        </section>
        <section className="border-border bg-background-elevated w-full max-w-md rounded-[var(--radius-lg)] border p-6 shadow-[var(--shadow-soft)]">
          <Alert title="Design preview" tone="warning">
            Form controls are non-functional placeholders for layout and accessibility review.
          </Alert>
          <form className="mt-6 space-y-4" aria-describedby="sign-in-help">
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@example.org"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                disabled
              />
            </div>
            <p id="sign-in-help" className="text-muted text-sm">
              Real sign-in will use Supabase Authentication after Phase 3 authorization.
            </p>
            <Button type="button" disabled className="w-full">
              Sign in unavailable in Bundle 1
            </Button>
          </form>
          <p className="text-muted mt-4 text-sm">
            Need an account design reference?{" "}
            <Link
              href="/sign-up"
              className="text-accent font-semibold underline-offset-2 hover:underline"
            >
              View sign-up design
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
