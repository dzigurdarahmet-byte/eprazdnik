// Hit when getProgramBySlug() returns null. Stays inside the .main grid column.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-enter" style={{ padding: "60px 0", maxWidth: 640 }}>
      <h1 className="page-title">Программа не найдена</h1>
      <p className="page-sub" style={{ marginTop: 10 }}>
        Возможно, ссылка устарела или программу убрали из каталога.
      </p>
      <Link
        href="/catalog"
        className="btn btn-primary"
        style={{ marginTop: 24, display: "inline-flex" }}
      >
        Вернуться в каталог
      </Link>
    </div>
  );
}
