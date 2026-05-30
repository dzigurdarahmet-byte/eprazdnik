# Е-Праздник Каталог

Внутренний read-only справочник программ, шоу и мастер-классов агентства «Е-Праздник» для
менеджеров. Next.js 14 (App Router) + Notion API, дизайн — Notion-воркспейс-прототип.

**GitHub:** https://github.com/dzigurdarahmet-byte/eprazdnik
**Production:** _добавить URL после деплоя на Vercel_

## Источник дизайна

Папка [`proto-notion/`](./proto-notion) — **единственный источник истины по визуалу** (9 JSX +
`index.html`, React+Babel standalone). Presentation перенесён из неё в `app/globals.css` и
компоненты **токен-в-токен**. `proto-notion/` **не импортируется в билд** — это только референс.
`proto_DEPRECATED/` — предыдущий прототип, оставлен для истории.

## Стек

- **Next.js 14** (App Router, Server + Client Components, ISR `revalidate=60`)
- **TypeScript strict** (+ `noUncheckedIndexedAccess`), 0 `any`
- **CSS** — семантические классы в `app/globals.css`, значения из `proto-notion/` точь-в-точь
- **Notion API** (`@notionhq/client`) — две базы (Программы + Элементы) как headless CMS
- **Vitest** + `@testing-library/react` — 80 тестов
- **Pino** — structured logging · **Zod** — env validation
- **Edge middleware** — пароль-гейт (один общий пароль)
- **Deploy:** Vercel

## Модель данных (федерация трёх источников)

- **Notion** — каталог + тексты (легенда, активности, персонажи, теги, статус, скрипты, кейсы) →
  на сайте через ISR.
- **Google Sheets** — цены, маржа, расходники → карточки-ссылки в блоке «Расчёт» (сайт не
  пересобирает спредшит). URL берётся из свойства/блока программы в Notion.
- **Я.Диск** — фото/видео/афиша/КП → плитки-ссылки.

Сайт **read-only**: правки контента — в Notion, цены — в Google-листе, медиа — на Я.Диске.

## Запуск локально

```bash
npm install
cp .env.example .env.local       # заполнить NOTION_TOKEN и SITE_PASSWORD
npm run dev
```

Открыть http://localhost:3000 → редирект на `/login` → ввести `SITE_PASSWORD`.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Локальный dev-сервер (порт 3000) |
| `npm run build` | Production build |
| `npm run start` | Запуск собранного билда |
| `npm run lint` | ESLint, 0 warnings обязательно |
| `npm run typecheck` | TypeScript без эмита |
| `npm run test` | Vitest, все 80 тестов |
| `npm run test:coverage` | Coverage (lib ≥ 70, components ≥ 50) |

## Env переменные

| Переменная | Что |
|---|---|
| `NOTION_TOKEN` | Internal integration token (notion.so/profile/integrations) |
| `NOTION_DB_PROGRAMS_ID` | UUID базы «📚 Программы» |
| `NOTION_DB_ELEMENTS_ID` | UUID базы «🧩 Элементы авторских программ» |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL (для OG / canonical) |
| `SITE_PASSWORD` | Общий пароль для входа на сайт (гейт) |
| `NODE_ENV` | `development` локально / `production` на Vercel |

Шаблон — в `.env.example`. Реальные значения — только в `.env.local` (gitignore).

## Доступ (пароль-гейт)

- Edge `middleware.ts` пускает по httpOnly-cookie, иначе редиректит на `/login`.
- `/login` (server action) сверяет пароль с `SITE_PASSWORD` и ставит cookie.
- Без гейта доступны только `/login`, `/api/health` и статика.
- Весь сайт `noindex` (внутренний справочник; снять при переезде на публичный домен).

## Структура

