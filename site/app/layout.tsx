import type { Metadata } from "next";
import "@fontsource-variable/golos-text";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { siteUrl } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Юрий Бельчик — архитектор сильных решений",
    template: "%s | CKB.by",
  },
  description:
    "Юрий Бельчик помогает командам продавать сложные решения: разбор реальных сделок, практика переговоров и рабочие сценарии под ваш продукт.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "CKB.by — Юрий Бельчик",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots:
    process.env.SITE_INDEXABLE === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержанию
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
