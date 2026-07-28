import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Component gallery",
};

export default function ComponentsPage() {
  return (
    <AppShell
      title="Component gallery"
      description="Lightweight documentation approach for Bundle 1 reusable primitives. Prefer semantic HTML and accessible names before adding complex abstractions."
    >
      <div className="space-y-10">
        <section aria-labelledby="actions-heading" className="space-y-3">
          <h2 id="actions-heading" className="font-serif text-2xl font-semibold">
            Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Ghost action</Button>
            <Button variant="danger">Destructive action</Button>
          </div>
        </section>

        <section aria-labelledby="forms-heading" className="space-y-3">
          <h2 id="forms-heading" className="font-serif text-2xl font-semibold">
            Form controls
          </h2>
          <div className="max-w-md space-y-2">
            <Label htmlFor="sample-field">Sample field label</Label>
            <Input id="sample-field" name="sample-field" placeholder="Visible label required" />
            <p className="text-muted text-sm">
              Placeholder text is never a substitute for a programmatic label.
            </p>
          </div>
        </section>

        <section aria-labelledby="feedback-heading" className="space-y-3">
          <h2 id="feedback-heading" className="font-serif text-2xl font-semibold">
            Feedback states
          </h2>
          <Alert title="Informational alert" tone="info">
            Use calm, non-alarmist language for educator workflows.
          </Alert>
          <LoadingState label="Loading state example" />
          <EmptyState
            title="Empty state example"
            description="Explain what is missing and what happens next without punitive framing."
          />
          <ErrorState description="Error states must remain understandable and free of secrets." />
        </section>
      </div>
    </AppShell>
  );
}
