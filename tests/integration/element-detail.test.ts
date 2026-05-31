import { describe, it, expect, vi, beforeEach } from "vitest";
import { elementPageFor } from "@/tests/fixtures/elements";
import { pageFor } from "@/tests/fixtures/pages";
import { paragraph, heading2, bullet } from "@/tests/fixtures/blocks";

const mockQuery = vi.fn();
const mockBlocks = vi.fn();

vi.mock("@/lib/notion/client", () => ({
  notion: {
    databases: { query: mockQuery },
    pages: { retrieve: vi.fn() },
    blocks: { children: { list: mockBlocks } },
  },
  DB_PROGRAMS: "test-programs-db",
  DB_ELEMENTS: "test-elements-db",
}));

const ELEMENTS = [
  elementPageFor({ id: "el-olaf", title: "Ростовой Олаф", category: "Ростовая кукла", status: "🟢 Доступен", price: 6500, programIds: ["prog-frozen"] }),
];
const PROGRAMS = [pageFor({ id: "prog-frozen", title: "Холодное Сердце", category: "Шоу" })];

describe("getElementBySlug", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockBlocks.mockReset();
    mockQuery.mockImplementation(async ({ database_id }: { database_id: string }) =>
      database_id === "test-elements-db"
        ? { results: ELEMENTS, next_cursor: null, has_more: false }
        : { results: PROGRAMS, next_cursor: null, has_more: false },
    );
  });

  it("parses body + tech and resolves «используется в программах»", async () => {
    mockBlocks.mockResolvedValueOnce({
      results: [paragraph("Снеговик встречает гостей."), heading2("Технические требования"), bullet("Розетка 220В")],
      next_cursor: null,
      has_more: false,
    });
    const { getElementBySlug } = await import("@/lib/notion/elements");
    const el = await getElementBySlug("rostovoy-olaf");
    expect(el).not.toBeNull();
    expect(el?.content.description).toContain("Снеговик встречает гостей.");
    expect(el?.content.techRequirements).toEqual(["Розетка 220В"]);
    expect(el?.usedInPrograms.map((p) => p.slug)).toEqual(["holodnoe-serdtse"]);
  });

  it("returns null for an unknown slug", async () => {
    const { getElementBySlug } = await import("@/lib/notion/elements");
    expect(await getElementBySlug("nope")).toBeNull();
  });
});
