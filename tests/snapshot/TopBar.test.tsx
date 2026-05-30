import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/catalog" }));

import { TopBar } from "@/components/shell/TopBar";

describe("TopBar", () => {
  it("matches snapshot and shows the section title", () => {
    const { container, getByText } = render(<TopBar />);
    expect(getByText("Программы")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
