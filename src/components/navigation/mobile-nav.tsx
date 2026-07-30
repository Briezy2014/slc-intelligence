"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { PUBLIC_NAV } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="secondary"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
        <span>{open ? "Close" : "Menu"}</span>
      </Button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="border-border bg-background-elevated absolute inset-x-0 top-full z-30 border-b p-4 shadow-[var(--shadow-soft)]"
        >
          <nav aria-label="Mobile primary">
            <ul className="space-y-1">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:bg-surface-subtle block rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
