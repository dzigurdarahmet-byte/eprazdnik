// Domain model for the «🧩 Элементы авторских программ» library (§4.8 / v4).
export type ElementSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;            // Категория (select)
  status: string;              // Статус (select), raw — mapped to badge in UI
  tags: string[];              // Теги (multi_select)
  priceFrom: number | null;    // Цена от (number)
  coverImage: string;          // обложка/фото (свойство → page.cover), "" если нет
  accent: string;
  tint: string;
  relatedProgramIds: string[]; // relation → Программы (Используется в программах)
};

export type ElementContent = {
  description: string[];       // параграфы описания
  techRequirements: string[];  // тех.требования (если есть)
  photo: string;               // первая картинка из тела (fallback к coverImage)
};

export type UsedInProgram = { title: string; slug: string; accent: string };

export type ElementDetail = ElementSummary & {
  content: ElementContent;
  usedInPrograms: UsedInProgram[];
};
