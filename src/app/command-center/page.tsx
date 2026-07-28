import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Command Center",
};

export default function CommandCenterPage() {
  return (
    <div>
      <AppShell
        title="Command Center"
        description="Role-aware summaries will live here in later phases. This Bundle 1 page establishes the authenticated navigation shell only."
      >
        <div className="space-y-6">
          <Alert title="Shell only" tone="info">
            No student records, caseloads, or analytics are loaded. Authorization and tenant
            selection begin in Phase 3.
          </Alert>
          <LoadingState label="Example loading state for dashboard panels" />
          <EmptyState
            title="No classroom tasks yet"
            description="Assigned data-collection reminders and follow-ups will appear here after later workflow phases are authorized."
          />
        </div>
      </AppShell>
    </div>
  );
}
