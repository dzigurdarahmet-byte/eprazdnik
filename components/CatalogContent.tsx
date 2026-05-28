// Client wrapper: takes the server-fetched programs and provides the
// interactive search/chips filter UI around the static ProgramCard grid.
"use client";
import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/ProgramCard";
import { SearchBox } from "@/components/SearchBox";
import { Chips, type Chip } from "@/components/Chips";
import { Icon } from "@/components/Icon";
import type { ProgramSummary } from "@/types/program";

const STATIC_CHIPS: Chip[] = [
  { key: "all", label: "Все", ico: "sparkles" },
  { key: "b2c", label: "B2C", ico: "users" },
  { key: "b2b", label: "B2B", ico: "briefcase" },
];

function chipMatches(p: ProgramSummary, key: string): boolean {
  if (key === "b2c") return p.audience === "B2C";
  if (key === "b2b") return p.audience === "B2B";
  // Treat unknown keys as category- or tag-matchers.
  if (p.category === key) return true;
  return p.tags.includes(key);
}

export function CatalogContent({ programs }: { programs: ProgramSummary[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  // Derived chip list: static + each unique category + each unique tag.
  const chips = useMemo<Chip[]>(() => {
    const seen = new Set<string>();
    const dynamic: Chip[] = [];
    for (const p of programs) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        dynamic.push({ key: p.category, label: p.category, ico: "wand" });
      }
      for (const t of p.tags) {
        if (!seen.has(t)) {
          seen.add(t);
          dynamic.push({ key: t, label: t, ico: "tag" });
        }
      }
    }
    return [...STATIC_CHIPS, ...dynamic];
  }, [programs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return programs.filter((p) => {
      if (needle.length > 0) {
        const hay = (p.title + " " + p.subtitle).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (active.size === 0) return true;
      for (const key of active) {
        if (chipMatches(p, key)) return true;
      }
      return false;
    });
  }, [programs, q, active]);

  function toggle(key: string) {
    if (key === "all") {
      setActive(new Set());
      return;
    }
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      <div className="search-row">
        <SearchBox value={q} onChange={setQ} />
      </div>
      <Chips chips={chips} active={active} onToggle={toggle} />
      <div className="hero-stats" style={{ marginBottom: 18, display: "inline-flex" }}>
        <Icon n="check" size={14} /> <b>{filtered.length}</b> в выдаче
        <span className="dot">·</span>
        <Icon n="library" size={14} /> {programs.length} всего
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--text-3)" }}>
          Ничего не найдено по запросу «{q}»
        </div>
      ) : (
        <div className="cards-grid lg">
          {filtered.map((p) => (
            <ProgramCard key={p.id} p={p} lg />
          ))}
        </div>
      )}
    </>
  );
}
