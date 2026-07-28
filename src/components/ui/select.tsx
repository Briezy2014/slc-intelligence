import * as React from "react";
import { cn } from "@/lib/utilities";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "border-border bg-background-elevated text-foreground flex min-h-11 w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
