"use client";

import Link from "next/link";
import { ShieldAlert, Home, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-3 py-12 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-xl comic-shadow-lg w-full flex flex-col items-center gap-6 text-center">
          {/* Action Burst Icon */}
          <div className="w-16 h-16 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white comic-shadow rotate-[-6deg] animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-bangers text-4xl sm:text-5xl text-comic-bayangan tracking-wide">
              WADUH! 404
            </h1>
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-ink mt-2">
              HALAMAN DILENYAPKAN BAYANGAN!
            </h2>
            <p className="text-xs sm:text-sm font-sans text-gray-700 mt-3 leading-relaxed">
              Jalur penyelidikan terputus. Sepertinya Bayangan telah merusak halaman yang sedang kamu cari atau alamat URL salah ketik!
            </p>
          </div>

          {/* Comic Dialogue Balloon */}
          <div className="bg-yellow-50 comic-border p-4 rounded-xl relative bubble-tail-left w-full">
            <p className="text-xs font-sans italic text-comic-ink">
              &ldquo;Jangan menyerah dulu, Detektif! Mari kembali ke Markas Utama atau gunakan peta navigasi di bawah.&rdquo;
              <br />
              <strong className="text-comic-klu font-bold">-- Kapten Klu</strong>
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => window.location.reload()}
              className="comic-btn text-sm bg-gray-100 hover:bg-gray-200 text-comic-ink flex-1 py-2.5"
            >
              <RefreshCw className="w-4 h-4" /> REFRESH
            </button>
            <Link
              href="/"
              className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-2.5"
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
