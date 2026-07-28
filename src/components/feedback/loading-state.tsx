export function LoadingState({ label = "Loading content" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="border-border bg-background-elevated rounded-[var(--radius-lg)] border px-6 py-10 shadow-[var(--shadow-soft)]"
    >
      <p className="text-foreground text-sm font-semibold">{label}</p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <div className="bg-surface-subtle h-3 w-2/3 animate-pulse rounded" />
        <div className="bg-surface-subtle h-3 w-full animate-pulse rounded" />
        <div className="bg-surface-subtle h-3 w-5/6 animate-pulse rounded" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
