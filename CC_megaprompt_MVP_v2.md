# Мегапромт для Claude Code: MVP сайта-каталога «Е-Праздник» (v2)

> Версия 2 — пересобрано по стандартам `rossi-megaprompt-author` (структура 10 секций + 8a + 8b) и `staff-engineer-coding` (ADR, error handling, logging, tests, security).
>
> Это самодостаточная задача для Claude Code. Прочитай документ целиком, потом действуй по плану. Не делай ничего сверх Acceptance criteria. Не оставляй `TODO: implement later`. Каждый блок кода — ship-ready.

---

## 0. ADR (Architecture Decision Record)

### 0.1. Контекст

Агентство детских праздников «Е-Праздник» (клиент Sitt5, Kwork) заказывает публичный сайт-каталог программ. Контент уже лежит в Notion-базе (наша работа по основному контракту, 18 000 ₽). Кастомный сайт — вторая фаза проекта (ещё 18 000 ₽, итого 36 000 ₽), компенсация за компромисс с Notion-визуалом.

**Бизнес-задача:** превратить HTML-прототип (статический mockup) в реальный сайт с реальными данными, не выходя за scope в 36 000 ₽.

### 0.2. Решение

**Стек:** Next.js 14+ (App Router) + TypeScript strict + Tailwind CSS + Notion API + Vercel.

**Принципы:**

1. **Notion как Headless CMS.** Клиент редактирует контент в Notion. Сайт — публичная морда поверх Notion API. Никакой отдельной админки.
2. **Server Components где можно.** Все запросы к Notion на сервере. Client Components только для интерактивности (поиск, фильтры, табы).
3. **ISR (Incremental Static Regeneration).** Страницы регенерируются каждые 60 секунд. Это уменьшает rate-limit давление на Notion API.
4. **Прототип как референс.** Папка `proto/` (12 файлов из архива клиента) — источник вёрстки и стилей. CC копирует CSS-классы и JSX-разметку оттуда.

### 0.3. Альтернативы рассмотренные

| Альтернатива | Почему отвергнуто |
|---|---|
| Notion + Super.so / Potion (no-code обёртки) | Не дают точного контроля над визуалом — клиент именно эту проблему и хотел решить |
| Headless CMS (Strapi / Directus / Sanity) | Клиент уже работает в Notion, не хочет учить новый инструмент. Перенос контента — лишняя работа |
| Static Site Generator (Astro / Gatsby) | Next.js даёт лучший DX, встроенную поддержку ISR, и его понимает Claude Code |
| Vue / Nuxt | Прототип написан на React, переписывать не имеет смысла |
| Кастомная админка с своей БД | Выходит за scope в 36 000 ₽, дублирует функционал Notion |

### 0.4. Последствия (trade-offs)

**Плюсы:**

- Клиент редактирует контент привычным способом
- Минимум кода — Notion API уже даёт CRUD
- Бесплатный хостинг на Vercel
- Точный контроль над визуалом

**Минусы:**

- Rate-limit Notion API (3 req/sec) — митигируется ISR + кешем
- Vendor lock на Vercel (можно мигрировать на Netlify / Railway за день)
- Если Notion упадёт — сайт продолжит работать на кеше до следующей revalidation, но новые программы не появятся

### 0.5. Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                          BROWSER                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Next.js App (Server + Client Components)              │  │
│  │  - / (Главная)                                          │  │
│  │  - /catalog (список программ)                           │  │
│  │  - /program/[slug] (страница программы)                 │  │
│  │  - /api/health (мониторинг)                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
            ↑                                ↑
            │ HTML/CSS/JS (Server)           │ JSON (Client)
            │                                │
┌──────────────────────────────────────────────────────────────┐
│                       VERCEL (Edge)                           │
│  - ISR cache (60s revalidate)                                │
│  - Server Components rendering                                │
│  - Environment variables                                      │
└──────────────────────────────────────────────────────────────┘
            ↑
            │ Notion API (Server-side only)
            │
┌──────────────────────────────────────────────────────────────┐
│                         NOTION                                │
│  - DB «📚 Программы» (16 + 1 шаблон)                          │
│  - DB «🧩 Элементы» (27 элементов)                            │
│  - Контент-блоки внутри страниц программ                      │
└──────────────────────────────────────────────────────────────┘
            ↑
            │ Edit via Notion UI
            │
        ┌────────┐
        │ Клиент │ (агентство Е-Праздник)
        └────────┘
