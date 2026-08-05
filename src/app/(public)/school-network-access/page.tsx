import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { CANONICAL_PRODUCTION_URL, PRODUCTION_DOMAIN } from "@/lib/constants/product";

export const metadata: Metadata = {
  title: "School network access (Fortinet)",
  description:
    "District IT steps for Fortinet / SSL inspection so Chromebooks can open SLC Intelligence.",
};

const ALLOWLIST = [
  { host: PRODUCTION_DOMAIN, purpose: "Apex domain" },
  { host: `www.${PRODUCTION_DOMAIN}`, purpose: "Canonical web app (use this URL)" },
  { host: "*.supabase.co", purpose: "Sign-in / API (production Supabase project)" },
  {
    host: "*.vercel.app",
    purpose: "Optional: preview deployments only (not required for production)",
  },
] as const;

export default function SchoolNetworkAccessPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/support", label: "Support" },
          { label: "School network access" },
        ]}
      />
      <PageHeader
        title="School network access"
        description="For district IT: fix Chromebook errors that name Fortinet when opening SLC Intelligence."
      />

      <div className="space-y-6">
        <Alert title="This is a district firewall certificate issue" tone="warning">
          If Chrome shows <strong>NET::ERR_CERT_AUTHORITY_INVALID</strong> and mentions{" "}
          <strong>Fortinet</strong>, the school network is intercepting HTTPS. SLC Intelligence
          cannot install Fortinet trust on Chromebooks or create FortiGate exceptions from the app.
          District IT must apply one of the options below.
        </Alert>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Quick check</h2>
          <ul className="text-muted list-disc space-y-2 pl-5">
            <li>
              Open{" "}
              <a
                className="text-highlight font-semibold underline-offset-4 hover:underline"
                href={`${CANONICAL_PRODUCTION_URL.replace("://", "://www.")}/`}
              >
                https://www.{PRODUCTION_DOMAIN}
              </a>{" "}
              on a phone hotspot or home Wi‑Fi.
            </li>
            <li>
              If it loads off school Wi‑Fi, our public certificate is fine — Fortinet trust or an
              inspection exception is still needed on campus.
            </li>
            <li>Do not ask staff to bypass certificate warnings on managed Chromebooks.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Option A — Trust the Fortinet CA (recommended)</h2>
          <ol className="text-muted list-decimal space-y-2 pl-5">
            <li>Export the FortiGate SSL deep-inspection CA used on staff policies.</li>
            <li>
              In <strong>Google Admin</strong>, push that CA to managed Chromebooks as a trusted
              certificate authority.
            </li>
            <li>Have staff sign out/in or reboot so the profile loads the new trust.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Option B — SSL inspection exception (allowlist)</h2>
          <p className="text-muted">
            Exempt these hosts from HTTPS / SSL deep inspection (and allow outbound TCP 443 if
            needed):
          </p>
          <div className="border-border overflow-x-auto rounded-[var(--radius-lg)] border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-subtle">
                <tr>
                  <th className="border-border border-b px-4 py-3 font-semibold">Host</th>
                  <th className="border-border border-b px-4 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {ALLOWLIST.map((row) => (
                  <tr key={row.host}>
                    <td className="border-border border-b px-4 py-3 font-mono text-xs sm:text-sm">
                      {row.host}
                    </td>
                    <td className="border-border text-muted border-b px-4 py-3">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-sm">
            Paste-ready list:{" "}
            <code className="text-foreground">{ALLOWLIST.map((row) => row.host).join(", ")}</code>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">What we verified on our side</h2>
          <ul className="text-muted list-disc space-y-2 pl-5">
            <li>
              Production hosts use public <strong>Let’s Encrypt</strong> certificates on Vercel.
            </li>
            <li>
              Canonical site: <strong>https://www.{PRODUCTION_DOMAIN}</strong> (apex redirects
              here).
            </li>
            <li>
              We do not operate your FortiGate, Google Admin, or Chromebook certificate store —
              those are district controls.
            </li>
          </ul>
        </section>

        <p className="text-muted">
          More product support:{" "}
          <Link className="text-highlight underline-offset-4 hover:underline" href="/support">
            Support
          </Link>
          . Internal runbook: <code className="text-foreground">docs/SCHOOL_NETWORK_ACCESS.md</code>
          .
        </p>
      </div>
    </main>
  );
}
