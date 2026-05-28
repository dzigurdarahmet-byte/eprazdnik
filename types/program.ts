// Domain models — independent of Notion SDK types, suitable for components/tests.

export type ProgramSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;            // short tagline / sub
  coverEmoji: string;          // single emoji to seed the visual cover
  coverKind: string;           // cover variant key (matches proto/covers.jsx)
  tags: string[];              // multi_select tags
  category: string;            // primary category for filtering
  audience: "B2C" | "B2B" | "OTHER";
  ageRange: string;            // e.g. "5–12"
  duration: string;            // e.g. "1,5 ч"
  guests: string;              // e.g. "до 50"
  priceFrom: number | null;    // numeric, in ₽; null if unknown
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
  constructor: { title: string; sub: string };
  packages: { title: string; sub: string };
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
};

export type ProgramDetail = ProgramSummary & {
  content: ProgramContent;
};
