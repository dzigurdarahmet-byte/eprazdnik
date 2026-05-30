// Deterministic accent/tint per item. Notion has no accent property, so we
// derive one from a stable seed (title) using the proto-notion/data.jsx palette,
// keeping cards visually in-palette and stable across renders.

type AccentPair = { accent: string; tint: string };

// Pairs lifted verbatim from proto-notion/data.jsx PROGRAMS[].{accent,tint}.
const PALETTE: readonly AccentPair[] = [
  { accent: "#3d6fa8", tint: "#eaf1fa" },
  { accent: "#7a4a1f", tint: "#f4ecdf" },
  { accent: "#6a4d8c", tint: "#efeaf6" },
  { accent: "#c47a14", tint: "#fbefd5" },
  { accent: "#b13a3a", tint: "#f9e8e8" },
  { accent: "#a85978", tint: "#f6e7ee" },
  { accent: "#3a7a4d", tint: "#e7f1ea" },
  { accent: "#4a5360", tint: "#ebedf0" },
  { accent: "#2e4a66", tint: "#e7ecf3" },
  { accent: "#a050a8", tint: "#f3e7f4" },
  { accent: "#4a3a8a", tint: "#ebebf5" },
  { accent: "#c43a3a", tint: "#faeaea" },
];

// Same string hash used by the proto Avatar component.
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const FALLBACK: AccentPair = { accent: "#4a5360", tint: "#ebedf0" };

export function deriveAccent(seed: string): AccentPair {
  return PALETTE[hash(seed) % PALETTE.length] ?? FALLBACK;
}
