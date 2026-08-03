"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Trophy,
  Flame,
  Droplet,
  Clock,
  LogOut,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  User,
  ShieldCheck,
  Play,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Achievement {
  id: string;
  title: string;
  category: "KATA" | "WAKTU";
  target: number;
  currentProgress: number;
  rewardTinta: number;
  iconEmoji: string;
  description: string;
  isUnlocked: boolean;
  isClaimed: boolean;
}

interface UserData {
  username: string;
  email: string;
  tinta: number;
  currentStreak: number;
  longestStreak: number;
  role: string;
}

interface StatsData {
  totalPlayed: number;
  totalWon: number;
  winRate: number;
  avgAttempts: string;
  totalDurationSeconds: number;
}

interface DailyData {
  date: string;
  played: number;
  won: number;
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [dailyAnalytics, setDailyAnalytics] = useState<DailyData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      const data = await res.json();

      if (data.user) setUser(data.user);
      if (data.stats) setStats(data.stats);
      if (data.dailyAnalytics) setDailyAnalytics(data.dailyAnalytics);
      if (data.achievements) setAchievements(data.achievements);
    } catch (e) {
      console.error("Gagal memuat dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClaimAchievement = async (achievementId: string, rewardTinta: number) => {
    setClaimingId(achievementId);
    try {
      const res = await fetch("/api/user/achievements/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal mengklaim pencapaian!");
        return;
      }

      setToastMsg(`🎉 KLAIM BERHASIL! +${rewardTinta} Tinta ditambahkan ke akunmu!`);
      setTimeout(() => setToastMsg(null), 3000);

      // Refresh dashboard state
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      alert("Koneksi bermasalah!");
    } finally {
      setClaimingId(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}j ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
        <Header />
        <main className="flex-1 flex items-center justify-center font-bangers text-2xl text-comic-ink">
          MEMUAT DASHBOARD DETEKTIF...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header tintaCount={user?.tinta} streakCount={user?.currentStreak} />

      {/* Toast Notification Notification Burst */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-comic-yellow comic-border px-5 py-2.5 rounded-xl comic-shadow-lg text-comic-ink font-bangers text-lg sm:text-xl"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 py-6 flex flex-col gap-6">
        {/* ===== USER PROFILE HEADER CARD ===== */}
        <div className="bg-white comic-border p-5 rounded-2xl comic-shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {/* Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-comic-yellow comic-border flex items-center justify-center font-bangers text-3xl sm:text-4xl text-comic-ink comic-shadow shrink-0 rotate-[-3deg]">
              🦸‍♂️
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink leading-none">
                  {user?.username}
                </h1>
                {user?.role === "ADMIN" && (
                  <span className="bg-comic-bayangan text-white font-bangers text-xs px-2 py-0.5 rounded comic-border-sm">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs font-sans text-gray-600 mt-1">{user?.email || "Detektif Tekakonik"}</p>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <div className="bg-blue-100 comic-border-sm px-2.5 py-0.5 rounded text-xs font-bangers text-comic-ink flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-comic-klu fill-comic-klu" /> {user?.tinta} Tinta
                </div>
                <div className="bg-amber-100 comic-border-sm px-2.5 py-0.5 rounded text-xs font-bangers text-comic-ink flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" /> {user?.currentStreak} Streak Harian
                </div>
              </div>
            </div>
          </div>

          {/* Header Buttons: Main Game & Logout */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/play"
              className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 sm:flex-initial py-2.5"
            >
              <Play className="w-4 h-4 fill-comic-ink" /> MAIN GAME
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="comic-btn text-sm bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-initial py-2.5"
            >
              <LogOut className="w-4 h-4" /> KELUAR
            </button>
          </div>
        </div>

        {/* ===== STATS OVERVIEW CARDS ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="comic-box p-4 flex flex-col items-center text-center gap-1 bg-blue-50">
            <Award className="w-6 h-6 text-comic-klu" />
            <span className="font-bangers text-2xl sm:text-3xl text-comic-ink leading-none">{stats?.totalWon || 0} / {stats?.totalPlayed || 0}</span>
            <span className="text-xs font-sans text-gray-600 font-bold">Kata Ditebak</span>
          </div>

          <div className="comic-box p-4 flex flex-col items-center text-center gap-1 bg-green-50">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span className="font-bangers text-2xl sm:text-3xl text-comic-ink leading-none">{stats?.winRate || 0}%</span>
            <span className="text-xs font-sans text-gray-600 font-bold">Tingkat Kemenangan</span>
          </div>

          <div className="comic-box p-4 flex flex-col items-center text-center gap-1 bg-yellow-50">
            <Trophy className="w-6 h-6 text-comic-yellow fill-comic-yellow" />
            <span className="font-bangers text-2xl sm:text-3xl text-comic-ink leading-none">{stats?.avgAttempts || "0.0"}x</span>
            <span className="text-xs font-sans text-gray-600 font-bold">Rata-rata Percobaan</span>
          </div>

          <div className="comic-box p-4 flex flex-col items-center text-center gap-1 bg-pink-50">
            <Clock className="w-6 h-6 text-comic-bayangan" />
            <span className="font-bangers text-xl sm:text-2xl text-comic-ink leading-none">{formatDuration(stats?.totalDurationSeconds || 0)}</span>
            <span className="text-xs font-sans text-gray-600 font-bold">Akumulasi Waktu</span>
          </div>
        </div>

        {/* ===== ANALITIK JAWABAN PER HARI (RECHARTS CHART) ===== */}
        <div className="bg-white comic-border p-5 rounded-2xl comic-shadow flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-comic-klu text-white font-bangers text-lg sm:text-xl px-3.5 py-1 rounded comic-border-sm">
              📊 ANALITIK JAWABAN HARIAN (7 HARI TERAKHIR)
            </div>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="played" name="Total Dimainkan" fill="#FFD200" radius={[4, 4, 0, 0]} />
                <Bar dataKey="won" name="Berhasil Ditebak" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== ACHIEVEMENTS GRID WITH COMIC-BORDERED BADGES & CLAIM BUTTONS ===== */}
        <div className="bg-white comic-border p-5 rounded-2xl comic-shadow flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="bg-comic-yellow text-comic-ink font-bangers text-lg sm:text-xl px-3.5 py-1 rounded comic-border-sm flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-comic-ink fill-comic-ink" />
              PENCAPAIAN DETEKTIF (ACHIEVEMENTS)
            </div>
            <span className="font-bangers text-sm sm:text-base text-gray-600">
              KLAIM TINTA GRATIS!
            </span>
          </div>

          <p className="text-xs font-sans text-gray-700">
            Selesaikan target tebakan kata (25, 50, 75, 100, 125, 150) dan akumulasi waktu bermain untuk mengklaim bonus Tinta!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => {
              const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.target) * 100));

              return (
                <div
                  key={ach.id}
                  className={`comic-border p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden ${
                    ach.isClaimed
                      ? "bg-green-50/80 border-emerald-600"
                      : ach.isUnlocked
                      ? "bg-yellow-50/90 border-comic-yellow animate-pulse"
                      : "bg-gray-50 opacity-90"
                  }`}
                >
                  {/* Badge Gambar Terbungkus Border Komik */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-14 h-14 rounded-xl comic-border flex items-center justify-center text-3xl comic-shadow shrink-0 select-none ${
                        ach.isUnlocked ? "bg-comic-yellow" : "bg-gray-200"
                      }`}
                    >
                      {ach.iconEmoji}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bangers text-lg text-comic-ink leading-tight">{ach.title}</span>
                      <p className="text-[11px] font-sans text-gray-600 mt-0.5 leading-snug">{ach.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between text-[11px] font-bangers text-comic-ink">
                      <span>PROGRESS: {ach.category === "WAKTU" ? formatDuration(ach.currentProgress) : ach.currentProgress}</span>
                      <span>TARGET: {ach.category === "WAKTU" ? formatDuration(ach.target) : ach.target} ({progressPercent}%)</span>
                    </div>

                    <div className="w-full h-3.5 bg-gray-200 comic-border-sm rounded-full overflow-hidden">
                      <div
                        className="h-full bg-comic-correct transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Action Button */}
                  {ach.isClaimed ? (
                    <div className="flex items-center justify-center gap-1 bg-emerald-100 comic-border-sm py-1.5 rounded-lg text-xs font-bangers text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SUDAH DIKLAIM
                    </div>
                  ) : ach.isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={claimingId === ach.id}
                      onClick={() => handleClaimAchievement(ach.id, ach.rewardTinta)}
                      className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink py-2 w-full"
                    >
                      <Sparkles className="w-4 h-4 fill-comic-ink animate-bounce" />
                      {claimingId === ach.id ? "MENGKLAIM..." : `KLAIM +${ach.rewardTinta} TINTA`}
                    </motion.button>
                  ) : (
                    <div className="flex items-center justify-center gap-1 bg-gray-200 comic-border-sm py-1.5 rounded-lg text-xs font-bangers text-gray-500">
                      BELUM TERBUKA (+{ach.rewardTinta} TINTA)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ===== MODAL KONFIRMASI LOGOUT KOMIK ===== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-comic-paper comic-border p-6 rounded-2xl comic-shadow-lg max-w-sm w-full flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in">
            <div className="w-14 h-14 rounded-full bg-red-500 comic-border flex items-center justify-center text-white comic-shadow">
              <LogOut className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-bangers text-2xl text-comic-ink">KONFIRMASI KELUAR AKUN</h2>
              <p className="text-xs font-sans text-gray-700 mt-1">
                Apakah kamu yakin ingin keluar dari akun Tekakonik?
              </p>
            </div>

            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="comic-btn text-sm bg-white hover:bg-gray-100 text-comic-ink flex-1 py-2.5"
              >
                BATAL
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="comic-btn text-sm bg-red-500 hover:bg-red-600 text-white flex-1 py-2.5"
              >
                YA, KELUAR
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
