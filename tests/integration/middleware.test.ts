import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { SESSION_COOKIE } from "@/lib/auth";

// SITE_PASSWORD in tests is "test_password" (tests/setup.ts).
const PASSWORD = "test_password";

function req(path: string, cookie?: string): NextRequest {
  const r = new NextRequest(new URL(`http://localhost${path}`));
  if (cookie !== undefined) r.cookies.set(SESSION_COOKIE, cookie);
  return r;
}

describe("password gate middleware", () => {
  it("redirects to /login when no session cookie is present", () => {
    const res = middleware(req("/catalog"));
    expect(res.status).toBe(307);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("/login");
    expect(location).toContain("from=%2Fcatalog");
  });

  it("redirects when the cookie value is wrong", () => {
    const res = middleware(req("/catalog", "nope"));
    expect(res.headers.get("location") ?? "").toContain("/login");
  });

  it("lets the request through with a valid session cookie", () => {
    const res = middleware(req("/catalog", PASSWORD));
    expect(res.headers.get("location")).toBeNull();
  });
});
