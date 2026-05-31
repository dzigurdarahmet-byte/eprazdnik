// Tolerant readers for Notion page properties.
// Property names in the source DB are not under our control, so each helper
// accepts a list of candidate names and falls back to a default when none match.
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { richTextToString } from "@/lib/notion/parser";

type Props = PageObjectResponse["properties"];

export function findTitle(page: PageObjectResponse): string {
  for (const prop of Object.values(page.properties)) {
    if (prop.type === "title") {
      return richTextToString(prop.title);
    }
  }
  return "";
}

function pickProp(props: Props, candidates: readonly string[]) {
  for (const name of candidates) {
    if (Object.prototype.hasOwnProperty.call(props, name)) {
      return props[name];
    }
  }
  return undefined;
}

export function readSelect(page: PageObjectResponse, candidates: readonly string[]): string {
  const p = pickProp(page.properties, candidates);
  if (p && p.type === "select") return p.select?.name ?? "";
  if (p && p.type === "status") return p.status?.name ?? "";
  return "";
}

export function readMultiSelect(page: PageObjectResponse, candidates: readonly string[]): string[] {
  const p = pickProp(page.properties, candidates);
  if (p && p.type === "multi_select") return p.multi_select.map((o) => o.name);
  return [];
}

export function readRichTextProp(page: PageObjectResponse, candidates: readonly string[]): string {
  const p = pickProp(page.properties, candidates);
  if (p && p.type === "rich_text") return richTextToString(p.rich_text);
  return "";
}

export function readNumberProp(page: PageObjectResponse, candidates: readonly string[]): number | null {
  const p = pickProp(page.properties, candidates);
  if (p && p.type === "number") return p.number ?? null;
  return null;
}

export function readRelation(page: PageObjectResponse, candidates: readonly string[]): string[] {
  const p = pickProp(page.properties, candidates);
  if (p && p.type === "relation") return p.relation.map((r) => r.id);
  return [];
}

/** Read a URL from either a `url` property or the first link inside a rich_text property. */
export function readUrlProp(page: PageObjectResponse, candidates: readonly string[]): string {
  const p = pickProp(page.properties, candidates);
  if (!p) return "";
  if (p.type === "url") return p.url ?? "";
  if (p.type === "rich_text") {
    for (const t of p.rich_text) {
      if (t.href) return t.href;
      if (t.type === "text" && t.text.link?.url) return t.text.link.url;
    }
  }
  return "";
}

export function readPageEmoji(page: PageObjectResponse): string {
  if (page.icon && page.icon.type === "emoji") return page.icon.emoji;
  return "";
}

/** Page cover image URL (external or uploaded file), "" if none. */
export function readPageCover(page: PageObjectResponse): string {
  const cover = page.cover;
  if (!cover) return "";
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return "";
}

/**
 * Cover image for a card: prefer a URL/Фото property, then the page cover.
 * Tolerant — returns "" when nothing is set.
 */
export function readCoverImage(page: PageObjectResponse, candidates: readonly string[]): string {
  return readUrlProp(page, candidates) || readPageCover(page);
}

/**
 * Map an audience string from Notion ("B2C", "B2B", "Корпоративный", …)
 * to the narrowed union used in the UI.
 */
export function normalizeAudience(raw: string): "B2C" | "B2B" | "OTHER" {
  const s = raw.toUpperCase();
  if (s.includes("B2C")) return "B2C";
  if (s.includes("B2B")) return "B2B";
  return "OTHER";
}
