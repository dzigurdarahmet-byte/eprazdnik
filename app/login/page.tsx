// /login — password gate screen (§4.10). Server action verifies SITE_PASSWORD
// on the server and sets an httpOnly session cookie. Rendered bare (outside the
// workspace shell). Excluded from the middleware gate by config.matcher.
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход — Е-Праздник",
  robots: { index: false, follow: false },
};

function pick(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function safeFrom(from: string): string {
  // Only allow internal absolute paths to avoid open redirects.
  return from.startsWith("/") && !from.startsWith("//") ? from : "/";
}

async function login(formData: FormData): Promise<void> {
  "use server";
  const password = String(formData.get("password") ?? "");
  const from = safeFrom(String(formData.get("from") ?? "/"));
  if (password === env.SITE_PASSWORD) {
    cookies().set(SESSION_COOKIE, env.SITE_PASSWORD, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    redirect(from);
  }
  redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const from = safeFrom(pick(searchParams?.from));
  const hasError = Boolean(pick(searchParams?.error));

  return (
    <div className="login-screen">
      <form className="login-card" action={login}>
        <div className="login-mark">е</div>
        <h1 className="login-title">Е-Праздник</h1>
        <p className="login-sub">Внутренний справочник. Введите пароль для доступа.</p>
        <input type="hidden" name="from" value={from} />
        <label className="login-label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          autoComplete="current-password"
          autoFocus
          required
        />
        {hasError ? <div className="login-error">Неверный пароль. Попробуйте ещё раз.</div> : null}
        <button type="submit" className="login-btn">
          Войти
        </button>
      </form>
    </div>
  );
}
