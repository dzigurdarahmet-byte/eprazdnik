// Renders a Скрипты/Кейсы section (§4.6a): link tiles and/or text paragraphs.
import { IconSlot } from "@/components/ui/IconSlot";
import type { LinkOrTextSection } from "@/types/program";

export function hasContent(s: LinkOrTextSection): boolean {
  return s.links.length > 0 || s.paragraphs.length > 0;
}

export function LinkOrText({ section }: { section: LinkOrTextSection }) {
  return (
    <>
      {section.links.length > 0 ? (
        <div className="link-tiles">
          {section.links.map((l, i) => (
            <a key={i} className="media-card" href={l.url} target="_blank" rel="noopener noreferrer">
              <div className="media-top">
                <IconSlot name="doc" size={28} accent="var(--text-muted)" tint="var(--bg-soft)" />
                <span className="media-arrow">↗</span>
              </div>
              <div>
                <div className="media-title">{l.title}</div>
                {l.meta ? <div className="media-meta">{l.meta}</div> : null}
              </div>
            </a>
          ))}
        </div>
      ) : null}
      {section.paragraphs.map((p, i) => (
        <p key={i} className="detail-text">
          {p}
        </p>
      ))}
    </>
  );
}
