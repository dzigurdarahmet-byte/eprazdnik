import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { ElementsView } from "@/components/elements/ElementsView";
import type { ElementSummary } from "@/types/element";

function el(e: Partial<ElementSummary>): ElementSummary {
  return {
    id: "id", slug: "slug", title: "Элемент", category: "", status: "", tags: [],
    priceFrom: null, accent: "#000", tint: "#fff", relatedProgramIds: [], ...e,
  };
}

const ELEMENTS = [
  el({ id: "1", title: "Ростовой Олаф", category: "Ростовая кукла" }),
  el({ id: "2", title: "Снегогенератор", category: "Спецэффект" }),
];

describe("ElementsView", () => {
  it("renders all element cards", () => {
    const { container, getByText } = render(<ElementsView elements={ELEMENTS} />);
    expect(container.querySelectorAll(".pcard").length).toBe(2);
    expect(getByText("2 элементов")).toBeTruthy();
  });

  it("respects an initial category", () => {
    const { container } = render(<ElementsView elements={ELEMENTS} initialCategory="Спецэффект" />);
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });

  it("filters via search", () => {
    const { container, getByPlaceholderText } = render(<ElementsView elements={ELEMENTS} />);
    fireEvent.change(getByPlaceholderText("Поиск по элементам"), { target: { value: "олаф" } });
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });

  it("filters via the category dropdown", () => {
    const { container, getByText } = render(<ElementsView elements={ELEMENTS} />);
    fireEvent.click(getByText("Категория"));
    const menu = container.querySelector(".facet-menu") as HTMLElement;
    fireEvent.click(within(menu).getByText("Спецэффект"));
    expect(container.querySelectorAll(".pcard").length).toBe(1);
  });
});
