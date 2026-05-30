// PropertyRow — port of proto-notion/screen_program_detail.jsx PropertyRow.
export function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 1, fontSize: 14 }}>
      <div
        style={{
          width: 200,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          padding: "6px 8px",
          borderRadius: 4,
        }}
      >
        <span style={{ width: 14, textAlign: "center", fontSize: 13, opacity: 0.7 }}>{icon}</span>
        <span style={{ fontSize: 14 }}>{label}</span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "6px 8px",
          minHeight: 32,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
}
