import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Support",
  description: "Support and contact guidance for SLC Intelligence.",
};

export default function SupportPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Support" }]} />
      <PageHeader
        title="Support"
        description="Product-owner and authorized-user support pathways for SLC Intelligence."
      />
      <div className="text-muted space-y-4">
        <p>
          For production access issues, authentication problems, or deployment defects, contact the product owner
          through the approved organizational support channel.
        </p>
        <p>
          Do not include real student names, family narrative content, or protected education records in support
          emails or screenshots.
        </p>
        <p>
          Use the post-launch issue template in the repository documentation when reporting defects after
          deployment.
        </p>
        <p>
          Account deletion requests should follow the instructions on the{" "}
          <a className="text-highlight underline-offset-4 hover:underline" href="/account-deletion">
            account deletion
          </a>{" "}
          page.
        </p>
      </div>
    </main>
  );
}
