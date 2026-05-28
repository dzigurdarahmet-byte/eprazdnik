// Magic-string + magic-number central registry.

// Pages with a title starting with this marker are excluded from the public catalog.
export const TEMPLATE_TITLE_PREFIX = "[ШАБЛОН]";

// ISR revalidation window for Notion-backed pages. 60s is the project default.
export const REVALIDATE_SECONDS = 60;

// Notion fetch cache tags — used for targeted on-demand revalidation.
export const CACHE_TAG_PROGRAMS = "notion:programs";
export const cacheTagProgram = (id: string): string => `notion:program:${id}`;

// Notion column-list section headings (must match the source DB exactly).
export const NOTION_SECTIONS = {
  LEGEND: "01 Легенда",
  FINALE: "02 Финал",
  ACTIVITIES: "03 Активности",
  CHARACTERS: "04 Персонажи",
  TECH_REQUIREMENTS: "05 Технические требования",
  PRICING: "06 Расчёт",
  MEDIA: "07 Медиа",
  // The two trailing sections below are explicitly NOT rendered on the public site.
  CREATIVE_DEPT: "08 Творческий отдел",
  PROGRAM_ELEMENTS: "10 Элементы программы",
} as const;
