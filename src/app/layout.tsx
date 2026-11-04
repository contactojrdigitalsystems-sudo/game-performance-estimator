import type { Metadata, Viewport } from "next";
import { Oxanium, Sora } from "next/font/google";
import "./globals.css";

const display = Oxanium({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const TITLE = "Calculadora de Cuello de Botella y Estimador de FPS | GameSpec";
const DESCRIPTION =
  "Calcula el cuello de botella (bottleneck) de tu PC y estima los FPS en juegos como GTA VI, Fortnite y Warzone. Comprueba el rendimiento de tu CPU y GPU gratis.";

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const url = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: TITLE,
    template: "%s | GameSpec",
  },
  description: DESCRIPTION,
  applicationName: "GameSpec",
  authors: [{ name: "GameSpec" }],
  creator: "GameSpec",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "GameSpec",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GameSpec",
  alternateName: "Calculadora de Cuello de Botella y Estimador de FPS",
  url,
  description: DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  inLanguage: "es",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  featureList: [
    "Cálculo de cuello de botella entre CPU y GPU",
    "Estimación de FPS en 1080p, 1440p y 4K",
    "Presets Bajo, Medio y Ultra",
    "Recomendación de actualización",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
