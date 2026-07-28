"use client";

import * as React from "react";
import { cn } from "@/lib/utilities";

type DropdownShellProps = {
  label: string;
  items: Array<{ id: string; label: string; disabled?: boolean }>;
};

export function DropdownShell({ label, items }: DropdownShellProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  React.useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        className="border-border bg-background-elevated inline-flex min-h-11 items-center rounded-[var(--radius-md)] border px-3 text-sm font-semibold"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className={cn(
            "border-border bg-background-elevated absolute right-0 z-20 mt-2 min-w-48 rounded-[var(--radius-md)] border p-1 shadow-[var(--shadow-soft)]",
          )}
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className="hover:bg-surface-subtle flex w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm disabled:opacity-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
