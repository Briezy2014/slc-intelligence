import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { OrganizationSelector } from "@/components/navigation/organization-selector";
import { UserMenu } from "@/components/navigation/user-menu";

export async function PlatformTopNav() {
  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <BrandLogo href="/command-center" size="sm" showWordmark priority />
          <Link
            href="/"
            className="text-muted hover:bg-surface-subtle hover:text-foreground rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium lg:hidden"
          >
            Exit
          </Link>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <OrganizationSelector />
          <UserMenu />
          <Link
            href="/"
            className="text-muted hover:bg-surface-subtle hover:text-foreground hidden rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium lg:inline-flex"
          >
            Exit platform
          </Link>
        </div>
      </div>
    </header>
  );
}
