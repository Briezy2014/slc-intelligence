import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState } from "@/components/domain/page-states";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";
import { listMembershipsForUser } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Account" }]} />
        <PageHeader
          title="Account"
          description="Supabase configuration is required before account details can load."
        />
        <ConfigurationState />
      </main>
    );
  }

  const user = await requireUser("/account");
  const supabase = await createClient();
  const [{ data: profile }, memberships] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("display_name,preferred_name,status")
      .eq("id", user.id)
      .maybeSingle(),
    listMembershipsForUser(user.id),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Account" }]} />
      <PageHeader title="Account" description="Review your authenticated account context." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {profile?.preferred_name ?? profile?.display_name ?? user.email ?? "Authenticated user"}
          </CardDescription>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted font-semibold">Email</dt>
              <dd>{user.email ?? "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-muted font-semibold">Status</dt>
              <dd>{profile?.status ?? "Supabase auth active"}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <CardTitle>Memberships</CardTitle>
          <CardDescription>Organization memberships visible to this account.</CardDescription>
          <ul className="mt-4 space-y-3">
            {memberships.map((membership) => (
              <li
                key={membership.id}
                className="border-border rounded-[var(--radius-md)] border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {membership.organization?.name ?? "Unnamed organization"}
                    </p>
                    <p className="text-muted">{ROLE_LABELS[membership.role_code]}</p>
                  </div>
                  <Badge tone={membership.status === "active" ? "success" : "warning"}>
                    {membership.status}
                  </Badge>
                </div>
              </li>
            ))}
            {memberships.length === 0 ? (
              <li className="text-muted text-sm">No memberships available.</li>
            ) : null}
          </ul>
        </Card>
      </div>
    </main>
  );
}
