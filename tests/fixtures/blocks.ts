// Builders for minimal Notion block fixtures used across parser tests.
// Cast through `any` because the public response types carry many fields
// (timestamps, parent, edited_by, …) that are irrelevant for parsing logic.
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BlockTree } from "@/lib/notion/parser";
import type { NotionRichText } from "@/types/notion";

let nextId = 0;
const id = () => `block-${++nextId}`;

const baseMeta = () => ({
  object: "block" as const,
  id: id(),
  parent: { type: "page_id", page_id: "page-1" } as any,
  created_time: "2025-01-01T00:00:00.000Z",
  last_edited_time: "2025-01-01T00:00:00.000Z",
  created_by: { object: "user", id: "u" } as any,
  last_edited_by: { object: "user", id: "u" } as any,
  has_children: false,
  archived: false,
  in_trash: false,
});

const rt = (text: string, opts: Partial<NotionRichText> = {}): NotionRichText =>
  ({
    type: "text",
    text: { content: text, link: null },
    annotations: {
      bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default",
    },
    plain_text: text,
    href: null,
    ...opts,
  } as unknown as NotionRichText);

export const heading1 = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "heading_1",
  heading_1: { rich_text: [rt(text)], color: "default", is_toggleable: false },
} as any);

export const heading2 = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "heading_2",
  heading_2: { rich_text: [rt(text)], color: "default", is_toggleable: false },
} as any);

export const heading3 = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "heading_3",
  heading_3: { rich_text: [rt(text)], color: "default", is_toggleable: false },
} as any);

export const paragraph = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "paragraph",
  paragraph: { rich_text: [rt(text)], color: "default" },
} as any);

export const bullet = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "bulleted_list_item",
  bulleted_list_item: { rich_text: [rt(text)], color: "default" },
} as any);

export const numbered = (text: string): BlockTree => ({
  ...baseMeta(),
  type: "numbered_list_item",
  numbered_list_item: { rich_text: [rt(text)], color: "default" },
} as any);

export const callout = (
  text: string,
  options: { emoji?: string; color?: string; href?: string } = {},
): BlockTree => {
  const richText: NotionRichText[] = [
    options.href
      ? (rt(text, { href: options.href, text: { content: text, link: { url: options.href } } as any }) as NotionRichText)
      : rt(text),
  ];
  return {
    ...baseMeta(),
    type: "callout",
    callout: {
      rich_text: richText,
      color: options.color ?? "default",
      icon: options.emoji ? { type: "emoji", emoji: options.emoji } : null,
    },
  } as any;
};

export const bookmark = (url: string, caption = ""): BlockTree => ({
  ...baseMeta(),
  type: "bookmark",
  bookmark: { url, caption: caption ? [rt(caption)] : [] },
} as any);

export const paragraphLink = (text: string, url: string): BlockTree => ({
  ...baseMeta(),
  type: "paragraph",
  paragraph: {
    rich_text: [rt(text, { href: url, text: { content: text, link: { url } } as any })],
    color: "default",
  },
} as any);

export const column = (children: BlockTree[]): BlockTree => ({
  ...baseMeta(),
  type: "column",
  column: {},
  has_children: children.length > 0,
  children,
} as any);

export const columnList = (cols: BlockTree[]): BlockTree => ({
  ...baseMeta(),
  type: "column_list",
  column_list: {},
  has_children: cols.length > 0,
  children: cols,
} as any);
