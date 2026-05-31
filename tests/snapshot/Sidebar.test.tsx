import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/catalog" }));

import { Sidebar } from "@/components/shell/Sidebar";

describe("Sidebar", () => {
  const props = {
    programsCount: 16,
    elementsCount: 30,
    programs: [
      { title: "Холодное Сердце", slug: "holodnoe-serdce", accent: "#3d6fa8" },
      { title: "Гарри Поттер", slug: "garri-potter", accent: "#7a4a1f" },
    ],
    elementCatCounts: { Артист: 12, "Ростовая кукла": 6 },
  };

  it("matches snapshot with live counts", () => {
    const { container } = render(<Sidebar {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("expands «Программы» into the program list (links to detail)", () => {
    const { getByText, container } = render(<Sidebar {...props} />);
    expect(getByText("Холодное Сердце")).toBeTruthy();
    expect(container.querySelector('a[href="/program/holodnoe-serdce"]')).toBeTruthy();
  });

  it("renders the «Элементы» section (categories expand on demand)", () => {
    const { getByText } = render(<Sidebar {...props} />);
    expect(getByText("Элементы")).toBeTruthy();
  });
});
