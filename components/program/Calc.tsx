// Calc — read-only «Расчёт» block (§4.7). Port of the prototype's "Расчёт и
// расходники" section: yellow note + link cards to the Google Sheet. The site
// never rebuilds the spreadsheet; if no sheet URL is set yet, cards render
// inactive (no link) rather than breaking.
import { SheetIcon } from "@/components/ui/SheetIcon";
import { formatPrice } from "@/lib/format";
import type { PricingBlock } from "@/types/program";

const DEFAULT_NOTE =
  "Детальный конструктор стоимости, расчёт маржи и список расходников ведутся в Google Sheets. Все изменения автоматически отражаются здесь по ссылке.";

function CalcCard({
  title,
  sub,
  badge,
  url,
}: {
  title: string;
  sub: string;
  badge?: string;
  url?: string;
}) {
  const inner = (
    <>
      <SheetIcon size={32} />
      <div className="calc-card-body">
        <div className="calc-card-title">
          <span>{title}</span>
          {url ? <span className="ext">↗</span> : null}
        </div>
        <div className="calc-card-sub">{sub}</div>
      </div>
      {badge ? <div className="calc-card-badge">{badge}</div> : null}
    </>
  );
  if (url) {
    return (
      <a className="calc-card link" href={url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <div className="calc-card">{inner}</div>;
}

export function Calc({
  title,
  pricing,
  priceFrom,
}: {
  title: string;
  pricing: PricingBlock;
  priceFrom: number | null;
}) {
  const { sheetUrl, yellowNote, constructor, packages } = pricing;
  const hasSheet = Boolean(sheetUrl);

  return (
    <>
      <div className="calc-note">
        <span className="star">✱</span>
        <p>{yellowNote || DEFAULT_NOTE}</p>
      </div>
      <div className="calc-cards">
        <CalcCard
          title={constructor.title || `Конструктор «${title}»`}
          sub={
            hasSheet
              ? constructor.sub || "Позиции, цены и маржа в Google Sheets"
              : "Ссылка появится после заполнения в Notion"
          }
          badge={hasSheet ? "Google Sheets" : undefined}
          url={sheetUrl || undefined}
        />
        <CalcCard
          title={packages.title || "Простой · Средний · Премиум"}
          sub={packages.sub || "Готовые сборки с фиксированной ценой для менеджера"}
          badge={packages.sub ? undefined : "3 пакета"}
          url={sheetUrl || undefined}
        />
      </div>
      {priceFrom !== null ? (
        <div className="calc-price">
          Цена от <b>{formatPrice(priceFrom)}</b>
        </div>
      ) : null}
    </>
  );
}
