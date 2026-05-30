// MediaGrid — port of proto-notion/screen_program_detail.jsx MediaCard grid.
// Tiles link out to Я.Диск / external media (§4.6).
import { IconSlot } from "@/components/ui/IconSlot";
import type { MediaTile } from "@/types/program";

export function MediaGrid({ tiles }: { tiles: MediaTile[] }) {
  return (
    <div className="media-grid">
      {tiles.map((t, i) => (
        <a
          key={i}
          className="media-card"
          href={t.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="media-top">
            <IconSlot name="media" size={28} accent="var(--text-muted)" tint="var(--bg-soft)" emoji={t.emoji} />
            <span className="media-arrow">↗</span>
          </div>
          <div>
            <div className="media-title">{t.title}</div>
            {t.meta ? <div className="media-meta">{t.meta}</div> : null}
          </div>
        </a>
      ))}
    </div>
  );
}
