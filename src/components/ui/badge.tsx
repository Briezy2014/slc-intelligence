import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utilities";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        neutral: "border-border bg-surface-subtle text-foreground",
        info: "border-transparent bg-info-soft text-foreground",
        success: "border-transparent bg-success-soft text-foreground",
        warning: "border-transparent bg-warning-soft text-foreground",
        danger: "border-transparent bg-danger-soft text-foreground",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export function Badge({
  className,
  tone,
  children,
}: React.PropsWithChildren<{ className?: string } & VariantProps<typeof badgeVariants>>) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
