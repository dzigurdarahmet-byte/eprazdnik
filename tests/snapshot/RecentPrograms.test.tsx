import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { RecentPrograms } from "@/components/home/RecentPrograms";
import { RECENT_KEY } from "@/lib/recent";
import type { ProgramSummary } from "@/types/program";

function prog(p: Partial<ProgramSummary>): ProgramSummary {
  return {
    id: "id", slug: "slug", title: "Программа", subtitle: "", coverEmoji: "", coverKind: "purple",
    coverImage: "", accent: "#000", tint: "#fff", tags: [], category: "", format: "", groupSize: [],
    status: "", audience: "OTHER", ageRange: "", duration: "", guests: "", priceFrom: null, relatedElementIds: [],
    ...p,
  };
}

const PROGRAMS = [
  prog({ id: "1", slug: "a", title: "Алиса" }),
  prog({ id: "2", slug: "b", title: "Беларусь" }),
  prog({ id: "3", slug: "c", title: "Холодное" }),
];

describe("RecentPrograms", () => {
  beforeEach(() => window.localStorage.clear());

  it("falls back to the first programs when history is empty (snapshot)", () => {
    const { container } = render(<RecentPrograms programs={PROGRAMS} />);
    expect(container.querySelectorAll(".recent-row").length).toBe(3);
    expect(container).toMatchSnapshot();
  });

  it("shows recent programs from localStorage in order", async () => {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(["c", "a"]));
    const { container } = render(<RecentPrograms programs={PROGRAMS} />);
    await waitFor(() => {
      const titles = [...container.querySelectorAll(".recent-title")].map((n) => n.textContent);
      expect(titles).toEqual(["Холодное", "Алиса"]);
    });
  });
});
