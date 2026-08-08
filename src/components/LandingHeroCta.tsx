"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Play, UserPlus, Lock, WifiOff } from "lucide-react";

export function LandingHeroCta() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-1">
        <Link
          href="/play"
          className="comic-btn text-lg sm:text-xl bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-3.5 flex items-center justify-center gap-2 animate-bounce comic-shadow-lg"
        >
          <Play className="w-6 h-6 fill-comic-ink text-comic-ink" />
          <span>PLAY! MAIN SEKARANG</span>
        </Link>
        <div className="flex gap-2 w-full">
          <Link
            href="/chapter"
            className="comic-btn text-xs bg-white hover:bg-gray-100 text-comic-ink flex-1 py-2 flex items-center justify-center gap-1"
          >
            <span>📚 CHAPTERS</span>
          </Link>
          <Link
            href="/play-offline"
            className="comic-btn text-xs bg-gray-100 hover:bg-gray-200 text-comic-ink flex-1 py-2 flex items-center justify-center gap-1 border-dashed"
          >
            <WifiOff className="w-3.5 h-3.5 text-comic-bayangan" />
            <span>MODE OFFLINE</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-1">
      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        <Link
          href="/auth/login"
          className="comic-btn text-sm sm:text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-3"
        >
          <UserPlus className="w-4 h-4" />
          SIGN IN / DAFTAR
        </Link>
        <Link
          href="/auth/login?callbackUrl=/chapter"
          className="comic-btn text-sm sm:text-base bg-white hover:bg-gray-100 text-comic-ink flex-1 py-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
          </svg>
          GOOGLE SIGN IN
        </Link>
      </div>

      <Link
        href="/play-offline"
        className="comic-btn text-xs bg-amber-100 hover:bg-amber-200 text-comic-ink w-full py-2 flex items-center justify-center gap-1.5 border-dashed"
      >
        <WifiOff className="w-4 h-4 text-comic-bayangan" />
        <span>📴 MAIN MODE OFFLINE (TANPA INTERNET)</span>
      </Link>

      <div className="bg-amber-100/90 comic-border-sm px-3 py-1 rounded-md text-[11px] font-sans text-gray-800 flex items-center justify-center gap-1 font-bold">
        <Lock className="w-3.5 h-3.5 text-red-600 inline" /> Wajib Sign In terlebih dahulu untuk mengakses arena tebak kata online & menyimpan progress.
      </div>
    </div>
  );
}
