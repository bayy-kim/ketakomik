import type { Metadata, Viewport } from "next";
import { Bangers, Archivo_Black, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tekakomik.vercel.app"),
  title: "Tekakonik — Game Tebak Kata Harian Komik Modern",
  description: "Bantu Kapten Klu dan selidiki trik Bayangan dalam game tebak kata harian bergaya komik modern!",
  applicationName: "Tekakonik",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tekakonik",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Tekakonik",
    title: "Tekakonik — Game Tebak Kata Harian Komik Modern",
    description: "Bantu Kapten Klu dan selidiki trik Bayangan dalam game tebak kata harian bergaya komik modern!",
    url: "https://tekakomik.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tekakonik — Game Tebak Kata Harian Komik Modern",
    description: "Bantu Kapten Klu dan selidiki trik Bayangan dalam game tebak kata harian bergaya komik modern!",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD200",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bangers.variable} ${archivoBlack.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-comic-paper text-comic-ink selection:bg-comic-klu selection:text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
