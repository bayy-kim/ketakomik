"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-3 py-12 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-xl comic-shadow-lg w-full flex flex-col items-center gap-6 text-center">
          {/* Danger Alert Icon */}
          <div className="w-16 h-16 rounded-full bg-red-500 comic-border flex items-center justify-center text-white comic-shadow rotate-[4deg] animate-pulse">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>

          <div>
            <h1 className="font-bangers text-4xl sm:text-5xl text-red-500 tracking-wide">
              MISTERI RUSAK!
            </h1>
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-ink mt-2">
              TERJADI KESALAHAN SISTEM
            </h2>
            <p className="text-xs sm:text-sm font-sans text-gray-700 mt-3 leading-relaxed">
              Jaringan intelijen Kapten Klu mengalami gangguan teknis mendadak. Klik tombol di bawah untuk menyambungkan kembali.
            </p>
          </div>

          <div className="bg-red-50 comic-border-sm p-3 rounded text-left w-full font-mono text-[10px] text-red-800 break-all">
            {error.message || "Unknown error occurred"}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => reset()}
              className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-2.5"
            >
              <RefreshCw className="w-4 h-4" /> ULANGI PROSES
            </button>
            <Link
              href="/"
              className="comic-btn text-sm bg-gray-100 hover:bg-gray-200 text-comic-ink flex-1 py-2.5"
            >
              <Home className="w-4 h-4" /> KEMBALI
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