```

### 0.6. Project Structure

```
eprazdnik/
├── app/
│   ├── layout.tsx              # Root: html lang="ru", шрифты, sidebar
│   ├── page.tsx                # Главная (Server Component)
│   ├── globals.css             # Стили из proto/styles.css
│   ├── catalog/
│   │   └── page.tsx            # /catalog (Server)
│   ├── program/
│   │   └── [slug]/
│   │       ├── page.tsx        # /program/holodnoe-serdce (Server)
│   │       └── not-found.tsx   # 404 для несуществующих slug
│   ├── api/
│   │   └── health/
│   │       └── route.ts        # /api/health (мониторинг)
│   ├── error.tsx               # Global Error Boundary
│   └── not-found.tsx           # Global 404
├── components/
│   ├── Sidebar.tsx             # Server (статика)
│   ├── ProgramCard.tsx         # Server
│   ├── Hero.tsx                # Server
│   ├── Tabs.tsx                # Client (useState)
│   ├── MediaCard.tsx           # Server
│   ├── Cover.tsx               # Server
│   ├── Icon.tsx                # Server (обёртка lucide-react)
│   ├── SearchBox.tsx           # Client (input + filter)
│   ├── Chips.tsx               # Client (active state)
│   ├── CatalogContent.tsx      # Client (содержит SearchBox, Chips, grid)
│   └── ErrorBoundary.tsx       # Client (React Error Boundary)
├── lib/
│   ├── notion/
│   │   ├── client.ts           # Notion API клиент + типы
│   │   ├── programs.ts         # listPrograms, getProgram
│   │   ├── parser.ts           # parseProgram блоков → ProgramContent
│   │   └── errors.ts           # Кастомные классы ошибок
│   ├── env.ts                  # Типизированная конфигурация env vars (zod)
│   ├── logger.ts               # pino structured logger
│   ├── slugify.ts              # Транслитерация русского → латинского URL slug
│   └── constants.ts            # Константы (TEMPLATE_TITLE_PREFIX, REVALIDATE_SECONDS, etc.)
├── types/
│   ├── program.ts              # Domain models (Program, ProgramContent, Section)
│   └── notion.ts               # Aliasы поверх @notionhq/client типов
├── tests/
│   ├── unit/
│   │   ├── parser.test.ts      # 10+ тестов парсера блоков
│   │   ├── slugify.test.ts     # 5+ тестов транслитерации
│   │   └── env.test.ts         # Валидация env схемы
│   ├── integration/
│   │   └── notion.test.ts      # 3+ интеграционных теста с mock'ом Notion
│   ├── snapshot/
│   │   ├── ProgramCard.test.tsx
│   │   ├── Hero.test.tsx
│   │   └── Sidebar.test.tsx
│   └── fixtures/
│       ├── notion-response.json    # Сохранённый ответ Notion API для тестов
│       └── program-blocks.json     # Сохранённые блоки страницы
├── proto/                      # Прототип-референс (read-only)
│   └── ... (12 файлов)
├── public/
├── .env.example
├── .env.local                  # gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json               # strict: true, noUncheckedIndexedAccess: true
├── vitest.config.ts
├── eslint.config.js            # с правилом no-explicit-any: error
├── package.json
├── README.md
└── .gitignore
```

---

## 1. Контекст

Делаем публичный сайт-каталог для агентства детских праздников. Контент уже лежит в Notion-базе (две БД):

| База | ID | Содержит |
|---|---|---|
| 📚 Программы | `36cdaa5e-0af7-80b1-af9f-e1b05497b255` | 16 рабочих программ + 1 шаблон (исключить) |
| 🧩 Элементы | `36cdaa5e-0af7-81e6-a74a-f242037b1102` | 27 элементов авторских программ |

**Эталонная программа** — «Индейский квест», ID `36ddaa5e-0af7-816d-8e1a-def5d1c3465c`. На ней проверять корректность парсинга и рендеринга.

**Артефакты на входе:**

- Папка `proto/` — 12 файлов HTML/React прототипа (статический mockup на React через CDN). CC использует как референс вёрстки и стилей. Файлы:
  - `index.html`, `app.jsx`, `data.jsx`, `icons.jsx`, `covers.jsx`, `sidebar.jsx`
  - `screens/dashboard.jsx`, `screens/catalog.jsx`, `screens/program.jsx`, `screens/match.jsx`
  - `tweaks-panel.jsx`, `styles.css` (891 строка кастомного CSS)
- Документ `Кастомный_сайт_Scope_v1.md` — детальный scope в той же папке (контекст для понимания целевого продукта).

**Notion-токен:** Sergey передаст отдельно. В коде — НИКОГДА не хардкодить.

---

## 2. Цель

Сделать MVP сайта с 3 публичными страницами (Главная / Каталог / Программа), визуально соответствующего прототипу, с реальными данными из Notion, развернутого на Vercel, с базовым покрытием тестами и обвязкой production-grade.

---

## 3. Не-цели (явный scope-cut)

CC НЕ делает в этом MVP:

- ❌ AI-подбор услуги по фильтрам (LLM, эмбеддинги) — отдельный проект
- ❌ Авторизация менеджеров с личным кабинетом
- ❌ Подборки для отправки клиентам через сайт
- ❌ Скрипты продаж и Прайсы как полноценные разделы (только стабы-заглушки)
- ❌ Кастомная админка для контента (контент в Notion)
- ❌ Booking-форма, платежи, CRM
- ❌ Многоязычность (только русский)
- ❌ Мобильное приложение (только адаптивный сайт)
- ❌ E2E тесты с Playwright (только unit + integration + snapshot)
- ❌ Storybook
- ❌ Сложные анимации между страницами (только базовый CSS-transition)
- ❌ Серверный поиск с Elastic / Algolia (только клиентская фильтрация массива)

---

## 4. Спецификация

### 4.1. Notion API клиент (`lib/notion/client.ts`)

```ts
import { Client } from "@notionhq/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export const notion = new Client({
  auth: env.NOTION_TOKEN,
  logLevel: env.NODE_ENV === "production" ? undefined : "INFO",
});

