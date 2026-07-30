import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { RequestAccessForm } from "@/components/forms/request-access-form";
import { isServerSupabaseConfigured } from "@/lib/env";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request access",
};

export default async function RequestAccessPage() {
  const configured = isServerSupabaseConfigured();

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="motion-safe-rise">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Request access" }]} />
          <div className="mt-4 mb-6">
            <Image
              src="/brand/slc-logo.png"
              alt={`${APP_NAME} logo`}
              width={88}
              height={88}
              className="rounded-[22%] shadow-[0_16px_40px_rgb(139_61_255/0.3)]"
              priority
            />
          </div>
          <PageHeader
            title="Request access"
            description="Create your account, select the role(s) that fit your work, and wait for administrator approval."
          />
          <p className="text-muted mt-4 max-w-xl text-sm leading-relaxed">
            This is not an open subscription. Access stays under administrator control so only authorized educators
            enter student workflows.
          </p>
        </section>
        <Card className="motion-safe-rise p-6">
          {!configured ? (
            <Alert title="Configuration needed" tone="warning">
              Supabase must be configured before access requests can be submitted.
            </Alert>
          ) : (
            <RequestAccessForm />
          )}
        </Card>
      </div>
    </main>
  );
}
