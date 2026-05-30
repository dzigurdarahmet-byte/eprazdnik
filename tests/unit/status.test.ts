import { describe, it, expect } from "vitest";
import { statusBadge } from "@/lib/status";

describe("statusBadge", () => {
  it("maps program statuses by emoji prefix", () => {
    expect(statusBadge("🟢 Готово к продаже")).toMatchObject({ color: "green", dot: "🟢" });
    expect(statusBadge("🟡 В работе")).toMatchObject({ color: "yellow", dot: "🟡" });
    expect(statusBadge("🔴 Не хватает материалов")).toMatchObject({ color: "red", dot: "🔴" });
  });

  it("maps element statuses by emoji prefix", () => {
    expect(statusBadge("🟢 Доступен")).toMatchObject({ color: "green" });
    expect(statusBadge("🟡 По запросу")).toMatchObject({ color: "yellow" });
    expect(statusBadge("🔴 Не используем")).toMatchObject({ color: "red" });
  });

  it("strips the emoji from the label", () => {
    expect(statusBadge("🟢 Готово к продаже")?.label).toBe("Готово к продаже");
  });

  it("falls back to keywords when there is no emoji", () => {
    expect(statusBadge("Готово к продаже")).toMatchObject({ color: "green" });
    expect(statusBadge("По запросу")).toMatchObject({ color: "yellow" });
    expect(statusBadge("Не используем")).toMatchObject({ color: "red" });
  });

  it("returns null for empty status and gray for unknown", () => {
    expect(statusBadge("")).toBeNull();
    expect(statusBadge("   ")).toBeNull();
    expect(statusBadge("Черновик")).toMatchObject({ color: "gray" });
  });
});
