import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Е-Праздник — Каталог детских праздников",
  description:
    "Сюжетные программы, шоу и квесты для детских и корпоративных праздников. Подробное описание каждой программы, расчёт стоимости, медиа.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Е-Праздник",
    description: "Каталог детских праздничных программ",
    locale: "ru_RU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
