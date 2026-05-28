import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Chips, type Chip } from "@/components/Chips";

afterEach(() => cleanup());

const CHIPS: Chip[] = [
  { key: "all", label: "Все" },
  { key: "b2c", label: "B2C" },
  { key: "b2b", label: "B2B" },
];

describe("Chips", () => {
  it("treats «Все» as active when no filter is selected", () => {
    const { getByRole } = render(<Chips chips={CHIPS} active={new Set()} onToggle={() => undefined} />);
    expect(getByRole("button", { name: /Все/ }).getAttribute("aria-pressed")).toBe("true");
    expect(getByRole("button", { name: /B2C/ }).getAttribute("aria-pressed")).toBe("false");
  });

  it("calls onToggle with the chip key when clicked", () => {
    const onToggle = vi.fn();
    const { getByRole } = render(<Chips chips={CHIPS} active={new Set()} onToggle={onToggle} />);
    fireEvent.click(getByRole("button", { name: /B2C/ }));
    expect(onToggle).toHaveBeenCalledWith("b2c");
  });

  it("marks chips as active when their key is in the set", () => {
    const { getByRole } = render(<Chips chips={CHIPS} active={new Set(["b2b"])} onToggle={() => undefined} />);
    expect(getByRole("button", { name: /B2B/ }).getAttribute("aria-pressed")).toBe("true");
    expect(getByRole("button", { name: /Все/ }).getAttribute("aria-pressed"), "with active filters Все is off").toBe("false");
  });
});
