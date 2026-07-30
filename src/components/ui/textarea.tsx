import * as React from "react";
import { cn } from "@/lib/utilities";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "border-border text-foreground placeholder:text-muted min-h-28 w-full rounded-[var(--radius-md)] border bg-[rgb(18_6_45/0.65)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
