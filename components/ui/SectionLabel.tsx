// SectionLabel — port of proto-notion/screen_program_detail.jsx SectionLabel.
export function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "40px 0 14px" }}>
      <span
        className="mono"
        style={{ fontSize: 11, color: "var(--text-light)", letterSpacing: ".05em" }}
      >
        {num}
      </span>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.015em" }}>
        {children}
      </h2>
    </div>
  );
}
