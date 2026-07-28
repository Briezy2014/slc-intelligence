import Link from "next/link";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/health", label: "Health" },
];

export function SiteHeader({ variant = "public" }: { variant?: "public" | "app" }) {
  return (
    <header className="border-border/80 bg-background-elevated/90 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-foreground font-serif text-xl font-semibold tracking-tight"
          >
            SLC Intelligence
          </Link>
          <p className="text-muted truncate text-sm">
            {variant === "app" ? "Command Center shell" : "Specialized Learning Classrooms"}
          </p>
        </div>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
          {variant === "public" ? (
            publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:bg-surface-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))
          ) : (
            <Link
              href="/"
              className="text-foreground hover:bg-surface-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
            >
              Exit shell
            </Link>
          )}
          {variant === "public" ? (
            <Link
              href="/sign-in"
              className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold hover:bg-[color-mix(in_oklab,var(--accent),black_8%)]"
            >
              Sign in
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
