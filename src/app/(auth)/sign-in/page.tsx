import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/forms/sign-in-form";
import { isServerSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/auth/session";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign in",
};

type SignInPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const rawNext = Array.isArray(params?.next) ? params?.next[0] : params?.next;
  const message = Array.isArray(params?.message) ? params?.message[0] : params?.message;
  const configured = isServerSupabaseConfigured();
  const configurationNeeded = !configured || message === "configuration-needed";
  const next = safeRedirectPath(rawNext, "/command-center");

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="motion-safe-rise">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Sign in" }]} />
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
            title="Sign in"
            description={`Access the ${APP_NAME} Command Center with your authorized educator account.`}
          />
          <DevelopmentNotice>
            This development environment must be connected to a Supabase project before real
            authentication can succeed.
          </DevelopmentNotice>
        </section>
        <Card className="brand-glow motion-safe-fade-in">
          <h2 className="text-foreground font-serif text-2xl font-semibold">Welcome back</h2>
          <p className="text-muted mt-1 text-sm">
            Sessions are managed by Supabase Auth when this environment is configured.
          </p>
          <SignInForm next={next} configurationNeeded={configurationNeeded} />
        </Card>
      </div>
    </main>
  );
}
