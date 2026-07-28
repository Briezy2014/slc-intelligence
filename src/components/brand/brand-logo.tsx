import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utilities";
import { APP_NAME } from "@/lib/constants";

type BrandLogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 56,
  hero: 120,
} as const;

export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  className,
  priority = false,
}: BrandLogoProps) {
  const pixels = SIZE_MAP[size];
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/slc-logo.png"
        alt=""
        width={pixels}
        height={pixels}
        priority={priority}
        className="rounded-[22%] shadow-[0_8px_24px_rgb(139_61_255/0.25)]"
      />
      {showWordmark ? (
        <span className="min-w-0">
          <span className="text-foreground block font-serif text-lg font-semibold tracking-tight sm:text-xl">
            {APP_NAME}
          </span>
          {size !== "sm" ? (
            <span className="text-muted block truncate text-xs tracking-[0.08em] uppercase">
              Specialized Learning Classrooms
            </span>
          ) : null}
        </span>
      ) : (
        <span className="sr-only">{APP_NAME}</span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="hover:opacity-95 focus-visible:rounded-[var(--radius-md)]">
      {content}
    </Link>
  );
}
