/**
 * Printable SVG visuals for worksheet packets.
 * Embedded inline so Print / Save as PDF includes real drawings — not text placeholders.
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
  | "bus"
  | "school"
  | "hands-wash"
  | "emotion-happy"
  | "emotion-calm"
  | "theme-banner";

const VISUAL_MARKER_RE = /\[\[VISUAL:([a-z0-9-]+)\]\]/gi;

export function visualMarker(id: WorksheetVisualId | string): string {
  return `[[VISUAL:${id}]]`;
}

function svgWrap(inner: string, label: string, width = 280, height = 180): string {
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
  <defs>
    <radialGradient id="g${Math.round(cx)}${Math.round(r)}" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${fill}"/>
      <stop offset="100%" stop-color="${stroke}"/>
    </radialGradient>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${Math.round(cx)}${Math.round(r)})" stroke="${stroke}" stroke-width="4"/>
  <circle cx="${cx}" cy="${cy}" r="${Math.max(r - 10, 8)}" fill="none" stroke="${stroke}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#111">${label}</text>
  <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#222">${value}</text>`;
}

export function renderVisualSvg(id: string): string {
  switch (id) {
    case "coin-penny":
      return svgWrap(coinSvg(140, 90, 62, "#d8a27a", "#8a4f2a", "PENNY", "1¢"), "Penny · 1 cent");
    case "coin-nickel":
      return svgWrap(coinSvg(140, 90, 66, "#c8c8c8", "#555", "NICKEL", "5¢"), "Nickel · 5 cents");
    case "coin-dime":
      return svgWrap(coinSvg(140, 90, 52, "#d0d0d0", "#666", "DIME", "10¢"), "Dime · 10 cents");
    case "coin-quarter":
      return svgWrap(
        coinSvg(140, 90, 72, "#d7d7d7", "#444", "QUARTER", "25¢"),
        "Quarter · 25 cents",
      );
    case "coins-set":
      return svgWrap(
        `
        ${coinSvg(48, 95, 34, "#d8a27a", "#8a4f2a", "1¢", "")}
        ${coinSvg(118, 95, 40, "#c8c8c8", "#555", "5¢", "")}
        ${coinSvg(185, 95, 30, "#d0d0d0", "#666", "10¢", "")}
        ${coinSvg(250, 95, 44, "#d7d7d7", "#444", "25¢", "")}
        `,
        "Penny, nickel, dime, quarter",
        300,
        180,
      );
    case "space-rocket":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#071526"/>
        <circle cx="36" cy="28" r="2.5" fill="#fff"/><circle cx="70" cy="55" r="1.8" fill="#fff"/>
        <circle cx="210" cy="30" r="2.2" fill="#fff"/><circle cx="245" cy="70" r="1.6" fill="#fff"/>
        <circle cx="160" cy="48" r="1.5" fill="#ffe08a"/>
        <polygon points="140,20 168,88 112,88" fill="#f7f7f7" stroke="#222" stroke-width="2"/>
        <rect x="118" y="88" width="44" height="48" rx="4" fill="#9eb6d4" stroke="#222" stroke-width="2"/>
        <polygon points="118,136 102,168 118,152" fill="#ef6c3a"/><polygon points="162,136 178,168 162,152" fill="#ef6c3a"/>
        <circle cx="140" cy="52" r="10" fill="#5ec8ef" stroke="#222" stroke-width="2"/>
        <rect x="128" y="100" width="10" height="18" fill="#dff3ff" stroke="#222"/>
        <rect x="142" y="100" width="10" height="18" fill="#dff3ff" stroke="#222"/>
        `,
        "Rocket in space",
      );
    case "space-planet":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#0b2038"/>
        <circle cx="40" cy="30" r="2" fill="#fff"/><circle cx="230" cy="40" r="2" fill="#fff"/>
        <circle cx="140" cy="90" r="52" fill="#5f9e4a" stroke="#2f5d28" stroke-width="4"/>
        <ellipse cx="128" cy="78" rx="16" ry="10" fill="#3f7a34" opacity="0.8"/>
        <ellipse cx="160" cy="104" rx="18" ry="11" fill="#3f7a34" opacity="0.75"/>
        <ellipse cx="140" cy="90" rx="78" ry="18" fill="none" stroke="#e6c97a" stroke-width="5"/>
        `,
        "Planet with ring",
      );
    case "space-stars":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#0d182b"/>
        <polygon points="60,95 72,68 84,95 60,82 84,82" fill="#ffe08a"/>
        <polygon points="140,55 154,28 168,55 140,42 168,42" fill="#ffe08a"/>
        <polygon points="220,120 232,96 244,120 220,108 244,108" fill="#ffe08a"/>
        <circle cx="100" cy="40" r="2.5" fill="#fff"/><circle cx="190" cy="70" r="2" fill="#fff"/>
        <circle cx="40" cy="130" r="1.8" fill="#fff"/>
        `,
        "Stars",
      );
    case "animal-dog":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f7f1e8"/>
        <ellipse cx="130" cy="115" rx="62" ry="36" fill="#c48a4a" stroke="#5a3a1a" stroke-width="3"/>
        <circle cx="185" cy="72" r="30" fill="#c48a4a" stroke="#5a3a1a" stroke-width="3"/>
        <circle cx="196" cy="68" r="4" fill="#222"/>
        <ellipse cx="210" cy="80" rx="9" ry="6" fill="#333"/>
        <polygon points="165,52 154,24 180,48" fill="#c48a4a" stroke="#5a3a1a" stroke-width="2"/>
        <polygon points="200,48 220,22 220,56" fill="#c48a4a" stroke="#5a3a1a" stroke-width="2"/>
        <ellipse cx="95" cy="145" rx="10" ry="14" fill="#8a5a2a"/>
        <ellipse cx="160" cy="145" rx="10" ry="14" fill="#8a5a2a"/>
        `,
        "Dog",
      );
    case "animal-cat":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f7f1e8"/>
        <ellipse cx="130" cy="118" rx="58" ry="34" fill="#e0b35a" stroke="#7a5a20" stroke-width="3"/>
        <circle cx="180" cy="74" r="28" fill="#e0b35a" stroke="#7a5a20" stroke-width="3"/>
        <polygon points="158,52 150,24 174,50" fill="#e0b35a" stroke="#7a5a20" stroke-width="2"/>
        <polygon points="196,50 220,24 210,56" fill="#e0b35a" stroke="#7a5a20" stroke-width="2"/>
        <circle cx="190" cy="72" r="3.5" fill="#222"/>
        <polygon points="204,80 216,86 204,90" fill="#333"/>
        <path d="M70 110 Q40 70 55 50" fill="none" stroke="#e0b35a" stroke-width="8" stroke-linecap="round"/>
        `,
        "Cat",
      );
    case "sports-ball":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#eef7ee"/>
        <circle cx="140" cy="90" r="62" fill="#e87722" stroke="#7a3a10" stroke-width="4"/>
        <path d="M90 70 Q140 48 190 70" fill="none" stroke="#fff" stroke-width="4"/>
        <path d="M88 112 Q140 134 192 112" fill="none" stroke="#fff" stroke-width="4"/>
        <path d="M140 28 V152" fill="none" stroke="#fff" stroke-width="4"/>
        `,
        "Ball",
      );
    case "cooking-apple":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f4f8ef"/>
        <circle cx="125" cy="100" r="52" fill="#d64545" stroke="#7a1f1f" stroke-width="3"/>
        <circle cx="155" cy="100" r="48" fill="#e25b5b" stroke="#7a1f1f" stroke-width="3"/>
        <rect x="142" y="34" width="8" height="30" rx="2" fill="#6b4226"/>
        <ellipse cx="165" cy="42" rx="20" ry="11" fill="#3f8f4a"/>
        <ellipse cx="105" cy="85" rx="10" ry="16" fill="#ffffff" opacity="0.25"/>
        `,
        "Apple",
      );
    case "number-card":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f5f7fb"/>
        <rect x="28" y="35" width="64" height="110" rx="12" fill="#fff" stroke="#233" stroke-width="3"/>
        <text x="60" y="110" text-anchor="middle" font-size="56" font-family="Georgia, serif" fill="#111">1</text>
        <rect x="108" y="35" width="64" height="110" rx="12" fill="#fff" stroke="#233" stroke-width="3"/>
        <text x="140" y="110" text-anchor="middle" font-size="56" font-family="Georgia, serif" fill="#111">2</text>
        <rect x="188" y="35" width="64" height="110" rx="12" fill="#fff" stroke="#233" stroke-width="3"/>
        <text x="220" y="110" text-anchor="middle" font-size="56" font-family="Georgia, serif" fill="#111">3</text>
        `,
        "Number cards 1–3",
      );
    case "shape-set":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f7fafc"/>
        <circle cx="60" cy="90" r="38" fill="#7ec8e3" stroke="#245" stroke-width="3"/>
        <rect x="112" y="52" width="76" height="76" fill="#f2c14e" stroke="#245" stroke-width="3"/>
        <polygon points="230,48 268,128 192,128" fill="#e07a5f" stroke="#245" stroke-width="3"/>
        `,
        "Circle, square, triangle",
      );
    case "bus":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#eef6ff"/>
        <rect x="30" y="58" width="220" height="70" rx="12" fill="#f2c14e" stroke="#333" stroke-width="3"/>
        <rect x="48" y="72" width="36" height="28" rx="4" fill="#8ecae6" stroke="#333"/>
        <rect x="96" y="72" width="36" height="28" rx="4" fill="#8ecae6" stroke="#333"/>
        <rect x="144" y="72" width="36" height="28" rx="4" fill="#8ecae6" stroke="#333"/>
        <rect x="198" y="70" width="40" height="34" rx="4" fill="#dff3ff" stroke="#333"/>
        <circle cx="78" cy="132" r="16" fill="#333"/><circle cx="78" cy="132" r="7" fill="#bbb"/>
        <circle cx="210" cy="132" r="16" fill="#333"/><circle cx="210" cy="132" r="7" fill="#bbb"/>
        `,
        "School bus",
      );
    case "school":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#f4f7fb"/>
        <rect x="50" y="70" width="180" height="80" fill="#c9d7e8" stroke="#333" stroke-width="3"/>
        <polygon points="40,70 140,28 240,70" fill="#e07a5f" stroke="#333" stroke-width="3"/>
        <rect x="120" y="100" width="40" height="50" fill="#6b4226" stroke="#333"/>
        <rect x="70" y="90" width="28" height="24" fill="#8ecae6" stroke="#333"/>
        <rect x="182" y="90" width="28" height="24" fill="#8ecae6" stroke="#333"/>
        `,
        "School building",
      );
    case "hands-wash":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#eef9f8"/>
        <rect x="70" y="50" width="140" height="90" rx="18" fill="#bde0fe" stroke="#245" stroke-width="3"/>
        <ellipse cx="110" cy="95" rx="22" ry="30" fill="#f4d6b0" stroke="#7a5a20" stroke-width="2"/>
        <ellipse cx="160" cy="95" rx="22" ry="30" fill="#f4d6b0" stroke="#7a5a20" stroke-width="2"/>
        <circle cx="140" cy="48" r="10" fill="#4ea8de"/>
        <path d="M140 58 V78" stroke="#4ea8de" stroke-width="6"/>
        <path d="M120 85 Q140 100 160 85" fill="none" stroke="#48cae4" stroke-width="4"/>
        `,
        "Washing hands",
      );
    case "emotion-happy":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#fff8e8"/>
        <circle cx="140" cy="90" r="58" fill="#ffe08a" stroke="#b08900" stroke-width="4"/>
        <circle cx="118" cy="78" r="7" fill="#333"/>
        <circle cx="162" cy="78" r="7" fill="#333"/>
        <path d="M112 108 Q140 132 168 108" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round"/>
        `,
        "Happy face",
      );
    case "emotion-calm":
      return svgWrap(
        `
        <rect width="280" height="180" fill="#eef7ff"/>
        <circle cx="140" cy="90" r="58" fill="#a8dadc" stroke="#1d3557" stroke-width="4"/>
        <circle cx="118" cy="80" r="6" fill="#1d3557"/>
        <circle cx="162" cy="80" r="6" fill="#1d3557"/>
        <path d="M118 112 H162" fill="none" stroke="#1d3557" stroke-width="5" stroke-linecap="round"/>
        `,
        "Calm face",
      );
    case "theme-banner":
    default:
      return svgWrap(
        `
        <defs>
          <linearGradient id="banner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#dbeafe"/>
            <stop offset="100%" stop-color="#93c5fd"/>
          </linearGradient>
        </defs>
        <rect x="16" y="34" width="248" height="112" rx="18" fill="url(#banner)" stroke="#1e3a5f" stroke-width="3"/>
        <circle cx="70" cy="90" r="28" fill="#60a5fa" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="112" y="68" width="120" height="44" rx="10" fill="#1d4ed8"/>
        <text x="172" y="97" text-anchor="middle" font-size="18" font-family="Georgia, serif" fill="#fff">Look</text>
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
  } else if (/bus|transport|community|travel/.test(topic) || /bus/.test(theme)) {
    ids.push("bus");
  } else if (/school|classroom|life skill/.test(topic)) {
    ids.push(input.pageIndex % 2 === 0 ? "school" : "hands-wash");
  } else if (/hygiene|wash|hand|bathroom|self.care/.test(topic)) {
    ids.push("hands-wash");
  } else if (/emotion|feeling|social|calm|happy/.test(topic) || /social/.test(theme)) {
    ids.push(input.pageIndex % 2 === 0 ? "emotion-happy" : "emotion-calm");
  }

  if (/space|rocket|planet|star|moon|astronaut/.test(theme) || /space/.test(topic)) {
    const spaceCycle: WorksheetVisualId[] = ["space-rocket", "space-planet", "space-stars"];
    ids.push(spaceCycle[input.pageIndex % spaceCycle.length]!);
  }

  if (!ids.length) {
    const fallback: WorksheetVisualId[] = [
      "theme-banner",
      "school",
      "emotion-happy",
      "number-card",
    ];
    ids.push(fallback[input.pageIndex % fallback.length]!);
  }
  return Array.from(new Set(ids)).slice(0, 2);
}

export function replaceVisualMarkersWithSvg(text: string): string {
  return text.replace(VISUAL_MARKER_RE, (_match, id: string) => renderVisualSvg(id.toLowerCase()));
}

export function stripVisualMarkers(text: string): string {
  return text.replace(VISUAL_MARKER_RE, "").replace(/\n{3,}/g, "\n\n");
}

export function hasVisualMarkers(text: string): boolean {
  return /\[\[VISUAL:[a-z0-9-]+\]\]/i.test(text) || /\[\[AIIMAGE:[a-z0-9_-]+\]\]/i.test(text);
}
