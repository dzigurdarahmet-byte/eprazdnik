import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ElementCard } from "@/components/elements/ElementCard";
import type { ElementSummary } from "@/types/element";

const element: ElementSummary = {
  id: "el-1",
  slug: "rostovoy-olaf",
  title: "Ростовой Олаф",
  category: "Ростовая кукла",
  status: "🟢 Доступен",
  tags: ["зима"],
  priceFrom: 6500,
  coverImage: "",
  accent: "#3d6fa8",
  tint: "#eaf1fa",
  relatedProgramIds: [],
};

describe("ElementCard", () => {
  it("matches snapshot", () => {
    const { container } = render(<ElementCard e={element} />);
    expect(container).toMatchSnapshot();
  });
});
