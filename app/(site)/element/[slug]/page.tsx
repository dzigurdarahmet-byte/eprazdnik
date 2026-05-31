// /element/[slug] — element detail (v4 §1). On-demand ISR + prebuilt slugs.
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconSlot } from "@/components/ui/IconSlot";
import { Tag } from "@/components/ui/Tag";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PropertyRow } from "@/components/ui/PropertyRow";
import { tagColorFor } from "@/lib/tag-color";
import { statusBadge } from "@/lib/status";
import { formatPrice } from "@/lib/format";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { getElementBySlug, listElements } from "@/lib/notion/elements";

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const elements = await listElements();
    return elements.map((e) => ({ slug: e.slug }));
  } catch {
    return []; // fall back to on-demand if Notion is unreachable at build
  }
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const element = await getElementBySlug(params.slug);
  if (!element) return { title: "Элемент не найден — Е-Праздник" };
  return { title: `${element.title} — Е-Праздник`, description: element.content.description[0] || element.title };
}

export default async function ElementPage({ params }: { params: Params }) {
  const element = await getElementBySlug(params.slug);
  if (!element) notFound();

  const badge = statusBadge(element.status);
  const { content } = element;

  type Section = { label: string; node: ReactNode };
  const sections: Section[] = [];
  if (content.description.length > 0) {
    sections.push({
      label: "Описание",
      node: content.description.map((p, i) => (
        <p key={i} className="detail-text">
          {p}
        </p>
      )),
    });
  }
  if (content.photo) {
    sections.push({
      label: "Фото",
      node: (
        <div className="el-photo">
          <Image src={content.photo} alt={element.title} fill sizes="(max-width: 900px) 100vw, 720px" style={{ objectFit: "cover" }} />
        </div>
      ),
    });
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
  if (element.usedInPrograms.length > 0) {
    sections.push({
      label: "Используется в программах",
      node: (
        <div className="used-in">
          {element.usedInPrograms.map((p) => (
            <Link key={p.slug} href={`/program/${p.slug}`} className="used-in-chip">
              <span className="used-in-dot" style={{ background: p.accent }} />
              {p.title}
            </Link>
          ))}
        </div>
      ),
    });
  }

  return (
    <div>
      <div className="detail-accent" style={{ background: element.accent }} />
      <div className="detail-wrap">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Элементы", href: "/elements" },
            { label: element.title },
          ]}
        />

        <div className="detail-hero">
          {element.coverImage ? (
            <div className="detail-hero-photo">
              <Image src={element.coverImage} alt={element.title} fill sizes="120px" style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <IconSlot name="element" size={64} accent={element.accent} tint={element.tint} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="detail-eyebrow">элемент{element.category ? ` · ${element.category}` : ""}</div>
            <h1 className="detail-h1">{element.title}</h1>
          </div>
        </div>

        <div className="detail-props">
          {element.category ? (
            <PropertyRow icon="◇" label="Категория">
              <Tag color="brown">{element.category}</Tag>
            </PropertyRow>
          ) : null}
          {badge ? (
            <PropertyRow icon="●" label="Статус">
              <Tag color={badge.color} dot={badge.dot}>
                {badge.label}
              </Tag>
            </PropertyRow>
          ) : null}
          {element.tags.length > 0 ? (
            <PropertyRow icon="✦" label="Теги">
              {element.tags.map((t, i) => (
                <Tag key={i} color={tagColorFor(t)}>
                  {t}
                </Tag>
              ))}
            </PropertyRow>
          ) : null}
          <PropertyRow icon="◆" label="Цена от">
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{formatPrice(element.priceFrom)}</span>
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
