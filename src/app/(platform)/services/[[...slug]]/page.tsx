import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ModuleLinkGrid, ServicesWorkspace } from "@/components/domain/application-modules";
import { listServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const state = await listServices({ servicePlanId: slug[0] && !["definitions", "logs", "reviews", "exports"].includes(slug[0]) ? slug[0] : undefined });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />
      <PageHeader title="Services" description="Service definitions, plans, provider workspace logs, reviews, and export records." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <ModuleLinkGrid links={[
            { href: "/services", label: "Dashboard", description: "Review service plans and delivery records." },
            { href: "/services/definitions", label: "Definitions", description: "Manage service definitions." },
            { href: "/services/logs", label: "Provider workspace", description: "Record individual or group service delivery." },
          ]} />
          <ServicesWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
