// Builders for minimal Notion page-object fixtures used in programs.test.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

let nextPageId = 0;
const pid = () => `page-${++nextPageId}`;

type Tile = {
  title: string;
  id?: string;
  audience?: "B2C" | "B2B";
  category?: string;
  tags?: string[];
  age?: string;
  duration?: string;
  guests?: string;
  price?: number;
  emoji?: string;
};

export function pageFor(t: Tile): PageObjectResponse {
  return {
    object: "page",
    id: t.id ?? pid(),
    parent: { type: "database_id", database_id: "db-1" },
    created_time: "2025-01-01T00:00:00.000Z",
    last_edited_time: "2025-01-01T00:00:00.000Z",
    created_by: { object: "user", id: "u" },
    last_edited_by: { object: "user", id: "u" },
    cover: null,
    icon: t.emoji ? { type: "emoji", emoji: t.emoji as any } : null,
    archived: false,
    in_trash: false,
    url: `https://notion.so/${t.id ?? "x"}`,
    public_url: null,
    properties: {
      Название: {
        id: "title",
        type: "title",
        title: [
          {
            type: "text",
            text: { content: t.title, link: null },
            annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
            plain_text: t.title,
            href: null,
          } as any,
        ],
      },
      "B2B/B2C": t.audience
        ? { id: "aud", type: "select", select: { id: "s", name: t.audience, color: "default" } }
        : { id: "aud", type: "select", select: null },
      Категория: t.category
        ? { id: "cat", type: "select", select: { id: "c", name: t.category, color: "default" } }
        : { id: "cat", type: "select", select: null },
      Теги: {
        id: "tg",
        type: "multi_select",
        multi_select: (t.tags ?? []).map((name, i) => ({ id: `t${i}`, name, color: "default" })),
      },
      Возраст: {
        id: "ag",
        type: "rich_text",
        rich_text: t.age
          ? [{
              type: "text",
              text: { content: t.age, link: null },
              annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
              plain_text: t.age,
              href: null,
            } as any]
          : [],
      },
      Длительность: {
        id: "du",
        type: "rich_text",
        rich_text: t.duration
          ? [{
              type: "text",
              text: { content: t.duration, link: null },
              annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
              plain_text: t.duration,
              href: null,
            } as any]
          : [],
      },
      Гости: {
        id: "gu",
        type: "rich_text",
        rich_text: t.guests
          ? [{
              type: "text",
              text: { content: t.guests, link: null },
              annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
              plain_text: t.guests,
              href: null,
            } as any]
          : [],
      },
      "Цена от": {
        id: "pr",
        type: "number",
        number: t.price ?? null,
      },
    } as any,
  } as any;
}
