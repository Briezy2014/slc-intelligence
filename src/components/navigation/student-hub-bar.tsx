"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studentDataHubLinks } from "@/lib/navigation/student-data-hub";

export function StudentHubBar({
  studentId,
  studentLabel,
}: {
  studentId: string;
  studentLabel: string;
}) {
  const pathname = usePathname();
  const hubHref = `/students/${studentId}/overview`;
  const onHub = pathname === hubHref || pathname === `/students/${studentId}`;
  const quickLinks = studentDataHubLinks(studentId).filter(
    (link) =>
      !link.href.endsWith("/overview") &&
      [
        "Behavior",
        "Progress",
        "Family communication",
        "Services / providers",
        "Goals & IEP",
      ].includes(link.label),
  );

  return (
    <div className="border-border bg-background-elevated mb-6 rounded-[var(--radius-lg)] border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">Student data</p>
          <p className="font-semibold">{studentLabel}</p>
        </div>
        {onHub ? (
          <span className="text-highlight text-sm font-semibold">Student hub · working here</span>
        ) : (
          <Link
            href={hubHref}
            className="bg-accent text-accent-foreground inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
          >
            Open student hub
          </Link>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "border-highlight bg-surface-subtle inline-flex min-h-10 items-center rounded-[var(--radius-md)] border px-3 py-1.5 text-sm font-semibold"
                  : "border-border hover:border-highlight/40 inline-flex min-h-10 items-center rounded-[var(--radius-md)] border px-3 py-1.5 text-sm"
              }
            >
              {link.label}
            </Link>
          );
        })}
        {!onHub ? (
          <Link
            href={hubHref}
            className="text-highlight inline-flex min-h-10 items-center px-2 text-sm font-semibold"
          >
            All student data →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
