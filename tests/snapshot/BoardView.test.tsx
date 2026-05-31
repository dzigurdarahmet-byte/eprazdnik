import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BoardView } from "@/components/catalog/BoardView";
import type { ProgramSummary } from "@/types/program";

function prog(p: Partial<ProgramSummary>): ProgramSummary {
  return {
    id: "id", slug: "slug", title: "Программа", subtitle: "", coverEmoji: "", coverKind: "purple",
    coverImage: "", accent: "#000", tint: "#fff", tags: [], category: "", format: "", groupSize: [], status: "",
    audience: "OTHER", ageRange: "", duration: "", guests: "", priceFrom: null, relatedElementIds: [],
    ...p,
  };
}

const PROGRAMS = [
  prog({ id: "1", slug: "frost", title: "Холодное Сердце", status: "🟢 Готово к продаже" }),
  prog({ id: "2", slug: "harry", title: "Гарри Поттер", status: "🟡 В работе" }),
  prog({ id: "3", slug: "pirates", title: "Пираты", status: "🟢 Готово к продаже" }),
];

describe("BoardView", () => {
  it("renders one column per status with cards", () => {
    const { container } = render(<BoardView programs={PROGRAMS} />);
    const cols = container.querySelectorAll(".board-col");
    expect(cols.length).toBe(2); // green + yellow
    expect(container.querySelectorAll(".board-card").length).toBe(3);
  });

  it("matches snapshot", () => {
    const { container } = render(<BoardView programs={PROGRAMS} />);
    expect(container).toMatchSnapshot();
  });
});
