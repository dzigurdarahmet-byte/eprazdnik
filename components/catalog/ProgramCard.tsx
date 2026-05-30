// ProgramCard — port of proto-notion/screen_programs.jsx ProgramCard.
// Wrapped in <Link> to the program detail page.
import Link from "next/link";
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { tagColorFor } from "@/lib/tag-color";
import { statusBadge } from "@/lib/status";
import type { ProgramSummary } from "@/types/program";

export function ProgramCard({ p }: { p: ProgramSummary }) {
  const badge = statusBadge(p.status);
  return (
    <Link href={`/program/${p.slug}`} className="pcard">
      <div className="pcard-accent" style={{ background: p.accent }} />
      <div className="pcard-body">
        <div className="pcard-head">
          <IconSlot name={p.coverKind} size={36} accent={p.accent} tint={p.tint} emoji={p.coverEmoji} />
          {badge ? (
            <Tag color={badge.color} dot={badge.dot}>
              {badge.label}
            </Tag>
          ) : null}
        </div>
        <div>
          <div className="pcard-title">{p.title}</div>
          {p.subtitle ? <div className="pcard-sub">{p.subtitle}</div> : null}
        </div>
        <div className="pcard-foot">
          <div className="pcard-tags">
            {p.tags.slice(0, 2).map((t, i) => (
              <Tag key={i} color={tagColorFor(t)}>
                {t}
              </Tag>
            ))}
          </div>
          {p.ageRange ? <span className="pcard-age">{p.ageRange}</span> : null}
        </div>
      </div>
    </Link>
  );
}
