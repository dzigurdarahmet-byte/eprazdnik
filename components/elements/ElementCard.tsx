// ElementCard — read-only card for the Элементы library (§4.8). Shares the
// ProgramCard visual language, simplified (no detail page → not a link).
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { statusBadge } from "@/lib/status";
import { tagColorFor } from "@/lib/tag-color";
import { formatPrice } from "@/lib/format";
import type { ElementSummary } from "@/types/element";

export function ElementCard({ e }: { e: ElementSummary }) {
  const badge = statusBadge(e.status);
  return (
    <div className="pcard">
      <div className="pcard-accent" style={{ background: e.accent }} />
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
          {e.priceFrom !== null ? <span className="pcard-age">от {formatPrice(e.priceFrom)}</span> : null}
        </div>
      </div>
    </div>
  );
}
