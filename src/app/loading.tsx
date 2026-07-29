import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="border-border bg-background-elevated brand-glow motion-safe-fade-in w-full rounded-[var(--radius-xl)] border p-8"
      >
        <div className="flex items-center gap-4">
          <Image
            src="/brand/slc-logo.png"
            alt=""
            width={56}
            height={56}
            className="rounded-[22%]"
            priority
          />
          <div>
            <p className="text-foreground font-semibold">Loading {APP_NAME}</p>
            <p className="text-muted text-sm">Preparing your Command Center workspace…</p>
          </div>
        </div>
        <div className="mt-6 space-y-3" aria-hidden="true">
          <div className="bg-accent-soft h-2.5 w-1/2 animate-pulse rounded-full" />
          <div className="bg-surface-subtle h-2.5 w-full animate-pulse rounded-full" />
          <div className="from-highlight/40 to-accent/30 h-2.5 w-4/5 animate-pulse rounded-full bg-gradient-to-r" />
        </div>
      </div>
    </div>
  );
}
