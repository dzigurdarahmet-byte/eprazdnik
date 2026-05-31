import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import type { ProgramSummary } from "@/types/program";

const program: ProgramSummary = {
  id: "1",
  slug: "holodnoe-serdce",
  title: "Холодное Сердце",
  subtitle: "Тайна кристаллов Эренделла",
  coverEmoji: "❄️",
  coverKind: "ice",
  coverImage: "",
  accent: "#3d6fa8",
  tint: "#eaf1fa",
  tags: ["сюжетная", "премиум"],
  category: "Шоу",
  format: "Шоу",
  groupSize: ["до 50"],
  status: "🟢 Готово к продаже",
  audience: "B2C",
  ageRange: "5–12",
  duration: "1,5 ч",
  guests: "до 50",
  priceFrom: 182000,
  relatedElementIds: [],
};

describe("ProgramCard", () => {
  it("matches snapshot", () => {
    const { container } = render(<ProgramCard p={program} />);
    expect(container).toMatchSnapshot();
  });

  it("links to the program detail page", () => {
    const { container } = render(<ProgramCard p={program} />);
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/program/holodnoe-serdce");
  });

  it("renders a cover image when coverImage is set, else the accent strip", () => {
    const withPhoto = render(<ProgramCard p={{ ...program, coverImage: "https://x/cover.jpg" }} />);
    expect(withPhoto.container.querySelector(".pcard-photo")).toBeTruthy();
    expect(withPhoto.container.querySelector("img")).toBeTruthy();

    const noPhoto = render(<ProgramCard p={program} />);
    expect(noPhoto.container.querySelector(".pcard-photo")).toBeNull();
    expect(noPhoto.container.querySelector(".pcard-accent")).toBeTruthy();
  });
});
