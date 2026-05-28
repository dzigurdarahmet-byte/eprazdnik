import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("renders title, subtitle, and totalPrograms counter", () => {
    const { getByRole, getByTestId } = render(
      <Hero title="Каталог" subtitle="Все программы" totalPrograms={16} />,
    );
    expect(getByRole("heading", { level: 1 }).textContent, "h1 has the title").toBe("Каталог");
    expect(getByTestId("hero-stats").textContent, "counter shows live N").toContain("16");
    expect(getByTestId("hero-stats").textContent, "counter has «программ» label").toContain("программ");
  });

  it("omits the second metric block when its label/value are not provided", () => {
    const { getByTestId } = render(<Hero title="X" totalPrograms={3} />);
    expect(getByTestId("hero-stats").textContent, "only one stat segment").not.toContain("·");
  });

  it("renders the second metric when both label and value are provided", () => {
    const { getByTestId } = render(
      <Hero title="X" totalPrograms={3} metric2Label="встреч" metric2Value="12" />,
    );
    const text = getByTestId("hero-stats").textContent ?? "";
    expect(text, "second segment present").toContain("12");
    expect(text, "second label present").toContain("встреч");
  });
});
