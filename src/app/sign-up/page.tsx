import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <h1 className="text-foreground font-serif text-3xl font-semibold">
          Invitation sign-up design
        </h1>
        <p className="text-muted mt-2">
          Invitation-based membership is planned for Phase 3. This screen is a design reference
          only.
        </p>
        <div className="border-border bg-background-elevated mt-8 rounded-[var(--radius-lg)] border p-6 shadow-[var(--shadow-soft)]">
          <Alert title="No accounts are created here" tone="info">
            Do not enter real credentials. Bundle 1 does not connect to authentication services.
          </Alert>
          <form className="mt-6 space-y-4">
            <div>
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" name="full-name" disabled />
            </div>
            <div>
              <Label htmlFor="invite-email">Work email</Label>
              <Input id="invite-email" name="email" type="email" disabled />
            </div>
            <div>
              <Label htmlFor="invite-password">Create password</Label>
              <Input id="invite-password" name="password" type="password" disabled />
            </div>
            <Button type="button" disabled className="w-full">
              Continue unavailable in Bundle 1
            </Button>
          </form>
          <p className="text-muted mt-4 text-sm">
            <Link
              href="/sign-in"
              className="text-accent font-semibold underline-offset-2 hover:underline"
            >
              Back to sign-in design
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
