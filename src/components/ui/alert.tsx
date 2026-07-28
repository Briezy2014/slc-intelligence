import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utilities";

const alertVariants = cva("rounded-[var(--radius-lg)] border px-4 py-3 text-sm", {
  variants: {
    tone: {
      info: "border-[color-mix(in_oklab,var(--info),white_55%)] bg-info-soft text-foreground",
      success:
        "border-[color-mix(in_oklab,var(--success),white_55%)] bg-success-soft text-foreground",
      warning:
        "border-[color-mix(in_oklab,var(--warning),white_55%)] bg-warning-soft text-foreground",
      danger: "border-[color-mix(in_oklab,var(--danger),white_55%)] bg-danger-soft text-foreground",
      neutral: "border-border bg-surface-subtle text-foreground",
    },
  },
  defaultVariants: {
    tone: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title: string;
}

export function Alert({ className, tone, title, children, ...props }: AlertProps) {
  return (
    <div role="status" className={cn(alertVariants({ tone }), className)} {...props}>
      <p className="font-semibold">{title}</p>
      {children ? <div className="text-muted mt-1">{children}</div> : null}
    </div>
  );
}