export const DB_PROGRAMS = env.NOTION_DB_PROGRAMS_ID;
export const DB_ELEMENTS = env.NOTION_DB_ELEMENTS_ID;
```

Никаких `process.env.NOTION_TOKEN!` напрямую. Только через `env` (см. §4.7).

### 4.2. Парсер блоков (`lib/notion/parser.ts`)

Структура карточки программы в Notion (после нашей предыдущей работы):

- `heading_2` — подзаголовок программы
- `column_list` пара 1: [01 Легенда + 02 Финал] | [03 Активности]
- `column_list` пара 2: [04 Персонажи] | [05 Технические требования]
- `column_list` пара 3: [06 Расчёт + жёлтый callout + 2 карточки] | [07 Медиа плитки]
- `heading_1` секция 08 «Творческий отдел» (НЕ показывать на сайте)
- `column_list` (4 плитки Творческого отдела) (НЕ показывать)
- `heading_1` секция 10 «Элементы программы» (НЕ показывать)
- `bulleted_list_item` × 12 (НЕ показывать)

Целевой тип:

```ts
export type ProgramContent = {
  subtitle: string;              // из heading_2
  legend: string;                // блоки под "01 Легенда"
  finale: string;                // блоки под "02 Финал"
  activities: string[];          // numbered list под "03 Активности"
  characters: Array<{ emoji: string; name: string; role?: string }>;
  techRequirements: string[];
  pricing: {
    yellowNote: string;          // жёлтый callout
    constructor: { title: string; sub: string };
    packages: { title: string; sub: string };
  };
  media: Array<{
    emoji: string;
    title: string;
    url: string;                 // link annotation из rich_text
    meta: string;
  }>;
};
```

**Требования к парсеру:**

- Defensive coding: каждое поле имеет default, парсер не падает на отсутствующих секциях
- Возвращает все поля заполненными (пустые строки / пустые массивы при отсутствии данных)
- Не делает повторных запросов к Notion API — парсит из переданного массива блоков
- Логирует через `logger.warn` если секция не найдена (но не бросает)

### 4.3. Программы (`lib/notion/programs.ts`)

```ts
export async function listPrograms(): Promise<ProgramSummary[]>;
export async function getProgram(pageId: string): Promise<ProgramDetail>;
export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null>;
```

**`listPrograms`:**

- Query к DB_PROGRAMS
- Фильтр: исключить страницы где `Название` начинается с `[ШАБЛОН]`
- Сортировка: по `Название` ascending
- Возвращает массив `ProgramSummary` (без блоков, только properties)
- Cache: `fetch` с `next: { revalidate: 60 }`

**`getProgramBySlug`:**

- Вызывает `listPrograms()`
- Находит программу через `slugify(getTitle(p)) === slug`
- Возвращает `null` если не найдена
- Если найдена — вызывает `getProgram(p.id)` для блоков

### 4.4. Типизированная env конфигурация (`lib/env.ts`)

```ts
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NOTION_TOKEN: z.string().min(1, "NOTION_TOKEN required"),
  NOTION_DB_PROGRAMS_ID: z.string().uuid().or(z.string().regex(/^[a-f0-9-]{32,36}$/)),
  NOTION_DB_ELEMENTS_ID: z.string().uuid().or(z.string().regex(/^[a-f0-9-]{32,36}$/)),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const env = (() => {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid env:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
})();
```

`.env.example`:

```
NODE_ENV=development
NOTION_TOKEN=secret_xxx
NOTION_DB_PROGRAMS_ID=36cdaa5e-0af7-80b1-af9f-e1b05497b255
NOTION_DB_ELEMENTS_ID=36cdaa5e-0af7-81e6-a74a-f242037b1102
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.5. Error handling (`lib/notion/errors.ts`)

