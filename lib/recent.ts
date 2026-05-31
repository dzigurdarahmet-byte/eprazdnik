// Recently-opened programs, tracked client-side in localStorage (v4 §2).
// Pure helpers here so they're unit-testable without a DOM.

export const RECENT_KEY = "eprazdnik:recent";
export const RECENT_MAX = 9; // 3 rows × 3
const STORE_CAP = 30; // how many slugs we retain in storage

/** Add a slug to the front, dedupe, cap. Returns a new array. */
export function mergeRecent(existing: string[], slug: string, cap = STORE_CAP): string[] {
  if (!slug) return existing.slice(0, cap);
  return [slug, ...existing.filter((s) => s !== slug)].slice(0, cap);
}

/**
 * Resolve recent slugs to items in recency order. Falls back to the first
 * `max` items when history is empty or none of it matches the current list.
 */
export function pickRecent<T extends { slug: string }>(
  items: T[],
  recentSlugs: string[],
  max = RECENT_MAX,
): T[] {
  if (recentSlugs.length === 0) return items.slice(0, max);
  const bySlug = new Map(items.map((i) => [i.slug, i]));
  const ordered = recentSlugs
    .map((s) => bySlug.get(s))
    .filter((x): x is T => Boolean(x));
  if (ordered.length === 0) return items.slice(0, max);
  return ordered.slice(0, max);
}

/** Safe read of the recent list from localStorage (returns [] on any failure). */
export function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** Safe write: merge a slug and persist. No-op outside the browser. */
export function recordRecent(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = mergeRecent(readRecent(), slug);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // storage disabled / quota — ignore.
  }
}
