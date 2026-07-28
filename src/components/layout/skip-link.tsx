import Link from "next/link";
import { cn } from "@/lib/utils";

export function SkipLink({
  href = "#main-content",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus:bg-background-elevated sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-[var(--radius-md)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      Skip to main content
    </Link>
  );
}
