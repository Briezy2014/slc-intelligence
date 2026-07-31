import { replaceVisualMarkersWithSvg } from "@/lib/worksheet-generator/visuals";

const PAGE_BREAK = "---------- PAGE BREAK ----------";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function printCss(printingFormat: string): string {
  const large = /large/i.test(printingFormat);
  const lowInk = /low ink|high contrast/i.test(printingFormat);
  return `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      margin: 0;
      padding: 16px;
      line-height: 1.45;
      color: #111;
      background: #fff;
      font-size: ${large ? "18px" : "14px"};
    }
    h1 { font-size: ${large ? "26px" : "22px"}; margin: 0 0 12px; }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
      margin-bottom: 16px; padding: 12px; border: 1px solid #ccc; border-radius: 8px;
      background: #f7f7f7; font-family: system-ui, sans-serif; font-size: 14px;
    }
    .toolbar button {
      font: inherit; padding: 8px 12px; border-radius: 6px; border: 1px solid #333;
      background: #111; color: #fff; cursor: pointer;
    }
    .toolbar .secondary { background: #fff; color: #111; }
    .hint { color: #333; }
    .page {
      break-after: page;
      page-break-after: always;
      padding: 8px 4px 24px;
      min-height: 80vh;
    }
    .page:last-child { break-after: auto; page-break-after: auto; }
    .page-body { white-space: pre-wrap; }
    .visual {
      display: inline-block;
      margin: 10px 12px 10px 0;
      vertical-align: top;
      text-align: center;
      max-width: 100%;
    }
    .visual svg {
      display: block;
      border: ${lowInk ? "2px solid #000" : "1px solid #999"};
      border-radius: 8px;
      background: #fff;
      max-width: 100%;
      height: auto;
    }
    .visual figcaption {
      font-family: system-ui, sans-serif;
      font-size: 12px;
      margin-top: 4px;
      color: #222;
    }
    @media print {
      body { padding: 0; }
      .toolbar { display: none !important; }
      .page { min-height: auto; padding: 0 0 8px; }
    }
  `;
}

export function buildPrintablePacketHtml(options: {
  title: string;
  content: string;
  printingFormat?: string;
}): string {
  const title = escapeHtml(options.title || "Worksheet packet");
  const pages = options.content
    .split(PAGE_BREAK)
    .map((page) => page.trim())
    .filter(Boolean);

  const pageHtml = pages
    .map((page, index) => {
      // Escape first, then re-inject SVG for visual markers that were escaped.
      const escaped = escapeHtml(page);
      // Markers were escaped as [[VISUAL:id]] still (no < >), so replace works on escaped text.
      const withVisuals = replaceVisualMarkersWithSvg(escaped).replaceAll("\n", "<br/>");
      return `<section class="page" aria-label="Page ${index + 1}"><div class="page-body">${withVisuals}</div></section>`;
    })
    .join("\n");

  const format = options.printingFormat || "Standard";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <style>${printCss(format)}</style>
</head>
<body>
  <div class="toolbar">
    <strong>${title}</strong>
    <span class="hint">To save a PDF: click Print, then choose “Save as PDF” / “Microsoft Print to PDF”.</span>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <h1>${title}</h1>
  ${pageHtml || `<section class="page"><div class="page-body">(Empty packet)</div></section>`}
  <script>
    window.addEventListener("load", function () {
      if (new URLSearchParams(window.location.search).get("autoprint") === "1") {
        setTimeout(function () { window.focus(); window.print(); }, 250);
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Opens a printable packet in a same-tab blob URL or iframe.
 * Avoids window.open(..., "noopener") which returns null and silently breaks Print/PDF.
 */
export function openPrintablePacket(options: {
  title: string;
  content: string;
  printingFormat?: string;
  autoPrint?: boolean;
}): { ok: true } | { ok: false; message: string } {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { ok: false, message: "Printing is only available in the browser." };
  }

  const html = buildPrintablePacketHtml(options);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Prefer a dedicated tab without noopener so scripts/print work.
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    // Revoke later; keep URL alive while the tab loads.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    if (options.autoPrint) {
      // Blob URLs may not receive query params reliably; trigger print after load when possible.
      const timer = window.setInterval(() => {
        try {
          if (printWindow.document && printWindow.document.readyState === "complete") {
            window.clearInterval(timer);
            printWindow.focus();
            printWindow.print();
          }
        } catch {
          // Cross-window access can fail briefly; keep trying briefly.
        }
      }, 200);
      window.setTimeout(() => window.clearInterval(timer), 5000);
    }
    return { ok: true };
  }

  // Popup blocked: fall back to hidden iframe print.
  try {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Print worksheet packet");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        window.setTimeout(() => {
          URL.revokeObjectURL(url);
          iframe.remove();
        }, 2000);
      }
    };
    return { ok: true };
  } catch {
    URL.revokeObjectURL(url);
    return {
      ok: false,
      message:
        "Pop-up blocked. Allow pop-ups for this site, then try Print / Download as PDF again.",
    };
  }
}

export function downloadPrintableHtmlFile(options: {
  title: string;
  content: string;
  printingFormat?: string;
}): void {
  const html = buildPrintablePacketHtml(options);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = (options.title || "worksheet-packet")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  anchor.href = url;
  anchor.download = `${safeName || "worksheet-packet"}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
