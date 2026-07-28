import type { ReactNode } from "react";
import { cn } from "@/lib/utilities";

export function VisuallyHidden({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("sr-only", className)}>{children}</span>;
}
