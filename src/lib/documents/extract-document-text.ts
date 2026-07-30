export type DocumentExtractionMethod = "pdf_text" | "pdf_ocr" | "image_ocr" | "plain_text";

export type DocumentExtractionResult = {
  text: string;
  method: DocumentExtractionMethod;
  pageCount: number;
  warning?: string;
};

const MAX_OCR_PAGES = 8;
const MIN_TEXT_CHARS = 80;

function normalizeExtractedText(value: string): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function readPlainText(file: File): Promise<DocumentExtractionResult> {
  const text = normalizeExtractedText(await file.text());
  return {
    text,
    method: "plain_text",
    pageCount: 1,
    warning: text ? undefined : "No readable text found in that file.",
  };
}

async function ocrCanvas(
  canvas: HTMLCanvasElement,
  tesseract: typeof import("tesseract.js"),
): Promise<string> {
  const result = await tesseract.recognize(canvas, "eng", {
    logger: () => undefined,
  });
  return result.data.text ?? "";
}

async function extractPdf(file: File): Promise<DocumentExtractionResult> {
  const pdfjs = await import("pdfjs-dist");
  // Use the package worker so text extraction works in the browser bundle.
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const textChunks: string[] = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? String(item.str) : "")).join(" ");
    if (pageText.trim()) textChunks.push(pageText);
  }

  const embeddedText = normalizeExtractedText(textChunks.join("\n"));
  if (embeddedText.length >= MIN_TEXT_CHARS) {
    return {
      text: embeddedText,
      method: "pdf_text",
      pageCount,
    };
  }

  // Scanned / image-only PDF: render pages and OCR.
  const tesseract = await import("tesseract.js");
  const ocrChunks: string[] = [];
  const pagesToOcr = Math.min(pageCount, MAX_OCR_PAGES);

  for (let pageNumber = 1; pageNumber <= pagesToOcr; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) continue;
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    ocrChunks.push(await ocrCanvas(canvas, tesseract));
  }

  const ocrText = normalizeExtractedText(ocrChunks.join("\n"));
  return {
    text: ocrText || embeddedText,
    method: "pdf_ocr",
    pageCount,
    warning:
      pageCount > MAX_OCR_PAGES
        ? `OCR processed the first ${MAX_OCR_PAGES} pages of ${pageCount}. Review and add remaining pages if needed.`
        : ocrText
          ? undefined
          : "PDF OCR returned little text. Try a clearer scan or paste text manually.",
  };
}

async function extractImage(file: File): Promise<DocumentExtractionResult> {
  const tesseract = await import("tesseract.js");
  const result = await tesseract.recognize(file, "eng", {
    logger: () => undefined,
  });
  const text = normalizeExtractedText(result.data.text ?? "");
  return {
    text,
    method: "image_ocr",
    pageCount: 1,
    warning: text ? undefined : "Image OCR returned little text. Try a clearer image.",
  };
}

export async function extractDocumentText(file: File): Promise<DocumentExtractionResult> {
  const type = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();

  if (type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    return readPlainText(file);
  }

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdf(file);
  }

  if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(name)) {
    return extractImage(file);
  }

  // Last resort: attempt plain text decode.
  return readPlainText(file);
}
