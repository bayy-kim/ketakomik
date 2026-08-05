"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Flame, Droplet, Volume2, VolumeX, BookOpen, Swords, Trophy, Sparkles, User, LogIn, Lock, Play, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
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
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function syncUserStatus() {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/user/profile");
          const data = await res.json();
          if (res.ok && data.tinta !== undefined) {
            setTinta(data.tinta);
            setStreak(data.streak);
            setUserAvatarUrl(data.avatarUrl || null);
            saveLocalGameState({ tinta: data.tinta, streak: data.streak });
            return;
          }
        } catch (e) {
          console.error("Gagal sinkronisasi tinta user:", e);
        }
      }
      const state = getLocalGameState();
      setTinta(propTinta ?? state.tinta);
      setStreak(propStreak ?? state.streak);
    }
    syncUserStatus();
    setMode(initialMode ?? getLocalGameState().mode);
  }, [isLoggedIn, propTinta, propStreak, initialMode]);

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
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="w-full bg-white border-b-4 border-comic-ink shadow-[0_4px_0_#16161A] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Top Tier on Mobile / Left Section on Desktop: Logo + Status Badges */}
        <div className="w-full sm:w-auto flex items-center justify-between gap-2.5">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="bg-comic-yellow comic-border px-2.5 py-1 rounded-md rotate-[-2deg] group-hover:rotate-0 transition-transform comic-shadow-sm">
              <span className="font-bangers text-2xl sm:text-3xl text-comic-ink tracking-wider">TEKAKOMIK</span>
            </div>
          </Link>

          {/* Currency Tinta & Streak (Only shown when logged in or playing) */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Streak Indicator */}
              <div
                className="flex items-center gap-1 bg-amber-100 comic-border-sm px-2 py-1 rounded-md comic-shadow-sm text-xs sm:text-sm"
                title="Login berturut-turut (Streak)"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 fill-orange-500 animate-pulse" />
                <span className="font-bangers text-base sm:text-lg text-comic-ink">{streak}</span>
              </div>

              {/* Tinta Currency */}
              <div
                className="flex items-center gap-1 bg-blue-100 comic-border-sm px-2 py-1 rounded-md comic-shadow-sm text-xs sm:text-sm"
                title="Tinta Komik (Currency untuk Buka Clue)"
              >
                <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-comic-klu fill-comic-klu" />
                <span className="font-bangers text-base sm:text-lg text-comic-ink">{tinta}</span>
              </div>

              {/* Hardcore Voice Mode Toggle */}
              <button
                onClick={handleToggleMode}
                className={`flex items-center gap-1 px-2 py-1 rounded-md font-bangers text-xs sm:text-sm comic-border-sm transition-transform active:scale-95 comic-shadow-sm ${
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
          )}
        </div>

        {/* Navigation Bar */}
        <nav className="hidden sm:flex w-full sm:w-auto items-center justify-around sm:justify-end gap-1.5 sm:gap-2 pt-1.5 sm:pt-0 border-t-2 sm:border-t-0 border-gray-200">
          <Link
            href="/play"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[40px] px-3 py-1.5 bg-comic-yellow comic-border-sm rounded-md hover:bg-yellow-400 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-ink ${
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
            className={`flex-1 sm:flex-initial min-h-[40px] px-2.5 py-1.5 bg-white comic-border-sm rounded-md hover:bg-yellow-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-ink ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Story Chapters"}
          >
            <BookOpen className="w-3.5 h-3.5 text-comic-ink" />
            <span className="hidden sm:inline">CHAPTER</span>
            <span className="sm:hidden text-[10px]">CH</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/duel"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[40px] px-2.5 py-1.5 bg-white comic-border-sm rounded-md hover:bg-pink-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-bayangan ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Mode Duel"}
          >
            <Swords className="w-3.5 h-3.5 text-comic-bayangan" />
            <span className="hidden sm:inline font-bangers">DUEL</span>
            <span className="sm:hidden text-[10px] font-bangers">DUEL</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/leaderboard"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[40px] px-2.5 py-1.5 bg-white comic-border-sm rounded-md hover:bg-blue-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-comic-klu ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Papan Peringkat"}
          >
            <Trophy className="w-3.5 h-3.5 text-comic-klu" />
            <span className="hidden sm:inline">RANK</span>
            <span className="sm:hidden text-[10px]">RANK</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          <Link
            href="/usul"
            onClick={alertLoginRequired}
            className={`flex-1 sm:flex-initial min-h-[40px] px-2.5 py-1.5 bg-white comic-border-sm rounded-md hover:bg-green-100 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-emerald-700 ${
              !isLoggedIn ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "Wajib Login Terlebih Dahulu" : "Usulkan Kata"}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">USUL</span>
            <span className="sm:hidden text-[10px]">USUL</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-red-600 ml-0.5" />}
          </Link>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex-1 sm:flex-initial min-h-[40px] px-3 py-1.5 bg-comic-klu comic-border-sm rounded-md hover:bg-blue-600 transition-colors comic-shadow-sm flex items-center justify-center gap-1.5 font-bangers text-xs sm:text-sm text-white"
              title="Dashboard & Profil Saya"
            >
              {userAvatarUrl ? (
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                  <img src={userAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
              )}
              <span>DASHBOARD</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex-1 sm:flex-initial min-h-[40px] px-3 py-1.5 bg-comic-bayangan comic-border-sm rounded-md hover:bg-pink-600 transition-colors comic-shadow-sm flex items-center justify-center gap-1 font-bangers text-xs sm:text-sm text-white"
              title="Masuk / Daftar Akun"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>SIGN IN</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
