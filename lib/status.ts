// Notion `Статус` select → tag color + dot, per verified live-DB values (§4.1).
// Tolerant: matches by emoji prefix first, then by keyword, so minor wording
// drift in Notion doesn't break the mapping.

export type TagColor =
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export type StatusBadge = {
  label: string; // human label without the leading emoji
  color: TagColor;
  dot: string; // the 🟢/🟡/🔴 emoji
};

const GREEN: StatusBadge["color"] = "green";
const YELLOW: StatusBadge["color"] = "yellow";
const RED: StatusBadge["color"] = "red";

/** Strip a leading status emoji (🟢/🟡/🔴 …) and surrounding space. */
function stripEmoji(raw: string): string {
  return raw.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]+\s*/u, "").trim();
}

/**
 * Map a Notion status string to a badge.
 * Returns null for an empty/unknown status so callers can hide the chip.
 */
export function statusBadge(raw: string): StatusBadge | null {
  const s = raw.trim();
  if (!s) return null;

  const label = stripEmoji(s) || s;
  const lower = s.toLowerCase();

  // By emoji first (works for both Программы and Элементы vocabularies).
  if (s.includes("🟢")) return { label, color: GREEN, dot: "🟢" };
  if (s.includes("🟡")) return { label, color: YELLOW, dot: "🟡" };
  if (s.includes("🔴")) return { label, color: RED, dot: "🔴" };

  // Keyword fallback — Программы.
  if (lower.includes("готов")) return { label, color: GREEN, dot: "🟢" };
  if (lower.includes("не хватает")) return { label, color: RED, dot: "🔴" };
  // Элементы.
  if (lower.includes("доступ")) return { label, color: GREEN, dot: "🟢" };
  if (lower.includes("не использ")) return { label, color: RED, dot: "🔴" };
  if (lower.includes("по запросу") || lower.includes("в работе")) {
    return { label, color: YELLOW, dot: "🟡" };
  }

  // Unknown but non-empty → neutral, still show.
  return { label, color: "gray", dot: "" };
}
