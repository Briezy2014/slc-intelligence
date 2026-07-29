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
        "border-border bg-[rgb(18_6_45/0.65)] text-foreground placeholder:text-muted focus:border-highlight/50 flex min-h-11 w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm shadow-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
