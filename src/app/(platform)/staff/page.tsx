import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { listStaff } from "@/lib/data/staff";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = {
  title: "Staff",
};

export default async function StaffPage() {
  const state = await listStaff();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Staff" }]} />
      <PageHeader
        title="Staff"
        description="Organization members and staff assignment entry points."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <TableShell
          caption="Staff members"
          headers={["Name", "Role", "Status", "Start date"]}
          rows={state.data.rows.map((member) => [
            member.profile ? `${member.profile.display_name}` : member.user_id,
            ROLE_LABELS[member.role_code],
            member.status,
            member.start_date,
          ])}
        />
      )}
      {state.configured && !state.error ? (
        <div className="mt-4 text-sm">
          {state.data.rows.map((member) => (
            <Link
              key={member.user_id}
              href={`/staff/${member.user_id}`}
              className="text-accent mr-4 font-semibold hover:underline"
            >
              View {member.profile?.display_name ?? member.user_id}
            </Link>
          ))}
        </div>
      ) : null}
    </main>
  );
}
