// Typed, validated environment configuration.
// Every consumer reads `env.X` instead of touching process.env directly.
import { z } from "zod";

const NotionIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-f0-9]{32}$|^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, {
    message: "Must be a Notion-style UUID (32 hex chars, optionally dashed)",
  });

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NOTION_TOKEN: z.string().min(1, "NOTION_TOKEN required"),
  NOTION_DB_PROGRAMS_ID: NotionIdSchema,
  NOTION_DB_ELEMENTS_ID: NotionIdSchema,
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Logging via stderr-friendly throw: no console.log in prod code.
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(fieldErrors)}`,
    );
  }
  return parsed.data;
}

// Eagerly validate at import time so misconfiguration crashes the build/server early.
export const env: Env = parseEnv();
