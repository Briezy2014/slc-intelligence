"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#f4f7f8] text-[#1a2b33]">
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold">Application error</h1>
          <p className="mt-3 text-[#5b6b73]">
            An unexpected error occurred. No student data should appear in diagnostics.
          </p>
          <button
            type="button"
            className="mt-6 min-h-11 rounded-md bg-[#1f6f78] px-4 py-2 text-sm font-semibold text-white"
            onClick={reset}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
