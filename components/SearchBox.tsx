// Controlled search input. Lives inside CatalogContent so it can wire up to filter state.
"use client";
import { Icon } from "@/components/Icon";

export function SearchBox({
  value,
  onChange,
  placeholder = "Найти программу по названию или ключевому слову…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-box">
      <Icon n="search" size={18} className="search-icon" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Поиск по каталогу"
      />
    </div>
  );
}
