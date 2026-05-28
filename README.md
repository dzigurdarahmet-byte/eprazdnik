# Е-Праздник Каталог

Кастомный сайт-каталог для агентства детских праздников «Е-Праздник». MVP на Next.js 14 (App Router) + Notion API.

**GitHub:** https://github.com/dzigurdarahmet-byte/eprazdnik
**Production:** _добавить URL после деплоя на Vercel_

## Стек

- **Next.js 14** (App Router, Server + Client Components)
- **TypeScript strict** (+ `noUncheckedIndexedAccess`)
- **Tailwind CSS** + кастомный CSS из прототипа (`app/globals.css`)
- **Notion API** (`@notionhq/client`) — Notion как headless CMS
- **Vitest** + `@testing-library/react` — 49 тестов
- **Pino** — structured logging
- **Zod** — env validation
- **Lucide-react** — icons
- **Deploy:** Vercel (ISR с revalidate=60)

## Запуск локально

```bash
npm install
cp .env.example .env.local       # затем заполнить NOTION_TOKEN
npm run dev
```

Открыть http://localhost:3000.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Локальный dev-сервер (порт 3000) |
| `npm run build` | Production build |
| `npm run start` | Запуск собранного билда |
| `npm run lint` | ESLint, 0 warnings обязательно |
| `npm run typecheck` | TypeScript без эмита |
| `npm run test` | Vitest, все 49 тестов |
| `npm run test:coverage` | Coverage report |

## Env переменные

| Переменная | Что |
|---|---|
| `NOTION_TOKEN` | Internal integration token из https://www.notion.so/profile/integrations |
| `NOTION_DB_PROGRAMS_ID` | UUID базы «📚 Программы» |
| `NOTION_DB_ELEMENTS_ID` | UUID базы «🧩 Элементы» |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL (для OG / canonical) |
| `NODE_ENV` | `development` локально / `production` на Vercel |

Шаблон — в `.env.example`. Реальные значения — только в `.env.local` (gitignore).

## Структура

```
eprazdnik/
├── app/
│   ├── layout.tsx              # html lang="ru", шрифты, skip-link, sidebar
│   ├── page.tsx                # Главная (Server)
│   ├── globals.css             # Стили из proto/styles.css + a11y + mobile
│   ├── catalog/page.tsx        # /catalog (Server + Client filter)
│   ├── program/[slug]/page.tsx # /program/[slug] (Server, ISR)
│   ├── program/[slug]/not-found.tsx
│   ├── api/health/route.ts     # /api/health
│   ├── error.tsx               # Route error boundary
│   ├── global-error.tsx        # Layout error boundary
│   └── not-found.tsx           # Site 404
├── components/
│   ├── Sidebar.tsx            # Client (usePathname for active state)
│   ├── ProgramCard.tsx        # Server, wraps in next/link
│   ├── Hero.tsx               # Server, takes totalPrograms prop
│   ├── Cover.tsx              # Server, 14 named gradient variants
│   ├── Icon.tsx               # lucide-react wrapper
│   ├── Tabs.tsx               # Client (useState)
│   ├── MediaCard.tsx          # Server, target=_blank rel=noopener
│   ├── SearchBox.tsx          # Client
│   ├── Chips.tsx              # Client (multi-select toggle)
│   ├── CatalogContent.tsx     # Client (composes Search/Chips/grid)
│   └── ErrorBoundary.tsx      # Client (subtree fallback)
├── lib/
│   ├── env.ts                 # zod-validated env
│   ├── logger.ts              # pino
│   ├── constants.ts           # template-prefix, ISR seconds, SECTION_MATCHERS
│   ├── slugify.ts             # ru→latin URL slug
│   ├── format.ts              # ru-locale price formatter
│   └── notion/
│       ├── client.ts          # @notionhq/client singleton
│       ├── errors.ts          # NotionError + variants
│       ├── parser.ts          # BlockTree → ProgramContent
│       ├── programs.ts        # listPrograms, getProgram, getProgramBySlug
│       ├── properties.ts      # tolerant page-property readers
│       └── throttle.ts        # 350ms serialized queue + 429 backoff
├── types/                     # ProgramSummary / ProgramDetail / NotionBlock alias
├── tests/
│   ├── unit/                  # parser, env, slugify (24 tests)
│   ├── integration/           # notion (5 tests with mocked SDK)
│   ├── snapshot/              # 7 components (20 tests)
│   └── fixtures/              # block + page builders
├── proto/                     # Read-only HTML/JSX prototype (referenced)
├── next.config.js             # security headers (HSTS, X-Frame-Options, …)
├── tsconfig.json              # strict
└── vitest.config.ts           # jsdom env, coverage thresholds
```

## Обновление контента

Контент-редактор работает в Notion. Все изменения в страницах программ автоматически становятся доступными на сайте через **ISR (Incremental Static Regeneration)** — каждые 60 секунд первый запрос триггерит фоновое перегенерирование страницы, остальные пользователи в течение этого окна получают кешированный HTML.

Принудительная инвалидация: на Vercel дашборде → Deployments → Redeploy с галкой «Clear cache», либо вызвать API `revalidatePath` (не реализовано в MVP).

## Деплой на Vercel

1. Импортировать репозиторий в Vercel
2. Environment Variables → Production:
   - `NOTION_TOKEN`
   - `NOTION_DB_PROGRAMS_ID`
   - `NOTION_DB_ELEMENTS_ID`
   - `NEXT_PUBLIC_SITE_URL` (после привязки домена)
3. Production branch: `main`
4. Build command по умолчанию (`next build`)
5. Никаких дополнительных настроек — Vercel автоматически обнаруживает Next.js

## Notion-интеграция

- **Структура страницы:** `heading_2` (подзаголовок) → `column_list` × 3 пары с секциями `01 Легенда / 02 Финал / 03 Активности / 04 Персонажи / 05 Технические требования / 06 Расчёт / 07 Медиа`. Секции `08 Творческий отдел` и `10 Элементы программы` парсер игнорирует.
- **Парсер толерантен** к вариациям заголовков: `01 📚 Легенда` / `Легенда` / `📖 Легенда` — все распознаются через regex (см. `lib/constants.ts → SECTION_MATCHERS`).
- **Свойства программы** (категория, теги, возраст, длительность, цена) тоже читаются с fallback'ом по нескольким именам.
- **Шаблон-страницы** с заголовками, начинающимися на `[ШАБЛОН]`, исключаются из каталога.

## Ограничения MVP

- `/program/[slug]` НЕ пре-рендерится при build (пустой `generateStaticParams`). Причина — Notion API rate-limit (~3 req/sec) делает параллельный SSG нестабильным при 16 программах × ~10 запросов на каждую. Каждая страница лениво генерируется на первом запросе и кешируется на 60 секунд.
- `/catalog` помечена `dynamic = "force-dynamic"` по той же причине.
- Lighthouse прогон не сделан в этой итерации — нужен запущенный prod-сервер + Chrome (ручной шаг на CI).

## Что нужно от Sergey

- [ ] Добавить env переменные в Vercel Project Settings → Environment Variables
- [ ] Подтвердить production URL и обновить `NEXT_PUBLIC_SITE_URL`
- [ ] Подключить домен (если не Vercel-subdomain)
- [ ] Прогнать Lighthouse CI после деплоя (Performance ≥ 80, Accessibility ≥ 90)
- [ ] Опционально: Vercel uptime monitoring → /api/health, alerts на 503
