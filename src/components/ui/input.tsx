import * as React from "react";
import { cn } from "@/lib/utilities";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, id, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      className={cn(
        "border-border bg-background-elevated text-foreground placeholder:text-muted flex min-h-11 w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm shadow-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
