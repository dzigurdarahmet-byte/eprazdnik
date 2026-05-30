// Breadcrumbs — port of proto-notion/ui.jsx Breadcrumbs. Uses Next <Link>.
import { Fragment } from "react";
import Link from "next/link";

export type Crumb = { label: string; href?: string; emoji?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Хлебные крошки">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const inner = (
          <>
            {it.emoji ? <span>{it.emoji}</span> : null}
            <span>{it.label}</span>
          </>
        );
        return (
          <Fragment key={i}>
            {i > 0 ? <span className="crumb-sep">/</span> : null}
            {it.href && !last ? (
              <Link className="crumb" href={it.href}>
                {inner}
              </Link>
            ) : (
              <span className={last ? "crumb current" : "crumb"}>{inner}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
