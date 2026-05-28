// Static sidebar shared by every page. Server Component — no interaction.
// Items that don't have a real screen yet route to "/" so visitors don't
// get a dead link; their visual placement still telegraphs the product surface.
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

type SbItem = { id: string; href: string; label: string; ico: IconName; badge?: number };

const NAV: SbItem[] = [
  { id: "home", href: "/", label: "Главная", ico: "zap" },
  { id: "catalog", href: "/catalog", label: "Каталог услуг", ico: "library" },
];

const SALES: SbItem[] = [
  { id: "collections", href: "/", label: "Мои подборки", ico: "briefcase" },
  { id: "scripts", href: "/", label: "Скрипты продаж", ico: "flame" },
  { id: "prices", href: "/", label: "Прайсы и КП", ico: "wallet" },
];

const RESOURCES: SbItem[] = [
  { id: "media", href: "/", label: "Медиа", ico: "image" },
  { id: "favs", href: "/", label: "Избранное", ico: "star" },
];

function renderItem(it: SbItem, active: string) {
  const cls = "sb-item " + (active === it.id ? "active" : "");
  return (
    <Link key={it.id} href={it.href} className={cls}>
      <span className="ico">
        <Icon n={it.ico} size={17} />
      </span>
      <span>{it.label}</span>
      {it.badge ? <span className="badge">{it.badge}</span> : null}
    </Link>
  );
}

export function Sidebar({ active = "home" }: { active?: string }) {
  return (
    <aside className="sb" aria-label="Основная навигация">
      <div className="sb-logo">
        <div className="sb-logo-mark"><span>Е</span></div>
        <div>
          Е-<span className="accent">Праздник</span>
        </div>
      </div>

      <div className="sb-section-title">Навигация</div>
      {NAV.map((it) => renderItem(it, active))}

      <div className="sb-section-title">Продажи</div>
      {SALES.map((it) => renderItem(it, active))}

      <div className="sb-section-title">Ресурсы</div>
      {RESOURCES.map((it) => renderItem(it, active))}

      <div className="sb-spacer" />

      <div className="sb-user">
        <div className="sb-avatar">ЕП</div>
        <div>
          <div className="sb-user-name">Е-Праздник</div>
          <div className="sb-user-role">Каталог услуг</div>
        </div>
      </div>
    </aside>
  );
}
