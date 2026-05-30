// Builders for minimal Notion element-page fixtures (base «🧩 Элементы»).
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

let nextId = 0;
const eid = () => `el-${++nextId}`;

type ElTile = {
  title: string;
  id?: string;
  category?: string;
  status?: string;
  tags?: string[];
  price?: number;
  programIds?: string[];
};

export function elementPageFor(t: ElTile): PageObjectResponse {
  return {
    object: "page",
    id: t.id ?? eid(),
    parent: { type: "database_id", database_id: "db-el" },
    created_time: "2025-01-01T00:00:00.000Z",
    last_edited_time: "2025-01-01T00:00:00.000Z",
    created_by: { object: "user", id: "u" },
    last_edited_by: { object: "user", id: "u" },
    cover: null,
    icon: null,
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
      Категория: t.category
        ? { id: "cat", type: "select", select: { id: "c", name: t.category, color: "default" } }
        : { id: "cat", type: "select", select: null },
      Статус: t.status
        ? { id: "st", type: "select", select: { id: "s", name: t.status, color: "default" } }
        : { id: "st", type: "select", select: null },
      Теги: {
        id: "tg",
        type: "multi_select",
        multi_select: (t.tags ?? []).map((name, i) => ({ id: `t${i}`, name, color: "default" })),
      },
      "Цена от": { id: "pr", type: "number", number: t.price ?? null },
      "Используется в программах": {
        id: "rel",
        type: "relation",
        relation: (t.programIds ?? []).map((pid) => ({ id: pid })),
        has_more: false,
      },
    } as any,
  } as any;
}
