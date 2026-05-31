"use client";
// Search overlay (Cmd/Ctrl+K): instant filter, keyboard nav, click → detail.
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { searchItems, type SearchItem } from "@/lib/search";

export function SearchOverlay({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchItems(items, query).slice(0, 50), [items, query]);
  useEffect(() => setActive(0), [query]);

  const go = (item: SearchItem) => {
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      const item = results[active];
      if (item) go(item);
    }
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" role="dialog" aria-modal="true" aria-label="Поиск" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <span aria-hidden>⌕</span>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Поиск по программам и элементам"
            aria-label="Поиск по программам и элементам"
          />
          <button type="button" className="kbd" onClick={onClose}>Esc</button>
        </div>
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">Ничего не найдено</div>
          ) : (
            results.map((item, i) => {
              const badge = statusBadge(item.status);
              return (
                <button
                  key={`${item.kind}:${item.slug}`}
                  type="button"
                  className={"search-result" + (i === active ? " active" : "")}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item)}
                >
                  <span className="search-ico" style={{ background: item.accent }} aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="search-main">
                    <span className="search-title">{item.title}</span>
                    {item.hint ? <span className="search-hint">{item.hint}</span> : null}
                  </span>
                  <span className="search-kind">{item.kind === "program" ? "Программа" : "Элемент"}</span>
                  {badge ? <Tag color={badge.color} dot={badge.dot}>{badge.label}</Tag> : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
