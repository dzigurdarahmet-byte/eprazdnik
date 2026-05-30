// /program/[slug] — full program detail. Порт proto-notion/screen_program_detail.jsx.
// On-demand ISR: render on first request, then cache for `revalidate` seconds.
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PropertyRow } from "@/components/ui/PropertyRow";
import { Calc } from "@/components/program/Calc";
import { MediaGrid } from "@/components/program/MediaGrid";
import { LinkOrText, hasContent } from "@/components/program/LinkOrText";
import { tagColorFor } from "@/lib/tag-color";
import { statusBadge } from "@/lib/status";
import { formatPrice } from "@/lib/format";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { getProgramBySlug } from "@/lib/notion/programs";

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // No build-time prerender: separate SSG workers don't share the Notion
  // throttle, so we let pages build on first request (ISR) instead.
  return [];
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const program = await getProgramBySlug(params.slug);
  if (!program) return { title: "Программа не найдена — Е-Праздник" };
  return {
    title: `${program.title} — Е-Праздник`,
    description: program.subtitle || program.content.subtitle || program.title,
  };
}

const AUDIENCE_NOTE: Record<string, string> = {
  B2C: "детский праздник",
  B2B: "корпоративное мероприятие",
};

export default async function ProgramPage({ params }: { params: Params }) {
  const program = await getProgramBySlug(params.slug);
  if (!program) notFound();

  const { content } = program;
  const subtitle = program.subtitle || content.subtitle;
  const badge = statusBadge(program.status);
  const audienceNote = AUDIENCE_NOTE[program.audience];

  // Drop placeholder characters ("Уточнить у клиента" и т.п.) so a sparse card
  // doesn't render a stub as content (§ пустые состояния).
  const characters = content.characters.filter(
    (c) => c.name.trim().length > 0 && !/уточнить\s+у\s+клиента/i.test(c.name),
  );

  // Build the numbered sections that actually have content, then number them
  // sequentially — sparse cards stay finished-looking, no gaps in the numbering.
  const sections: Array<{ label: string; node: ReactNode }> = [];
  if (content.legend) {
    sections.push({
      label: "Легенда",
      node: content.legend.split("\n\n").map((para, i) => (
        <p key={i} className="detail-text">
          {para}
        </p>
      )),
    });
  }
  if (characters.length > 0) {
    sections.push({
      label: "Персонажи",
      node: (
        <div className="chars-grid">
          {characters.map((c, i) => {
            const col = i % 3;
            const lastRow = Math.floor(i / 3) === Math.floor((characters.length - 1) / 3);
            return (
              <div
                key={i}
                className="char-cell"
                style={{
                  borderRight: col < 2 ? "1px solid var(--border)" : "none",
                  borderBottom: lastRow ? "none" : "1px solid var(--border)",
                }}
              >
                <IconSlot name="char" size={32} accent={program.accent} tint={program.tint} emoji={c.emoji} />
                <div>
                  <div className="char-name">{c.name}</div>
                  {c.role ? <div className="char-role">{c.role}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      ),
    });
  }
  if (content.activities.length > 0) {
    sections.push({
      label: "Активности",
      node: (
        <ol className="acts">
          {content.activities.map((a, i) => (
            <li key={i} className="act-row">
              <span className="act-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="act-name">{a}</span>
            </li>
          ))}
        </ol>
      ),
    });
  }
  if (content.finale) {
    sections.push({ label: "Финал", node: <p className="detail-text">{content.finale}</p> });
  }
  // Расчёт всегда присутствует — жёлтая плашка валидна по дизайну прототипа.
  sections.push({
    label: "Расчёт и расходники",
    node: <Calc title={program.title} pricing={content.pricing} priceFrom={program.priceFrom} />,
  });
  if (content.media.length > 0) {
    sections.push({ label: "Медиа и материалы", node: <MediaGrid tiles={content.media} /> });
  }
  if (content.techRequirements.length > 0) {
    sections.push({
      label: "Технический блок",
      node: (
        <ul className="tech-list">
          {content.techRequirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ),
    });
  }
  if (hasContent(content.scripts)) {
    sections.push({ label: "Скрипты продаж", node: <LinkOrText section={content.scripts} /> });
  }
  if (hasContent(content.cases)) {
    sections.push({ label: "Кейсы", node: <LinkOrText section={content.cases} /> });
  }

  return (
    <div>
      <div className="detail-accent" style={{ background: program.accent }} />
      <div className="detail-wrap">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Программы", href: "/catalog" },
            { label: program.title },
          ]}
        />

        <div className="detail-hero">
          <IconSlot
            name={program.coverKind}
            size={64}
            accent={program.accent}
            tint={program.tint}
            emoji={program.coverEmoji}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="detail-eyebrow">программа{program.format ? ` · ${program.format}` : ""}</div>
            <h1 className="detail-h1">{program.title}</h1>
            {subtitle ? <div className="detail-sub">{subtitle}</div> : null}
          </div>
        </div>

        <div className="detail-props">
          {program.category ? (
            <PropertyRow icon="◇" label="Категория">
              <Tag color="brown">{program.category}</Tag>
            </PropertyRow>
          ) : null}
          {program.audience !== "OTHER" ? (
            <PropertyRow icon="◎" label="Тип">
              <Tag color={program.audience === "B2B" ? "blue" : "green"}>{program.audience}</Tag>
              {audienceNote ? <span style={{ color: "var(--text-muted)" }}>{audienceNote}</span> : null}
            </PropertyRow>
          ) : null}
          {badge ? (
            <PropertyRow icon="●" label="Статус">
              <Tag color={badge.color} dot={badge.dot}>
                {badge.label}
              </Tag>
            </PropertyRow>
          ) : null}
          {program.tags.length > 0 ? (
            <PropertyRow icon="✦" label="Теги">
              {program.tags.map((t, i) => (
                <Tag key={i} color={tagColorFor(t)}>
                  {t}
                </Tag>
              ))}
            </PropertyRow>
          ) : null}
          {program.ageRange ? (
            <PropertyRow icon="○" label="Возраст">
              <span style={{ color: "var(--text)" }}>{program.ageRange}</span>
            </PropertyRow>
          ) : null}
          {program.duration ? (
            <PropertyRow icon="◐" label="Длительность">
              <span style={{ color: "var(--text)" }}>{program.duration}</span>
            </PropertyRow>
          ) : null}
          <PropertyRow icon="◆" label="Цена от">
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{formatPrice(program.priceFrom)}</span>
          </PropertyRow>
        </div>

        {sections.map((s, i) => (
          <Fragment key={s.label}>
            <SectionLabel num={String(i + 1).padStart(2, "0")}>{s.label}</SectionLabel>
            {s.node}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
