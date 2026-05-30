import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Tag } from "@/components/ui/Tag";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconSlot } from "@/components/ui/IconSlot";
import { FilterPill } from "@/components/ui/FilterPill";
import { Avatar } from "@/components/ui/Avatar";
import { Plus } from "@/components/ui/Plus";
import { Chevron } from "@/components/ui/Chevron";
import { SheetIcon } from "@/components/ui/SheetIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PropertyRow } from "@/components/ui/PropertyRow";

describe("ui atoms", () => {
  it("Tag renders color class and dot", () => {
    const { container, getByText } = render(<Tag color="green" dot="🟢">Готово</Tag>);
    expect(container.querySelector(".tag.tag-green")).toBeTruthy();
    expect(getByText("Готово")).toBeTruthy();
  });

  it("Breadcrumbs links non-final items and marks the last current", () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Программы", href: "/catalog" }, { label: "X" }]} />,
    );
    expect(container.querySelectorAll("a").length).toBe(2);
    expect(container.querySelector(".crumb.current")?.textContent).toContain("X");
  });

  it("IconSlot shows emoji when provided, else a dashed placeholder caption", () => {
    const withEmoji = render(<IconSlot name="ice" size={36} emoji="❄️" />);
    expect(withEmoji.getByText("❄️")).toBeTruthy();
    const placeholder = render(<IconSlot name="adventure" size={36} accent="#333" />);
    // caption is a slice of the name
    expect(placeholder.container.textContent).toContain("adv");
  });

  it("FilterPill fires onClick and reflects active state", () => {
    let clicked = false;
    const { getByRole } = render(
      <FilterPill active onClick={() => (clicked = true)}>Формат</FilterPill>,
    );
    const btn = getByRole("button");
    expect(btn.className).toContain("active");
    fireEvent.click(btn);
    expect(clicked).toBe(true);
  });

  it("renders the remaining atoms without crashing", () => {
    expect(render(<Avatar name="Мария Корнева" />).container.textContent).toBe("МК");
    expect(render(<Plus />).container.querySelector("svg")).toBeTruthy();
    expect(render(<Chevron open />).container.querySelector("svg")).toBeTruthy();
    expect(render(<SheetIcon />).container.querySelector("svg")).toBeTruthy();
    expect(render(<SectionLabel num="01">Легенда</SectionLabel>).getByText("Легенда")).toBeTruthy();
    expect(
      render(
        <PropertyRow icon="◇" label="Категория">
          <span>Шоу</span>
        </PropertyRow>,
      ).getByText("Категория"),
    ).toBeTruthy();
  });
});
