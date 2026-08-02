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
  HandHelping,
  Layers3,
  LibraryBig,
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
import { PLATFORM_NAV_GROUPS, type PlatformNavItem } from "@/lib/constants";
import { cn } from "@/lib/utilities";

const ICONS = {
  "/command-center": Gauge,
  "/admin": Settings2,
  "/supports": HandHelping,
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
  "/billing": CreditCard,
} as const;

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemOrChildActive(pathname: string, item: PlatformNavItem) {
  if (pathMatches(pathname, item.href)) return true;
  return Boolean(item.children?.some((child) => pathMatches(pathname, child.href)));
}

function NavLink({
  item,
  pathname,
  nested = false,
}: {
  item: PlatformNavItem;
  pathname: string;
  nested?: boolean;
}) {
  const Icon = ICONS[item.href as keyof typeof ICONS] ?? FileStack;
  const active = pathMatches(pathname, item.href);
  const showChildren = Boolean(item.children?.length) && itemOrChildActive(pathname, item);

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
          nested && "pl-4 text-[13px]",
          active
            ? "bg-accent-soft text-foreground ring-1 ring-[rgb(139_61_255/0.35)]"
            : "text-muted hover:bg-surface-subtle hover:text-foreground",
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon className="text-highlight size-4 shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
      {showChildren ? (
        <ul className="mt-0.5 ml-2 space-y-0.5 border-l border-[rgb(139_61_255/0.25)] pl-2">
          {item.children!.map((child) => (
            <NavLink key={child.href} item={child} pathname={pathname} nested />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Platform navigation"
      className="border-border bg-background-elevated brand-glow h-fit rounded-[var(--radius-xl)] border p-3"
    >
      <p className="text-muted px-2 pb-2 text-xs font-semibold tracking-[0.14em] uppercase">Menu</p>
      <nav className="space-y-4">
        {PLATFORM_NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-muted px-2 pb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
