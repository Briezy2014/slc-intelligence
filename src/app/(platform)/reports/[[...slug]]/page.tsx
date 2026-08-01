import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import {
  ModuleLinkGrid,
  ReportCreateForm,
  ReportDetail,
  ReportPrintView,
  ReportingPeriodForm,
  ReportingTables,
} from "@/components/domain/phase-modules";
import { listReporting } from "@/lib/data/reporting";

export const metadata: Metadata = { title: "Progress reports" };

export default async function ReportsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const state = await listReporting({
    reportId: slug[0] && slug[0] !== "periods" ? slug[0] : undefined,
  });
  const segment = slug[0] ?? "index";
  const reportId = segment !== "periods" && segment !== "index" ? segment : null;
  const isNewPeriod = segment === "periods" && slug[1] === "new";
  const isPrint = Boolean(reportId && slug[1] === "print");

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Reports" }]} />
      <PageHeader
        title="Progress reports"
        description="Reporting periods, draft reports, evidence links, print exports, and status history."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : isPrint && reportId ? (
        <ReportPrintView data={state.data} reportId={reportId} />
      ) : reportId ? (
        <ReportDetail data={state.data} reportId={reportId} />
      ) : (
        <div className="space-y-6">
          <ModuleLinkGrid
            links={[
              {
                href: "/reports/periods",
                label: "Reporting periods",
                description: "Review active, inactive, and archived reporting windows.",
              },
              {
                href: "/reports/periods/new",
                label: "New period",
                description: "Create a reporting period when authorized.",
              },
              {
                href: "/reports",
                label: "Report dashboard",
                description: "View draft, review-ready, finalized, and corrected reports.",
              },
            ]}
          />
          {isNewPeriod ? (
            <Card>
              <CardTitle>Create reporting period</CardTitle>
              <CardDescription>
                Dates are validated before saving and scoped to the active organization.
              </CardDescription>
              <div className="mt-4">
                <ReportingPeriodForm organizationId={state.data.organizationId ?? ""} />
              </div>
            </Card>
          ) : (
            <Card>
              <CardTitle>Create report draft</CardTitle>
              <CardDescription>
                Goal sections are seeded from active goals in the selected IEP cycle.
              </CardDescription>
              <div className="mt-4">
                <ReportCreateForm data={state.data} />
              </div>
            </Card>
          )}
          <ReportingTables data={state.data} />
        </div>
      )}
    </main>
  );
}
