import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { TableView } from "@/components/catalog/TableView";
import type { ProgramSummary } from "@/types/program";

function prog(p: Partial<ProgramSummary>): ProgramSummary {
  return {
    id: "id", slug: "slug", title: "Программа", subtitle: "", coverEmoji: "", coverKind: "purple",
    accent: "#000", tint: "#fff", tags: [], category: "", format: "", groupSize: [], status: "",
    audience: "OTHER", ageRange: "", duration: "", guests: "", priceFrom: null, relatedElementIds: [],
    ...p,
  };
}

const ROWS = [
  prog({ id: "1", slug: "b", title: "Беларусь", priceFrom: 200 }),
  prog({ id: "2", slug: "a", title: "Алиса", priceFrom: 100 }),
];

describe("TableView", () => {
  it("matches snapshot", () => {
    const { container } = render(<TableView programs={ROWS} />);
    expect(container).toMatchSnapshot();
  });

  it("sorts by a column header click", () => {
    const { container, getByText } = render(<TableView programs={ROWS} />);
    // default asc by title: Алиса before Беларусь
    let firstCell = container.querySelector("tbody tr td .cell-name");
    expect(firstCell?.textContent).toContain("Алиса");
    // click Цена от → asc by price: 100 (Алиса) first; then click again → desc: 200 (Беларусь)
    fireEvent.click(getByText("Цена от"));
    fireEvent.click(getByText("Цена от"));
    firstCell = container.querySelector("tbody tr td .cell-name");
    expect(firstCell?.textContent).toContain("Беларусь");
  });
});
