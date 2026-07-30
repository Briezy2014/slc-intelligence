import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import {
  PILOT_AFTER_APPROVAL,
  PILOT_CANNOT_ENTER,
  PILOT_CAN_USE_FOR,
  PILOT_DEIDENTIFIED_USE_SUMMARY,
  PILOT_DEIDENTIFIED_USE_TITLE,
} from "@/lib/content/pilot-deidentified-use";

export const metadata: Metadata = {
  title: "Pilot use rules",
  description:
    "De-identified / coded-data pilot rules for SLC Intelligence classroom practice before district approval for identifiable student information.",
};

export default function PilotUsePage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Pilot use" }]} />
      <PageHeader
        title={PILOT_DEIDENTIFIED_USE_TITLE}
        description="Operational classroom rules for the current pilot. Not a FERPA certification or district legal policy."
      />
      <div className="text-muted space-y-6">
        <p>{PILOT_DEIDENTIFIED_USE_SUMMARY}</p>
        <p>
          Keep any private key that links codes (S1, S2, S3) to real students outside this system. Do
          not type that key into SLC Intelligence, AI Assist, notes, uploads, or communications.
        </p>

        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            What we can use it for during our pilot
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            {PILOT_CAN_USE_FOR.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">What we cannot enter</h2>
          <ul className="list-disc space-y-2 pl-5">
            {PILOT_CANNOT_ENTER.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">If unsure</h2>
          <p>If you are not sure whether something could identify a student, leave it out.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">After district review</h2>
          <p>{PILOT_AFTER_APPROVAL}</p>
        </section>
      </div>
    </main>
  );
}
