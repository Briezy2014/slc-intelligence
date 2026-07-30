import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div
      role="status"
      className="border-border bg-background-elevated rounded-[var(--radius-lg)] border border-dashed px-6 py-10 text-center shadow-[var(--shadow-soft)]"
    >
      <h2 className="text-foreground font-serif text-2xl font-semibold">{title}</h2>
      <p className="text-muted mx-auto mt-2 max-w-lg">{description}</p>
      {actionLabel && actionHref ? (
        <div className="mt-6 flex justify-center">
          <Link
            href={actionHref}
            className="bg-accent text-accent-foreground inline-flex rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
          >
            {actionLabel}
          </Link>
        </div>
      ) : actionLabel && onAction ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
