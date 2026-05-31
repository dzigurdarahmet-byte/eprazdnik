// Notion API client. All Notion calls flow through this module so the token is
// read in exactly one place and never escapes to the browser bundle.
import { Client, LogLevel } from "@notionhq/client";
import { env } from "@/lib/env";

export const notion = new Client({
  auth: env.NOTION_TOKEN,
  // Default INFO is noisy in production logs; keep it quiet there.
  logLevel: env.NODE_ENV === "production" ? LogLevel.ERROR : LogLevel.WARN,
  // Give slow responses room before the SDK aborts; the throttle also retries
  // transient timeouts so a single slow request can't fail a build-time export.
  timeoutMs: 60_000,
});

export const DB_PROGRAMS = env.NOTION_DB_PROGRAMS_ID;
export const DB_ELEMENTS = env.NOTION_DB_ELEMENTS_ID;
