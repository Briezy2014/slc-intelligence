"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utilities";

function isLinkSelected(pathname: string, href: string, allHrefs: string[]): boolean {
  if (pathname === href) return true;
  // Longer sibling paths win (e.g. /accommodations/library over /accommodations).
  const longerMatch = allHrefs
    .filter((candidate) => candidate !== href && pathname.startsWith(`${candidate}/`))
    .sort((a, b) => b.length - a.length)[0];
  if (longerMatch) return false;
  return pathname.startsWith(`${href}/`);
}

export function ModuleLinkGrid({
  links,
}: {
  links: Array<{ href: string; label: string; description: string }>;
}) {
  const pathname = usePathname();
  const hrefs = links.map((link) => link.href);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => {
        const selected = isLinkSelected(pathname, link.href, hrefs);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "border-border bg-background-elevated flex min-h-11 items-start justify-between gap-3 rounded-[var(--radius-lg)] border p-4 transition-colors",
              "hover:border-highlight/50 hover:bg-surface-subtle active:bg-surface-subtle",
              selected
                ? "border-highlight/60 bg-accent-soft ring-1 ring-[rgb(139_61_255/0.35)]"
                : null,
            )}
          >
            <span className="min-w-0">
              <span className="text-foreground block font-semibold">{link.label}</span>
              <span className="text-muted mt-1 block text-sm">{link.description}</span>
              <span className="text-highlight mt-2 block text-sm font-semibold">
                {selected ? "Working here" : "Tap to open →"}
              </span>
            </span>
            <ChevronRight className="text-highlight mt-1 size-5 shrink-0" aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
