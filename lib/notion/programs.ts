// High-level Notion queries for programs.
// Every public function returns domain types (ProgramSummary / ProgramDetail) —
// no raw Notion shapes leak past this module.
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

type QueryResultItem =
  | PageObjectResponse
  | PartialPageObjectResponse
  | DatabaseObjectResponse
  | PartialDatabaseObjectResponse;

import { notion, DB_PROGRAMS } from "@/lib/notion/client";
import { TEMPLATE_TITLE_PREFIX } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { slugify } from "@/lib/slugify";
import {
  NotionError,
  NotionRateLimitError,
  ProgramNotFoundError,
} from "@/lib/notion/errors";
import { isFullBlock } from "@/types/notion";
import type { ProgramDetail, ProgramSummary } from "@/types/program";
import { parseProgram, type BlockTree } from "@/lib/notion/parser";
import {
  findTitle,
  normalizeAudience,
  readMultiSelect,
  readNumberProp,
  readPageEmoji,
  readRichTextProp,
  readSelect,
} from "@/lib/notion/properties";

// Cover kind is derived from the title/tags so the visual matches the proto
// without requiring a new Notion property the client must maintain.
function deriveCoverKind(title: string, tags: string[]): string {
  const haystack = (title + " " + tags.join(" ")).toLowerCase();
  if (haystack.includes("холод") || haystack.includes("эльз") || haystack.includes("ice")) return "ice";
  if (haystack.includes("маги") || haystack.includes("волшеб")) return "arcane";
  if (haystack.includes("супергер") || haystack.includes("hero")) return "hero";
  if (haystack.includes("тесла") || haystack.includes("молни")) return "tesla";
  if (haystack.includes("бумаж") || haystack.includes("paper")) return "paper";
  if (haystack.includes("неон")) return "neon";
  if (haystack.includes("крио") || haystack.includes("cryo")) return "cryo";
  if (haystack.includes("хим") || haystack.includes("опыт")) return "chemistry";
  if (haystack.includes("слайм") || haystack.includes("slime")) return "slime";
  if (haystack.includes("форт") || haystack.includes("боярд") || haystack.includes("приключ")) return "adventure";
  if (haystack.includes("принцесс")) return "princess";
  if (haystack.includes("алис") || haystack.includes("чаепит")) return "whimsy";
  if (haystack.includes("баг") || haystack.includes("божья") || haystack.includes("ladybug")) return "ladybug";
  if (haystack.includes("индей")) return "adventure";
  return "purple";
}

function isFullPage(p: QueryResultItem): p is PageObjectResponse {
  return p.object === "page" && "properties" in p;
}

export function pageToSummary(page: PageObjectResponse): ProgramSummary {
  const title = findTitle(page);
  const subtitle = readRichTextProp(page, ["Подзаголовок", "Sub", "Subtitle"]);
  const tags = readMultiSelect(page, ["Теги", "Tags"]);
  const category = readSelect(page, ["Категория", "Category", "Тип"]);
  const audienceRaw = readSelect(page, ["B2B/B2C", "Аудитория", "Тип клиента"]);
  const ageRange = readRichTextProp(page, ["Возраст", "Age"]);
  const duration = readRichTextProp(page, ["Длительность", "Duration"]);
  const guests = readRichTextProp(page, ["Гости", "Guests"]);
  const priceFrom = readNumberProp(page, ["Цена от", "Price", "Стоимость"]);

  return {
    id: page.id,
    slug: slugify(title),
    title,
    subtitle,
    coverEmoji: readPageEmoji(page),
    coverKind: deriveCoverKind(title, tags),
    tags,
    category,
    audience: normalizeAudience(audienceRaw),
    ageRange,
    duration,
    guests,
    priceFrom,
  };
}

function classifyError(err: unknown): NotionError {
  if (err instanceof NotionError) return err;
  const e = err as { code?: string; status?: number; message?: string; headers?: Record<string, string> };
  if (e.code === "rate_limited" || e.status === 429) {
    const retryAfter = Number(e.headers?.["retry-after"]) || undefined;
    return new NotionRateLimitError(retryAfter);
  }
  return new NotionError(e.message ?? "Unknown Notion error", err);
}

/** Fetch all child blocks under a block id, recursively. Defensive against partials. */
async function fetchBlockTree(blockId: string): Promise<BlockTree[]> {
  const out: BlockTree[] = [];
  let cursor: string | undefined = undefined;
  do {
    const resp = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const raw of resp.results) {
      if (!isFullBlock(raw)) continue;
      const node: BlockTree = raw;
      if (raw.has_children) {
        node.children = await fetchBlockTree(raw.id);
      }
      out.push(node);
    }
    cursor = resp.next_cursor ?? undefined;
  } while (cursor);
  return out;
}

export async function listPrograms(): Promise<ProgramSummary[]> {
  const start = Date.now();
  try {
    const results: PageObjectResponse[] = [];
    let cursor: string | undefined = undefined;
    do {
      const resp = await notion.databases.query({
        database_id: DB_PROGRAMS,
        start_cursor: cursor,
        page_size: 100,
      });
      for (const page of resp.results) {
        if (isFullPage(page)) results.push(page);
      }
      cursor = resp.next_cursor ?? undefined;
    } while (cursor);

    const summaries = results
      .map(pageToSummary)
      .filter((s) => s.title.length > 0 && !s.title.startsWith(TEMPLATE_TITLE_PREFIX))
      .sort((a, b) => a.title.localeCompare(b.title, "ru"));

    logger.info({ count: summaries.length, durationMs: Date.now() - start }, "programs.list.ok");
    return summaries;
  } catch (err) {
    const wrapped = classifyError(err);
    logger.error({ err: wrapped.message, name: wrapped.name }, "programs.list.fail");
    throw wrapped;
  }
}

export async function getProgram(pageId: string): Promise<ProgramDetail> {
  const start = Date.now();
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (page.object !== "page" || !("properties" in page)) {
      throw new NotionError(`Partial page returned for ${pageId}`);
    }
    const summary = pageToSummary(page);
    const blocks = await fetchBlockTree(page.id);
    const content = parseProgram(blocks);
    logger.info({ pageId, durationMs: Date.now() - start }, "programs.get.ok");
    return { ...summary, content };
  } catch (err) {
    const wrapped = classifyError(err);
    logger.error({ err: wrapped.message, pageId, name: wrapped.name }, "programs.get.fail");
    throw wrapped;
  }
}

export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null> {
  const all = await listPrograms();
  const match = all.find((p) => p.slug === slug);
  if (!match) {
    logger.warn({ slug }, "programs.slug.not_found");
    return null;
  }
  return getProgram(match.id);
}

/** Throwing variant used by page components that should hit not-found.tsx when missing. */
export async function getProgramBySlugOrThrow(slug: string): Promise<ProgramDetail> {
  const found = await getProgramBySlug(slug);
  if (!found) throw new ProgramNotFoundError(slug);
  return found;
}
