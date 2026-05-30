// FilterPill — port of proto-notion/ui.jsx FilterPill. Presentational button;
// handlers are supplied by client callers (catalog/elements filter bars).
export function FilterPill({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={"filter-pill" + (active ? " active" : "")}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
