import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { Card } from "@/components/ui/card";
import { ForgotPasswordFormShell } from "@/components/forms/forgot-password-form-shell";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
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
        description="Design shell only. No recovery email is sent and no Supabase connection is active."
      />
      <Card>
        <ForgotPasswordFormShell />
        <p className="text-muted mt-4 text-sm">
          <Link href="/sign-in" className="text-accent font-semibold hover:underline">
            Back to sign-in design
          </Link>
        </p>
      </Card>
      <div className="mt-6">
        <DevelopmentNotice />
      </div>
    </main>
  );
}
