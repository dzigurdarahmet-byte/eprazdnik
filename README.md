# Е-Праздник Каталог

Кастомный сайт-каталог для агентства детских праздников «Е-Праздник». MVP на Next.js 14 (App Router) + Notion API.

## Стек

- Next.js 14 (App Router, Server Components)
- TypeScript strict
- Tailwind CSS + кастомный CSS из прототипа
- Notion API как headless CMS
- Vitest + @testing-library/react
- Pino structured logging
- Zod env validation
- Deploy: Vercel

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
| `npm run dev` | Локальный dev-сервер |
| `npm run build` | Production build |
| `npm run start` | Запуск собранного билда |
| `npm run lint` | ESLint, 0 warnings |
| `npm run typecheck` | TypeScript без эмита |
| `npm run test` | Vitest, все тесты |
| `npm run test:coverage` | Coverage report |

## Env переменные

| Переменная | Что |
|---|---|
| `NOTION_TOKEN` | Internal integration token из https://www.notion.so/profile/integrations |
| `NOTION_DB_PROGRAMS_ID` | UUID базы «📚 Программы» |
| `NOTION_DB_ELEMENTS_ID` | UUID базы «🧩 Элементы» |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL (для OG / canonical) |

Шаблон — в `.env.example`. Реальные значения — только в `.env.local` (gitignore).

## Обновление контента

Клиент редактирует программы напрямую в Notion. Сайт регенерируется через ISR раз в 60 секунд. Принудительно — `vercel --prod` или revalidate API (TBD).

## Структура

См. ADR в `CC_megaprompt_MVP_v2.md` §0.6.

## Деплой на Vercel

1. Импортировать репозиторий в Vercel
2. Добавить env переменные (`NOTION_TOKEN`, `NOTION_DB_PROGRAMS_ID`, `NOTION_DB_ELEMENTS_ID`, `NEXT_PUBLIC_SITE_URL`)
3. Production branch: `main`
