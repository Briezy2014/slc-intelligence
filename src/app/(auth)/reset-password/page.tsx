import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { isServerSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  const configured = isServerSupabaseConfigured();

  return (
    <main id="main-content" className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/sign-in", label: "Sign in" },
          { label: "Reset password" },
        ]}
      />
      <PageHeader
        title="Reset password"
        description="Choose a new password after opening a valid Supabase recovery link."
      />
      <Card>
        <ResetPasswordForm configurationNeeded={!configured} />
        <p className="text-muted mt-4 text-sm">
          <Link href="/sign-in" className="text-accent font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
