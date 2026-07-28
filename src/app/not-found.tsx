import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-foreground font-serif text-3xl font-semibold">Page not found</h1>
        <p className="text-muted mt-3">The requested page does not exist in the Bundle 1 shell.</p>
        <Link
          href="/"
          className="bg-accent text-accent-foreground mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
        >
          Return home
        </Link>
      </main>
    </div>
  );
}
