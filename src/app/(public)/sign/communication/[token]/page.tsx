import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { PublicCommunicationSignForm } from "@/components/domain/public-communication-sign-form";
import { isServerSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Acknowledge communication",
  description: "Electronically acknowledge receipt of a school communication.",
};

export default async function PublicCommunicationSignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <PageHeader title="Acknowledge communication" description="Signing is unavailable." />
        <Alert title="Unavailable" tone="warning">
          This signing page is not configured in the current environment.
        </Alert>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_communication_sign_packet", {
    p_token: token,
  });
  const packet = Array.isArray(data) ? data[0] : data;

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Acknowledge communication" }]} />
      <PageHeader
        title="Acknowledge communication"
        description="Review the message and add your signature to confirm you received it."
      />
      {error || !packet ? (
        <Alert title="Link unavailable" tone="warning">
          This sign link is invalid, expired, or has been revoked. Contact the school staff member
          who sent the communication for a new link.
        </Alert>
      ) : (
        <PublicCommunicationSignForm
          token={token}
          subject={packet.subject}
          summary={packet.summary}
          organizationName={packet.organization_name}
          alreadySigned={Boolean(packet.already_signed)}
        />
      )}
    </main>
  );
}
