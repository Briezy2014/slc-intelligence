import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";

export const metadata: Metadata = {
  title: "Accessibility",
};

export default function AccessibilityPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Accessibility" }]} />
      <PageHeader
        title="Accessibility goals"
        description="Accessibility is treated as a first-class product requirement for SLC Intelligence."
      />
      <ul className="text-muted list-disc space-y-2 pl-5">
        <li>WCAG 2.2 Level AA target where feasible</li>
        <li>Full keyboard support and visible focus</li>
        <li>Screen-reader-compatible structure and labels</li>
        <li>Accessible forms with instructions and errors</li>
        <li>Accessible tables with captions and headers</li>
        <li>Text alternatives or data-table views for future charts</li>
        <li>Responsive layouts for classroom devices</li>
        <li>Ongoing accessibility testing in development and CI</li>
      </ul>
      <div className="mt-8">
        <DevelopmentNotice />
      </div>
    </main>
  );
}
