import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("transliterates «Холодное Сердце» to a deterministic latin slug", () => {
    expect(slugify("Холодное Сердце")).toBe("holodnoe-serdtse");
  });

  it("transliterates «Индейский квест» to indeyskiy-kvest", () => {
    expect(slugify("Индейский квест")).toBe("indeyskiy-kvest");
  });

  it("collapses double spaces into a single dash", () => {
    expect(slugify("Школа  Магии")).toBe("shkola-magii");
  });

  it("drops punctuation like !?,.", () => {
    expect(slugify("Тесла-шоу: молнии 250к!")).toBe("tesla-shou-molnii-250k");
  });

  it("lowercases ASCII input as well", () => {
    expect(slugify("HELLO World")).toBe("hello-world");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  — Алиса —  ")).toBe("alisa");
  });

  it("handles emoji and dashes mixed in title", () => {
    expect(slugify("🎉 Праздник 🎈")).toBe("prazdnik");
  });
});
