"use client";
// Sidebar — style ported from proto-notion/sidebar.jsx, content driven by real
// Notion data. «Программы» раскрываются в список самих программ (как в прототипе);
// «Элементы» — в категории. Empty categories are hidden.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Chevron } from "@/components/ui/Chevron";

export type SidebarProgram = { title: string; slug: string; accent: string };

type Props = {
  programsCount: number;
  elementsCount: number;
  programs: SidebarProgram[];
  elementCatCounts: Record<string, number>;
};

const ELEMENT_CAT_META: Record<string, { label: string; icon: string }> = {
  Артист: { label: "Артисты", icon: "🎬" },
  "Ростовая кукла": { label: "Ростовые куклы", icon: "🧸" },
  Шоу: { label: "Шоу", icon: "🎭" },
  Спецэффект: { label: "Спецэффекты", icon: "🎆" },
  Активность: { label: "Активности", icon: "✨" },
  Расходник: { label: "Расходники", icon: "📦" },
};
const ELEMENT_CAT_ORDER = ["Артист", "Ростовая кукла", "Шоу", "Спецэффект", "Активность", "Расходник"];

function orderedKeys(counts: Record<string, number>, order: string[]): string[] {
  const present = Object.keys(counts).filter((k) => (counts[k] ?? 0) > 0);
  const known = order.filter((k) => present.includes(k));
  const extra = present.filter((k) => !order.includes(k)).sort((a, b) => a.localeCompare(b, "ru"));
  return [...known, ...extra];
}

function SbItem({
  icon,
  label,
  count,
  active,
  href,
  indent = 0,
  expandable,
  expanded,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  href?: string;
  indent?: number;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const style = { paddingLeft: 8 + indent * 14 };
  const inner = (
    <>
      <span
        className={"sb-item-chev" + (expandable ? " expandable" : "")}
        onClick={
          expandable && onToggle
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }
            : undefined
        }
      >
        {expandable ? <Chevron open={expanded} size={10} /> : null}
      </span>
      <span className="sb-item-ico">{icon}</span>
      <span className="sb-item-label">{label}</span>
      {count != null ? <span className="sb-item-count">{count}</span> : null}
    </>
  );
  if (href) {
    return (
      <Link className={"sb-item" + (active ? " active" : "")} href={href} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={"sb-item" + (active ? " active" : "")} style={style}>
      {inner}
    </div>
  );
}

export function Sidebar({ programsCount, elementsCount, programs, elementCatCounts }: Props) {
  const pathname = usePathname();
  const onCatalog = pathname === "/catalog" || pathname.startsWith("/program");
  const onElements = pathname.startsWith("/elements");
  const [programsOpen, setProgramsOpen] = useState(onCatalog);
  const [elementsOpen, setElementsOpen] = useState(onElements);

  const cats = orderedKeys(elementCatCounts, ELEMENT_CAT_ORDER);

  return (
    <aside className="sidebar">
      <Link href="/" className="sb-ws">
        <span className="sb-ws-mark">е</span>
        <span className="sb-ws-body">
          <span className="sb-ws-name">Е-Праздник</span>
          <span className="sb-ws-sub">справочник программ</span>
        </span>
        <span className="sb-ws-caret">⌄</span>
      </Link>

      <div className="sb-top">
        <SbItem icon="⌕" label="Поиск" href="/catalog" />
        <SbItem icon="◉" label="Главная" href="/" active={pathname === "/"} />
      </div>

      <div className="sb-section">
        <span>Каталог</span>
      </div>
      <div className="sb-scroll">
        <SbItem
          icon="📚"
          label="Программы"
          count={programsCount}
          href="/catalog"
          active={pathname === "/catalog"}
          expandable
          expanded={programsOpen}
          onToggle={() => setProgramsOpen((o) => !o)}
        />
        {programsOpen
          ? programs.map((p) => (
              <SbItem
                key={p.slug}
                icon={<span className="sb-dot" style={{ background: p.accent }} />}
                label={p.title}
                indent={1}
                href={`/program/${p.slug}`}
                active={pathname === `/program/${p.slug}`}
              />
            ))
          : null}

        <SbItem
          icon="🧩"
          label="Элементы"
          count={elementsCount}
          href="/elements"
          active={pathname === "/elements"}
          expandable
          expanded={elementsOpen}
          onToggle={() => setElementsOpen((o) => !o)}
        />
        {elementsOpen
          ? cats.map((value) => {
              const meta = ELEMENT_CAT_META[value] ?? { label: value, icon: "•" };
              return (
                <SbItem
                  key={value}
                  icon={meta.icon}
                  label={meta.label}
                  count={elementCatCounts[value]}
                  indent={1}
                  href={`/elements?cat=${encodeURIComponent(value)}`}
                />
              );
            })
          : null}
      </div>

      <div className="sb-foot">
        <SbItem icon="⚙" label="Настройки" />
      </div>
    </aside>
  );
}
