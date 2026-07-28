import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "The page could not be loaded. Try again, or return to the home page.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="space-y-4">
      <Alert title={title} tone="danger">
        {description}
      </Alert>
      {onRetry ? (
        <Button type="button" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
