// Tag atom — port of proto-notion/ui.jsx Tag, token-for-token via globals.css.
import type { TagColor } from "@/lib/status";

export function Tag({
  color = "gray",
  dot,
  children,
}: {
  color?: TagColor;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`tag tag-${color}`}>
      {dot ? <span className="tag-dot">{dot}</span> : null}
      {children}
    </span>
  );
}
