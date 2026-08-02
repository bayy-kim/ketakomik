import type { Metadata } from "next";
import { Bangers, Archivo_Black, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Tekakonik — Game Tebak Kata Harian Komik Modern",
  description: "Bantu Kapten Klu dan selidiki trik Bayangan dalam tebak kata harian bergaya komik modern!",
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
      </body>
    </html>
  );
}
