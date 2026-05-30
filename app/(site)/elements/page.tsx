// /elements — библиотека «🧩 Элементы» (§4.8). Read-only, ISR.
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ElementsView } from "@/components/elements/ElementsView";
import { listElements } from "@/lib/notion/elements";
import { REVALIDATE_SECONDS } from "@/lib/constants";

export const revalidate = REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Элементы — Е-Праздник",
  description: "Библиотека элементов: артисты, ростовые куклы, шоу, спецэффекты, расходники.",
};

function pick(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function ElementsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const elements = await listElements();
  const initialCategory = pick(searchParams?.cat ?? searchParams?.category);

  return (
    <div className="catalog-wrap">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Элементы" }]} />
      <div className="cat-eyebrow">библиотека · gallery view</div>
      <h1 className="catalog-h1">Элементы</h1>
      <div className="catalog-desc">
        {elements.length} элементов: артисты, ростовые куклы, шоу, спецэффекты, активности и
        расходники. Фильтруйте по категории или ищите по названию.
      </div>
      <ElementsView elements={elements} initialCategory={initialCategory} />
    </div>
  );
}
