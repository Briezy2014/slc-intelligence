import type { Metadata } from "next";
import { EducationDocumentsWorkspace } from "@/components/domain/education-documents-workspace";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listEducationDocuments } from "@/lib/data/education-documents";
import type { EducationDocumentType } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "IEP / ETR / Progress documents" };

function tabFromSlug(slug?: string[]): EducationDocumentType {
  const value = slug?.[0];
  if (value === "etr" || value === "progress-reports") {
    return value === "etr" ? "etr" : "progress_report";
  }
  return "iep";
}

export default async function EducationDocumentsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const state = await listEducationDocuments();
  const initialTab = tabFromSlug(slug);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Education documents" }]} />
      <PageHeader
        title="IEP, ETR, and progress documents"
        description="Ohio-aligned blank IEP/ETR/progress drafts, pre-populated fields, dropdown sections, and upload assist for team review."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : !state.data.permissions.canRead ? (
        <SafeErrorState message="You are not authorized to view education documents." />
      ) : (
        <EducationDocumentsWorkspace data={state.data} initialTab={initialTab} />
      )}
    </main>
  );
}
