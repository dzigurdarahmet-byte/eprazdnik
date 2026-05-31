"use client";
// Catalog gallery + working client-side filters/search (§4.5). Port of
// proto-notion/screen_programs.jsx (minus the create buttons — read-only).
import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import { TableView } from "@/components/catalog/TableView";
import { BoardView } from "@/components/catalog/BoardView";
import { FilterPill } from "@/components/ui/FilterPill";
import { Tag } from "@/components/ui/Tag";
import Link from "next/link";
import { statusBadge } from "@/lib/status";
import {
  applyFilters,
  EMPTY_FILTER,
  facetValues,
  type FilterState,
} from "@/lib/catalog-filter";
import type { ProgramSummary } from "@/types/program";

type FacetKey = "format" | "category" | "status" | "age" | "audience";
type ViewMode = "gallery" | "list" | "table" | "board";

const VIEW_TABS: Array<{ id: ViewMode; label: string }> = [
  { id: "gallery", label: "Галерея" },
  { id: "list", label: "Список" },
  { id: "table", label: "Таблица" },
  { id: "board", label: "Доска" },
];

function FacetDropdown({
  label,
  value,
  options,
  open,
  onOpen,
  onPick,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onOpen: () => void;
  onPick: (v: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="facet">
      <FilterPill active={Boolean(value)} onClick={onOpen}>
        {value ? `${label}: ${value}` : label} <span className="caret">▾</span>
      </FilterPill>
      {open ? (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
            onClick={() => onOpen()}
            aria-hidden
          />
          <div className="facet-menu" role="listbox">
            <button className={"facet-opt" + (!value ? " active" : "")} onClick={() => onPick("")}>
              Все
            </button>
            {options.map((o) => (
              <button
                key={o}
                className={"facet-opt" + (value === o ? " active" : "")}
                onClick={() => onPick(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function CatalogView({
  programs,
  initial,
}: {
  programs: ProgramSummary[];
  initial?: Partial<FilterState>;
}) {
  const [filter, setFilter] = useState<FilterState>({ ...EMPTY_FILTER, ...initial });
  const [view, setView] = useState<ViewMode>("gallery");
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);

  const facetOptions = useMemo(
    () => ({
      format: facetValues(programs, (p) => p.format),
      category: facetValues(programs, (p) => p.category),
      status: facetValues(programs, (p) => p.status),
      age: facetValues(programs, (p) => p.ageRange),
      audience: ["B2B", "B2C"],
    }),
    [programs],
  );

  const filtered = useMemo(() => applyFilters(programs, filter), [programs, filter]);

  const set = (key: FacetKey, value: string) => {
    setFilter((f) => ({ ...f, [key]: value }));
    setOpenFacet(null);
  };
  const toggle = (key: FacetKey) => setOpenFacet((cur) => (cur === key ? null : key));

  const facets: Array<{ key: FacetKey; label: string }> = [
    { key: "format", label: "Формат" },
    { key: "category", label: "Категория" },
    { key: "status", label: "Статус" },
    { key: "age", label: "Возраст" },
    { key: "audience", label: "B2B / B2C" },
  ];

  return (
    <>
      <div className="view-tabs">
        {VIEW_TABS.map((t) => (
          <button
            key={t.id}
            className={"view-tab" + (view === t.id ? " active" : "")}
            onClick={() => setView(t.id)}
          >
            {t.label}
          </button>
        ))}
        <div className="view-tabs-meta">
          <span>{filtered.length} карточек</span>
        </div>
      </div>

      <div className="filter-row">
        {facets.map((f) => (
          <FacetDropdown
            key={f.key}
            label={f.label}
            value={filter[f.key]}
            options={facetOptions[f.key]}
            open={openFacet === f.key}
            onOpen={() => toggle(f.key)}
            onPick={(v) => set(f.key, v)}
          />
        ))}
        <div className="catalog-search">
          <span aria-hidden>⌕</span>
          <input
            type="search"
            placeholder="Поиск по каталогу"
            aria-label="Поиск по каталогу"
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">Ничего не найдено — измените фильтры или запрос.</div>
      ) : view === "gallery" ? (
        <div className="pcard-grid">
          {filtered.map((p) => (
            <ProgramCard key={p.id} p={p} />
          ))}
        </div>
      ) : view === "table" ? (
        <TableView programs={filtered} />
      ) : view === "board" ? (
        <BoardView programs={filtered} />
      ) : (
        <div className="clist">
          {filtered.map((p) => {
            const badge = statusBadge(p.status);
            const meta = [p.format, p.ageRange, p.duration].filter(Boolean).join(" · ");
            return (
              <Link key={p.id} href={`/program/${p.slug}`} className="clist-row">
                <span className="clist-accent" style={{ background: p.accent }} />
                <span className="clist-main">
                  <span className="clist-title" style={{ display: "block" }}>{p.title}</span>
                  {meta ? <span className="clist-sub" style={{ display: "block" }}>{meta}</span> : null}
                </span>
                {badge ? <Tag color={badge.color} dot={badge.dot}>{badge.label}</Tag> : null}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
