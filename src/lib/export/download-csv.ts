/** Client-side CSV download + coordinator email helpers (no email server required). */

export function toCsvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function rowsToCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): string {
  const lines = [
    headers.map(toCsvCell).join(","),
    ...rows.map((row) => row.map(toCsvCell).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Opens the user's email app with a ready subject/body (attach the downloaded CSV manually). */
export function openCoordinatorEmail(options: { to?: string; subject: string; body: string }) {
  const params = new URLSearchParams();
  params.set("subject", options.subject);
  params.set("body", options.body);
  const to = options.to?.trim() || "";
  window.location.href = `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export function printHtmlDocument(title: string, bodyHtml: string) {
  const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!popup) return;
  popup.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title.replaceAll("<", "")}</title>
  <style>
    body { font-family: Georgia, serif; margin: 24px; color: #111; line-height: 1.45; }
    h1 { font-size: 22px; margin: 0 0 12px; }
    h2 { font-size: 16px; margin: 20px 0 8px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f2f2f2; }
    .toolbar { margin-bottom: 16px; font-family: system-ui, sans-serif; }
    .toolbar button { padding: 8px 12px; margin-right: 8px; cursor: pointer; }
    @media print { .toolbar { display: none; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button onclick="window.close()">Close</button>
  </div>
  <h1>${title.replaceAll("<", "")}</h1>
  ${bodyHtml}
</body>
</html>`);
  popup.document.close();
}
