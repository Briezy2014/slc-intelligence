import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function PublicFooter() {
  return (
    <footer className="border-border bg-background-elevated/70 mt-auto border-t">
      <div className="text-muted mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <BrandLogo href={null} size="sm" showWordmark />
          <p>Designed to support privacy-conscious educational workflows.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/about" className="hover:text-highlight transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-highlight transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-highlight transition-colors">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/command-center" className="hover:text-highlight transition-colors">
                Command Center
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
