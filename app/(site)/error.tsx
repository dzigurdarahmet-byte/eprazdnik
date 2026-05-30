// Route-level error boundary for the site pages (Notion timeouts, parser/render
// crashes). Rendered inside the workspace shell.
"use client";

import { useEffect } from "react";

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server logger (pino) doesn't reach the client; surface to devtools instead.
    // eslint-disable-next-line no-console
    console.error("page.error", { name: error.name, message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div style={{ maxWidth: 640, padding: "60px 96px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
        Что-то пошло не так
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 16 }}>
        Внутренняя ошибка. Попробуйте обновить страницу.
      </p>
      {error.digest ? (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-light)" }}>
          ID: <code>{error.digest}</code>
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        style={{
          marginTop: 24,
          background: "var(--text)",
          color: "white",
          padding: "7px 14px",
          borderRadius: 5,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Попробовать ещё раз
      </button>
    </div>
  );
}
