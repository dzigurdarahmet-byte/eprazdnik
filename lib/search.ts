// Global search over programs + elements. Pure, client-side, unit-testable.
export type SearchKind = "program" | "element";

export type SearchItem = {
  kind: SearchKind;
  title: string;
  slug: string;
  href: string;
  tags: string[];
  status: string;
  hint: string; // secondary text + extra haystack (формат / категория)
  emoji: string;
  accent: string;
};

/** Instant filter by title / tags / hint. Empty query returns everything. */
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) =>
    [i.title, i.hint, ...i.tags].join(" ").toLowerCase().includes(q),
  );
}
