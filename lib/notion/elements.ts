// High-level Notion queries for the «🧩 Элементы авторских программ» library.
// Returns domain ElementSummary only — no raw Notion shapes leak past here.
import * as React from "react";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { notion, DB_ELEMENTS } from "@/lib/notion/client";
import { isHiddenTitle } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { slugify } from "@/lib/slugify";
import { deriveAccent } from "@/lib/accent";
import { NotionError, NotionRateLimitError } from "@/lib/notion/errors";
import { throttle } from "@/lib/notion/throttle";
import { fetchBlockTree, listPrograms } from "@/lib/notion/programs";
import { parseElement } from "@/lib/notion/parser";
import type { ElementDetail, ElementSummary, UsedInProgram } from "@/types/element";
import {
  findTitle,
  readCoverImage,
  readMultiSelect,
  readNumberProp,
  readRelation,
  readSelect,
} from "@/lib/notion/properties";

const COVER_PROPS = ["Фото", "Обложка", "Cover", "Изображение"];

type QueryResultItem =
  | PageObjectResponse
  | PartialPageObjectResponse
  | DatabaseObjectResponse
  | PartialDatabaseObjectResponse;

function isFullPage(p: QueryResultItem): p is PageObjectResponse {
  return p.object === "page" && "properties" in p;
}

const REL_PROGRAMS = ["Используется в программах", "Программы"];

export function elementToSummary(page: PageObjectResponse): ElementSummary {
  const title = findTitle(page);
  const { accent, tint } = deriveAccent(title);
  return {
    id: page.id,
    slug: slugify(title),
    title,
    category: readSelect(page, ["Категория", "Category"]),
    status: readSelect(page, ["Статус", "Status"]),
    tags: readMultiSelect(page, ["Теги", "Tags"]),
    priceFrom: readNumberProp(page, ["Цена от", "Price", "Стоимость"]),
    coverImage: readCoverImage(page, COVER_PROPS),
    accent,
    tint,
    relatedProgramIds: readRelation(page, REL_PROGRAMS),
  };
}

type CacheWrap = <Args extends readonly unknown[], R>(fn: (...args: Args) => R) => (...args: Args) => R;
const cache: CacheWrap =
  typeof React.cache === "function"
    ? (React.cache as unknown as CacheWrap)
    : ((fn) => fn);

function classifyError(err: unknown): NotionError {
  if (err instanceof NotionError) return err;
  const e = err as { code?: string; status?: number; message?: string; headers?: Record<string, string> };
  if (e.code === "rate_limited" || e.status === 429) {
    const retryAfter = Number(e.headers?.["retry-after"]) || undefined;
    return new NotionRateLimitError(retryAfter);
  }
  return new NotionError(e.message ?? "Unknown Notion error", err);
}

export const listElements = cache(_listElements);
async function _listElements(): Promise<ElementSummary[]> {
  const start = Date.now();
  try {
    const results: PageObjectResponse[] = [];
    let cursor: string | undefined = undefined;
    do {
      const resp = await throttle(() =>
        notion.databases.query({
          database_id: DB_ELEMENTS,
          start_cursor: cursor,
          page_size: 100,
        }),
      );
      for (const page of resp.results) {
        if (isFullPage(page)) results.push(page);
      }
      cursor = resp.next_cursor ?? undefined;
    } while (cursor);

    const summaries = results
      .map(elementToSummary)
      .filter((e) => !isHiddenTitle(e.title))
      .sort((a, b) => a.title.localeCompare(b.title, "ru"));

    logger.info({ count: summaries.length, durationMs: Date.now() - start }, "elements.list.ok");
    return summaries;
  } catch (err) {
    const wrapped = classifyError(err);
    logger.error({ err: wrapped.message, name: wrapped.name }, "elements.list.fail");
    throw wrapped;
  }
}

/** Elements linked to a given program (via the relation), read-only (§4.7 note). */
export const getElementsForProgram = cache(_getElementsForProgram);
async function _getElementsForProgram(programId: string): Promise<ElementSummary[]> {
  const all = await listElements();
  return all.filter((e) => e.relatedProgramIds.includes(programId));
}

/** Full element detail: body parse + reverse relation «используется в программах» (v4). */
export const getElementBySlug = cache(_getElementBySlug);
async function _getElementBySlug(slug: string): Promise<ElementDetail | null> {
  const all = await listElements();
  const match = all.find((e) => e.slug === slug);
  if (!match) {
    logger.warn({ slug }, "elements.slug.not_found");
    return null;
  }
  try {
    const blocks = await fetchBlockTree(match.id);
    const content = parseElement(blocks);
    if (!content.photo) content.photo = match.coverImage;

    const programs = await listPrograms();
    const usedInPrograms: UsedInProgram[] = match.relatedProgramIds
      .map((id) => programs.find((p) => p.id === id))
      .filter((p): p is (typeof programs)[number] => Boolean(p))
      .map((p) => ({ title: p.title, slug: p.slug, accent: p.accent }));

    return { ...match, content, usedInPrograms };
  } catch (err) {
    const wrapped = classifyError(err);
    logger.error({ err: wrapped.message, slug, name: wrapped.name }, "elements.get.fail");
    throw wrapped;
  }
}
