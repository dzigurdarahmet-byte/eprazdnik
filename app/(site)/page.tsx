// Главная — порт proto-notion/screen_home.jsx. Server component, ISR (revalidate
// из layout/constants). Counts живые из Notion (§4.4).
import type { Metadata } from "next";
import Link from "next/link";
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { listPrograms } from "@/lib/notion/programs";
import { listElements } from "@/lib/notion/elements";
import { REVALIDATE_SECONDS } from "@/lib/constants";

export const revalidate = REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Е-Праздник — каталог программ",
  description: "Внутренний справочник программ, шоу и мастер-классов для менеджеров.",
};

function isB2B(tags: string[], audience: string): boolean {
  return audience === "B2B" || tags.some((t) => /b2b/i.test(t));
}

export default async function HomePage() {
  const [programs, elements] = await Promise.all([listPrograms(), listElements()]);
  const b2bCount = programs.filter((p) => isB2B(p.tags, p.audience)).length;
  const recents = programs.slice(0, 6);

  const quickCards = [
    { href: "/catalog", icon: "catalog", count: programs.length, label: "Все программы", sub: "Каталог сюжетных программ" },
    { href: "/elements", icon: "elements", count: elements.length, label: "Элементы и доп.услуги", sub: "Библиотека элементов" },
    { href: "/catalog?audience=B2B", icon: "b2b", count: b2bCount, label: "B2B-каталог", sub: "Корпоративные мероприятия" },
  ];

  return (
    <div className="home-wrap">
      <div className="eyebrow">справочник · каталог услуг</div>
      <h1 className="home-h1">
        Е-Праздник.
        <br />
        <span className="muted">Каталог программ.</span>
      </h1>
      <p className="home-lead">
        Единая база программ, шоу и мастер-классов. Менеджер собирает заказ за&nbsp;30 секунд: открыл
        карточку — взял описание, медиа и&nbsp;цену из&nbsp;расчёта.
      </p>

      <div className="qa3-grid">
        {quickCards.map((c) => (
          <Link key={c.label} href={c.href} className="qa3">
            <div className="qa3-top">
              <IconSlot name={c.icon} size={32} accent="var(--text-muted)" tint="var(--bg-soft)" />
              <span className="qa3-count">{c.count}</span>
            </div>
            <div>
              <div className="qa3-label">{c.label}</div>
              <div className="qa3-sub">{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {recents.length > 0 ? (
        <>
          <div className="recent-head">
            <h2>Недавно открытые</h2>
            <Link className="recent-link" href="/catalog">
              Все программы →
            </Link>
          </div>
          <div className="recent-grid">
            {recents.map((p, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const borderRight = col < 2 ? "1px solid var(--border)" : "none";
              const borderBottom =
                row < Math.floor((recents.length - 1) / 3) ? "1px solid var(--border)" : "none";
              const badge = statusBadge(p.status);
              const meta = [p.ageRange, p.duration].filter(Boolean).join(" · ");
              return (
                <Link key={p.id} href={`/program/${p.slug}`} className="recent-row" style={{ borderRight, borderBottom }}>
                  <span className="recent-accent" style={{ background: p.accent }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="recent-title" style={{ display: "block" }}>{p.title}</span>
                    {meta ? <span className="recent-sub" style={{ display: "block" }}>{meta}</span> : null}
                  </span>
                  {badge ? <Tag color={badge.color}>{badge.dot}</Tag> : null}
                </Link>
              );
            })}
          </div>
        </>
      ) : null}

      <div className="duo">
        <div className="duo-grid">
          <div>
            <div className="duo-eyebrow">витрина</div>
            <div className="duo-h">Notion — для навигации</div>
            <p className="duo-p">
              Карточки программ с&nbsp;легендой, персонажами, медиа и&nbsp;статусом готовности. Поиск,
              фильтры, тег-система.
            </p>
          </div>
          <div>
            <div className="duo-eyebrow">движок</div>
            <div className="duo-h">Google&nbsp;Sheets — для цен</div>
            <p className="duo-p">
              Конструктор стоимости, маржа и&nbsp;расходники остаются в&nbsp;таблицах и&nbsp;открываются
              из&nbsp;карточки по&nbsp;ссылке.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
