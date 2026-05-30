// 404 for unknown routes / missing programs. Rendered inside the workspace shell.
import Link from "next/link";

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 14px",
  borderRadius: 5,
  fontSize: 13,
  fontWeight: 500,
};

export default function NotFound() {
  return (
    <div style={{ maxWidth: 640, padding: "60px 96px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
        Страница не найдена
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 16 }}>
        404 — возможно, ссылка устарела или раздел переименован.
      </p>
      <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
        <Link href="/" style={{ ...btn, border: "1px solid var(--border-strong)", color: "var(--text)" }}>
          На главную
        </Link>
        <Link href="/catalog" style={{ ...btn, background: "var(--text)", color: "white" }}>
          В каталог
        </Link>
      </div>
    </div>
  );
}
