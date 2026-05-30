import { describe, it, expect } from "vitest";
import { elementToSummary } from "@/lib/notion/elements";
import { elementPageFor } from "@/tests/fixtures/elements";

describe("elementToSummary", () => {
  it("parses all fields from a populated element page", () => {
    const e = elementToSummary(
      elementPageFor({
        id: "el-1",
        title: "Ростовой Олаф",
        category: "Ростовая кукла",
        status: "🟢 Доступен",
        tags: ["зима", "хит"],
        price: 6500,
        programIds: ["prog-frozen"],
      }),
    );
    expect(e).toMatchObject({
      id: "el-1",
      title: "Ростовой Олаф",
      category: "Ростовая кукла",
      status: "🟢 Доступен",
      tags: ["зима", "хит"],
      priceFrom: 6500,
      relatedProgramIds: ["prog-frozen"],
    });
    expect(e.slug).toBe("rostovoy-olaf");
    expect(e.accent).toMatch(/^#/);
  });

  it("is tolerant of missing optional properties", () => {
    const e = elementToSummary(elementPageFor({ title: "Без свойств" }));
    expect(e.category).toBe("");
    expect(e.status).toBe("");
    expect(e.tags).toEqual([]);
    expect(e.priceFrom).toBeNull();
    expect(e.relatedProgramIds).toEqual([]);
  });
});
