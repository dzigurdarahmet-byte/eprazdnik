// Card used on home + catalog. Server Component, click handled by a wrapping <Link>.
import Link from "next/link";
import { Cover } from "@/components/Cover";
import { Icon } from "@/components/Icon";
import { formatPrice } from "@/lib/format";
import type { ProgramSummary } from "@/types/program";

export function ProgramCard({ p, lg }: { p: ProgramSummary; lg?: boolean }) {
  const cls = "pcard" + (lg ? " lg" : "");
  return (
    <Link
      href={`/program/${p.slug}`}
      className={cls}
      aria-label={`Открыть программу ${p.title}`}
      data-testid="program-card"
    >
      <div className="pcard-cover">
        <Cover kind={p.coverKind} emoji={p.coverEmoji} />
        <div className="pcard-badges">
          {p.audience !== "OTHER" ? (
            <span className={"pbadge " + (p.audience === "B2C" ? "b2c" : "b2b")}>{p.audience}</span>
          ) : null}
        </div>
      </div>
      <div className="pcard-body">
        <div className="pcard-title">{p.title}</div>
        {p.subtitle ? <div className="pcard-sub">{p.subtitle}</div> : null}
        <div className="pcard-tags">
          {p.category ? <span className="ptag purple">{p.category}</span> : null}
          {p.ageRange ? <span className="ptag">{p.ageRange} лет</span> : null}
          {p.duration ? <span className="ptag">{p.duration}</span> : null}
        </div>
        <div className="pcard-foot">
          <div className="pcard-price">
            <small>от</small>
            {formatPrice(p.priceFrom)}
          </div>
          <div className="pcard-cta">
            Открыть <Icon n="chevron-right" size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
