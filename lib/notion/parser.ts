// Notion blocks → ProgramContent. Pure function: no network calls, no throws.
// Missing sections collapse to empty defaults and emit logger.warn for triage.
import type {
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { logger } from "@/lib/logger";
import {
  IGNORED_SECTION_PATTERNS,
  SECTION_IDS,
  SECTION_MATCHERS,
  type SectionId,
} from "@/lib/constants";
import type { NotionBlock, NotionRichText } from "@/types/notion";
import { isFullBlock } from "@/types/notion";
import type {
  Character,
  MediaTile,
  PricingBlock,
  ProgramContent,
} from "@/types/program";

/** A Notion block enriched with its (already-fetched) children. */
export type BlockTree = NotionBlock & { children?: BlockTree[] };

// ---------------- Generic helpers ----------------

export function richTextToString(rt: NotionRichText[] | undefined): string {
  if (!rt || rt.length === 0) return "";
  return rt.map((t) => t.plain_text).join("");
}

function firstUrlFromRichText(rt: NotionRichText[] | undefined): string {
  if (!rt) return "";
  for (const t of rt) {
    if (t.href) return t.href;
    if (t.type === "text" && t.text.link?.url) return t.text.link.url;
  }
  return "";
}

/** Depth-first flatten, including children of column_list / column / toggle / quote / etc. */
export function flattenBlocks(blocks: BlockTree[]): NotionBlock[] {
  const out: NotionBlock[] = [];
  for (const b of blocks) {
    out.push(b);
    if (b.children && b.children.length > 0) {
      out.push(...flattenBlocks(b.children));
    }
  }
  return out;
}

function blockHeadingText(b: NotionBlock): string | null {
  if (b.type === "heading_1") return richTextToString((b as Heading1BlockObjectResponse).heading_1.rich_text);
  if (b.type === "heading_2") return richTextToString((b as Heading2BlockObjectResponse).heading_2.rich_text);
  if (b.type === "heading_3") return richTextToString((b as Heading3BlockObjectResponse).heading_3.rich_text);
  return null;
}

function matchSectionKey(headingText: string): SectionId | null {
  for (const { id, pattern } of SECTION_MATCHERS) {
    if (pattern.test(headingText)) return id;
  }
  return null;
}

function isIgnoredHeading(headingText: string): boolean {
  return IGNORED_SECTION_PATTERNS.some((p) => p.test(headingText));
}

/**
 * Walks the flat block stream, grouping blocks by the most recent recognized
 * section heading. Returns Map<SectionId, blocks-following-that-heading>.
 */
export function splitBySectionHeaders(flat: NotionBlock[]): Map<SectionId, NotionBlock[]> {
  const sections = new Map<SectionId, NotionBlock[]>();
  let current: SectionId | null = null;

  for (const b of flat) {
    const heading = blockHeadingText(b);
    if (heading !== null) {
      if (isIgnoredHeading(heading)) {
        current = null;
        continue;
      }
      const key = matchSectionKey(heading);
      if (key !== null) {
        current = key;
        if (!sections.has(current)) sections.set(current, []);
        continue;
      }
      // Unknown heading resets the cursor so unrelated body text isn't attributed
      // to the previous section.
      current = null;
      continue;
    }
    if (current !== null) {
      const bucket = sections.get(current);
      if (bucket) bucket.push(b);
    }
  }

  return sections;
}

// ---------------- Section parsers ----------------

export function extractSubtitle(flat: NotionBlock[]): string {
  for (const b of flat) {
    if (b.type === "heading_2") {
      const text = richTextToString((b as Heading2BlockObjectResponse).heading_2.rich_text);
      if (text.trim().length > 0) return text;
    }
  }
  return "";
}

function joinParagraphs(blocks: NotionBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "paragraph") {
      const text = richTextToString((b as ParagraphBlockObjectResponse).paragraph.rich_text);
      if (text.length > 0) parts.push(text);
    }
  }
  return parts.join("\n\n");
}

function collectListItems(
  blocks: NotionBlock[],
  variant: "numbered_list_item" | "bulleted_list_item",
): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === variant) {
      const text =
        variant === "numbered_list_item"
          ? richTextToString((b as NumberedListItemBlockObjectResponse).numbered_list_item.rich_text)
          : richTextToString((b as BulletedListItemBlockObjectResponse).bulleted_list_item.rich_text);
      if (text.trim().length > 0) out.push(text);
    }
  }
  return out;
}

/**
 * Characters are laid out as paragraph blocks like "🦊 Эльза — Снежная королева".
 * Strategy: take the first text token as emoji if it isn't ASCII, then split on
 * em-dash / hyphen for role.
 */
export function parseCharacters(blocks: NotionBlock[]): Character[] {
  const out: Character[] = [];
  for (const b of blocks) {
    if (b.type !== "paragraph") continue;
    const text = richTextToString((b as ParagraphBlockObjectResponse).paragraph.rich_text).trim();
    if (text.length === 0) continue;
    out.push(parseCharacterLine(text));
  }
  return out;
}

function parseCharacterLine(text: string): Character {
  // Pull leading emoji-or-symbol cluster (anything not in the ASCII letters/digits range,
  // up to the first space).
  const headMatch = text.match(/^([^\p{Letter}\p{Number}]+)/u);
  const headRaw = (headMatch?.[1] ?? "").trim();
  const rest = text.slice(headMatch?.[0].length ?? 0).trim();

  // Split "Name — role" / "Name - role".
  const sep = rest.match(/^(.*?)\s*[—\-–]\s*(.*)$/);
  if (sep && sep[1] && sep[2]) {
    return { emoji: headRaw, name: sep[1].trim(), role: sep[2].trim() };
  }
  return { emoji: headRaw, name: rest };
}

