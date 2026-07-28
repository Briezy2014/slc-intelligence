import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { EmptyState } from "@/components/feedback/empty-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Command Center",
};

const placeholders = [
  { label: "Students requiring review", value: "Not connected" },
  { label: "Goals needing data", value: "Not connected" },
  { label: "Reports due", value: "Not connected" },
];

export default function CommandCenterPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Command Center" }]} />
      <PageHeader
        title="Command Center"
        description="Authenticated-platform shell placeholder. Authentication is not yet active."
      />
      <div className="space-y-6">
        <DevelopmentNotice>
          Authentication is not yet active. This dashboard contains fictional placeholder
          information only. Protected-data modules are not yet implemented.
        </DevelopmentNotice>
        <div className="grid gap-4 md:grid-cols-3">
          {placeholders.map((item) => (
            <Card key={item.label}>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg">{item.label}</CardTitle>
                <Badge tone="warning">Placeholder</Badge>
              </div>
              <CardDescription>{item.value}</CardDescription>
            </Card>
          ))}
        </div>
        <EmptyState
          title="No connected classroom workflows"
          description="Progress monitoring, Behavior Detective, and administrative intelligence will appear here only after later authorized phases."
        />
      </div>
    </main>
  );
}
