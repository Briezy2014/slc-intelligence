"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary:", error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ErrorState
        title="Page error"
        description="An unexpected error occurred while rendering this page. No student data should be included in diagnostics."
        onRetry={reset}
      />
    </div>
  );
}
