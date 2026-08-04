import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { WorksheetGeneratorForm } from "@/components/domain/worksheet-generator-form";

export const metadata: Metadata = {
  title: "Worksheet Generator",
  description:
    "Choose subject, grade band, supports, and a topic/skill dropdown to auto-fill an IEP learning goal and generate printable packets.",
};

export default function WorksheetGeneratorPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Worksheet Generator" }]} />
      <PageHeader
        title="Worksheet Generator"
        description="Pick subject → grade band → instructional level → supports → topic/skill. The learning goal auto-fills in IEP format (By the end of the IEP…). Then generate a printable packet with drawings."
      />
      <WorksheetGeneratorForm />
    </main>
  );
}