```ts
export class NotionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "NotionError";
  }
}

export class ProgramNotFoundError extends NotionError {
  constructor(public readonly slug: string) {
    super(`Program not found: ${slug}`);
    this.name = "ProgramNotFoundError";
  }
}

export class NotionRateLimitError extends NotionError {
  constructor(public readonly retryAfter?: number) {
    super("Notion API rate limit exceeded");
    this.name = "NotionRateLimitError";
  }
}

export class NotionParseError extends NotionError {
  constructor(message: string, public readonly blockType?: string) {
    super(`Failed to parse Notion block: ${message}`);
    this.name = "NotionParseError";
  }
}
```

В функциях `lib/notion/*` — оборачивать Notion SDK ошибки в типизированные.

**Page-level error.tsx:**

```tsx
// app/error.tsx
"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  logger.error("page.error", { name: error.name, message: error.message, stack: error.stack });
  return (
    <div className="error-page">
      <h2>Что-то пошло не так</h2>
      <button onClick={reset}>Попробовать ещё раз</button>
    </div>
  );
}
```

### 4.6. Structured logging (`lib/logger.ts`)

```ts
import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
```

**Использование:**

```ts
logger.info({ programId: id, durationMs: elapsed }, "program.fetched");
logger.warn({ slug }, "program.not_found");
logger.error({ err: error.message, slug }, "program.parse_failed");
```

Никаких `console.log` в production-коде. Допустимо только в `app/error.tsx` для critical fallback.

### 4.7. Caching и revalidation

- Все запросы к Notion API — Server-side
- `fetch` с `next: { revalidate: 60 }` — кеш 1 минута
- Tags для целевой инвалидации: `notion:programs`, `notion:program:${id}`
- `generateStaticParams()` для `/program/[slug]` — генерирует все slug при build

### 4.8. Security

**Обязательно:**

- `next.config.js` с security headers:
  ```js
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ]
  ```
- Внешние ссылки (Я.Диск) — обязательно `target="_blank" rel="noopener noreferrer"`
- Никаких `dangerouslySetInnerHTML` без обоснования
- Notion токен НИКОГДА не попадает в client bundle (он только в server-side файлах)

### 4.9. Health check endpoint

`app/api/health/route.ts`:

```ts
import { NextResponse } from "next/server";
import { listPrograms } from "@/lib/notion/programs";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    const programs = await listPrograms();
    const elapsed = Date.now() - start;
    logger.info({ count: programs.length, durationMs: elapsed }, "health.ok");
    return NextResponse.json({
      status: "ok",
      programsCount: programs.length,
      durationMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ err: (error as Error).message }, "health.fail");
    return NextResponse.json(
      { status: "error", error: (error as Error).message },
      { status: 503 }
    );
  }
}
```

### 4.10. SLO/SLI таблица

