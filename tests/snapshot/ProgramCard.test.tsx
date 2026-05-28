import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProgramCard } from "@/components/ProgramCard";
import type { ProgramSummary } from "@/types/program";

const base: ProgramSummary = {
  id: "p1",
  slug: "kholodnoe-serdtse",
  title: "Холодное Сердце",
  subtitle: "Тайна кристаллов",
  coverEmoji: "❄️",
  coverKind: "ice",
  tags: ["сюжетная", "крио"],
  category: "Шоу",
  audience: "B2C",
  ageRange: "5–12",
  duration: "1,5 ч",
  guests: "до 50",
  priceFrom: 182000,
};

describe("ProgramCard", () => {
  it("renders title, subtitle, price and links to /program/[slug]", () => {
    const { getByTestId, getByText } = render(<ProgramCard p={base} />);
    const card = getByTestId("program-card");
    expect(card.getAttribute("href"), "href uses slug").toBe("/program/kholodnoe-serdtse");
    expect(getByText("Холодное Сердце")).toBeInTheDocument();
    expect(getByText("Тайна кристаллов")).toBeInTheDocument();
    expect(card.textContent, "formatted ru-locale price").toContain("182 000");
  });

  it("falls back to «по запросу» when priceFrom is null", () => {
    const { getByText } = render(<ProgramCard p={{ ...base, priceFrom: null }} />);
    expect(getByText(/по запросу/), "price fallback").toBeInTheDocument();
  });

  it("hides B2C/B2B badge for OTHER audience", () => {
    const { queryByText } = render(
      <ProgramCard p={{ ...base, audience: "OTHER" }} />,
    );
    expect(queryByText("B2C"), "no B2C badge").toBeNull();
    expect(queryByText("B2B"), "no B2B badge").toBeNull();
  });

  it("accepts a very long title without throwing (truncation handled by CSS)", () => {
    const long = "Очень-очень длинное название программы которое не должно ломать карточку".repeat(2);
    const { getByText } = render(<ProgramCard p={{ ...base, title: long }} />);
    expect(getByText(long, { exact: false })).toBeInTheDocument();
  });
});
