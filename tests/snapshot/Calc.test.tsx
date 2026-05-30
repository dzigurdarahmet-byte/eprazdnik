import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Calc } from "@/components/program/Calc";
import type { PricingBlock } from "@/types/program";

const withSheet: PricingBlock = {
  yellowNote: "",
  sheetUrl: "https://docs.google.com/spreadsheets/d/abc/edit",
  constructor: { title: "", sub: "" },
  packages: { title: "", sub: "" },
};

const noSheet: PricingBlock = {
  yellowNote: "",
  sheetUrl: "",
  constructor: { title: "", sub: "" },
  packages: { title: "", sub: "" },
};

describe("Calc", () => {
  it("renders active sheet links when a URL is present", () => {
    const { container } = render(<Calc title="Холодное Сердце" pricing={withSheet} priceFrom={182000} />);
    const links = container.querySelectorAll('a[href^="https://docs.google.com"]');
    expect(links.length).toBe(2);
    links.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    });
    expect(container).toMatchSnapshot();
  });

  it("renders inactive cards (no anchors) when the sheet URL is missing", () => {
    const { container } = render(<Calc title="Холодное Сердце" pricing={noSheet} priceFrom={null} />);
    expect(container.querySelectorAll("a").length).toBe(0);
    // Default yellow note still shows.
    expect(container.textContent).toContain("Google Sheets");
  });
});
