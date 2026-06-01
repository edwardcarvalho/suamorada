import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Gloock } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suamorada.pt"),
  title: {
    default: "Sua Morada — Comprar, Vender e Arrendar Imóveis em Portugal",
    template: "%s | Sua Morada",
  },
  description:
    "Encontre o imóvel ideal em Portugal. Milhares de apartamentos, moradias e vivendas para compra e arrendamento em Lisboa, Porto, Algarve e todo o país.",
  keywords: ["imóveis portugal", "casas para venda", "arrendamento", "apartamentos lisboa", "comprar casa portugal"],
  authors: [{ name: "Sua Morada" }],
  creator: "Sua Morada",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://suamorada.pt",
    siteName: "Sua Morada",
    title: "Sua Morada — Comprar, Vender e Arrendar Imóveis em Portugal",
    description:
      "Encontre o imóvel ideal em Portugal. Milhares de propriedades verificadas em todo o país.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sua Morada — Portal Imobiliário Portugal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sua Morada — Imóveis em Portugal",
    description: "Encontre o imóvel ideal em Portugal.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://suamorada.pt",
    languages: {
      "pt-PT": "https://suamorada.pt",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-PT"
      className={`${inter.variable} ${gloock.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-warm text-ink antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1C1C2E",
              color: "#FFFFFF",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#2D9E6B", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
          }}
        />
        {/* Plausible Analytics — substituir pelo domínio real */}
        <Script
          defer
          data-domain="suamorada.pt"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
