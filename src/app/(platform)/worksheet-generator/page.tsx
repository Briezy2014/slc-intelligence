import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { WorksheetGeneratorForm } from "@/components/domain/worksheet-generator-form";

export const metadata: Metadata = {
  title: "Worksheet Generator",
  description:
    "Generate customized printable worksheet packets from a learning goal and dropdown options.",
};

export default function WorksheetGeneratorPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Worksheet Generator" }]} />
      <PageHeader
        title="Worksheet Generator"
        description="Enter a learning goal, choose options, and generate a printable packet with large drawings (and theme illustrations when your API key supports images). Print or Save as PDF — student pages have no AI disclaimer footer."
      />
      <WorksheetGeneratorForm />
    </main>
  );
}
