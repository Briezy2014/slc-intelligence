"use client";

import { useEffect } from "react";
import { logClientSafeError } from "@/lib/monitoring/safe-log";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logClientSafeError(error.message);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#12062D", color: "#FFFFFF", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600 }}>Application error</h1>
          <p style={{ marginTop: "0.75rem", color: "#C9C2D9" }}>
            An unexpected error occurred. No student data should appear in diagnostics.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              minHeight: "2.75rem",
              borderRadius: "0.5rem",
              background: "#8B3DFF",
              color: "#FFFFFF",
              border: 0,
              padding: "0.5rem 1rem",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
