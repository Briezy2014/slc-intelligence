import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { PILOT_DEIDENTIFIED_USE_SUMMARY } from "@/lib/content/pilot-deidentified-use";

export function PilotUseBanner() {
  return (
    <Alert title="Pilot rule: coded / de-identified data only" tone="warning">
      <p>{PILOT_DEIDENTIFIED_USE_SUMMARY}</p>
      <p className="mt-2">
        <Link href="/pilot-use" className="font-semibold underline underline-offset-4">
          Read full pilot use rules
        </Link>
      </p>
    </Alert>
  );
}