function calloutColor(b: NotionBlock): string {
  if (b.type !== "callout") return "";
  return (b as CalloutBlockObjectResponse).callout.color ?? "";
}

function calloutText(b: NotionBlock): string {
  if (b.type !== "callout") return "";
  return richTextToString((b as CalloutBlockObjectResponse).callout.rich_text);
}

function calloutEmoji(b: NotionBlock): string {
  if (b.type !== "callout") return "";
  const icon = (b as CalloutBlockObjectResponse).callout.icon;
  if (icon && icon.type === "emoji") return icon.emoji;
  return "";
}

const DEFAULT_PRICING: PricingBlock = {
  yellowNote: "",
  constructor: { title: "", sub: "" },
  packages: { title: "", sub: "" },
};

export function parsePricing(blocks: NotionBlock[]): PricingBlock {
  const callouts = blocks.filter((b): b is NotionBlock & { type: "callout" } => b.type === "callout");
  if (callouts.length === 0) return DEFAULT_PRICING;

  // Yellow note: first callout with a yellow-ish background color.
  let yellowNote = "";
  let constructorBox = DEFAULT_PRICING.constructor;
  let packagesBox = DEFAULT_PRICING.packages;

  for (const c of callouts) {
    const color = calloutColor(c);
    const text = calloutText(c);
    if (!yellowNote && color.includes("yellow")) {
      yellowNote = text;
      continue;
    }
    // Pair "title · subtitle" — split on " · " or first newline.
    const [title, ...rest] = text.split(/\s*[·\n]\s*/);
    const sub = rest.join(" · ");
    if (text.toLowerCase().includes("конструктор") && !constructorBox.title) {
      constructorBox = { title: title?.trim() ?? text, sub: sub.trim() };
      continue;
    }
    if (
      (text.toLowerCase().includes("простой") ||
        text.toLowerCase().includes("средний") ||
        text.toLowerCase().includes("премиум") ||
        text.toLowerCase().includes("пакет")) &&
      !packagesBox.title
    ) {
      packagesBox = { title: title?.trim() ?? text, sub: sub.trim() };
      continue;
    }
  }

  return { yellowNote, constructor: constructorBox, packages: packagesBox };
}

export function parseMedia(blocks: NotionBlock[]): MediaTile[] {
  const out: MediaTile[] = [];
  for (const b of blocks) {
    if (b.type !== "callout") continue;
    const richText = (b as CalloutBlockObjectResponse).callout.rich_text;
    const text = richTextToString(richText);
    const url = firstUrlFromRichText(richText);
    if (!url) continue; // media tiles must have a link
    const emoji = calloutEmoji(b);
    // Convention: "Title · meta" on a single line.
    const [title, ...metaRest] = text.split(/\s*·\s*/);
    out.push({
      emoji,
      title: (title ?? "").trim() || text,
      url,
      meta: metaRest.join(" · ").trim(),
    });
  }
  return out;
}

// ---------------- Top-level entry ----------------

const EMPTY_CONTENT: ProgramContent = {
  subtitle: "",
  legend: "",
  finale: "",
  activities: [],
  characters: [],
  techRequirements: [],
  pricing: DEFAULT_PRICING,
  media: [],
};

export function parseProgram(blocks: BlockTree[]): ProgramContent {
  if (!blocks || blocks.length === 0) {
    logger.warn({ reason: "empty blocks" }, "parser.empty_input");
    return EMPTY_CONTENT;
  }

  // Drop partial (non-full) blocks defensively; they cannot be narrowed.
  const valid = blocks.filter((b): b is BlockTree => isFullBlock(b));
  const flat = flattenBlocks(valid);
  const sections = splitBySectionHeaders(flat);

  const subtitle = extractSubtitle(flat);

  const legendBlocks = sections.get(SECTION_IDS.LEGEND) ?? [];
  const finaleBlocks = sections.get(SECTION_IDS.FINALE) ?? [];
  const activitiesBlocks = sections.get(SECTION_IDS.ACTIVITIES) ?? [];
  const charactersBlocks = sections.get(SECTION_IDS.CHARACTERS) ?? [];
  const techBlocks = sections.get(SECTION_IDS.TECH_REQUIREMENTS) ?? [];
  const pricingBlocks = sections.get(SECTION_IDS.PRICING) ?? [];
  const mediaBlocks = sections.get(SECTION_IDS.MEDIA) ?? [];

  // Single warn line listing what's missing — quieter at build time than one
  // line per section, but the signal is preserved for triage.
  const missing: string[] = [];
  if (!subtitle) missing.push("subtitle");
  if (legendBlocks.length === 0) missing.push("legend");
  if (finaleBlocks.length === 0) missing.push("finale");
  if (activitiesBlocks.length === 0) missing.push("activities");
  if (charactersBlocks.length === 0) missing.push("characters");
  if (techBlocks.length === 0) missing.push("techRequirements");
  if (pricingBlocks.length === 0) missing.push("pricing");
  if (mediaBlocks.length === 0) missing.push("media");
  if (missing.length > 0) logger.warn({ missing }, "parser.sections_missing");

  return {
    subtitle,
    legend: joinParagraphs(legendBlocks),
    finale: joinParagraphs(finaleBlocks),
    activities: collectListItems(activitiesBlocks, "numbered_list_item"),
    characters: parseCharacters(charactersBlocks),
    techRequirements: collectListItems(techBlocks, "bulleted_list_item"),
    pricing: parsePricing(pricingBlocks),
    media: parseMedia(mediaBlocks),
  };
}
