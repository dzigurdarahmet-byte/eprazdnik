// /catalog — server-rendered listing of every program in Notion (templates
// already filtered out by listPrograms). The client-side filter UI is
// delegated to CatalogContent.
import type { Metadata } from "next";
import { CatalogContent } from "@/components/CatalogContent";
import { Hero } from "@/components/Hero";
import { listPrograms } from "@/lib/notion/programs";
import { REVALIDATE_SECONDS } from "@/lib/constants";

export const revalidate = REVALIDATE_SECONDS;
// Don't prerender at build time — Notion API rate limits make build-time
// data fetching brittle. ISR keeps the first user request warm for 60s.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог программ — Е-Праздник",
  description: "Все программы агентства Е-Праздник: сюжетные шоу, квесты, мастер-классы.",
};

export default async function CatalogPage() {
  const programs = await listPrograms();
  return (
    <div className="page-enter">
      <Hero
        title="Каталог услуг"
        subtitle={`${programs.length} программ и шоу для любого формата мероприятия.`}
        totalPrograms={programs.length}
      />
      <CatalogContent programs={programs} />
    </div>
  );
}
