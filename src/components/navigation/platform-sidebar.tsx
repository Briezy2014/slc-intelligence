import Link from "next/link";
import { PLATFORM_NAV } from "@/lib/constants";

export function PlatformSidebar() {
  return (
    <aside
      aria-label="Platform navigation"
      className="border-border bg-background-elevated h-fit rounded-[var(--radius-lg)] border p-3 shadow-[var(--shadow-soft)]"
    >
      <p className="text-muted px-2 pb-2 text-xs font-semibold tracking-wide uppercase">
        Platform shell
      </p>
      <nav>
        <ul className="flex flex-col gap-1">
          {PLATFORM_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-foreground hover:bg-accent-soft block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
