// Multi-value chip filter. Each chip toggles independently; "Все" clears all.
"use client";
import { Icon, type IconName } from "@/components/Icon";

export type Chip = { key: string; label: string; ico?: IconName };

export function Chips({
  chips,
  active,
  onToggle,
}: {
  chips: Chip[];
  active: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="chips-row" role="toolbar" aria-label="Фильтры каталога">
      {chips.map((c) => {
        const isActive = c.key === "all" ? active.size === 0 : active.has(c.key);
        return (
          <button
            key={c.key}
            type="button"
            className={"chip " + (isActive ? "active" : "")}
            onClick={() => onToggle(c.key)}
            aria-pressed={isActive}
          >
            {c.ico ? <Icon n={c.ico} size={14} /> : null} {c.label}
          </button>
        );
      })}
    </div>
  );
}
