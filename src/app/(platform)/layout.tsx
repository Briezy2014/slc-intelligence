import { PlatformSidebar } from "@/components/navigation/platform-sidebar";
import { PlatformTopNav } from "@/components/navigation/platform-top-nav";

/** Always render fresh platform HTML so removed banners cannot stick in edge/browser caches. */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <PlatformTopNav />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <PlatformSidebar />
        <div className="border-border bg-background-elevated/40 min-w-0 space-y-4 rounded-[var(--radius-xl)] border p-4 shadow-[var(--shadow-soft)] sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
