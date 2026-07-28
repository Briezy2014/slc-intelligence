import Link from "next/link";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { APP_NAME, PUBLIC_NAV } from "@/lib/constants";

export function PublicHeader() {
  return (
    <header className="border-border/80 bg-background-elevated/90 relative border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-foreground font-serif text-xl font-semibold tracking-tight"
          >
            {APP_NAME}
          </Link>
          <p className="text-muted truncate text-sm">Specialized Learning Classrooms</p>
        </div>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:bg-surface-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="bg-accent text-accent-foreground hidden min-h-11 items-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold sm:inline-flex"
          >
            Sign in
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
