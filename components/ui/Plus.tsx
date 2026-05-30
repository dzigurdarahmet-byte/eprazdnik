// Plus — port of proto-notion/ui.jsx Plus.
export function Plus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
      <path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
