// Workspace shell (sidebar + topbar + scroll pane). Wraps all catalog pages but
// NOT /login, so the gate screen renders bare. Live sidebar counts from Notion.
import { Sidebar, type SidebarProgram } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { SearchProvider } from "@/components/search/SearchProvider";
import { listPrograms } from "@/lib/notion/programs";
import { listElements } from "@/lib/notion/elements";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import type { SearchItem } from "@/lib/search";

export const revalidate = REVALIDATE_SECONDS;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let programsCount = 0;
  let elementsCount = 0;
  let sidebarPrograms: SidebarProgram[] = [];
  let searchData: SearchItem[] = [];
  const elementCatCounts: Record<string, number> = {};
  try {
    const [programs, elements] = await Promise.all([listPrograms(), listElements()]);
    programsCount = programs.length;
    elementsCount = elements.length;
    // listPrograms already sorts by title (ru) — same default order as the catalog.
    sidebarPrograms = programs.map((p) => ({ title: p.title, slug: p.slug, accent: p.accent }));
    for (const e of elements) {
      if (e.category) elementCatCounts[e.category] = (elementCatCounts[e.category] ?? 0) + 1;
    }
    searchData = [
      ...programs.map((p): SearchItem => ({
        kind: "program",
        title: p.title,
        slug: p.slug,
        href: `/program/${p.slug}`,
        tags: p.tags,
        status: p.status,
        hint: p.format,
        emoji: p.coverEmoji,
        accent: p.accent,
      })),
      ...elements.map((e): SearchItem => ({
        kind: "element",
        title: e.title,
        slug: e.slug,
        href: `/element/${e.slug}`,
        tags: e.tags,
        status: e.status,
        hint: e.category,
        emoji: "",
        accent: e.accent,
      })),
    ];
  } catch {
    // Counts stay 0; the shell still renders.
  }

  return (
    <SearchProvider items={searchData}>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <div className="app-shell">
        <Sidebar
          programsCount={programsCount}
          elementsCount={elementsCount}
          programs={sidebarPrograms}
          elementCatCounts={elementCatCounts}
        />
        <div className="main-pane">
          <TopBar />
          <main id="main" className="main-scroll">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
