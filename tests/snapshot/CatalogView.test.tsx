import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { CatalogView } from "@/components/catalog/CatalogView";
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
  prog({ id: "1", slug: "frost", title: "Холодное Сердце", format: "Шоу", status: "🟢 Готово к продаже", audience: "B2C" }),
  prog({ id: "2", slug: "pirates", title: "Квест Пиратов", format: "Квест", status: "🟡 В работе", audience: "B2C" }),
];

describe("CatalogView", () => {
  it("renders a gallery of cards", () => {
    const { container, getByText } = render(<CatalogView programs={PROGRAMS} />);
    expect(container.querySelectorAll(".pcard").length).toBe(2);
    expect(getByText("2 карточек")).toBeTruthy();
  });

  it("filters by search query", () => {
    const { container, getByPlaceholderText } = render(<CatalogView programs={PROGRAMS} />);
    fireEvent.change(getByPlaceholderText("Поиск по каталогу"), { target: { value: "пират" } });
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });

  it("applies an initial format filter", () => {
    const { container } = render(<CatalogView programs={PROGRAMS} initial={{ format: "Шоу" }} />);
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });

  it("filters via a facet dropdown selection", () => {
    const { container, getByText } = render(<CatalogView programs={PROGRAMS} />);
    fireEvent.click(getByText("Формат"));
    // Menu opens with options; pick "Квест".
    const menu = container.querySelector(".facet-menu") as HTMLElement;
    fireEvent.click(within(menu).getByText("Квест"));
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });

  it("switches to list view", () => {
    const { container, getByText } = render(<CatalogView programs={PROGRAMS} />);
    fireEvent.click(getByText("Список"));
    expect(container.querySelector(".clist")).toBeTruthy();
  });

  it("shows an empty state when nothing matches", () => {
    const { getByText, getByPlaceholderText } = render(<CatalogView programs={PROGRAMS} />);
    fireEvent.change(getByPlaceholderText("Поиск по каталогу"), { target: { value: "zzz" } });
    expect(getByText(/Ничего не найдено/)).toBeTruthy();
  });
});
