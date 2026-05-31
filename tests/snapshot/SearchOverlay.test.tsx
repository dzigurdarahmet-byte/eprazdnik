import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { SearchOverlay } from "@/components/search/SearchOverlay";
import type { SearchItem } from "@/lib/search";

function item(p: Partial<SearchItem>): SearchItem {
  return {
    kind: "program", title: "X", slug: "x", href: "/program/x",
    tags: [], status: "", hint: "", emoji: "", accent: "#000", ...p,
  };
}

const ITEMS = [
  item({ kind: "program", title: "Холодное Сердце", slug: "frost", href: "/program/frost", tags: ["крио"] }),
  item({ kind: "element", title: "Снегогенератор", slug: "snow", href: "/element/snow", hint: "Спецэффект" }),
];

describe("SearchOverlay", () => {
  it("matches snapshot (all results, no query)", () => {
    const { container } = render(<SearchOverlay items={ITEMS} onClose={() => {}} />);
    expect(container.querySelectorAll(".search-result").length).toBe(2);
    expect(container).toMatchSnapshot();
  });

  it("filters instantly as you type", () => {
    const { container, getByLabelText } = render(<SearchOverlay items={ITEMS} onClose={() => {}} />);
    fireEvent.change(getByLabelText("Поиск по программам и элементам"), { target: { value: "снег" } });
    const results = container.querySelectorAll(".search-result");
    expect(results.length).toBe(1);
    expect(results[0]?.textContent).toContain("Снегогенератор");
  });

  it("navigates and closes on result click", () => {
    const onClose = vi.fn();
    const { getByText } = render(<SearchOverlay items={ITEMS} onClose={onClose} />);
    fireEvent.click(getByText("Холодное Сердце"));
    expect(onClose).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/program/frost");
  });

  it("closes when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchOverlay items={ITEMS} onClose={onClose} />);
    fireEvent.click(container.querySelector(".search-overlay") as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });
});
