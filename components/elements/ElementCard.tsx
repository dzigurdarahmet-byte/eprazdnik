// ElementCard — read-only card for the Элементы library (§4.8). Links to the
// element detail page (v4). Optional cover image; falls back to accent + icon.
import Link from "next/link";
import Image from "next/image";
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { tagColorFor } from "@/lib/tag-color";
import { formatPrice } from "@/lib/format";
import type { ElementSummary } from "@/types/element";

export function ElementCard({ e }: { e: ElementSummary }) {
  const badge = statusBadge(e.status);
  return (
    <Link href={`/element/${e.slug}`} className="pcard">
      {e.coverImage ? (
        <div className="pcard-photo">
          <Image src={e.coverImage} alt="" fill sizes="(max-width: 900px) 50vw, 360px" style={{ objectFit: "cover" }} />
        </div>
      ) : (
        <div className="pcard-accent" style={{ background: e.accent }} />
      )}
      <div className="pcard-body">
        <div className="pcard-head">
          <IconSlot name="element" size={36} accent={e.accent} tint={e.tint} />
          {badge ? (
            <Tag color={badge.color} dot={badge.dot}>
              {badge.label}
            </Tag>
          ) : null}
        </div>
        <div>
          <div className="pcard-title">{e.title}</div>
        </div>
        <div className="pcard-foot">
          <div className="pcard-tags">
            {e.category ? <Tag color={tagColorFor(e.category)}>{e.category}</Tag> : null}
          </div>
          <span className="pcard-age">
            {e.priceFrom !== null ? `от ${formatPrice(e.priceFrom)}` : "по запросу"}
          </span>
        </div>
      </div>
    </Link>
  );
}
