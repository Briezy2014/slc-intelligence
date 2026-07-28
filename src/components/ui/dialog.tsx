"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utilities";

type DialogProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({ title, description, triggerLabel, children, className }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => dialogRef.current?.showModal()}>
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "border-border bg-background-elevated text-foreground w-[min(32rem,calc(100%-2rem))] rounded-[var(--radius-lg)] border p-0 shadow-[var(--shadow-soft)] backdrop:bg-[rgb(26_43_51/0.45)]",
          className,
        )}
      >
        <div className="space-y-3 p-5">
          <h2 id={titleId} className="font-serif text-2xl font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-muted text-sm">
              {description}
            </p>
          ) : null}
          <div>{children}</div>
          <form method="dialog">
            <Button type="submit" variant="secondary">
              Close
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
}
