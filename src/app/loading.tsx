export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-8 shadow-[var(--shadow-soft)]"
      >
        <p className="text-foreground font-semibold">Loading SLC Intelligence</p>
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="bg-surface-subtle h-3 w-1/2 animate-pulse rounded" />
          <div className="bg-surface-subtle h-3 w-full animate-pulse rounded" />
          <div className="bg-surface-subtle h-3 w-4/5 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
