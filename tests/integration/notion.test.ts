import { describe, it, expect, vi, beforeEach } from "vitest";
import { pageFor } from "@/tests/fixtures/pages";

// Mock the Notion client BEFORE importing the module under test.
// The mocks below cover databases.query (used by listPrograms) and pages.retrieve
// + blocks.children.list (used by getProgram → fetchBlockTree).
const mockQuery = vi.fn();
const mockRetrieve = vi.fn();
const mockChildrenList = vi.fn();

vi.mock("@/lib/notion/client", () => ({
  notion: {
    databases: { query: mockQuery },
    pages: { retrieve: mockRetrieve },
    blocks: { children: { list: mockChildrenList } },
  },
  DB_PROGRAMS: "test-programs-db",
  DB_ELEMENTS: "test-elements-db",
}));

const PROGRAM_PAGES = [
  pageFor({ id: "page-indeyskiy", title: "Индейский квест", audience: "B2C", category: "Квесты", age: "8–14", duration: "2 ч", guests: "до 30", price: 112000 }),
  pageFor({ id: "page-frost", title: "Холодное Сердце", audience: "B2C", category: "Шоу", age: "5–12", duration: "1,5 ч", guests: "до 50", price: 182000 }),
  pageFor({ id: "page-template", title: "[ШАБЛОН] Программа", audience: "B2C", category: "Шоу" }),
];

describe("listPrograms", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockRetrieve.mockReset();
    mockChildrenList.mockReset();
  });

  it("excludes pages whose title starts with [ШАБЛОН]", async () => {
    mockQuery.mockResolvedValueOnce({ results: PROGRAM_PAGES, next_cursor: null, has_more: false });
    const { listPrograms } = await import("@/lib/notion/programs");
    const out = await listPrograms();
    expect(out.length, "template filtered out").toBe(2);
    expect(out.find((p) => p.title.startsWith("[ШАБЛОН]")), "no template title in output").toBeUndefined();
  });

  it("sorts programs by title ascending (ru locale)", async () => {
    mockQuery.mockResolvedValueOnce({ results: PROGRAM_PAGES, next_cursor: null, has_more: false });
    const { listPrograms } = await import("@/lib/notion/programs");
    const out = await listPrograms();
    expect(out.map((p) => p.title), "alphabetical order").toEqual([
      "Индейский квест",
      "Холодное Сердце",
    ]);
  });

  it("paginates through next_cursor", async () => {
    mockQuery
      .mockResolvedValueOnce({ results: [PROGRAM_PAGES[0]], next_cursor: "c2", has_more: true })
      .mockResolvedValueOnce({ results: [PROGRAM_PAGES[1]], next_cursor: null, has_more: false });
    const { listPrograms } = await import("@/lib/notion/programs");
    const out = await listPrograms();
    expect(mockQuery, "called twice for two pages").toHaveBeenCalledTimes(2);
    expect(out.length).toBe(2);
  });
});

describe("getProgramBySlug", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockRetrieve.mockReset();
    mockChildrenList.mockReset();
  });

  it("returns the program when its slug matches", async () => {
    mockQuery.mockResolvedValueOnce({ results: PROGRAM_PAGES, next_cursor: null, has_more: false });
    mockRetrieve.mockResolvedValueOnce(PROGRAM_PAGES[0]);
    mockChildrenList.mockResolvedValueOnce({ results: [], next_cursor: null, has_more: false });

    const { getProgramBySlug } = await import("@/lib/notion/programs");
    const got = await getProgramBySlug("indeyskiy-kvest");
    expect(got, "non-null match").not.toBeNull();
    expect(got?.title).toBe("Индейский квест");
    expect(got?.content.subtitle, "empty subtitle when no blocks").toBe("");
  });

  it("returns null when slug doesn't match any program", async () => {
    mockQuery.mockResolvedValueOnce({ results: PROGRAM_PAGES, next_cursor: null, has_more: false });
    const { getProgramBySlug } = await import("@/lib/notion/programs");
    const got = await getProgramBySlug("nesuschestvuyuschiy");
    expect(got, "null when not found").toBeNull();
  });
});
