// One tile inside the «Медиа» grid on the program page.
// External link → opens in a new tab; rel=noopener noreferrer mandatory (security §4.8).
import { Icon } from "@/components/Icon";
import type { MediaTile } from "@/types/program";

export function MediaCard({ tile }: { tile: MediaTile }) {
  return (
    <a
      href={tile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="feed-row"
      style={{ cursor: "pointer", textDecoration: "none" }}
    >
      <div className="feed-ico purple" aria-hidden>
        <span style={{ fontSize: 16 }}>{tile.emoji || "🎬"}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div className="feed-title">{tile.title}</div>
        {tile.meta ? <div className="feed-meta">{tile.meta}</div> : null}
      </div>
      <Icon n="external" size={14} className="media-card-external" />
    </a>
  );
}
