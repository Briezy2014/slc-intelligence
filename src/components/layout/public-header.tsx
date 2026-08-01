import Link from "next/link";
import { LogIn } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { PUBLIC_NAV } from "@/lib/constants";

export function PublicHeader() {
  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLogo size="md" priority />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted hover:bg-surface-subtle hover:text-foreground rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="bg-accent text-accent-foreground hover:bg-accent-secondary inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold transition-colors"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Sign in
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
