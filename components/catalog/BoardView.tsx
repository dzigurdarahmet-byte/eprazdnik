// Board view (§2): kanban columns = Статус values, ordered green → yellow → red.
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { groupByStatus } from "@/lib/catalog-filter";
import type { ProgramSummary } from "@/types/program";

export function BoardView({ programs }: { programs: ProgramSummary[] }) {
  const groups = groupByStatus(programs);
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${Math.max(groups.length, 1)}, 1fr)` }}>
      {groups.map((g) => (
        <div className="board-col" key={g.status || "none"}>
          <div className="board-col-head">
            <Tag color={g.color} dot={g.dot}>
              {g.label}
            </Tag>
            <span className="board-col-count">{g.items.length}</span>
          </div>
          <div className="board-cards">
            {g.items.map((p) => (
              <Link
                key={p.id}
                href={`/program/${p.slug}`}
                className="board-card"
                style={{ borderLeft: `3px solid ${p.accent}` }}
              >
                <div className="board-card-title">{p.title}</div>
                <div className="board-card-sub">{[p.format, p.ageRange].filter(Boolean).join(" · ")}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
