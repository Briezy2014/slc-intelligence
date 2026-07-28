import { Badge } from "@/components/ui/badge";

export function OrganizationSelectorPlaceholder() {
  return (
    <div className="border-border bg-surface-subtle rounded-[var(--radius-md)] border border-dashed px-3 py-2">
      <p className="text-muted text-xs font-semibold tracking-wide uppercase">Organization</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-foreground text-sm font-medium">Not connected</p>
        <Badge tone="warning">Nonfunctional until Phase 3</Badge>
      </div>
    </div>
  );
}
