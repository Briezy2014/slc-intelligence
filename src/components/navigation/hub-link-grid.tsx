import Link from "next/link";
import { ChevronRight } from "lucide-react";
<<<<<<< HEAD
import { cn } from "@/lib/utilities";

export function HubLinkGrid({
  links,
  activeHref,
  className,
}: {
  links: Array<{ href: string; label: string; description: string }>;
  /** When set, highlights the matching card so teachers see which section is open. */
  activeHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {links.map((link) => {
        const isActive = activeHref != null && activeHref === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "border-border bg-background-elevated flex min-h-14 items-start justify-between gap-3 rounded-[var(--radius-lg)] border p-4 transition-colors",
              "hover:border-highlight/50 hover:bg-surface-subtle active:bg-surface-subtle",
              "focus-visible:ring-highlight focus-visible:ring-2 focus-visible:outline-none",
              isActive && "border-highlight bg-surface-subtle ring-highlight/30 ring-2",
            )}
          >
            <span className="min-w-0">
              <span className="text-foreground block font-semibold">{link.label}</span>
              <span className="text-muted mt-1 block text-sm">{link.description}</span>
              <span className="text-highlight mt-2 block text-sm font-semibold">
                {isActive ? "Open now" : "Tap to open →"}
              </span>
            </span>
            <ChevronRight
              className={cn("mt-1 size-5 shrink-0", isActive ? "text-highlight" : "text-muted")}
              aria-hidden="true"
            />
          </Link>
        );
      })}
=======

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
>>>>>>> origin/main
    </div>
  );
}
