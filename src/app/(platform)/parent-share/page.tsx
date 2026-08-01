import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Alert } from "@/components/ui/alert";
import { TableShell } from "@/components/data-display/table-shell";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Parent share" };

export default async function ParentSharePage() {
  const state = await listCommunications();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Parent share" }]} />
      <PageHeader
        title="Parent share packets"
        description="Family-visible communications ready to share home. Pair with signature workflows in Family Communication for receipt acknowledgment."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Family-visible notes only" tone="info">
            This list shows communications marked for families. Internal notes stay out. For
            signatures, open Family Communication and create a sign link or capture on a staff
            device.
          </Alert>
          <TableShell
            caption="Family-visible share candidates"
            headers={["Subject", "Method", "Status", "Occurred"]}
            rows={state.data.familyVisibleCommunications.map((log) => [
              log.subject,
              log.method,
              log.status,
              new Date(log.occurred_at).toLocaleString(),
            ])}
          />
        </div>
      )}
    </main>
  );
}
