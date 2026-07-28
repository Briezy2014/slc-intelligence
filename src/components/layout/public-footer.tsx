import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-border bg-background-elevated mt-auto border-t">
      <div className="text-muted mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-foreground font-semibold">{APP_NAME}</p>
          <p>Designed to support privacy-conscious educational workflows.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/about" className="hover:text-foreground hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-foreground hover:underline">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/command-center" className="hover:text-foreground hover:underline">
                Command Center shell
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