| Метрика | Target | Как измеряем |
|---|---|---|
| Availability | 99% | Vercel uptime monitoring + /api/health |
| Latency p50 (catalog) | < 500 ms | Vercel Speed Insights |
| Latency p99 (catalog) | < 2000 ms | Vercel Speed Insights |
| Lighthouse Performance | > 80 | Lighthouse CI после деплоя |
| Lighthouse Accessibility | > 90 | Lighthouse CI после деплоя |
| Error rate | < 1% запросов | Vercel logs + pino error level |

### 4.11. Стили

Скопировать `proto/styles.css` (891 строка) в `app/globals.css`. Сохранить CSS-переменные (`--purple`, `--text-1`, `--green`, `--bg-soft` и т.д.). Tailwind использовать для **новых** компонентов, классы из proto — для портированных компонентов.

В Hero на главной должна быть **динамическая** цифра «N программ» из реального `listPrograms().length`, а не моковая «86» из прототипа.

---

## 5. Файловая структура

См. §0.6 Project Structure. Все новые файлы в этом дереве.

**Не трогать (вне scope):**

- Папку `proto/` — read-only, это референс
- Notion-базы — наполнение делает Sergey/клиент через UI, CC только читает через API
- `.env.local` — Sergey создаёт локально, не коммитить

---

## 6. Тесты

Минимум **20 тестов**:

### 6.1. Unit (lib/)

**`parser.test.ts`** (12+ тестов):
- ✅ Парсит heading_2 в `subtitle`
- ✅ Парсит секцию «01 Легенда» в `legend`
- ✅ Парсит секцию «02 Финал» в `finale`
- ✅ Парсит numbered_list_item секции «03 Активности» в `activities[]`
- ✅ Парсит секцию «04 Персонажи» в `characters[]` с эмодзи и именами
- ✅ Парсит секцию «05 Технические требования» в `techRequirements[]`
- ✅ Парсит жёлтый callout в `pricing.yellowNote`
- ✅ Парсит callout «Конструктор» в `pricing.constructor`
- ✅ Парсит callout «Простой · Средний · Премиум» в `pricing.packages`
- ✅ Парсит callouts медиа с link annotation в `media[]`
- ✅ Возвращает дефолты при отсутствии секций (не падает)
- ✅ Логирует warn при отсутствии ожидаемой секции

**`slugify.test.ts`** (5+ тестов):
- «Холодное Сердце» → "holodnoe-serdtse" (или близкий, должно быть детерминированно)
- «Индейский квест» → "indeyskiy-kvest"
- Двойные пробелы → один дефис
- Спецсимволы (!?,.) — удаляются
- Lowercase

**`env.test.ts`** (3+ тестов):
- Валидная env — `env` парсится без ошибок
- Пустой `NOTION_TOKEN` — throw
- Невалидный UUID для `NOTION_DB_PROGRAMS_ID` — throw

### 6.2. Integration

