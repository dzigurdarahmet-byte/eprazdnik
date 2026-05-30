import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/catalog" }));

import { Sidebar } from "@/components/shell/Sidebar";

describe("Sidebar", () => {
  const props = {
    programsCount: 16,
    elementsCount: 30,
    formatCounts: { Программа: 8, Квест: 4, Шоу: 4 },
    elementCatCounts: { Артист: 12, "Ростовая кукла": 6 },
  };

  it("matches snapshot with live counts", () => {
    const { container } = render(<Sidebar {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("renders only formats that exist in the counts", () => {
    const { getByText, queryByText } = render(<Sidebar {...props} />);
    expect(getByText("Квесты")).toBeTruthy();
    // Тимбилдинги has no count → hidden.
    expect(queryByText("Тимбилдинги")).toBeNull();
  });
});
