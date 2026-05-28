// Route-level error boundary. Catches uncaught errors from any page in /app/*
// (Notion timeouts, parser crashes, render bugs) and offers a retry.
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server logger (pino) doesn't ship to the client, so fall back to console
    // here so the error still lands in browser devtools and Vercel client logs.
    // eslint-disable-next-line no-console
    console.error("page.error", { name: error.name, message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="page-enter" style={{ padding: "60px 0", maxWidth: 640 }}>
      <h1 className="page-title">Что-то пошло не так</h1>
      <p className="page-sub" style={{ marginTop: 10 }}>
        Внутренняя ошибка. Мы уже знаем о ней — попробуйте обновить страницу.
      </p>
      {error.digest ? (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-3)" }}>
          ID: <code>{error.digest}</code>
        </p>
      ) : null}
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 24 }}
        onClick={() => reset()}
      >
        Попробовать ещё раз
      </button>
    </div>
  );
}
