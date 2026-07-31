/**
 * Printable SVG visuals for worksheet packets.
 * These are embedded inline so Print / Save as PDF includes real drawings — not text placeholders.
 */

export type WorksheetVisualId =
  | "coin-penny"
  | "coin-nickel"
  | "coin-dime"
  | "coin-quarter"
  | "coins-set"
  | "space-rocket"
  | "space-planet"
  | "space-stars"
  | "animal-dog"
  | "animal-cat"
  | "sports-ball"
  | "cooking-apple"
  | "number-card"
  | "shape-set"
  | "theme-banner";

const VISUAL_MARKER_RE = /\[\[VISUAL:([a-z0-9-]+)\]\]/gi;

export function visualMarker(id: WorksheetVisualId | string): string {
  return `[[VISUAL:${id}]]`;
}

function svgWrap(inner: string, label: string, width = 220, height = 140): string {
  return `<figure class="visual" role="img" aria-label="${escapeAttr(label)}">
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
${inner}
</svg>
<figcaption>${escapeHtml(label)}</figcaption>
</figure>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function coinSvg(
  cx: number,
  cy: number,
  r: number,
  fill: string,
  stroke: string,
  label: string,
  value: string,
): string {
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="700" fill="#111">${label}</text>
  <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#222">${value}</text>`;
}

export function renderVisualSvg(id: string): string {
  switch (id) {
    case "coin-penny":
      return svgWrap(coinSvg(110, 70, 48, "#d8a27a", "#8a4f2a", "PENNY", "1¢"), "Penny · 1 cent");
    case "coin-nickel":
      return svgWrap(coinSvg(110, 70, 52, "#c8c8c8", "#555", "NICKEL", "5¢"), "Nickel · 5 cents");
    case "coin-dime":
      return svgWrap(coinSvg(110, 70, 40, "#d0d0d0", "#666", "DIME", "10¢"), "Dime · 10 cents");
    case "coin-quarter":
      return svgWrap(
        coinSvg(110, 70, 58, "#d7d7d7", "#444", "QUARTER", "25¢"),
        "Quarter · 25 cents",
      );
    case "coins-set":
      return svgWrap(
        `
        ${coinSvg(48, 72, 30, "#d8a27a", "#8a4f2a", "1¢", "")}
        ${coinSvg(110, 72, 34, "#c8c8c8", "#555", "5¢", "")}
        ${coinSvg(168, 72, 26, "#d0d0d0", "#666", "10¢", "")}
        ${coinSvg(220, 72, 38, "#d7d7d7", "#444", "25¢", "")}
        `,
        "Penny, nickel, dime, quarter",
        260,
        140,
      );
    case "space-rocket":
      return svgWrap(
        `
        <rect x="0" y="0" width="220" height="140" fill="#0b1d36"/>
        <circle cx="40" cy="30" r="2" fill="#fff"/><circle cx="80" cy="50" r="1.5" fill="#fff"/>
        <circle cx="160" cy="24" r="2" fill="#fff"/><circle cx="190" cy="60" r="1.5" fill="#fff"/>
        <polygon points="110,18 130,70 90,70" fill="#f2f2f2" stroke="#333" stroke-width="2"/>
        <rect x="95" y="70" width="30" height="36" fill="#c9d7e8" stroke="#333" stroke-width="2"/>
        <polygon points="95,106 85,128 95,118" fill="#e07040"/><polygon points="125,106 135,128 125,118" fill="#e07040"/>
        <circle cx="110" cy="48" r="7" fill="#7ec8e3" stroke="#333" stroke-width="1.5"/>
        `,
        "Rocket in space",
      );
    case "space-planet":
      return svgWrap(
        `
        <rect x="0" y="0" width="220" height="140" fill="#102744"/>
        <circle cx="110" cy="70" r="40" fill="#6aa84f" stroke="#2f5d28" stroke-width="3"/>
        <ellipse cx="110" cy="70" rx="62" ry="14" fill="none" stroke="#d9c27a" stroke-width="4"/>
        <circle cx="30" cy="28" r="2" fill="#fff"/><circle cx="180" cy="36" r="2" fill="#fff"/>
        `,
        "Planet with ring",
      );
    case "space-stars":
      return svgWrap(
        `
        <rect x="0" y="0" width="220" height="140" fill="#0f1a2e"/>
        <polygon points="40,70 46,55 52,70 40,62 52,62" fill="#ffe08a"/>
        <polygon points="110,40 118,22 126,40 110,32 126,32" fill="#ffe08a"/>
        <polygon points="170,90 178,74 186,90 170,82 186,82" fill="#ffe08a"/>
        <circle cx="70" cy="30" r="2" fill="#fff"/><circle cx="150" cy="55" r="2" fill="#fff"/>
        `,
        "Stars",
      );
    case "animal-dog":
      return svgWrap(
        `
        <ellipse cx="110" cy="85" rx="50" ry="30" fill="#c48a4a" stroke="#5a3a1a" stroke-width="2"/>
        <circle cx="145" cy="55" r="22" fill="#c48a4a" stroke="#5a3a1a" stroke-width="2"/>
        <circle cx="152" cy="52" r="3" fill="#222"/>
        <ellipse cx="162" cy="60" rx="6" ry="4" fill="#333"/>
        <polygon points="130,40 122,20 140,38" fill="#c48a4a" stroke="#5a3a1a"/>
        <polygon points="155,38 168,18 168,42" fill="#c48a4a" stroke="#5a3a1a"/>
        `,
        "Dog",
      );
    case "animal-cat":
      return svgWrap(
        `
        <ellipse cx="110" cy="90" rx="46" ry="28" fill="#e0b35a" stroke="#7a5a20" stroke-width="2"/>
        <circle cx="140" cy="58" r="20" fill="#e0b35a" stroke="#7a5a20" stroke-width="2"/>
        <polygon points="125,42 120,22 136,40" fill="#e0b35a" stroke="#7a5a20"/>
        <polygon points="150,40 165,22 158,44" fill="#e0b35a" stroke="#7a5a20"/>
        <circle cx="146" cy="56" r="2.5" fill="#222"/>
        <polygon points="155,62 162,66 155,68" fill="#333"/>
        `,
        "Cat",
      );
    case "sports-ball":
      return svgWrap(
        `
        <circle cx="110" cy="70" r="48" fill="#e87722" stroke="#7a3a10" stroke-width="3"/>
        <path d="M70 55 Q110 40 150 55" fill="none" stroke="#fff" stroke-width="3"/>
        <path d="M68 85 Q110 100 152 85" fill="none" stroke="#fff" stroke-width="3"/>
        <path d="M110 22 V118" fill="none" stroke="#fff" stroke-width="3"/>
        `,
        "Ball",
      );
    case "cooking-apple":
      return svgWrap(
        `
        <circle cx="105" cy="78" r="40" fill="#d64545" stroke="#7a1f1f" stroke-width="2"/>
        <circle cx="125" cy="78" r="36" fill="#e25b5b" stroke="#7a1f1f" stroke-width="2"/>
        <rect x="112" y="28" width="6" height="22" fill="#6b4226"/>
        <ellipse cx="128" cy="34" rx="14" ry="8" fill="#3f8f4a"/>
        `,
        "Apple",
      );
    case "number-card":
      return svgWrap(
        `
        <rect x="20" y="20" width="50" height="70" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
        <text x="45" y="68" text-anchor="middle" font-size="36" font-family="Georgia, serif" fill="#111">1</text>
        <rect x="85" y="20" width="50" height="70" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
        <text x="110" y="68" text-anchor="middle" font-size="36" font-family="Georgia, serif" fill="#111">2</text>
        <rect x="150" y="20" width="50" height="70" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
        <text x="175" y="68" text-anchor="middle" font-size="36" font-family="Georgia, serif" fill="#111">3</text>
        `,
        "Number cards 1–3",
      );
    case "shape-set":
      return svgWrap(
        `
        <circle cx="50" cy="70" r="28" fill="#7ec8e3" stroke="#245" stroke-width="2"/>
        <rect x="95" y="42" width="56" height="56" fill="#f2c14e" stroke="#245" stroke-width="2"/>
        <polygon points="185,42 215,98 155,98" fill="#e07a5f" stroke="#245" stroke-width="2"/>
        `,
        "Circle, square, triangle",
      );
    case "theme-banner":
    default:
      return svgWrap(
        `
        <rect x="10" y="30" width="200" height="80" rx="12" fill="#eef5ff" stroke="#335" stroke-width="2"/>
        <circle cx="50" cy="70" r="18" fill="#8ecae6"/>
        <rect x="85" y="55" width="100" height="30" rx="6" fill="#219ebc"/>
        <text x="135" y="76" text-anchor="middle" font-size="14" font-family="Georgia, serif" fill="#fff">Visual support</text>
        `,
        "Visual support cue",
      );
  }
}

