import Link from "next/link";
import { DevelopmentStatusBanner } from "@/components/layout/development-status-banner";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DevelopmentStatusBanner />
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-foreground font-serif text-3xl font-semibold">Page not found</h1>
        <p className="text-muted mt-3">The requested page does not exist in the Bundle 1 shell.</p>
        <Link
          href="/"
          className="bg-accent text-accent-foreground mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
        >
          Return home
        </Link>
      </main>
      <PublicFooter />
    </div>
  );
}
