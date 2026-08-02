"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Trophy, Volume2, Gamepad2, Flame, Clock } from "lucide-react";

interface LeaderboardItem {
  rank: number;
  name: string;
  attempts: number;
  duration: number;
  mode: string;
  streak?: number;
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
        {/* Leaderboard Header */}
        <div className="bg-comic-klu comic-border p-4 rounded-xl comic-shadow text-white flex items-center justify-between rotate-[-1deg]">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-comic-yellow" />
            <div>
              <h1 className="font-bangers text-3xl sm:text-4xl">PAPAN PERINGKAT DETEKTIF</h1>
              <p className="text-xs sm:text-sm font-sans">
                Para pemain terbaik yang berhasil mengalahkan trik Bayangan!
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection: Mode Normal vs Mode Dengar (Voice) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white comic-border p-3 rounded-xl comic-shadow">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setMode("NORMAL")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded comic-border-sm font-bangers text-base flex items-center justify-center gap-1.5 transition-all ${
                mode === "NORMAL"
                  ? "bg-comic-klu text-white comic-shadow-sm"
                  : "bg-gray-100 text-comic-ink hover:bg-gray-200"
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> MODE NORMAL
            </button>
            <button
              onClick={() => setMode("HARDCORE_VOICE")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded comic-border-sm font-bangers text-base flex items-center justify-center gap-1.5 transition-all ${
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
                className={`px-3 py-1 rounded font-bangers text-sm uppercase ${
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
            <div className="p-8 text-center font-bangers text-2xl text-comic-ink">MEMUAT PERINGKAT...</div>
          ) : (
            <div className="flex flex-col divide-y-2 divide-comic-ink">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 flex items-center justify-between gap-3 ${
                    item.rank === 1
                      ? "bg-amber-50 font-bold"
                      : item.rank === 2
                      ? "bg-slate-50"
                      : item.rank === 3
                      ? "bg-orange-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full comic-border-sm flex items-center justify-center font-bangers text-base ${
                        item.rank === 1
                          ? "bg-comic-yellow text-comic-ink"
                          : item.rank === 2
                          ? "bg-slate-300 text-comic-ink"
                          : item.rank === 3
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 text-comic-ink"
                      }`}
                    >
                      #{item.rank}
                    </div>
                    <div>
                      <span className="font-bangers text-lg text-comic-ink block leading-tight">{item.name}</span>
                      <span className="text-[10px] text-gray-500 font-sans">
                        Mode: {item.mode === "HARDCORE_VOICE" ? "Dengar (Voice)" : "Normal"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bangers">
                    <div className="flex items-center gap-1 text-comic-ink">
                      <span>{item.attempts}x Coba</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.duration}s</span>
                    </div>
                    {item.streak !== undefined && (
                      <div className="hidden sm:flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-0.5 rounded comic-border-sm">
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
