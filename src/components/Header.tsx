"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Flame, Droplet, Volume2, VolumeX, BookOpen, Swords, Trophy, Sparkles, Play, User, LogIn, UserPlus, Lock } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { getLocalGameState, saveLocalGameState } from "@/lib/storage";

interface HeaderProps {
  mode?: "NORMAL" | "HARDCORE_VOICE";
  onModeToggle?: (newMode: "NORMAL" | "HARDCORE_VOICE") => void;
  tintaCount?: number;
  streakCount?: number;
}

export function Header({ mode: initialMode, onModeToggle, tintaCount: propTinta, streakCount: propStreak }: HeaderProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  const [tinta, setTinta] = useState<number>(50);
  const [streak, setStreak] = useState<number>(0);
  const [mode, setMode] = useState<"NORMAL" | "HARDCORE_VOICE">("NORMAL");

  useEffect(() => {
    const state = getLocalGameState();
    setTinta(propTinta ?? state.tinta);
    setStreak(propStreak ?? state.streak);
    setMode(initialMode ?? state.mode);
  }, [propTinta, propStreak, initialMode]);

  const handleToggleMode = () => {
    const nextMode = mode === "NORMAL" ? "HARDCORE_VOICE" : "NORMAL";
    setMode(nextMode);
    saveLocalGameState({ mode: nextMode });
    if (onModeToggle) {
      onModeToggle(nextMode);
    }
  };

  const alertLoginRequired = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("🔒 Kamu harus Login terlebih dahulu untuk bermain dan membuka fitur ini!");
    }
  };

  return (
    <header className="w-full bg-white border-b-4 border-comic-ink shadow-[0_4px_0_#16161A] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Top Tier on Mobile / Left on Desktop: Logo + Status Badges */}
        <div className="w-full sm:w-auto flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="bg-comic-yellow comic-border px-2 py-0.5 rounded rotate-[-2deg] active:rotate-0 transition-transform comic-shadow-sm">
              <span className="font-bangers text-2xl sm:text-3xl text-comic-ink tracking-wider">TEKAKOMIK</span>
            </div>
          </Link>

          {/* Currency Tinta & Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1 bg-amber-100 comic-border-sm px-2 py-1 rounded comic-shadow-sm text-xs sm:text-sm"
              title="Login berturut-turut (Streak)"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 fill-orange-500 animate-pulse" />
              <span className="font-bangers text-base sm:text-lg text-comic-ink">{streak}</span>
            </div>

            {/* Tinta Currency */}
            <div
              className="flex items-center gap-1 bg-blue-100 comic-border-sm px-2 py-1 rounded comic-shadow-sm text-xs sm:text-sm"
              title="Tinta Komik (Currency untuk Buka Clue)"
            >
              <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-comic-klu fill-comic-klu" />
              <span className="font-bangers text-base sm:text-lg text-comic-ink">{tinta}</span>
            </div>

            {/* Hardcore Voice Mode Toggle */}
            <button
              onClick={handleToggleMode}
              className={`flex items-center gap-1 px-2 py-1 rounded font-bangers text-xs sm:text-base comic-border-sm transition-transform active:scale-95 comic-shadow-sm ${
                mode === "HARDCORE_VOICE"
                  ? "bg-comic-bayangan text-white animate-bounce"
                  : "bg-gray-100 text-comic-ink hover:bg-gray-200"
              }`}
              title={mode === "HARDCORE_VOICE" ? "Mode Dengar Aktif! Tap untuk kembalikan" : "Aktifkan Mode Dengar Suara (Hardcore)"}
            >
              {mode === "HARDCORE_VOICE" ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="inline">DENGAR</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="hidden sm:inline">NORMAL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Nav Links (Visible to all, disabled with prompt when not logged in) */}
        <nav className="w-full sm:w-auto flex items-center justify-around sm:justify-end gap-1 sm:gap-2 pt-1 sm:pt-0 border-t-2 sm:border-t-0 border-gray-200">
          <Link
            href="/play"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1 bg-comic-yellow comic-border-sm rounded hover:bg-yellow-400 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-ink ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Arena Game"}
          >
            <Play className="w-3.5 h-3.5 fill-comic-ink" />
            <span>MAIN</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/chapter"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1 bg-white comic-border-sm rounded hover:bg-yellow-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-ink ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Story Chapters"}
          >
            <BookOpen className="w-3.5 h-3.5 text-comic-ink" />
            <span className="sm:hidden">CHAPTER</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/duel"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1 bg-white comic-border-sm rounded hover:bg-pink-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-bayangan ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Mode Duel"}
          >
            <Swords className="w-3.5 h-3.5 text-comic-bayangan" />
            <span className="sm:hidden">DUEL</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/leaderboard"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1 bg-white comic-border-sm rounded hover:bg-blue-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-klu ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Papan Peringkat"}
          >
            <Trophy className="w-3.5 h-3.5 text-comic-klu" />
            <span className="sm:hidden">RANK</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/usul"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1 bg-white comic-border-sm rounded hover:bg-green-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-emerald-700 ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Usulkan Kata"}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="sm:hidden">USUL</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1 bg-gray-100 comic-border-sm rounded hover:bg-red-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-red-600"
              title="Keluar Akun"
            >
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>KELUAR</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="flex-1 sm:flex-initial min-h-[38px] px-3 py-1 bg-comic-bayangan comic-border-sm rounded hover:bg-pink-600 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-white"
              title="Masuk / Daftar Akun"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>MASUK</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
