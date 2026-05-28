// Global 404 for any unknown route under /app/*.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-enter" style={{ padding: "60px 0", maxWidth: 640 }}>
      <h1 className="page-title">Страница не найдена</h1>
      <p className="page-sub" style={{ marginTop: 10 }}>
        404 — возможно, ссылка устарела или раздел переименован.
      </p>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <Link href="/" className="btn btn-outline">
          На главную
        </Link>
        <Link href="/catalog" className="btn btn-primary">
          В каталог
        </Link>
      </div>
    </div>
  );
}
