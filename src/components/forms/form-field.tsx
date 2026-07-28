import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utilities";

export function FormField({
  id,
  label,
  description,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {description ? (
        <p id={descriptionId} className="text-muted text-sm">
          {description}
        </p>
      ) : null}
      <div
        // Consumers should pass aria-describedby composed from description/error ids as needed.
        data-description-id={descriptionId}
        data-error-id={errorId}
      >
        {children}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-danger text-sm font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
