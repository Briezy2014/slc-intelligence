import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { ErrorState } from "@/components/feedback/error-state";

export function ConfigurationState() {
  return (
    <DevelopmentNotice title="Configuration needed">
      Supabase is not configured for this environment. Protected data will load after Supabase URL
      and anon key values are configured; no fake authentication or seeded data is displayed here.
    </DevelopmentNotice>
  );
}

export function SafeErrorState({ message }: { message?: string }) {
  return (
    <ErrorState
      title="Unable to load data"
      description={message ?? "The requested data could not be loaded. No internal database details are exposed."}
    />
  );
}
