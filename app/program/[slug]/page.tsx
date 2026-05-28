// /program/[slug] — full program detail.
// generateStaticParams pre-builds every slug at compile time; ISR keeps them fresh.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Cover } from "@/components/Cover";
import { Icon } from "@/components/Icon";
import { MediaCard } from "@/components/MediaCard";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getProgramBySlug } from "@/lib/notion/programs";

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

/**
 * Pure ISR: pages render on the first request after deploy, then sit in cache
 * for `revalidate` seconds. We deliberately don't pre-render at build time —
 * with 16 programs × ~10 Notion calls each, parallel SSG workers blow past
 * the 3-req/sec Notion limit (even with the in-process throttle, separate
 * Next.js build workers don't share the chain).
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params },
): Promise<Metadata> {
  const program = await getProgramBySlug(params.slug);
  if (!program) return { title: "Программа не найдена — Е-Праздник" };
  return {
    title: `${program.title} — Е-Праздник`,
    description: program.subtitle || program.content.subtitle || program.title,
    openGraph: {
      title: program.title,
      description: program.subtitle || program.content.subtitle,
    },
  };
}

export default async function ProgramPage({ params }: { params: Params }) {
  const program = await getProgramBySlug(params.slug);
  if (!program) notFound();

  const { content } = program;
  const subtitle = program.subtitle || content.subtitle;

  return (
    <div className="page-enter">
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/catalog">Каталог</Link>
        <span className="sep">/</span>
        <span className="cur">{program.title}</span>
      </nav>

      <article className="prog-hero">
        <div className="prog-hero-img">
          <Cover kind={program.coverKind} emoji={program.coverEmoji} />
        </div>
        <div className="prog-hero-info">
          <div>
            <h1 className="prog-hero-title">{program.title}</h1>
            {subtitle ? <div className="prog-hero-sub">{subtitle}</div> : null}
          </div>

          {program.tags.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {program.tags.map((t) => (
                <span key={t} className="ptag amber">{t}</span>
              ))}
            </div>
          ) : null}

          <div className="metrics-row">
            {program.ageRange ? (
              <div className="metric">
                <div className="metric-ico pink"><Icon n="baby" size={16} /></div>
                <div>
                  <div className="metric-label">Возраст</div>
                  <div className="metric-value">{program.ageRange} лет</div>
                </div>
              </div>
            ) : null}
            {program.duration ? (
              <div className="metric">
                <div className="metric-ico amber"><Icon n="clock" size={16} /></div>
                <div>
                  <div className="metric-label">Длительность</div>
                  <div className="metric-value">{program.duration}</div>
                </div>
              </div>
            ) : null}
            {program.guests ? (
              <div className="metric">
                <div className="metric-ico cyan"><Icon n="users" size={16} /></div>
                <div>
                  <div className="metric-label">Гостей</div>
                  <div className="metric-value">{program.guests}</div>
                </div>
              </div>
            ) : null}
            {program.priceFrom !== null ? (
              <div className="metric">
                <div className="metric-ico purple"><Icon n="ruble" size={16} /></div>
                <div>
                  <div className="metric-label">Стоимость</div>
                  <div className="metric-value">от {formatPrice(program.priceFrom)}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      <div className="prog-body">
        <div>
          {content.legend ? (
            <section className="prog-section">
              <h2><Icon n="book" size={18} /> Легенда программы</h2>
              {content.legend.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </section>
          ) : null}

          {content.finale ? (
            <section className="prog-section">
              <h2><Icon n="sparkles" size={18} /> Финал</h2>
              <p>{content.finale}</p>
            </section>
          ) : null}

          {content.activities.length > 0 ? (
            <section className="prog-section">
              <h2><Icon n="compass" size={18} /> Активности</h2>
              <div className="includes-list">
                {content.activities.map((a, i) => (
                  <div className="includes-item" key={i}>
                    <div
                      className="includes-ico"
                      style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}
                      aria-hidden
                    >
                      <Icon n="check" size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="includes-title">{a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {content.characters.length > 0 ? (
            <section className="prog-section">
              <h2><Icon n="users" size={18} /> Персонажи</h2>
              <div className="chars-row">
                {content.characters.map((c, i) => (
                  <div className="char-card" key={i}>
                    <div
                      className="char-avatar"
                      style={{ background: "linear-gradient(135deg,#c7d2fe,#6366f1)", display: "grid", placeItems: "center" }}
                      aria-hidden
                    >
                      <span style={{ fontSize: 22 }}>{c.emoji || c.name[0]}</span>
                    </div>
                    <div>
                      <div className="char-name">{c.name}</div>
                      {c.role ? <div className="char-role">{c.role}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {content.techRequirements.length > 0 ? (
            <section className="prog-section">
              <h2><Icon n="wand" size={18} /> Технические требования</h2>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
                {content.techRequirements.map((r, i) => (
                  <li key={i} style={{ color: "var(--text-2)", lineHeight: 1.5 }}>{r}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {content.media.length > 0 ? (
            <section className="prog-section">
              <h2><Icon n="image" size={18} /> Медиа</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {content.media.map((m, i) => (
                  <MediaCard key={i} tile={m} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside>
          <div className="aside-card">
            <h4>Расчёт</h4>
            {content.pricing.yellowNote ? (
              <p style={{ color: "var(--text-2)", marginBottom: 14, fontSize: 13, lineHeight: 1.5 }}>
                {content.pricing.yellowNote}
              </p>
            ) : null}
            {content.pricing.constructor.title ? (
              <div className="spec-row">
                <span className="label">{content.pricing.constructor.title}</span>
                {content.pricing.constructor.sub ? <b>{content.pricing.constructor.sub}</b> : null}
              </div>
            ) : null}
            {content.pricing.packages.title ? (
              <div className="spec-row">
                <span className="label">{content.pricing.packages.title}</span>
                {content.pricing.packages.sub ? <b>{content.pricing.packages.sub}</b> : null}
              </div>
            ) : null}
            {program.priceFrom !== null ? (
              <div className="spec-row">
                <span className="label">Цена от</span>
                <b>{formatPrice(program.priceFrom)}</b>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
