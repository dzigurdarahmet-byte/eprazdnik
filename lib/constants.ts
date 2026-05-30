// Magic-string + magic-number central registry.

// Pages with a title starting with this marker are excluded from the public catalog.
export const TEMPLATE_TITLE_PREFIX = "[ШАБЛОН]";

// Preview/test rows (e.g. "🧪 Индейский квест — превью шапки") must never leak
// into the catalog. Code-level filter is belt-and-suspenders next to the manual
// Notion archival (§4.11).
export const TEST_TITLE_PREFIX = "🧪";

/** True if a title is a template or test/preview row that must stay hidden. */
export function isHiddenTitle(title: string): boolean {
  const t = title.trim();
  if (t.length === 0) return true;
  return t.startsWith(TEMPLATE_TITLE_PREFIX) || t.startsWith(TEST_TITLE_PREFIX);
}

// ISR revalidation window for Notion-backed pages. 60s is the project default.
export const REVALIDATE_SECONDS = 60;

// Notion fetch cache tags — used for targeted on-demand revalidation.
export const CACHE_TAG_PROGRAMS = "notion:programs";
export const cacheTagProgram = (id: string): string => `notion:program:${id}`;

// Stable section ids used by the parser to bucket Notion blocks.
// Heading text varies across programs ("01 Легенда" vs "Легенда" vs "📖 Легенда"),
// so matching is keyword-regex-based — see SECTION_MATCHERS below.
export const SECTION_IDS = {
  LEGEND: "LEGEND",
  FINALE: "FINALE",
  ACTIVITIES: "ACTIVITIES",
  CHARACTERS: "CHARACTERS",
  TECH_REQUIREMENTS: "TECH_REQUIREMENTS",
  PRICING: "PRICING",
  MEDIA: "MEDIA",
  SCRIPTS: "SCRIPTS",
  CASES: "CASES",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

// Order matters: more specific patterns first so e.g. "Технические требования"
// doesn't get swallowed by a broader rule.
export const SECTION_MATCHERS: ReadonlyArray<{ id: SectionId; pattern: RegExp }> = [
  { id: "TECH_REQUIREMENTS", pattern: /техническ|требован/i },
  { id: "LEGEND", pattern: /леген/i },
  { id: "FINALE", pattern: /финал/i },
  { id: "ACTIVITIES", pattern: /активн|что\s+вход|состав\s+программ/i },
  { id: "CHARACTERS", pattern: /персонаж|геро[йи]/i },
  { id: "PRICING", pattern: /расч[её]т|цен|стоимост/i },
  { id: "MEDIA", pattern: /медиа|видео|фото|материал/i },
  { id: "SCRIPTS", pattern: /скрипт/i },
  { id: "CASES", pattern: /кейс/i },
];

// Sections that must NEVER be exposed publicly even if their headings match.
// Recognised so the parser resets the cursor and following blocks aren't leaked.
export const IGNORED_SECTION_PATTERNS: readonly RegExp[] = [
  /творческ/i,
  /элемент.*программ/i,
];
