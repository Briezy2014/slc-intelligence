import { DevelopmentStatusBanner } from "@/components/layout/development-status-banner";
import { PlatformSidebar } from "@/components/navigation/platform-sidebar";
import { PlatformTopNav } from "@/components/navigation/platform-top-nav";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DevelopmentStatusBanner />
      <PlatformTopNav />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <PlatformSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
