// Avatar — port of proto-notion/ui.jsx Avatar (deterministic color from name).
const PALETTE = ["#7a4ad8", "#2383e2", "#1a6055", "#a85978", "#c47a14", "#4a5360"];

export function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const c = PALETTE[Math.abs(h) % PALETTE.length];
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c,
        color: "white",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}
