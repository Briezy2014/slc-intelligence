import * as React from "react";
import { cn } from "@/lib/utilities";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, id, ...props }: CheckboxProps) {
  return (
    <input
      id={id}
      type="checkbox"
      className={cn(
        "border-border text-accent size-5 rounded border accent-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
