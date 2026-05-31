// Pure client-side catalog filtering (§4.5). No I/O — fully unit-testable.
import type { ProgramSummary } from "@/types/program";
import { statusBadge, type TagColor } from "@/lib/status";

export type FilterState = {
  query: string;
  format: string; // "" = все
  category: string;
  status: string;
  age: string;
  audience: string; // "", "B2B", "B2C"
};

export const EMPTY_FILTER: FilterState = {
  query: "",
  format: "",
  category: "",
  status: "",
  age: "",
  audience: "",
};

function matchesAudience(p: ProgramSummary, audience: string): boolean {
  if (!audience) return true;
  if (audience === "B2B") return p.audience === "B2B" || p.tags.some((t) => /b2b/i.test(t));
  if (audience === "B2C") return p.audience === "B2C" || p.tags.some((t) => /b2c/i.test(t));
  return true;
}

function matchesQuery(p: ProgramSummary, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [p.title, p.subtitle, ...p.tags, p.category, p.format].join(" ").toLowerCase();
  return haystack.includes(q);
}

export function applyFilters(programs: ProgramSummary[], f: FilterState): ProgramSummary[] {
  return programs.filter(
    (p) =>
      (!f.format || p.format === f.format) &&
      (!f.category || p.category === f.category) &&
      (!f.status || p.status === f.status) &&
      (!f.age || p.ageRange === f.age) &&
      matchesAudience(p, f.audience) &&
      matchesQuery(p, f.query),
  );
}

/** Distinct non-empty values of a facet, sorted (ru locale). */
export function facetValues(
  programs: ProgramSummary[],
  pick: (p: ProgramSummary) => string,
): string[] {
  const set = new Set<string>();
  for (const p of programs) {
    const v = pick(p).trim();
    if (v) set.add(v);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ru"));
}

// ---- Table view sorting ----

export type SortKey = "title" | "format" | "category" | "status" | "age" | "price";
export type SortDir = "asc" | "desc";

function sortValue(p: ProgramSummary, key: SortKey): string | number | null {
  switch (key) {
    case "title": return p.title;
    case "format": return p.format;
    case "category": return p.category;
    case "status": return p.status;
    case "age": return p.ageRange;
    case "price": return p.priceFrom;
  }
}

/** Stable sort by a column. Null prices sort last regardless of direction. */
export function sortPrograms(programs: ProgramSummary[], key: SortKey, dir: SortDir): ProgramSummary[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...programs].sort((a, b) => {
    const va = sortValue(a, key);
    const vb = sortValue(b, key);
    if (typeof va === "number" || typeof vb === "number") {
      const na = typeof va === "number" ? va : null;
      const nb = typeof vb === "number" ? vb : null;
      if (na === null && nb === null) return 0;
      if (na === null) return 1; // nulls last
      if (nb === null) return -1;
      return (na - nb) * sign;
    }
    return String(va).localeCompare(String(vb), "ru") * sign;
  });
}

// ---- Board view grouping (kanban by Статус) ----

export type StatusGroup = {
  status: string; // raw status (with emoji) or "" for none
  label: string;
  color: TagColor;
  dot: string;
  items: ProgramSummary[];
};

const COLOR_RANK: Record<string, number> = { green: 0, yellow: 1, red: 2, gray: 3 };

/** Group programs into kanban columns by Статус, ordered green → yellow → red → нет. */
export function groupByStatus(programs: ProgramSummary[]): StatusGroup[] {
  const groups = new Map<string, StatusGroup>();
  for (const p of programs) {
    const key = p.status.trim();
    let group = groups.get(key);
    if (!group) {
      const badge = statusBadge(key);
      group = {
        status: key,
        label: badge?.label || "Без статуса",
        color: badge?.color ?? "gray",
        dot: badge?.dot ?? "",
        items: [],
      };
      groups.set(key, group);
    }
    group.items.push(p);
  }
  return [...groups.values()].sort((a, b) => {
    const ra = COLOR_RANK[a.color] ?? 3;
    const rb = COLOR_RANK[b.color] ?? 3;
    if (ra !== rb) return ra - rb;
    return a.label.localeCompare(b.label, "ru");
  });
}
