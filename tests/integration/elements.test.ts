import { describe, it, expect, vi, beforeEach } from "vitest";
import { elementPageFor } from "@/tests/fixtures/elements";

const mockQuery = vi.fn();

vi.mock("@/lib/notion/client", () => ({
  notion: {
    databases: { query: mockQuery },
    pages: { retrieve: vi.fn() },
    blocks: { children: { list: vi.fn() } },
  },
  DB_PROGRAMS: "test-programs-db",
  DB_ELEMENTS: "test-elements-db",
}));

const ELEMENT_PAGES = [
  elementPageFor({ id: "el-olaf", title: "Ростовой Олаф", category: "Ростовая кукла", status: "🟢 Доступен", price: 6500, programIds: ["prog-frozen"] }),
  elementPageFor({ id: "el-snow", title: "Снегогенератор", category: "Спецэффект", status: "🟡 По запросу", price: 5500 }),
  elementPageFor({ id: "el-test", title: "🧪 тестовый элемент" }),
  elementPageFor({ id: "el-tpl", title: "[ШАБЛОН] Элемент" }),
];

describe("listElements", () => {
  beforeEach(() => mockQuery.mockReset());

  it("filters test/template rows and sorts by title", async () => {
    mockQuery.mockResolvedValueOnce({ results: ELEMENT_PAGES, next_cursor: null, has_more: false });
    const { listElements } = await import("@/lib/notion/elements");
    const out = await listElements();
    expect(out.map((e) => e.title)).toEqual(["Ростовой Олаф", "Снегогенератор"]);
    expect(out.find((e) => e.title.startsWith("🧪"))).toBeUndefined();
    expect(out.find((e) => e.title.startsWith("[ШАБЛОН]"))).toBeUndefined();
  });

  it("resolves elements linked to a program via the relation", async () => {
    mockQuery.mockResolvedValueOnce({ results: ELEMENT_PAGES, next_cursor: null, has_more: false });
    const { getElementsForProgram } = await import("@/lib/notion/elements");
    const out = await getElementsForProgram("prog-frozen");
    expect(out.map((e) => e.id)).toEqual(["el-olaf"]);
  });
});
