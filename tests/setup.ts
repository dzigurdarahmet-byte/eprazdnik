import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Stable env for tests — overrides anything from real .env.
// NODE_ENV is declared readonly by @types/node; cast through Record to mutate.
const _env = process.env as Record<string, string | undefined>;
_env.NODE_ENV ??= "test";
_env.NOTION_TOKEN ??= "test_token";
_env.NOTION_DB_PROGRAMS_ID ??= "36cdaa5e-0af7-80b1-af9f-e1b05497b255";
_env.NOTION_DB_ELEMENTS_ID ??= "36cdaa5e-0af7-81e6-a74a-f242037b1102";
_env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";

afterEach(() => {
  cleanup();
});