export function selectVisualIdsForContext(input: {
  topicOrSkill: string;
  studentInterestOrTheme?: string;
  subject: string;
  pageIndex: number;
}): WorksheetVisualId[] {
  const topic = `${input.topicOrSkill} ${input.subject}`.toLowerCase();
  const theme = (input.studentInterestOrTheme ?? "").toLowerCase();
  const ids: WorksheetVisualId[] = [];

  if (/coin|money|cent|penny|nickel|dime|quarter|cash/.test(topic)) {
    const coinCycle: WorksheetVisualId[] = [
      "coins-set",
      "coin-penny",
      "coin-nickel",
      "coin-dime",
      "coin-quarter",
    ];
    ids.push(coinCycle[input.pageIndex % coinCycle.length]!);
  } else if (/number|count|add|subtract|math/.test(topic)) {
    ids.push(input.pageIndex % 2 === 0 ? "number-card" : "shape-set");
  } else if (/shape|geometry/.test(topic)) {
    ids.push("shape-set");
  } else if (/animal|pet|dog|cat/.test(topic) || /animal/.test(theme)) {
    ids.push(input.pageIndex % 2 === 0 ? "animal-dog" : "animal-cat");
  } else if (/sport|ball|swim/.test(topic) || /sport|swim/.test(theme)) {
    ids.push("sports-ball");
  } else if (/cook|food|grocery|apple/.test(topic) || /cook|food/.test(theme)) {
    ids.push("cooking-apple");
  }

  if (/space|rocket|planet|star|moon|astronaut/.test(theme) || /space/.test(topic)) {
    const spaceCycle: WorksheetVisualId[] = ["space-rocket", "space-planet", "space-stars"];
    ids.push(spaceCycle[input.pageIndex % spaceCycle.length]!);
  }

  if (!ids.length) ids.push("theme-banner");
  // Keep at most 2 visuals per page for clean printing.
  return Array.from(new Set(ids)).slice(0, 2);
}

export function replaceVisualMarkersWithSvg(text: string): string {
  return text.replace(VISUAL_MARKER_RE, (_match, id: string) => renderVisualSvg(id.toLowerCase()));
}

export function stripVisualMarkers(text: string): string {
  return text.replace(VISUAL_MARKER_RE, "").replace(/\n{3,}/g, "\n\n");
}

export function hasVisualMarkers(text: string): boolean {
  return /\[\[VISUAL:[a-z0-9-]+\]\]/i.test(text);
}
