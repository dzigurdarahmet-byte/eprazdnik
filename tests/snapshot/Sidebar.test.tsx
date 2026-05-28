import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

// next/navigation's usePathname needs a router context that vitest doesn't provide.
vi.mock("next/navigation", () => ({
  usePathname: () => "/catalog",
}));

import { Sidebar } from "@/components/Sidebar";

afterEach(() => {
  cleanup();
});

describe("Sidebar", () => {
  it("renders every navigation entry", () => {
    const { container } = render(<Sidebar />);
    const expectedLabels = [
      "Главная",
      "Каталог услуг",
      "Мои подборки",
      "Скрипты продаж",
      "Прайсы и КП",
      "Медиа",
      "Избранное",
    ];
    const text = container.textContent ?? "";
    for (const label of expectedLabels) {
      expect(text.includes(label), `sidebar contains «${label}»`).toBe(true);
    }
  });

  it("marks the catalog item active when pathname is /catalog", () => {
    const { container } = render(<Sidebar />);
    const links = Array.from(container.querySelectorAll("a"));
    const catalogLink = links.find((a) => a.textContent?.trim() === "Каталог услуг");
    const homeLink = links.find((a) => a.textContent?.trim() === "Главная");
    expect(catalogLink, "catalog link exists").toBeTruthy();
    expect(catalogLink?.className, "active class on catalog").toContain("active");
    expect(homeLink?.className, "no active on home").not.toContain("active");
  });
});
