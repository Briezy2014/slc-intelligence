import { DEVELOPMENT_STATUS } from "@/lib/constants";

export function DevelopmentStatusBanner() {
  return (
    <div
      role="status"
      className="bg-warning-soft text-foreground border-b border-[color-mix(in_oklab,var(--warning),white_45%)] px-4 py-2 text-center text-sm"
    >
      <p>
        <span className="font-semibold">Development build.</span> {DEVELOPMENT_STATUS}
      </p>
    </div>
  );
}
