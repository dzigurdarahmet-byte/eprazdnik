// Last-resort error boundary that catches errors thrown by the root layout
// itself (rare). Must render its own <html><body> because the layout is gone.
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("global.error", { name: error.name, message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: 40,
          color: "#14141c",
          background: "#f7f7fa",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Сайт временно недоступен</h1>
        <p style={{ marginTop: 12, color: "#4d4d5c" }}>
          Произошла критическая ошибка. Попробуйте обновить страницу через минуту.
        </p>
        {error.digest ? (
          <p style={{ marginTop: 8, fontSize: 12, color: "#8a8a99" }}>
            ID: <code>{error.digest}</code>
          </p>
        ) : null}
      </body>
    </html>
  );
}
