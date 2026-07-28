import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TableShell } from "@/components/data-display/table-shell";

export const metadata: Metadata = {
  title: "Component gallery",
};

export default function ComponentGalleryPage() {
  return (
    <main id="main-content" className="space-y-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/command-center", label: "Command Center" },
          { label: "Component gallery" },
        ]}
      />
      <PageHeader
        title="Component gallery"
        description="Bundle 1 documentation approach for reusable primitives. Prefer semantic HTML and accessible names."
      />

      <section aria-labelledby="actions-heading" className="space-y-3">
        <h2 id="actions-heading" className="font-serif text-2xl font-semibold">
          Actions and status
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </section>

      <section aria-labelledby="forms-heading" className="space-y-3">
        <h2 id="forms-heading" className="font-serif text-2xl font-semibold">
          Form controls
        </h2>
        <div className="grid max-w-xl gap-4">
          <div>
            <Label htmlFor="gallery-input">Sample input</Label>
            <Input id="gallery-input" name="gallery-input" />
          </div>
          <div>
            <Label htmlFor="gallery-select">Sample select</Label>
            <Select id="gallery-select" defaultValue="">
              <option value="" disabled>
                Choose an option
              </option>
              <option value="one">Option one</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="gallery-textarea">Sample textarea</Label>
            <Textarea id="gallery-textarea" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="gallery-check" />
            <Label htmlFor="gallery-check" className="mb-0">
              Sample checkbox
            </Label>
          </div>
          <Dialog
            title="Dialog shell"
            description="Native dialog with accessible labeling for Bundle 1."
            triggerLabel="Open dialog shell"
          >
            <p className="text-muted text-sm">Dialog content placeholder.</p>
          </Dialog>
        </div>
      </section>

      <section aria-labelledby="feedback-heading" className="space-y-3">
        <h2 id="feedback-heading" className="font-serif text-2xl font-semibold">
          Feedback and data display
        </h2>
        <Alert title="Informational alert" tone="info">
          Use calm language for educator workflows.
        </Alert>
        <LoadingState label="Loading state example" />
        <EmptyState
          title="Empty state example"
          description="Explain what is missing without punitive framing."
        />
        <ErrorState description="Error states must remain understandable and free of secrets." />
        <TableShell
          caption="Example table shell"
          headers={["Area", "Status"]}
          rows={[
            ["Authentication", "Not connected"],
            ["Protected data modules", "Not implemented"],
          ]}
        />
      </section>
    </main>
  );
}
