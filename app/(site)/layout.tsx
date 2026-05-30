// Workspace shell (sidebar + topbar + scroll pane). Wraps all catalog pages but
// NOT /login, so the gate screen renders bare. Live sidebar counts from Notion.
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { listPrograms } from "@/lib/notion/programs";
import { listElements } from "@/lib/notion/elements";
import { REVALIDATE_SECONDS } from "@/lib/constants";

export const revalidate = REVALIDATE_SECONDS;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let programsCount = 0;
  let elementsCount = 0;
  const formatCounts: Record<string, number> = {};
  const elementCatCounts: Record<string, number> = {};
  try {
    const [programs, elements] = await Promise.all([listPrograms(), listElements()]);
    programsCount = programs.length;
    elementsCount = elements.length;
    for (const p of programs) {
      if (p.format) formatCounts[p.format] = (formatCounts[p.format] ?? 0) + 1;
    }
    for (const e of elements) {
      if (e.category) elementCatCounts[e.category] = (elementCatCounts[e.category] ?? 0) + 1;
    }
  } catch {
    // Counts stay 0; the shell still renders.
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <div className="app-shell">
        <Sidebar
          programsCount={programsCount}
          elementsCount={elementsCount}
          formatCounts={formatCounts}
          elementCatCounts={elementCatCounts}
        />
        <div className="main-pane">
          <TopBar />
          <main id="main" className="main-scroll">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
