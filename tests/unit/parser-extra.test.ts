import { describe, it, expect } from "vitest";
import { parseProgram, parsePricing, parseLinkOrText } from "@/lib/notion/parser";
import { isHiddenTitle } from "@/lib/constants";
import {
  heading2,
  paragraph,
  paragraphLink,
  bookmark,
  callout,
} from "@/tests/fixtures/blocks";

const SHEET = "https://docs.google.com/spreadsheets/d/abc/edit";

describe("isHiddenTitle", () => {
  it("hides templates and test/preview rows", () => {
    expect(isHiddenTitle("[ШАБЛОН] Программа")).toBe(true);
    expect(isHiddenTitle("🧪 Индейский квест — превью шапки")).toBe(true);
    expect(isHiddenTitle("")).toBe(true);
    expect(isHiddenTitle("Холодное Сердце")).toBe(false);
  });
});

describe("parsePricing — sheetUrl", () => {
  it("picks up a Google Sheets bookmark in the pricing section", () => {
    const pricing = parsePricing([
      callout("Цены ведутся в Google Sheets", { color: "yellow_background" }),
      bookmark(SHEET, "Конструктор"),
    ]);
    expect(pricing.sheetUrl).toBe(SHEET);
    expect(pricing.yellowNote).toContain("Google Sheets");
  });

  it("leaves sheetUrl empty when no sheet link is present", () => {
    const pricing = parsePricing([callout("Без ссылки", { color: "yellow_background" })]);
    expect(pricing.sheetUrl).toBe("");
  });
});

describe("parseLinkOrText", () => {
  it("collects bookmark/link tiles", () => {
    const section = parseLinkOrText([
      bookmark("https://disk.yandex.ru/d/x", "Скрипт продаж · PDF"),
      paragraphLink("Открыть кейс", "https://docs.google.com/document/d/y"),
    ]);
    expect(section.links).toHaveLength(2);
    expect(section.links[0]).toMatchObject({ url: "https://disk.yandex.ru/d/x" });
    expect(section.paragraphs).toEqual([]);
  });

  it("collects plain-text paragraphs", () => {
    const section = parseLinkOrText([paragraph("Звоните и продавайте."), paragraph("Второй абзац.")]);
    expect(section.links).toEqual([]);
    expect(section.paragraphs).toEqual(["Звоните и продавайте.", "Второй абзац."]);
  });

  it("is empty for no blocks", () => {
    expect(parseLinkOrText([])).toEqual({ links: [], paragraphs: [] });
  });
});

describe("parseProgram — scripts / cases / sheet", () => {
  it("routes sections by heading and detects the sheet link", () => {
    const content = parseProgram([
      heading2("05 Расчёт"),
      bookmark(SHEET),
      heading2("Скрипты продаж"),
      bookmark("https://disk.yandex.ru/d/script", "Скрипт"),
      heading2("Кейсы"),
      paragraph("Сделали праздник на 200 человек."),
    ]);
    expect(content.pricing.sheetUrl).toBe(SHEET);
    expect(content.scripts.links).toHaveLength(1);
    expect(content.cases.paragraphs).toEqual(["Сделали праздник на 200 человек."]);
  });

  it("leaves scripts/cases empty when their headings are absent", () => {
    const content = parseProgram([heading2("Легенда"), paragraph("Жили-были.")]);
    expect(content.scripts).toEqual({ links: [], paragraphs: [] });
    expect(content.cases).toEqual({ links: [], paragraphs: [] });
  });

  it("parses the «Творческий блок» section (no longer ignored)", () => {
    const content = parseProgram([
      heading2("Творческий блок"),
      paragraph("Реквизит и костюмы под ключ."),
      bookmark("https://disk.yandex.ru/d/creative", "Мудборд"),
    ]);
    expect(content.creative.paragraphs).toEqual(["Реквизит и костюмы под ключ."]);
    expect(content.creative.links).toHaveLength(1);
  });

  it("still ignores the body «Элементы программы» section (rendered from relation instead)", () => {
    const content = parseProgram([heading2("Элементы программы"), paragraph("Это не должно протечь.")]);
    expect(content.legend).toBe("");
    expect(content.creative).toEqual({ links: [], paragraphs: [] });
  });
});
