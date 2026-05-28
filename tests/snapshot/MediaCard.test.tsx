import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MediaCard } from "@/components/MediaCard";

afterEach(() => cleanup());

describe("MediaCard", () => {
  it("renders title, meta, and external link with proper security attrs", () => {
    const { getByRole, getByText } = render(
      <MediaCard tile={{ emoji: "🎬", title: "Видео-демо", meta: "1:24", url: "https://disk.yandex.ru/x" }} />,
    );
    const link = getByRole("link");
    expect(link.getAttribute("href")).toBe("https://disk.yandex.ru/x");
    expect(link.getAttribute("target"), "opens in new tab").toBe("_blank");
    expect(link.getAttribute("rel"), "noopener + noreferrer enforced").toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
    expect(getByText("Видео-демо")).toBeInTheDocument();
    expect(getByText("1:24")).toBeInTheDocument();
  });

  it("hides the meta row when meta is empty", () => {
    const { queryByText } = render(
      <MediaCard tile={{ emoji: "📷", title: "Фото", meta: "", url: "https://disk.yandex.ru/y" }} />,
    );
    expect(queryByText("", { selector: ".feed-meta" }), "no .feed-meta").toBeNull();
  });
});
