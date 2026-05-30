// Domain model for the «🧩 Элементы авторских программ» library (§4.8).
export type ElementSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;            // Категория (select)
  status: string;              // Статус (select), raw — mapped to badge in UI
  tags: string[];              // Теги (multi_select)
  priceFrom: number | null;    // Цена от (number)
  accent: string;
  tint: string;
  relatedProgramIds: string[]; // relation → Программы (Используется в программах)
};
