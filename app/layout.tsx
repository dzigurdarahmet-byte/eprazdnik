import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Е-Праздник — каталог программ",
  description:
    "Внутренний справочник программ, шоу и мастер-классов агентства «Е-Праздник» для менеджеров.",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // Внутренний справочник за паролем — не индексируем (§4.10).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`;
  return (
    <html lang="ru" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
