// SheetIcon — port of proto-notion/ui.jsx SheetIcon (green spreadsheet mark).
export function SheetIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#1f8a4d" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="#ffffff" />
      <line x1="5.5" y1="10" x2="18.5" y2="10" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="5.5" y1="14" x2="18.5" y2="14" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="10" y1="5.5" x2="10" y2="18.5" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="14" y1="5.5" x2="14" y2="18.5" stroke="#1f8a4d" strokeWidth="1" />
    </svg>
  );
}
