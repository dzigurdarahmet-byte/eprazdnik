"use client";
// Table view (§2): sortable columns over the already-filtered program list.
import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { formatPrice } from "@/lib/format";
import { sortPrograms, type SortKey, type SortDir } from "@/lib/catalog-filter";
import type { ProgramSummary } from "@/types/program";

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: "title", label: "Название" },
  { key: "format", label: "Формат" },
  { key: "category", label: "Категория" },
  { key: "status", label: "Статус" },
  { key: "age", label: "Возраст" },
  { key: "price", label: "Цена от" },
];

export function TableView({ programs }: { programs: ProgramSummary[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "title", dir: "asc" });
  const rows = sortPrograms(programs, sort.key, sort.dir);
  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <table className="ptable">
      <thead>
        <tr>
          {COLUMNS.map((c) => (
            <th key={c.key} scope="col" aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
              <button type="button" className="th-sort" onClick={() => onSort(c.key)}>
                {c.label}
                <span className="arr">{sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : ""}</span>
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => {
          const badge = statusBadge(p.status);
          return (
            <tr key={p.id}>
              <td>
                <Link className="cell-name" href={`/program/${p.slug}`}>
                  <span className="accent-dot" style={{ background: p.accent }} />
                  {p.title}
                </Link>
              </td>
              <td>{p.format || "—"}</td>
              <td>{p.category || "—"}</td>
              <td>{badge ? <Tag color={badge.color} dot={badge.dot}>{badge.label}</Tag> : "—"}</td>
              <td>{p.ageRange || "—"}</td>
              <td className="num">{p.priceFrom !== null ? formatPrice(p.priceFrom) : "по запросу"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
