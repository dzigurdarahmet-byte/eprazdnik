// Chevron — port of proto-notion/ui.jsx Chevron.
export function Chevron({ open, size = 12 }: { open?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .12s" }}
      aria-hidden
    >
      <path
        d="M4 2 L8 6 L4 10"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
