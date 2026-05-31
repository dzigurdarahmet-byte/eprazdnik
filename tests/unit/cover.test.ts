import { describe, it, expect } from "vitest";
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { readCoverImage, readPageCover } from "@/lib/notion/properties";

function page(opts: { cover?: any; photoUrl?: string }): PageObjectResponse {
  return {
    object: "page",
    id: "p",
    cover: opts.cover ?? null,
    properties: opts.photoUrl
      ? { Фото: { id: "f", type: "url", url: opts.photoUrl } }
      : {},
  } as any;
}

const COVER = ["Фото", "Обложка", "Cover"];

describe("readCoverImage / readPageCover", () => {
  it("reads an external page cover", () => {
    expect(readPageCover(page({ cover: { type: "external", external: { url: "https://x/img.png" } } }))).toBe(
      "https://x/img.png",
    );
  });

  it("reads an uploaded file page cover", () => {
    expect(readPageCover(page({ cover: { type: "file", file: { url: "https://s3/img.jpg" } } }))).toBe(
      "https://s3/img.jpg",
    );
  });

  it("returns '' when there is no cover", () => {
    expect(readPageCover(page({}))).toBe("");
  });

  it("prefers a Фото URL property over the page cover", () => {
    const p = page({
      cover: { type: "external", external: { url: "https://cover" } },
      photoUrl: "https://photo-prop",
    });
    expect(readCoverImage(p, COVER)).toBe("https://photo-prop");
  });

  it("falls back to the page cover when no property is set", () => {
    const p = page({ cover: { type: "external", external: { url: "https://cover" } } });
    expect(readCoverImage(p, COVER)).toBe("https://cover");
  });

  it("returns '' when neither is present", () => {
    expect(readCoverImage(page({}), COVER)).toBe("");
  });
});
