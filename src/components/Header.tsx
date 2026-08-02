"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Flame, Droplet, Volume2, VolumeX, BookOpen, Swords, Trophy, Sparkles, User, ShieldAlert } from "lucide-react";
import { getLocalGameState, saveLocalGameState } from "@/lib/storage";

interface HeaderProps {
  mode?: "NORMAL" | "HARDCORE_VOICE";
  onModeToggle?: (newMode: "NORMAL" | "HARDCORE_VOICE") => void;
  tintaCount?: number;
  streakCount?: number;
}

export function Header({ mode: initialMode, onModeToggle, tintaCount: propTinta, streakCount: propStreak }: HeaderProps) {
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

  return (
    <header className="w-full bg-white border-b-4 border-comic-ink shadow-[0_4px_0_#16161A] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center justify-between">
        {/* Logo Brand */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="bg-comic-yellow comic-border px-2 py-0.5 rounded rotate-[-2deg] group-hover:rotate-0 transition-transform shadow-[2px_2px_0_#16161A]">
            <span className="font-bangers text-2xl sm:text-3xl text-comic-ink tracking-wider">TEKAKOMIK</span>
          </div>
        </Link>

        {/* Currency Tinta & Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 bg-amber-100 comic-border-sm px-2 py-1 rounded shadow-[2px_2px_0_#16161A]"
            title="Login berturut-turut (Streak)"
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
            <span className="font-bangers text-base sm:text-lg text-comic-ink">{streak}</span>
          </div>

          {/* Tinta Currency */}
          <div
            className="flex items-center gap-1 bg-blue-100 comic-border-sm px-2 py-1 rounded shadow-[2px_2px_0_#16161A]"
            title="Tinta Komik (Currency untuk Buka Clue)"
          >
            <Droplet className="w-4 h-4 text-comic-klu fill-comic-klu" />
            <span className="font-bangers text-base sm:text-lg text-comic-ink">{tinta}</span>
          </div>

          {/* Hardcore Voice Mode Toggle */}
          <button
            onClick={handleToggleMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bangers text-sm sm:text-base comic-border-sm transition-transform active:scale-95 shadow-[2px_2px_0_#16161A] ${
              mode === "HARDCORE_VOICE"
                ? "bg-comic-bayangan text-white animate-bounce"
                : "bg-gray-100 text-comic-ink hover:bg-gray-200"
            }`}
            title={mode === "HARDCORE_VOICE" ? "Mode Dengar Aktif! Tap untuk kembalikan" : "Aktifkan Mode Dengar Suara (Hardcore)"}
          >
            {mode === "HARDCORE_VOICE" ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">DENGAR</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-500" />
                <span className="hidden sm:inline">NORMAL</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Nav Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/chapter"
            className="p-1.5 bg-white comic-border-sm rounded hover:bg-yellow-100 transition-colors shadow-[2px_2px_0_#16161A]"
            title="Story Chapters"
          >
            <BookOpen className="w-4 h-4 text-comic-ink" />
          </Link>
          <Link
            href="/duel"
            className="p-1.5 bg-white comic-border-sm rounded hover:bg-magenta-100 transition-colors shadow-[2px_2px_0_#16161A]"
            title="Mode Duel"
          >
            <Swords className="w-4 h-4 text-comic-bayangan" />
          </Link>
          <Link
            href="/leaderboard"
            className="p-1.5 bg-white comic-border-sm rounded hover:bg-blue-100 transition-colors shadow-[2px_2px_0_#16161A]"
            title="Papan Peringkat"
          >
            <Trophy className="w-4 h-4 text-comic-klu" />
          </Link>
          <Link
            href="/usul"
            className="p-1.5 bg-white comic-border-sm rounded hover:bg-green-100 transition-colors shadow-[2px_2px_0_#16161A]"
            title="Usulkan Kata"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </Link>
          <Link
            href="/admin"
            className="p-1.5 bg-gray-200 comic-border-sm rounded hover:bg-gray-300 transition-colors shadow-[2px_2px_0_#16161A]"
            title="Admin Panel"
          >
            <ShieldAlert className="w-4 h-4 text-comic-ink" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
