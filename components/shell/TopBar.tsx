"use client";
// TopBar — port of proto-notion/app.jsx TopBar: back/forward arrows + current
// section title. Decorative action buttons (share/star/…) intentionally dropped
// (no actions to back them — §4.2). Title derived from the route.
import { usePathname } from "next/navigation";

function titleFor(pathname: string): string {
  if (pathname === "/") return "Главная";
  if (pathname === "/catalog") return "Программы";
  if (pathname.startsWith("/program")) return "Карточка программы";
  if (pathname.startsWith("/elements")) return "Элементы";
  return "Е-Праздник";
}

export function TopBar() {
  const pathname = usePathname();
  return (
    <div className="topbar">
      <div className="topbar-crumbs">
        <span className="arrow">‹</span>
        <span className="arrow">›</span>
        <span className="title">{titleFor(pathname)}</span>
      </div>
    </div>
  );
}
