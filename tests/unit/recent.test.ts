import { describe, it, expect } from "vitest";
import { mergeRecent, pickRecent } from "@/lib/recent";

describe("mergeRecent", () => {
  it("adds a slug to the front", () => {
    expect(mergeRecent(["a", "b"], "c")).toEqual(["c", "a", "b"]);
  });

  it("dedupes (moves an existing slug to the front)", () => {
    expect(mergeRecent(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("caps the stored length", () => {
    const long = Array.from({ length: 30 }, (_, i) => `s${i}`);
    const out = mergeRecent(long, "new", 30);
    expect(out).toHaveLength(30);
    expect(out[0]).toBe("new");
    expect(out).not.toContain("s29");
  });

  it("ignores an empty slug", () => {
    expect(mergeRecent(["a"], "")).toEqual(["a"]);
  });
});

describe("pickRecent", () => {
  const items = [
    { slug: "a", n: 1 },
    { slug: "b", n: 2 },
    { slug: "c", n: 3 },
    { slug: "d", n: 4 },
  ];

  it("falls back to the first `max` when history is empty", () => {
    expect(pickRecent(items, [], 2).map((i) => i.slug)).toEqual(["a", "b"]);
  });

  it("returns items in recency order", () => {
    expect(pickRecent(items, ["c", "a"], 9).map((i) => i.slug)).toEqual(["c", "a"]);
  });

  it("caps to `max`", () => {
    expect(pickRecent(items, ["d", "c", "b", "a"], 2).map((i) => i.slug)).toEqual(["d", "c"]);
  });

  it("ignores recent slugs not present and falls back if none match", () => {
    expect(pickRecent(items, ["zzz"], 2).map((i) => i.slug)).toEqual(["a", "b"]);
  });
});
