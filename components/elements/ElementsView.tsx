"use client";
// Elements library view: category filter (?cat seed) + search (§4.8). Read-only.
import { useMemo, useState } from "react";
import { ElementCard } from "@/components/elements/ElementCard";
import { FilterPill } from "@/components/ui/FilterPill";
import type { ElementSummary } from "@/types/element";

export function ElementsView({
  elements,
  initialCategory = "",
}: {
  elements: ElementSummary[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const e of elements) if (e.category) set.add(e.category);
    return [...set].sort((a, b) => a.localeCompare(b, "ru"));
  }, [elements]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return elements.filter(
      (e) =>
        (!category || e.category === category) &&
        (!q || [e.title, e.category, ...e.tags].join(" ").toLowerCase().includes(q)),
    );
  }, [elements, category, query]);

  return (
    <>
      <div className="view-tabs">
        <button className="view-tab active">Галерея</button>
        <div className="view-tabs-meta">
          <span>{filtered.length} элементов</span>
        </div>
      </div>

      <div className="filter-row">
        <div className="facet">
          <FilterPill active={Boolean(category)} onClick={() => setOpen((o) => !o)}>
            {category ? `Категория: ${category}` : "Категория"} <span className="caret">▾</span>
          </FilterPill>
          {open ? (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} aria-hidden />
              <div className="facet-menu" role="listbox">
                <button
                  className={"facet-opt" + (!category ? " active" : "")}
                  onClick={() => {
                    setCategory("");
                    setOpen(false);
                  }}
                >
                  Все
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={"facet-opt" + (category === c ? " active" : "")}
                    onClick={() => {
                      setCategory(c);
                      setOpen(false);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="catalog-search">
          <span aria-hidden>⌕</span>
          <input
            type="search"
            placeholder="Поиск по элементам"
            aria-label="Поиск по элементам"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">Ничего не найдено — измените фильтр или запрос.</div>
      ) : (
        <div className="pcard-grid">
          {filtered.map((e) => (
            <ElementCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </>
  );
}