```
app/
├── layout.tsx                  # root: html, шрифты (Inter/JetBrains Mono/Fraunces), noindex
├── globals.css                 # дизайн-токены + классы из proto-notion (токен-в-токен)
├── login/page.tsx              # экран входа (server action)
├── api/health/route.ts         # /api/health → {status, programsCount, elementsCount}
├── global-error.tsx            # корневой error boundary
└── (site)/                     # workspace-шелл (Sidebar + TopBar), под гейтом
    ├── layout.tsx              # шелл + live counts из Notion
    ├── page.tsx                # Главная
    ├── catalog/page.tsx        # Программы (фильтры/поиск клиентские)
    ├── program/[slug]/page.tsx # Карточка (ISR, on-demand)
    ├── elements/page.tsx       # Библиотека Элементов
    ├── error.tsx · not-found.tsx
components/
├── shell/{Sidebar,TopBar}.tsx
├── catalog/{ProgramCard,CatalogView}.tsx
├── program/{Calc,MediaGrid,LinkOrText}.tsx
├── elements/{ElementCard,ElementsView}.tsx
└── ui/{Tag,Breadcrumbs,IconSlot,FilterPill,Avatar,Chevron,Plus,SheetIcon,SectionLabel,PropertyRow}.tsx
lib/
├── env.ts · logger.ts · constants.ts · slugify.ts · format.ts
├── status.ts · tag-color.ts · accent.ts · catalog-filter.ts · auth.ts
└── notion/{client,errors,parser,programs,elements,properties,throttle}.ts
types/{program,element,notion}.ts
middleware.ts                   # пароль-гейт
proto-notion/                   # ИСТОЧНИК ДИЗАЙНА (в билд не импортируется)
```

## Notion-интеграция

- **Две базы.** Программы (`Название/Цена от/Теги/Формат/Категория/Размер группы/Возраст/Статус` +
  relation на Элементы) и Элементы (`Название/Цена от/Категория/Статус/Теги` + relation на Программы).
- **Парсер толерантен** к вариациям заголовков (regex, см. `lib/constants.ts → SECTION_MATCHERS`):
  Легенда / Персонажи / Активности / Финал / Расчёт / Медиа / Скрипты продаж / Кейсы.
- **Свойства** читаются с fallback'ом по нескольким именам (`lib/notion/properties.ts`).
- **Скрыто из каталога:** заголовки на `[ШАБЛОН]` и `🧪` (тест/превью).
- **Расчёт:** жёлтая плашка + ссылки на Google Sheets (URL из Notion); таблица из Элементов **не**
  строится. Если URL не заведён — карточки неактивны, страница не падает.

## Обновление контента

Редактор работает в Notion; изменения текста становятся доступны на сайте через **ISR** — каждые
60 секунд первый запрос триггерит фоновое перегенерирование. Цены меняются в Google-листе, медиа —
на Я.Диске; сайт ссылается.

## Деплой на Vercel

1. Импортировать репозиторий, Production branch = `main`.
2. Environment Variables → Production: `NOTION_TOKEN`, `NOTION_DB_PROGRAMS_ID`,
   `NOTION_DB_ELEMENTS_ID`, `NEXT_PUBLIC_SITE_URL`, **`SITE_PASSWORD`**.
3. Build command по умолчанию (`next build`).

## Ограничения

- `/program/[slug]` не пре-рендерится при build (пустой `generateStaticParams`) из-за rate-limit
  Notion (~3 req/sec) — генерируется лениво на первом запросе и кешируется на 60 с.
- `/catalog` и `/elements` динамические (читают `searchParams`); от rate-limit защищает throttle.
- Lighthouse прогон — ручной шаг на CI (Performance ≥ 80, Accessibility ≥ 90).

## Что нужно от Sergey / руководителя

- [ ] `SITE_PASSWORD` (и остальные env) в Vercel Project Settings.
- [ ] Заархивировать в Notion строку `🧪 Индейский квест — превью шапки`.
- [ ] Проставить у программ ссылку на Google-лист (свойство/блок) → активирует блок «Расчёт».
- [ ] Заполнить «Скрипты продаж», «Кейсы», добавить значение `Площадка` в поле `Формат`.
- [ ] Прогнать Lighthouse после деплоя; подключить домен и снять `noindex`.
