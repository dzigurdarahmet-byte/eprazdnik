import { describe, it, expect } from "vitest";
import { parseEnv } from "@/lib/env";

const VALID = {
  NODE_ENV: "test",
  NOTION_TOKEN: "secret_abc",
  NOTION_DB_PROGRAMS_ID: "36cdaa5e-0af7-80b1-af9f-e1b05497b255",
  NOTION_DB_ELEMENTS_ID: "36cdaa5e0af781e6a74af242037b1102",
  NEXT_PUBLIC_SITE_URL: "https://example.com",
};

describe("parseEnv", () => {
  it("parses a valid env without throwing", () => {
    expect(() => parseEnv(VALID)).not.toThrow();
    const env = parseEnv(VALID);
    expect(env.NOTION_TOKEN).toBe("secret_abc");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });

  it("throws when NOTION_TOKEN is empty", () => {
    expect(() => parseEnv({ ...VALID, NOTION_TOKEN: "" })).toThrow(/NOTION_TOKEN/);
  });

  it("throws when NOTION_DB_PROGRAMS_ID is not a Notion-style UUID", () => {
    expect(() => parseEnv({ ...VALID, NOTION_DB_PROGRAMS_ID: "not-a-uuid" })).toThrow(/NOTION_DB_PROGRAMS_ID|Notion-style/);
  });

  it("falls back to default site URL when omitted", () => {
    const env = parseEnv({
      NODE_ENV: "test",
      NOTION_TOKEN: "x",
      NOTION_DB_PROGRAMS_ID: VALID.NOTION_DB_PROGRAMS_ID,
      NOTION_DB_ELEMENTS_ID: VALID.NOTION_DB_ELEMENTS_ID,
    });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });
});
