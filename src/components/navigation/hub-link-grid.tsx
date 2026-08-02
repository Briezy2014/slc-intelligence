import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function HubLinkGrid({
  links,
}: {
  links: Array<{ href: string; label: string; description: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border-border bg-background-elevated hover:border-highlight/50 hover:bg-surface-subtle flex min-h-11 items-start justify-between gap-3 rounded-[var(--radius-lg)] border p-4 transition-colors"
        >
          <span className="min-w-0">
            <span className="text-foreground block font-semibold">{link.label}</span>
            <span className="text-muted mt-1 block text-sm">{link.description}</span>
          </span>
          <ChevronRight className="text-highlight mt-1 size-5 shrink-0" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
