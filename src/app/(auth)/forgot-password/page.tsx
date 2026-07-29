import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { isServerSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  const configured = isServerSupabaseConfigured();

  return (
    <main id="main-content" className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/sign-in", label: "Sign in" },
          { label: "Forgot password" },
        ]}
      />
      <PageHeader
        title="Forgot password"
        description="Request a password reset link for an authorized account."
      />
      <Card>
        <ForgotPasswordForm configurationNeeded={!configured} />
        <p className="text-muted mt-4 text-sm">
          <Link href="/sign-in" className="text-accent font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
