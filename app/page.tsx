// Home page. Server component. Pulls the full program list so the hero counter
// is live ("N программ", AC §7) and the "Recent" grid shows real cards.
import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { ProgramCard } from "@/components/ProgramCard";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { listPrograms } from "@/lib/notion/programs";

export const revalidate = REVALIDATE_SECONDS;
// Notion API rate-limits force on-demand rendering; ISR provides the
// fast-path cache after first hit (see ADR in program/[slug]/page.tsx).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Е-Праздник — каталог детских и корпоративных программ",
  description:
    "Сюжетные шоу, квесты, мастер-классы и крио-шоу. Подробное описание каждой программы и расчёт стоимости.",
};

type QuickAction = {
  href: string;
  ico: "library" | "compass" | "send" | "flame";
  cls: "qa--purple" | "qa--pink" | "qa--amber" | "qa--cyan";
  title: string;
  meta: string;
};

const QA: QuickAction[] = [
  { href: "/catalog", ico: "library", cls: "qa--pink", title: "Каталог программ", meta: "Полный список" },
  { href: "/catalog", ico: "compass", cls: "qa--purple", title: "Подбор по формату", meta: "Шоу · Квест · МК" },
  { href: "/catalog", ico: "send", cls: "qa--amber", title: "Отправить клиенту", meta: "Готовые подборки" },
  { href: "/catalog", ico: "flame", cls: "qa--cyan", title: "Популярное", meta: "Хиты сезона" },
];

export default async function HomePage() {
  const programs = await listPrograms();
  const recent = programs.slice(0, 4);

  return (
    <div className="page-enter">
      <Hero
        title="Е-Праздник"
        subtitle="Каталог авторских праздничных программ — сюжетные шоу, квесты, мастер-классы."
        totalPrograms={programs.length}
      />

      <div className="qa-grid">
        {QA.map((q) => (
          <Link key={q.title} href={q.href} className={"qa " + q.cls}>
            <div className="qa-arrow"><Icon n="arrow-up-right" size={18} /></div>
            <div className="qa-ico"><Icon n={q.ico} size={20} /></div>
            <div>
              <div className="qa-title">{q.title}</div>
              <div className="qa-meta">{q.meta}</div>
            </div>
          </Link>
        ))}
      </div>

      {recent.length > 0 ? (
        <>
          <div className="sec-head">
            <div className="sec-title">
              <span className="ico"><Icon n="sparkles" size={18} /></span>
              Свежие программы
            </div>
            <Link className="sec-link" href="/catalog">
              Весь каталог <Icon n="arrow-right" size={13} />
            </Link>
          </div>
          <div className="cards-grid">
            {recent.map((p) => (
              <ProgramCard key={p.id} p={p} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
