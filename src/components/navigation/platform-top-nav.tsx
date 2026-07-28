import Link from "next/link";
import { OrganizationSelectorPlaceholder } from "@/components/navigation/organization-selector-placeholder";
import { UserMenuPlaceholder } from "@/components/navigation/user-menu-placeholder";
import { APP_NAME } from "@/lib/constants";

export function PlatformTopNav() {
  return (
    <header className="border-border/80 bg-background-elevated/90 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href="/" className="text-foreground font-serif text-xl font-semibold">
              {APP_NAME}
            </Link>
            <p className="text-muted text-sm">Command Center shell</p>
          </div>
          <Link
            href="/"
            className="hover:bg-surface-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium lg:hidden"
          >
            Exit shell
          </Link>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <OrganizationSelectorPlaceholder />
          <UserMenuPlaceholder />
          <Link
            href="/"
            className="hover:bg-surface-subtle hidden rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium lg:inline-flex"
          >
            Exit shell
          </Link>
        </div>
      </div>
    </header>
  );
}
