// Domain models — independent of Notion SDK types, suitable for components/tests.

export type ProgramSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;            // short tagline / sub
  coverEmoji: string;          // single emoji to seed the visual cover
  coverKind: string;           // cover variant key (matches proto/covers.jsx)
  coverImage: string;          // обложка/фото (свойство Фото → page.cover), "" если нет
  accent: string;              // solid accent color (proto palette, derived)
  tint: string;                // soft tint background paired with accent
  tags: string[];              // multi_select tags
  category: string;            // Категория (select)
  format: string;              // Формат (select) — тип услуги (§0.5)
  groupSize: string[];         // Размер группы (multi_select)
  status: string;              // Статус (select), raw — mapped to badge in UI
  audience: "B2C" | "B2B" | "OTHER";
  ageRange: string;            // e.g. "5–12"
  duration: string;            // e.g. "1,5 ч"
  guests: string;              // e.g. "до 50"
  priceFrom: number | null;    // numeric, in ₽; null if unknown
  relatedElementIds: string[]; // relation → Элементы
};

export type Character = {
  emoji: string;
  name: string;
  role?: string;
};

export type MediaTile = {
  emoji: string;
  title: string;
  url: string;
  meta: string;
};

export type PricingBlock = {
  yellowNote: string;
  sheetUrl: string;            // Google Sheets конструктора (свойство/блок), "" если не заведён
  constructor: { title: string; sub: string };
  packages: { title: string; sub: string };
};

// Скрипты продаж / Кейсы (§4.6a): либо ссылки-плитки, либо текстовые блоки.
export type ContentLink = { title: string; url: string; meta: string };
export type LinkOrTextSection = {
  links: ContentLink[];
  paragraphs: string[];
};

export type ProgramContent = {
  subtitle: string;
  legend: string;
  finale: string;
  activities: string[];
  characters: Character[];
  techRequirements: string[];
  pricing: PricingBlock;
  media: MediaTile[];
  creative: LinkOrTextSection;
  scripts: LinkOrTextSection;
  cases: LinkOrTextSection;
};

export type ProgramDetail = ProgramSummary & {
  content: ProgramContent;
};
