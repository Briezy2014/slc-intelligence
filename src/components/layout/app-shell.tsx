import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

const appNav = [
  { href: "/command-center", label: "Command Center" },
  { href: "/sign-in", label: "Sign-in design" },
  { href: "/components", label: "Component gallery" },
];

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader variant="app" />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          aria-label="Application navigation"
          className="border-border bg-background-elevated h-fit rounded-[var(--radius-lg)] border p-3 shadow-[var(--shadow-soft)]"
        >
          <p className="text-muted px-2 pb-2 text-xs font-semibold tracking-wide uppercase">
            Navigation shell
          </p>
          <nav className="flex flex-col gap-1">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:bg-accent-soft rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="mb-6">
            <h1 className="text-foreground text-3xl font-semibold">{title}</h1>
            <p className="text-muted mt-2 max-w-2xl">{description}</p>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}
