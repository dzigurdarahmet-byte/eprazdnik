import { describe, it, expect } from "vitest";
import { parseProgram } from "@/lib/notion/parser";
import {
  heading2,
  heading3,
  paragraph,
  bullet,
  numbered,
  callout,
  column,
  columnList,
  heading1,
} from "@/tests/fixtures/blocks";

// Helper: build a realistic 3-column-pair program structure (per spec §4.2).
function fullProgramBlocks() {
  return [
    heading2("Тайна кристаллов Эренделла"),
    columnList([
      column([
        heading3("01 Легенда"),
        paragraph("В королевстве случилась беда."),
        paragraph("Только дети могут вернуть магию."),
        heading3("02 Финал"),
        paragraph("Встреча со Снежной королевой."),
      ]),
      column([
        heading3("03 Активности"),
        numbered("Оленья тропа"),
        numbered("Ледяной страж"),
        numbered("Магический урок"),
      ]),
    ]),
    columnList([
      column([
        heading3("04 Персонажи"),
        paragraph("🧊 Эльза — Снежная королева"),
        paragraph("👑 Анна — принцесса Эренделла"),
        paragraph("⛏️ Кристофф — горный проводник"),
      ]),
      column([
        heading3("05 Технические требования"),
        bullet("Зал от 60 м²"),
        bullet("Розетки 220В"),
        bullet("Свободный въезд для крио-машины"),
      ]),
    ]),
    columnList([
      column([
        heading3("06 Расчёт"),
        callout("Все цены указаны без НДС", { color: "yellow_background" }),
        callout("Конструктор · собери свой пакет"),
        callout("Простой · Средний · Премиум"),
      ]),
      column([
        heading3("07 Медиа"),
        callout("Видео-демо · 1:24", { emoji: "🎬", href: "https://disk.yandex.ru/video-demo" }),
        callout("Фото-сет 2025 · 48 фото", { emoji: "📷", href: "https://disk.yandex.ru/photo-set" }),
      ]),
    ]),
    // Sections that must be ignored.
    heading1("08 Творческий отдел"),
    paragraph("Менеджеры творческого отдела (не для сайта)."),
    heading1("10 Элементы программы"),
    bullet("Не показывать (1)"),
    bullet("Не показывать (2)"),
  ];
}

describe("parseProgram", () => {
  it("extracts subtitle from heading_2", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.subtitle, "subtitle taken from first heading_2").toBe("Тайна кристаллов Эренделла");
  });

  it("collects legend paragraphs into a single string", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.legend, "legend should contain both paragraphs").toContain("случилась беда");
    expect(result.legend).toContain("вернуть магию");
  });

  it("parses finale text from its own section", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.finale, "finale collected").toBe("Встреча со Снежной королевой.");
  });

  it("parses activities as ordered string list", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.activities, "all 3 activities").toEqual([
      "Оленья тропа",
      "Ледяной страж",
      "Магический урок",
    ]);
  });

  it("parses characters with emoji + name + role split", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.characters.length, "3 characters").toBe(3);
    expect(result.characters[0], "Эльза with emoji and role").toEqual({
      emoji: "🧊",
      name: "Эльза",
      role: "Снежная королева",
    });
    expect(result.characters[1]?.name).toBe("Анна");
    expect(result.characters[2]?.role).toBe("горный проводник");
  });

  it("parses technical requirements as bulleted list", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.techRequirements, "3 tech reqs").toEqual([
      "Зал от 60 м²",
      "Розетки 220В",
      "Свободный въезд для крио-машины",
    ]);
  });

  it("captures yellow callout as pricing.yellowNote", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.pricing.yellowNote, "yellow note text").toBe("Все цены указаны без НДС");
  });

  it("captures constructor callout into pricing.constructor", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.pricing.constructor.title, "constructor title").toBe("Конструктор");
    expect(result.pricing.constructor.sub).toBe("собери свой пакет");
  });

  it("captures packages callout into pricing.packages", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.pricing.packages.title, "packages title").toBe("Простой");
    expect(result.pricing.packages.sub).toContain("Средний");
    expect(result.pricing.packages.sub).toContain("Премиум");
  });

  it("parses media callouts with link annotation and emoji", () => {
    const result = parseProgram(fullProgramBlocks());
    expect(result.media.length, "2 media tiles").toBe(2);
    expect(result.media[0]).toEqual({
      emoji: "🎬",
      title: "Видео-демо",
      url: "https://disk.yandex.ru/video-demo",
      meta: "1:24",
    });
    expect(result.media[1]?.url).toBe("https://disk.yandex.ru/photo-set");
  });

  it("returns full defaults (no throw) for empty input", () => {
    const result = parseProgram([]);
    expect(result.subtitle, "subtitle default empty").toBe("");
    expect(result.legend).toBe("");
    expect(result.activities, "activities default []").toEqual([]);
    expect(result.characters, "characters default []").toEqual([]);
    expect(result.media, "media default []").toEqual([]);
    expect(result.pricing.yellowNote, "yellowNote default empty").toBe("");
  });

  it("does NOT throw and returns defaults when only the «08 Творческий отдел» heading exists", () => {
    const result = parseProgram([heading1("08 Творческий отдел"), paragraph("foo")]);
    expect(result.subtitle).toBe("");
    expect(result.legend).toBe("");
    expect(result.activities).toEqual([]);
  });

  it("ignores «08 Творческий отдел» content from public output", () => {
    const result = parseProgram(fullProgramBlocks());
    // The activities/legend/etc. fields must not have leaked text from sections 08/10.
    expect(result.legend, "legend free of dept content").not.toContain("Менеджеры");
    expect(result.activities, "activities free of section 10").not.toContain("Не показывать (1)");
    expect(result.techRequirements, "techRequirements free of section 10").not.toContain("Не показывать (1)");
  });
});
