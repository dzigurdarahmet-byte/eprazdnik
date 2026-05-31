"use client";
// Holds the global-search open state + data, registers the Cmd/Ctrl+K and Esc
// shortcuts, and renders the overlay. Children call useSearch().open().
import { createContext, useContext, useEffect, useState } from "react";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import type { SearchItem } from "@/lib/search";

type SearchContextValue = { open: () => void };
const SearchContext = createContext<SearchContextValue>({ open: () => {} });

export function useSearch(): SearchContextValue {
  return useContext(SearchContext);
}

export function SearchProvider({ items, children }: { items: SearchItem[]; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      {isOpen ? <SearchOverlay items={items} onClose={() => setIsOpen(false)} /> : null}
    </SearchContext.Provider>
  );
}
