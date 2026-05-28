import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Tabs } from "@/components/Tabs";

afterEach(() => cleanup());

const TABS = [
  { key: "a", label: "Описание", content: <div>desc-content</div> },
  { key: "b", label: "Расчёт", content: <div>calc-content</div> },
];

describe("Tabs", () => {
  it("shows the first tab content by default", () => {
    const { getByText, queryByText } = render(<Tabs tabs={TABS} />);
    expect(getByText("desc-content"), "first tab content").toBeInTheDocument();
    expect(queryByText("calc-content"), "second tab hidden").toBeNull();
  });

  it("switches content on tab click and updates aria-selected", () => {
    const { getByRole, getByText, queryByText } = render(<Tabs tabs={TABS} />);
    fireEvent.click(getByRole("tab", { name: "Расчёт" }));
    expect(getByText("calc-content"), "second content visible").toBeInTheDocument();
    expect(queryByText("desc-content"), "first content hidden").toBeNull();
    expect(getByRole("tab", { name: "Расчёт" }).getAttribute("aria-selected")).toBe("true");
  });

  it("honors `initial` prop to pre-select a tab", () => {
    const { getByText } = render(<Tabs tabs={TABS} initial="b" />);
    expect(getByText("calc-content"), "initial second content").toBeInTheDocument();
  });
});
