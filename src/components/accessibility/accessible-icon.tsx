import type { ReactNode } from "react";
import { VisuallyHidden } from "@/components/accessibility/visually-hidden";

export function AccessibleIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center" aria-hidden={false}>
      <span aria-hidden="true">{children}</span>
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
