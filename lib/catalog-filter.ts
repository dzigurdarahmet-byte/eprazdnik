// Pure client-side catalog filtering (§4.5). No I/O — fully unit-testable.
import type { ProgramSummary } from "@/types/program";

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
