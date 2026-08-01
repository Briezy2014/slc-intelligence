"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  BrainCircuit,
  ClipboardList,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileStack,
  Gauge,
  Goal,
  Layers3,
  LibraryBig,
  Map,
  MessageCircle,
  FileText,
  NotebookText,
  Package,
  Puzzle,
  School,
  Settings2,
  Speech,
  ChartColumn,
  Sparkles,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { PLATFORM_NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utilities";

const ICONS = {
  "/command-center": Gauge,
  "/ai-assist": Sparkles,
  "/students": Users,
  "/schools": School,
  "/programs": Layers3,
  "/classrooms": Building2,
  "/staff": UsersRound,
  "/goals": Goal,
  "/progress/enter": ClipboardList,
  "/education-documents": FileText,
  "/reports": NotebookText,
  "/behavior-detective": BrainCircuit,
  "/interventions": LibraryBig,
  "/accommodations": Puzzle,
  "/services": Speech,
  "/family-communication": MessageCircle,
  "/meetings": CalendarDays,
  "/executive-function": ClipboardCheck,
  "/classroom-operations": Building2,
  "/administrative-intelligence": ChartColumn,
  "/organization/settings": Settings2,
  "/instructional-intelligence": BrainCircuit,
  "/worksheet-generator": Wrench,
  "/instructional-packets": Package,
  "/para-supports": UsersRound,
  "/parent-share": MessageCircle,
  "/deadlines": CalendarDays,
  "/capability-roadmap": Map,
  "/billing": CreditCard,
} as const;

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Platform navigation"
      className="border-border bg-background-elevated brand-glow h-fit rounded-[var(--radius-xl)] border p-3"
    >
      <p className="text-muted px-2 pb-2 text-xs font-semibold tracking-[0.14em] uppercase">
        Navigation
      </p>
      <nav className="space-y-4">
        {PLATFORM_NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-muted px-2 pb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.href as keyof typeof ICONS] ?? FileStack;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent-soft text-foreground ring-1 ring-[rgb(139_61_255/0.35)]"
                          : "text-muted hover:bg-surface-subtle hover:text-foreground",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="text-highlight size-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
