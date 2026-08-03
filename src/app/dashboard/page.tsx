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
  Play,
  Edit3,
  X,
  Check,
  ShieldCheck,
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
  avatarSeed?: string;
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

const COMIC_AVATARS = [
  { id: "klu_fan", emoji: "🦸‍♂️", label: "Kapten Klu" },
  { id: "bayangan_trick", emoji: "🦹‍♀️", label: "Bayangan" },
  { id: "sleuth_master", emoji: "🔍", label: "Master Sleuth" },
  { id: "burst_action", emoji: "💥", label: "Burst Hero" },
  { id: "comic_legend", emoji: "👑", label: "Comic Legend" },
  { id: "electric_detective", emoji: "⚡", label: "Electric Detective" },
];

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [dailyAnalytics, setDailyAnalytics] = useState<DailyData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Profile edit states
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarSeed, setEditAvatarSeed] = useState("klu_fan");
  const [savingProfile, setSavingProfile] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
        setEditUsername(data.user.username);
        setEditAvatarSeed(data.user.avatarSeed || "klu_fan");
      }
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername || editUsername.trim().length < 3) {
      alert("Username minimal 3 karakter!");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: editUsername.trim(), avatarSeed: editAvatarSeed }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal meng-update profil");
        return;
      }

      setToastMsg("✨ Profil Komik berhasil diperbarui!");
      setTimeout(() => setToastMsg(null), 3000);
      setShowEditProfileModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Koneksi bermasalah saat menyimpan profil!");
    } finally {
      setSavingProfile(false);
    }
  };

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

  const currentAvatarEmoji = COMIC_AVATARS.find((a) => a.id === user?.avatarSeed)?.emoji || "🦸‍♂️";

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

      {/* Toast Notification Burst */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-comic-yellow comic-border px-4 py-2 rounded-xl comic-shadow-lg text-comic-ink font-bangers text-base sm:text-xl text-center max-w-[90vw]"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-5xl mx-auto w-full px-2.5 sm:px-4 py-4 sm:py-6 flex flex-col gap-5">
        {/* ===== USER PROFILE HEADER CARD ===== */}
        <div className="bg-white comic-border p-4 sm:p-5 rounded-2xl comic-shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left w-full sm:w-auto">
            {/* Avatar Badge Terbungkus Border Komik */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-comic-yellow comic-border flex items-center justify-center font-bangers text-3xl sm:text-4xl text-comic-ink comic-shadow shrink-0 rotate-[-3deg] select-none">
              {currentAvatarEmoji}
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-bangers text-2xl sm:text-4xl text-comic-ink leading-none">
                  {user?.username}
                </h1>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 comic-border-sm rounded-md text-comic-ink"
                  title="Edit Profil Komik"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {user?.role === "ADMIN" && (
                  <Link href="/dashboardadmin" className="bg-comic-bayangan text-white font-bangers text-xs px-2 py-0.5 rounded comic-border-sm hover:bg-pink-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ADMIN HUB
                  </Link>
                )}
              </div>
              <p className="text-xs font-sans text-gray-600 mt-1">{user?.email || "Detektif Tekakonik"}</p>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2">
                <div className="bg-blue-100 comic-border-sm px-2.5 py-0.5 rounded-md text-xs font-bangers text-comic-ink flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-comic-klu fill-comic-klu" /> {user?.tinta} Tinta
                </div>
                <div className="bg-amber-100 comic-border-sm px-2.5 py-0.5 rounded-md text-xs font-bangers text-comic-ink flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" /> {user?.currentStreak} Streak Harian
                </div>
              </div>
            </div>
          </div>

          {/* Header Buttons: Main Game & Logout */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/play"
              className="comic-btn text-xs sm:text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 sm:flex-initial py-2.5"
            >
              <Play className="w-4 h-4 fill-comic-ink" /> MAIN GAME
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="comic-btn text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-initial py-2.5"
            >
              <LogOut className="w-4 h-4" /> KELUAR
            </button>
          </div>
        </div>

        {/* ===== STATS OVERVIEW CARDS ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="comic-box p-3 sm:p-4 flex flex-col items-center text-center gap-1 bg-blue-50">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-comic-klu" />
            <span className="font-bangers text-xl sm:text-3xl text-comic-ink leading-none">{stats?.totalWon || 0} / {stats?.totalPlayed || 0}</span>
            <span className="text-[11px] sm:text-xs font-sans text-gray-700 font-bold">Kata Ditebak</span>
          </div>

          <div className="comic-box p-3 sm:p-4 flex flex-col items-center text-center gap-1 bg-green-50">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            <span className="font-bangers text-xl sm:text-3xl text-comic-ink leading-none">{stats?.winRate || 0}%</span>
            <span className="text-[11px] sm:text-xs font-sans text-gray-700 font-bold">Tingkat Kemenangan</span>
          </div>

          <div className="comic-box p-3 sm:p-4 flex flex-col items-center text-center gap-1 bg-yellow-50">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-comic-yellow fill-comic-yellow" />
            <span className="font-bangers text-xl sm:text-3xl text-comic-ink leading-none">{stats?.avgAttempts || "0.0"}x</span>
            <span className="text-[11px] sm:text-xs font-sans text-gray-700 font-bold">Rata Percobaan</span>
          </div>

          <div className="comic-box p-3 sm:p-4 flex flex-col items-center text-center gap-1 bg-pink-50">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-comic-bayangan" />
            <span className="font-bangers text-lg sm:text-2xl text-comic-ink leading-none">{formatDuration(stats?.totalDurationSeconds || 0)}</span>
            <span className="text-[11px] sm:text-xs font-sans text-gray-700 font-bold">Akumulasi Waktu</span>
          </div>
        </div>

        {/* ===== ANALITIK JAWABAN PER HARI (RECHARTS CHART) ===== */}
        <div className="bg-white comic-border p-4 sm:p-5 rounded-2xl comic-shadow flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-comic-klu text-white font-bangers text-base sm:text-xl px-3 py-1 rounded comic-border-sm">
              📊 ANALITIK JAWABAN HARIAN (7 HARI TERAKHIR)
            </div>
          </div>

          <div className="w-full h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="played" name="Total Dimainkan" fill="#FFD200" radius={[4, 4, 0, 0]} />
                <Bar dataKey="won" name="Berhasil Ditebak" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== ACHIEVEMENTS GRID WITH COMIC-BORDERED BADGES & CLAIM BUTTONS ===== */}
        <div className="bg-white comic-border p-4 sm:p-5 rounded-2xl comic-shadow flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="bg-comic-yellow text-comic-ink font-bangers text-base sm:text-xl px-3 py-1 rounded comic-border-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-comic-ink fill-comic-ink" />
              PENCAPAIAN DETEKTIF (ACHIEVEMENTS)
            </div>
            <span className="font-bangers text-xs sm:text-base text-gray-600">
              KLAIM TINTA GRATIS!
            </span>
          </div>

          <p className="text-xs font-sans text-gray-700">
            Selesaikan target tebakan kata (25, 50, 75, 100, 125, 150) dan akumulasi waktu bermain untuk mengklaim bonus Tinta!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {achievements.map((ach) => {
              const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.target) * 100));

              return (
                <div
                  key={ach.id}
                  className={`comic-border p-3.5 sm:p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden ${
                    ach.isClaimed
                      ? "bg-green-50/80 border-emerald-600"
                      : ach.isUnlocked
                      ? "bg-yellow-50/90 border-comic-yellow animate-pulse"
                      : "bg-gray-50 opacity-90"
                  }`}
                >
                  {/* Badge Gambar Terbungkus Border Komik Tebal */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl comic-border flex items-center justify-center text-2xl sm:text-3xl comic-shadow shrink-0 select-none ${
                        ach.isUnlocked ? "bg-comic-yellow" : "bg-gray-200"
                      }`}
                    >
                      {ach.iconEmoji}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bangers text-base sm:text-lg text-comic-ink leading-tight">{ach.title}</span>
                      <p className="text-[11px] font-sans text-gray-600 mt-0.5 leading-snug">{ach.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between text-[10px] sm:text-[11px] font-bangers text-comic-ink">
                      <span>PROGRESS: {ach.category === "WAKTU" ? formatDuration(ach.currentProgress) : ach.currentProgress}</span>
                      <span>TARGET: {ach.category === "WAKTU" ? formatDuration(ach.target) : ach.target} ({progressPercent}%)</span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 comic-border-sm rounded-full overflow-hidden">
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
                      <Sparkles className="w-3.5 h-3.5 fill-comic-ink animate-bounce" />
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

      {/* ===== MODAL EDIT PROFIL KOMIK ===== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-comic-paper comic-border p-5 sm:p-6 rounded-2xl comic-shadow-lg max-w-md w-full flex flex-col gap-4 animate-in fade-in zoom-in relative">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md comic-border-sm hover:bg-gray-100 text-comic-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-comic-yellow comic-border p-2.5 rounded-xl flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-comic-ink" />
              <h2 className="font-bangers text-xl sm:text-2xl text-comic-ink">EDIT PROFIL KOMIK</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 text-xs font-sans">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">USERNAME KOMIK BARU:</label>
                <input
                  type="text"
                  required
                  placeholder="DetektifSuper99"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="bg-white comic-border px-3 py-2 rounded-md font-bangers text-base text-comic-ink"
                />
              </div>

              {/* Pilihan Avatar Komik Terbungkus Border Komik */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bangers text-sm text-comic-ink">PILIH AVATAR KOMIK:</label>
                <div className="grid grid-cols-3 gap-2">
                  {COMIC_AVATARS.map((av) => {
                    const isSelected = editAvatarSeed === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setEditAvatarSeed(av.id)}
                        className={`comic-border p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? "bg-comic-yellow comic-shadow-sm scale-105"
                            : "bg-white hover:bg-gray-50 opacity-80"
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl select-none">{av.emoji}</span>
                        <span className="font-bangers text-[10px] text-comic-ink leading-none">{av.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="comic-btn text-sm sm:text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-2.5 mt-1"
              >
                <Check className="w-4 h-4" /> {savingProfile ? "Menyimpan..." : "SIMPAN PERUBAHAN PROFIL"}
              </button>
            </form>
          </div>
        </div>
      )}

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
