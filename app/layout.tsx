import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Test de Bienestar · Happy Sapiens",
    template: "%s · Happy Sapiens",
  },
  description:
    "En 30 segundos, descubre qué podría necesitar más atención hoy. Test de bienestar por Happy Sapiens.",
  openGraph: {
    title: "Test de Bienestar · Happy Sapiens",
    description:
      "En 30 segundos, descubre qué podría necesitar más atención hoy.",
    url: SITE_URL,
    siteName: "Happy Sapiens",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test de Bienestar · Happy Sapiens",
    description:
      "En 30 segundos, descubre qué podría necesitar más atención hoy.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={anton.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
