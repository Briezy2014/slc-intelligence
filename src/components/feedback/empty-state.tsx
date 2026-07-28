import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      role="status"
      className="border-border bg-background-elevated rounded-[var(--radius-lg)] border border-dashed px-6 py-10 text-center shadow-[var(--shadow-soft)]"
    >
      <h2 className="text-foreground font-serif text-2xl font-semibold">{title}</h2>
      <p className="text-muted mx-auto mt-2 max-w-lg">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
