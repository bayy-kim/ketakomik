"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trophy, Volume2, Gamepad2, Flame, Clock, Award, Star } from "lucide-react";

interface LeaderboardItem {
  rank: number;
  name: string;
  score: number;
  attempts: number;
  duration: number;
  mode: string;
  badge?: string;
  streak?: number;
  avatarSeed: string;
  avatarUrl?: string | null;
}

export default function LeaderboardPage() {
  const [mode, setMode] = useState<"NORMAL" | "HARDCORE_VOICE">("NORMAL");
  const [period, setPeriod] = useState<"daily" | "weekly" | "alltime">("alltime");
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?mode=${mode}&period=${period}`);
        const data = await res.json();
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      } catch (e) {
        console.error("Gagal memuat leaderboard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, [mode, period]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-6 flex flex-col gap-6">
        {/* Leaderboard Header Banner */}
        <div className="bg-comic-klu comic-border p-4 rounded-xl comic-shadow text-white flex items-center justify-between rotate-[-1deg]">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-comic-yellow shrink-0" />
            <div>
              <h1 className="font-bangers text-3xl sm:text-4xl">PAPAN PERINGKAT DETEKTIF</h1>
              <p className="text-xs sm:text-sm font-sans">
                Peringkat dihitung berdasarkan <strong className="text-comic-yellow">SKOR KOMIK</strong> (Percobaan + Waktu + Mode)!
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection: Mode Normal vs Mode Dengar (Voice) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white comic-border p-3 rounded-xl comic-shadow">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setMode("NORMAL")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg comic-border-sm font-bangers text-base flex items-center justify-center gap-1.5 transition-all ${
                mode === "NORMAL"
                  ? "bg-comic-klu text-white comic-shadow-sm"
                  : "bg-gray-100 text-comic-ink hover:bg-gray-200"
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> MODE NORMAL
            </button>
            <button
              onClick={() => setMode("HARDCORE_VOICE")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg comic-border-sm font-bangers text-base flex items-center justify-center gap-1.5 transition-all ${
                mode === "HARDCORE_VOICE"
                  ? "bg-comic-bayangan text-white comic-shadow-sm"
                  : "bg-gray-100 text-comic-ink hover:bg-gray-200"
              }`}
            >
              <Volume2 className="w-4 h-4" /> MODE DENGAR (HARDCORE)
            </button>
          </div>

          {/* Period Filter */}
          <div className="flex gap-1 bg-gray-100 comic-border-sm p-1 rounded-lg w-full sm:w-auto justify-center">
            {(["daily", "weekly", "alltime"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded font-bangers text-xs sm:text-sm uppercase ${
                  period === p ? "bg-comic-yellow text-comic-ink comic-border-sm" : "text-gray-600 hover:text-comic-ink"
                }`}
              >
                {p === "daily" ? "Harian" : p === "weekly" ? "Mingguan" : "Sepanjang Masa"}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="bg-white comic-border rounded-xl comic-shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center font-bangers text-2xl text-comic-ink animate-pulse">
              MEMUAT PERINGKAT DETEKTIF...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-10 flex flex-col items-center text-center gap-3">
              <span className="text-5xl">🏆</span>
              <p className="font-bangers text-2xl text-comic-ink">BELUM ADA LAPORAN DETEKTIF!</p>
              <p className="text-xs font-sans text-gray-600 max-w-xs">
                Jadilah yang pertama memecahkan teka-teki hari ini dan catatkan namamu di papan peringkat Tekakomik!
              </p>
              <a
                href="/play"
                className="mt-2 comic-btn bg-comic-yellow text-comic-ink text-sm"
              >
                🕵️ MULAI BERMAIN SEKARANG
              </a>
            </div>
          ) : (
            <div className="flex flex-col divide-y-2 divide-comic-ink">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 flex items-center justify-between gap-3 ${
                    item.rank === 1
                      ? "bg-amber-50"
                      : item.rank === 2
                      ? "bg-slate-50"
                      : item.rank === 3
                      ? "bg-orange-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full comic-border-sm flex items-center justify-center font-bangers text-base shrink-0 ${
                        item.rank === 1
                          ? "bg-comic-yellow text-comic-ink"
                          : item.rank === 2
                          ? "bg-slate-300 text-comic-ink"
                          : item.rank === 3
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-comic-ink"
                      }`}
                    >
                      #{item.rank}
                    </div>

                    {/* Render Avatar/Custom Profile Photo in Leaderboard list */}
                    {item.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden comic-border-sm relative shrink-0">
                        <img src={item.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-comic-yellow comic-border-sm flex items-center justify-center text-xl shrink-0 select-none">
                        {item.avatarSeed === "klu_fan" ? "🦸‍♂️" : item.avatarSeed === "bayangan_trick" ? "🦹‍♀️" : "🔍"}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bangers text-lg text-comic-ink leading-tight">{item.name}</span>
                        {item.badge && (
                          <span className="bg-comic-yellow comic-border-sm px-2 py-0.5 rounded text-[10px] font-bangers text-comic-ink">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-600 font-sans">
                        {item.attempts}x Coba · Waktu: {item.duration}s · Mode: {item.mode === "HARDCORE_VOICE" ? "Dengar" : "Normal"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-bangers">
                    {/* Comic Score Badge */}
                    <div className="bg-comic-yellow comic-border-sm px-3 py-1 rounded-md text-comic-ink text-center shadow-[2px_2px_0_#16161A]">
                      <span className="text-xs font-sans text-gray-700 block text-[9px] leading-none">SKOR KOMIK</span>
                      <span className="text-base sm:text-lg leading-tight">{item.score || 85} PT</span>
                    </div>

                    {item.streak !== undefined && (
                      <div className="hidden sm:flex items-center gap-1 text-orange-600 bg-orange-100 comic-border-sm px-2 py-1 rounded-md text-xs">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        <span>{item.streak}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
