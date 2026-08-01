"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utilities";

export function CopyInviteCodeButton({
  code,
  className,
  label = "Copy invite code",
}: {
  code: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <code className="border-border bg-surface-subtle rounded-[var(--radius-md)] border px-3 py-2 text-sm font-semibold tracking-wide">
        {code}
      </code>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            // Fallback for restricted clipboard environments.
            const input = document.createElement("textarea");
            input.value = code;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }
        }}
      >
        {copied ? "Copied" : label}
      </Button>
    </div>
  );
}
