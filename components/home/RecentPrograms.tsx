"use client";
// «Недавно открытые» — real history from localStorage (v4 §2), up to 9 (3×3).
// SSR renders the fallback (first 9); after mount it swaps to the real history,
// so server/client initial markup match.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { pickRecent, readRecent, RECENT_MAX } from "@/lib/recent";
import type { ProgramSummary } from "@/types/program";

export function RecentPrograms({ programs }: { programs: ProgramSummary[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    setSlugs(readRecent());
  }, []);

  const items = pickRecent(programs, slugs, RECENT_MAX);
  if (items.length === 0) return null;
  const lastRowStart = Math.floor((items.length - 1) / 3);

  return (
    <div className="recent-grid">
      {items.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const borderRight = col < 2 ? "1px solid var(--border)" : "none";
        const borderBottom = row < lastRowStart ? "1px solid var(--border)" : "none";
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
  );
}
