// Client-side tab switcher used on the program detail page.
"use client";
import { useState, type ReactNode } from "react";

export type Tab = { key: string; label: string; content: ReactNode };

export function Tabs({ tabs, initial }: { tabs: Tab[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.key ?? "");
  const current = tabs.find((t) => t.key === active);
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Разделы программы">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            className={"tab " + (active === t.key ? "active" : "")}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current?.content ?? null}</div>
    </>
  );
}
