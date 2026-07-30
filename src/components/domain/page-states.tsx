import { Alert } from "@/components/ui/alert";
import { ErrorState } from "@/components/feedback/error-state";

export function ConfigurationState() {
  return (
    <Alert title="Configuration needed" tone="warning">
      Supabase is not configured for this environment. Protected data will load after the Supabase
      URL and anon key are configured.
    </Alert>
  );
}

export function SafeErrorState({ message }: { message?: string }) {
  return (
    <ErrorState
      title="Unable to load data"
      description={
        message ??
        "The requested data could not be loaded. No internal database details are exposed."
      }
    />
  );
}