**`notion.test.ts`** (3+ тестов, с mock'ом `@notionhq/client`):
- `listPrograms()` исключает страницы с `[ШАБЛОН]` в названии
- `getProgramBySlug("indeyskiy-kvest")` возвращает программу
- `getProgramBySlug("несуществующий")` возвращает null

### 6.3. Snapshot

**`ProgramCard.test.tsx`**:
- Рендерится с минимальными props
- Рендерится с длинным названием (truncate)

**`Hero.test.tsx`**:
- Рендерится с метриками
- Рендерится без обложки (fallback cover)

**`Sidebar.test.tsx`**:
- Содержит все пункты навигации

### 6.4. Test runner

- Vitest + @testing-library/react
- Configs в `vitest.config.ts`
- Coverage threshold: 70% для `lib/`, 50% для `components/`

---

## 7. Acceptance criteria

После выполнения мегапромта:

- ☐ Запущен Next.js 14+ проект с App Router и TypeScript strict
- ☐ `tsc --noEmit` без ошибок
- ☐ `eslint` без warning/error (rule `no-explicit-any` = error)
- ☐ `npm run build` без warning/error
- ☐ `vitest run` все 20+ тестов проходят
- ☐ Coverage `lib/` ≥ 70%
- ☐ 3 публичные страницы: `/`, `/catalog`, `/program/[slug]`
- ☐ `/api/health` возвращает 200 с количеством программ
- ☐ Визуал соответствует прототипу (стили, типографика, hover, тонкие борды)
- ☐ Каталог рендерит 16 программ из Notion (без шаблона)
- ☐ Hero на главной — динамическая цифра «N программ» (не моковая 86)
- ☐ Страница программы рендерит легенду, активности, персонажей, расчёт, медиа
- ☐ Поиск в каталоге работает по названию (case-insensitive)
- ☐ Чипсы-фильтры в каталоге работают по тегам (multi_select)
- ☐ Ссылки на Я.Диск кликабельные, открываются в новой вкладке
- ☐ Адаптив работает на 320px (iPhone SE) и 768px (iPad)
- ☐ ErrorBoundary ловит ошибки рендеринга, не белый экран
- ☐ Все env переменные валидируются через zod
- ☐ Все Notion errors типизированы
- ☐ Все логи через `pino`, ни одного `console.log` в `src/`
- ☐ Security headers настроены в `next.config.js`
- ☐ Задеплоено на Vercel, public URL работает
- ☐ Lighthouse Performance ≥ 80, Accessibility ≥ 90
- ☐ README с инструкцией по запуску и обновлению контента
- ☐ Минимум 1 git-коммит в main

---

## 8. Git workflow

Один репозиторий на GitHub (приватный), ветка `main`. Коммиты по этапам:

```
feat: setup next.js + typescript + tailwind
feat: lib/env + lib/logger + lib/notion/client
feat: lib/notion/parser with tests
feat: lib/notion/programs with tests
feat: app/catalog page + components
feat: app/program/[slug] page + components
feat: app/page (главная)
feat: app/api/health endpoint
feat: error boundaries + not-found pages
feat: security headers + accessibility polish
test: snapshot tests for components
chore: deploy to vercel + readme
```

### 8a. Risk class

**Medium.**

Обоснование:

- Новый проект, новый код, публичный интерфейс
- Внешний API (Notion) с rate-limit — митигировано через ISR
- Vercel free tier limits — для 16 программ запаса достаточно, мониторить
- Парсер блоков может упасть на нестандартной структуре — митигировано defensive coding и тестами

**Auto-merge:** Нет. Ручной мердж Sergey'я после ревью.

### 8b. Git Hygiene (mandatory)

- ❌ `git add -A`, `git add .`, `git add --all` — запрещено
- ✅ `git add <specific_files>` — каждый файл явно
- ❌ `git commit --amend` после первого push — запрещено
- ✅ Между коммитами — `git status` для проверки чистоты staging
- ❌ Не трогать файлы вне scope (proto/, .env.local, .env.example)
- ✅ Notion-токен НИКОГДА в коммитах — только через `.env.local` (gitignore)
- ✅ Если случайно закоммитили секрет — немедленный rotate токена + force-push очищенной истории
- ✅ `.gitignore` обязательно содержит: `node_modules/`, `.next/`, `.env*.local`, `coverage/`, `*.log`

---

## 9. Self-check (программатические проверки)

Перед сдачей CC выполняет эти команды и прикладывает вывод в отчёт:

```bash
# 1. Type check
npx tsc --noEmit
# Ожидание: 0 ошибок

# 2. Lint
npx eslint . --max-warnings 0
# Ожидание: 0 warning

# 3. Build
npm run build
# Ожидание: успешная сборка без warning

# 4. Tests
npx vitest run --coverage
# Ожидание: все 20+ тестов проходят, coverage lib/ >= 70%

# 5. No `any` в исходниках
grep -rn ": any" src/ lib/ app/ components/ --include="*.ts" --include="*.tsx"
# Ожидание: 0 совпадений

# 6. No console.log
grep -rn "console\.log\|console\.error" src/ lib/ app/ components/ --include="*.ts" --include="*.tsx" \
  | grep -v "app/error.tsx"
# Ожидание: 0 совпадений (кроме error.tsx как fallback)

# 7. No TODO/FIXME
grep -rn "TODO\|FIXME\|XXX" src/ lib/ app/ components/ --include="*.ts" --include="*.tsx"
# Ожидание: 0 совпадений

# 8. No process.env.* напрямую (всё через lib/env)
grep -rn "process\.env\." src/ lib/ app/ components/ --include="*.ts" --include="*.tsx" \
  | grep -v "lib/env.ts" \
  | grep -v "next.config.js"
# Ожидание: 0 совпадений

# 9. Все env переменные есть в .env.example
diff <(grep -oE "^[A-Z_]+=" .env.example | sort) <(grep -oE 'env\.[A-Z_]+' lib/env.ts | sed 's/env\.//' | sort -u)
# Ожидание: совпадение

# 10. Health check работает локально
curl -s http://localhost:3000/api/health | jq .status
# Ожидание: "ok"

# 11. Lighthouse mobile
npx lighthouse http://localhost:3000/catalog --only-categories=performance,accessibility --form-factor=mobile --output=json --output-path=./lighthouse.json --quiet
jq '.categories.performance.score, .categories.accessibility.score' lighthouse.json
# Ожидание: оба >= 0.8 и 0.9 соответственно

# 12. Размер bundle
npx next build && du -sh .next/static
# Ожидание: < 5 MB (для MVP с 3 страницами)

# 13. Шаблонная карточка НЕ показывается
curl -s http://localhost:3000/catalog | grep -c "ШАБЛОН"
# Ожидание: 0

# 14. Все 16 программ в каталоге
curl -s http://localhost:3000/catalog | grep -c "program-card"
# Ожидание: 16

# 15. Hot path: открывается эталонная карточка
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/program/indeyskiy-kvest
# Ожидание: 200
```

---

## 10. Финальный вывод (формат отчёта от CC)

После выполнения всех этапов отчитаться в чате Sergey'ю в следующем формате:

````markdown
## Отчёт по MVP «Е-Праздник Каталог»

### Ссылки
- **GitHub:** https://github.com/<org>/eprazdnik (приватный, Sergey добавлен как collaborator)
- **Production:** https://<project>.vercel.app
- **README:** https://github.com/<org>/eprazdnik/blob/main/README.md

### Acceptance criteria
- [✅/❌] Все 24 пункта из §7 — что выполнено, что нет, почему

### Self-check (вывод 15 команд из §9)
```
1. tsc --noEmit          → OK
2. eslint                → OK (0 warnings)
3. npm run build         → OK (build size: 1.2 MB)
...
```

### Lighthouse
- Performance: <score>/100
- Accessibility: <score>/100
- (приложить скриншот lighthouse-report)

### Отклонения от scope
- (если что-то пришлось упростить или изменить — перечислить с причинами)

### Известные ограничения
- (если что-то осталось не идеальным — перечислить)

### Что нужно от Sergey
- (например: подключить домен, добавить как collaborator в Vercel, передать токен Notion в Vercel ENV)

### Следующие шаги для v2
- (короткие рекомендации, если есть)
````

---

## Anti-patterns (явно запрещены)

1. ❌ `// TODO: implement later` в коммитимом коде
2. ❌ `: any` или `as any` без обоснования в комментарии
3. ❌ `console.log` / `console.error` в исходниках (кроме `app/error.tsx`)
4. ❌ `try { ... } catch { /* ignore */ }` — каждая ошибка обрабатывается
5. ❌ `dangerouslySetInnerHTML` без обоснования
6. ❌ Хардкод секретов или ID Notion-баз в коде
7. ❌ `process.env.X!` (с `!`) — только через `lib/env`
8. ❌ Магические строки и числа — в `lib/constants.ts`
9. ❌ God-компоненты больше 200 строк — разбивать
10. ❌ Бизнес-логика в page-компонентах — выносить в `lib/`
11. ❌ Копипаст вёрстки между страницами — общие компоненты
12. ❌ Тесты без assertion-сообщений (`expect(x).toBe(y)` без описания «что проверяем»)

---

## Финальный чек-лист перед сдачей Sergey'ю

- ☐ ADR в §0 написан, отражает реальный выбор стека
- ☐ Все §1–10 секции заполнены, без пропусков
- ☐ §8a risk class явно указан (`medium`)
- ☐ §8b git hygiene block вставлен дословно
- ☐ Минимум 20 тестов в §6 — все проходят
- ☐ Self-check §9 — 15 команд показывают ожидаемое
- ☐ Структура файлов соответствует §0.6
- ☐ ENV переменные документированы в README и `.env.example`
- ☐ Vercel: настроен Production deploy + ENV переменные
- ☐ Sergey добавлен collaborator в GitHub и Vercel
- ☐ Health check `/api/health` возвращает 200
- ☐ Lighthouse Performance ≥ 80, Accessibility ≥ 90

---

**Готов к работе. Если что-то непонятно в этом мегапромпте — спрашивай Sergey'я ДО старта, не угадывай. Каждое отклонение от scope/AC — фиксировать и согласовывать.**
