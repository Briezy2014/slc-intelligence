import * as React from "react";
import { cn } from "@/lib/utilities";

export function TableShell({
  caption,
  headers,
  rows,
  className,
  emptyMessage,
}: {
  caption: string;
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
  emptyMessage?: string;
}) {
  return (
    <div
      className={cn("border-border overflow-x-auto rounded-[var(--radius-lg)] border", className)}
    >
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="border-border bg-surface-subtle text-foreground border-b px-4 py-3 text-left font-semibold">
          {caption}
        </caption>
        <thead className="bg-background-elevated">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-border border-b px-4 py-3 font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="border-border text-muted border-b px-4 py-6 text-sm"
              >
                {emptyMessage ?? "Nothing here yet."}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={`row-${index}`}
                className="odd:bg-background-elevated even:bg-surface-subtle/40"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${index}-${cellIndex}`}
                    className="border-border text-muted border-b px-4 py-3"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
