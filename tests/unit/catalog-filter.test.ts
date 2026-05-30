import { describe, it, expect } from "vitest";
import { applyFilters, facetValues, EMPTY_FILTER } from "@/lib/catalog-filter";
import type { ProgramSummary } from "@/types/program";

function prog(p: Partial<ProgramSummary>): ProgramSummary {
  return {
    id: "id",
    slug: "slug",
    title: "Программа",
    subtitle: "",
    coverEmoji: "",
    coverKind: "purple",
    accent: "#000",
    tint: "#fff",
    tags: [],
    category: "",
    format: "",
    groupSize: [],
    status: "",
    audience: "OTHER",
    ageRange: "",
    duration: "",
    guests: "",
    priceFrom: null,
    relatedElementIds: [],
    ...p,
  };
}

const PROGRAMS: ProgramSummary[] = [
  prog({ id: "1", title: "Холодное Сердце", format: "Шоу", category: "Шоу", status: "🟢 Готово к продаже", ageRange: "5–12", audience: "B2C", tags: ["премиум"] }),
  prog({ id: "2", title: "Квест Пиратов", format: "Квест", category: "Квесты", status: "🟡 В работе", ageRange: "7–14", audience: "B2C", tags: ["квест"] }),
  prog({ id: "3", title: "Корпоратив", format: "Тимбилдинг", category: "B2B", status: "🟢 Готово к продаже", ageRange: "18+", audience: "B2B", tags: ["B2B"] }),
];

describe("applyFilters", () => {
  it("returns everything with the empty filter", () => {
    expect(applyFilters(PROGRAMS, EMPTY_FILTER)).toHaveLength(3);
  });

  it("filters by format", () => {
    const out = applyFilters(PROGRAMS, { ...EMPTY_FILTER, format: "Квест" });
    expect(out.map((p) => p.id)).toEqual(["2"]);
  });

  it("filters by status and age", () => {
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, status: "🟢 Готово к продаже" })).toHaveLength(2);
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, age: "7–14" }).map((p) => p.id)).toEqual(["2"]);
  });

  it("filters by audience including tag-derived B2B", () => {
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, audience: "B2B" }).map((p) => p.id)).toEqual(["3"]);
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, audience: "B2C" })).toHaveLength(2);
  });

  it("searches title, tags and format", () => {
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, query: "пират" }).map((p) => p.id)).toEqual(["2"]);
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, query: "премиум" }).map((p) => p.id)).toEqual(["1"]);
    expect(applyFilters(PROGRAMS, { ...EMPTY_FILTER, query: "нет такого" })).toHaveLength(0);
  });

  it("combines facets (AND semantics)", () => {
    const out = applyFilters(PROGRAMS, { ...EMPTY_FILTER, audience: "B2C", status: "🟢 Готово к продаже" });
    expect(out.map((p) => p.id)).toEqual(["1"]);
  });
});

describe("facetValues", () => {
  it("returns distinct sorted non-empty values", () => {
    expect(facetValues(PROGRAMS, (p) => p.format)).toEqual(["Квест", "Тимбилдинг", "Шоу"]);
    expect(facetValues(PROGRAMS, (p) => p.subtitle)).toEqual([]);
  });
});
