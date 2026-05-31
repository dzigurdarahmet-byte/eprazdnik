import { describe, it, expect } from "vitest";
import { searchItems, type SearchItem } from "@/lib/search";

function item(p: Partial<SearchItem>): SearchItem {
  return {
    kind: "program", title: "X", slug: "x", href: "/program/x",
    tags: [], status: "", hint: "", emoji: "", accent: "#000", ...p,
  };
}

const ITEMS = [
  item({ kind: "program", title: "Холодное Сердце", slug: "frost", tags: ["крио", "премиум"], hint: "Шоу" }),
  item({ kind: "element", title: "Снегогенератор", slug: "snow", tags: ["спецэффект"], hint: "Спецэффект", href: "/element/snow" }),
];

describe("searchItems", () => {
  it("returns everything for an empty query", () => {
    expect(searchItems(ITEMS, "")).toHaveLength(2);
    expect(searchItems(ITEMS, "   ")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchItems(ITEMS, "снег").map((i) => i.slug)).toEqual(["snow"]);
    expect(searchItems(ITEMS, "ХОЛОДНОЕ").map((i) => i.slug)).toEqual(["frost"]);
  });

  it("matches by tag and by hint", () => {
    expect(searchItems(ITEMS, "крио").map((i) => i.slug)).toEqual(["frost"]);
    expect(searchItems(ITEMS, "спецэффект").map((i) => i.slug)).toEqual(["snow"]);
  });

  it("returns [] when nothing matches", () => {
    expect(searchItems(ITEMS, "нет такого")).toEqual([]);
  });
});
