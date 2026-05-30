// IconSlot — port of proto-notion/ui.jsx IconSlot. Final icons aren't delivered,
// so we render the Notion page emoji in a tinted square when present, else the
// prototype's dashed placeholder with a mono caption. Sizing formulas copied
// verbatim from the prototype.

export function IconSlot({
  name = "·",
  size = 24,
  accent = "currentColor",
  tint,
  emoji,
}: {
  name?: string;
  size?: number;
  accent?: string;
  tint?: string;
  emoji?: string;
}) {
  const radius = Math.max(2, Math.round(size / 8));

  if (emoji) {
    return (
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          background: tint || "transparent",
          borderRadius: radius,
          flexShrink: 0,
          fontSize: Math.round(size * 0.5),
          lineHeight: 1,
        }}
      >
        {emoji}
      </span>
    );
  }

  const caption = (name || "·").slice(0, Math.max(2, Math.floor(size / 6)));
  return (
    <span
      title={`icon: ${name}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background: tint || "transparent",
        border: `1px dashed ${accent}`,
        borderRadius: radius,
        color: accent,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: Math.max(8, Math.round(size * 0.2)),
          letterSpacing: ".02em",
          opacity: 0.75,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {caption}
      </span>
    </span>
  );
}
