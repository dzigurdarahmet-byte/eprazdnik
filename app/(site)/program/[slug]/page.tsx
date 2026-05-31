// /program/[slug] — full program detail. Порт proto-notion/screen_program_detail.jsx.
// On-demand ISR: render on first request, then cache for `revalidate` seconds.
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconSlot } from "@/components/ui/IconSlot";
import { TrackRecent } from "@/components/program/TrackRecent";
import { Tag } from "@/components/ui/Tag";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PropertyRow } from "@/components/ui/PropertyRow";
import { Calc } from "@/components/program/Calc";
import { MediaGrid } from "@/components/program/MediaGrid";
import { LinkOrText, hasContent } from "@/components/program/LinkOrText";
import { ElementCard } from "@/components/elements/ElementCard";
import { tagColorFor } from "@/lib/tag-color";
import { statusBadge } from "@/lib/status";
import { formatPrice } from "@/lib/format";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { getProgramBySlug, listPrograms } from "@/lib/notion/programs";
import { getElementsForProgram } from "@/lib/notion/elements";
import type { MediaTile } from "@/types/program";

const VIDEO_RE = /видео|video|тизер|teaser|reels|reel|youtu|vimeo|rutube|\.mp4/i;
function isVideoTile(t: MediaTile): boolean {
  return VIDEO_RE.test(`${t.title} ${t.meta} ${t.url}`);
}

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // Prebuild all program slugs so the first open after a deploy is instant.
  // Fetches go through the shared throttle (+429 backoff); dynamicParams=true
  // keeps any un-built page available on demand.
  try {
    const programs = await listPrograms();
    return programs.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
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

  const programElements = await getElementsForProgram(program.id);
  const { content } = program;
  const subtitle = program.subtitle || content.subtitle;
  const badge = statusBadge(program.status);
  const audienceNote = AUDIENCE_NOTE[program.audience];

  // Drop placeholder characters ("Уточнить у клиента" и т.п.) so a sparse card
  // doesn't render a stub as content (§ пустые состояния).
  const characters = content.characters.filter(
    (c) => c.name.trim().length > 0 && !/уточнить\s+у\s+клиента/i.test(c.name),
  );

  // Numbering is sequential across all sections (two-column top block first,
  // then full-width sections), so sparse cards have no gaps.
  let counter = 0;
  const num = () => String(++counter).padStart(2, "0");
  type Block = { num: string; label: string; node: ReactNode };

  // Two-column top block (v4): left = Легенда + Финал, right = Активности.
  const legendBlock: Block | null = content.legend
    ? {
        num: num(),
        label: "Легенда",
        node: content.legend.split("\n\n").map((para, i) => (
          <p key={i} className="detail-text">
            {para}
          </p>
        )),
      }
    : null;
  const finaleBlock: Block | null = content.finale
    ? { num: num(), label: "Финал", node: <p className="detail-text">{content.finale}</p> }
    : null;
  const activitiesBlock: Block | null =
    content.activities.length > 0
      ? {
          num: num(),
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
        }
      : null;
  const hasTop = Boolean(legendBlock || finaleBlock || activitiesBlock);

  // Full-width sections below the two-column block.
  const rest: Block[] = [];
  if (characters.length > 0) {
    rest.push({
      num: num(),
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
  // Расчёт всегда присутствует — жёлтая плашка валидна по дизайну прототипа.
  rest.push({
    num: num(),
    label: "Расчёт и расходники",
    node: <Calc title={program.title} pricing={content.pricing} priceFrom={program.priceFrom} />,
  });
  if (content.media.length > 0) {
    const videos = content.media.filter(isVideoTile);
    const photos = content.media.filter((t) => !isVideoTile(t));
    if (videos.length > 0 && photos.length > 0) {
      rest.push({ num: num(), label: "Медиа фото", node: <MediaGrid tiles={photos} /> });
      rest.push({ num: num(), label: "Медиа видео", node: <MediaGrid tiles={videos} /> });
    } else {
      rest.push({ num: num(), label: "Медиа и материалы", node: <MediaGrid tiles={content.media} /> });
    }
  }
  if (hasContent(content.creative)) {
    rest.push({ num: num(), label: "Творческий блок", node: <LinkOrText section={content.creative} /> });
  }
  if (content.techRequirements.length > 0) {
    rest.push({
      num: num(),
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
  if (programElements.length > 0) {
    rest.push({
      num: num(),
      label: "Элементы программы",
      node: (
        <div className="pcard-grid">
          {programElements.map((e) => (
            <ElementCard key={e.id} e={e} />
          ))}
        </div>
      ),
    });
  }
  if (hasContent(content.scripts)) {
    rest.push({ num: num(), label: "Скрипты продаж", node: <LinkOrText section={content.scripts} /> });
  }
  if (hasContent(content.cases)) {
    rest.push({ num: num(), label: "Кейсы", node: <LinkOrText section={content.cases} /> });
  }

  return (
    <div>
      <TrackRecent slug={program.slug} />
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
          {program.coverImage ? (
            <div className="detail-hero-photo">
              <Image src={program.coverImage} alt={program.title} fill sizes="120px" style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <IconSlot
              name={program.coverKind}
              size={64}
              accent={program.accent}
              tint={program.tint}
              emoji={program.coverEmoji}
            />
          )}
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

        {hasTop ? (
          <div className="detail-top-grid">
            <div className="detail-col">
              {legendBlock ? (
                <>
                  <SectionLabel num={legendBlock.num}>Легенда</SectionLabel>
                  {legendBlock.node}
                </>
              ) : null}
              {finaleBlock ? (
                <>
                  <SectionLabel num={finaleBlock.num}>Финал</SectionLabel>
                  {finaleBlock.node}
                </>
              ) : null}
            </div>
            <div className="detail-col">
              {activitiesBlock ? (
                <>
                  <SectionLabel num={activitiesBlock.num}>Активности</SectionLabel>
                  {activitiesBlock.node}
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {rest.map((s) => (
          <Fragment key={s.label}>
            <SectionLabel num={s.num}>{s.label}</SectionLabel>
            {s.node}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
