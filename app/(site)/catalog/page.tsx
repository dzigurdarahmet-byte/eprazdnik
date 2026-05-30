// /catalog — порт proto-notion/screen_programs.jsx. ISR; фильтры/поиск клиентские.
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogView } from "@/components/catalog/CatalogView";
import { listPrograms } from "@/lib/notion/programs";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import type { FilterState } from "@/lib/catalog-filter";

export const revalidate = REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Программы — Е-Праздник",
  description: "Каталог программ агентства: сюжетные шоу, квесты, мастер-классы.",
};

function pick(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const programs = await listPrograms();
  const initial: Partial<FilterState> = {
    format: pick(searchParams?.format),
    category: pick(searchParams?.category ?? searchParams?.cat),
    audience: pick(searchParams?.audience),
  };

  return (
    <div className="catalog-wrap">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Программы" }]} />
      <div className="cat-eyebrow">каталог · gallery view</div>
      <h1 className="catalog-h1">Программы</h1>
      <div className="catalog-desc">
        {programs.length} программ и услуг. Фильтруйте по формату, категории, статусу и аудитории —
        или ищите по названию.
      </div>
      <CatalogView programs={programs} initial={initial} />
    </div>
  );
}
