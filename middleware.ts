// Edge password gate (§4.10). A single shared password (SITE_PASSWORD) protects
// the whole site; on success an httpOnly cookie is set by /login. Open without
// the gate: /login, /api/health, and Next static assets (excluded by matcher).
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token && token === env.SITE_PASSWORD) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the login page, the health probe, Next internals and
  // common static files.
  matcher: ["/((?!login|api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
