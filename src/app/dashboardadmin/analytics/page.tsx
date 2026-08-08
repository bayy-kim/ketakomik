"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { AlertTriangle, TrendingUp, Users, Award, Database, RefreshCw, Trophy, Zap, Layers, Sparkles, Activity } from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  dauWau: { day: string; DAU: number; WAU: number }[];
  modeDistribution: { name: string; count: number }[];
  attemptsDistribution: { attempt: string; count: number }[];
  flaggedWords: {
    id: string;
    text: string;
    scheduledDate: string;
    totalPlayed: number;
    winRate: number;
    attempt1Rate: number;
    flag: "TOO_EASY" | "TOO_HARD";
    reason: string;
  }[];
  totalGameSessions: number;
  totalWon: number;
  overallWinRate: number;
  avgAttempts: string;
  totalUsers: number;
  totalWords: number;
  totalChapters: number;
  pendingSuggestions: number;
}

const BRAND_COLORS = {
  klu: "#2B6CFF",
  bayangan: "#FF3D81",
  correct: "#22C55E",
  yellow: "#FFD200",
  wrong: "#F5402C",
  absent: "#64748B",
};

const PIE_COLORS = ["#2B6CFF", "#FF3D81", "#22C55E", "#FFD200", "#9333EA"];

// Custom Comic Styled Tooltip Component
function CustomComicTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white comic-border p-3 rounded-lg comic-shadow-sm font-sans text-xs">
        <p className="font-bangers text-sm text-comic-ink mb-1 border-b border-comic-ink pb-0.5">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 my-0.5">
            <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.color }}>
              <span className="w-2.5 h-2.5 rounded-full border border-comic-ink inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bangers text-sm text-comic-ink">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (e) {
      console.error("Gagal memuat analitik admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl">
        <div className="bg-white comic-border p-8 rounded-xl comic-shadow text-center flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-comic-yellow comic-border flex items-center justify-center font-bangers text-xl text-comic-ink animate-spin">
            💥
          </div>
          <p className="font-bangers text-xl text-comic-ink">MEMUAT GRAFIK ANALITIK HARIAN...</p>
        </div>
      </div>
    );
  }

  const hasData = data && data.totalGameSessions > 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow border-l-8 border-l-comic-klu flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-7 h-7 text-comic-klu animate-pulse" />
            <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">DASHBOARD ANALITIK & RECHARTS</h1>
          </div>
          <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1 max-w-2xl">
            Pantau statistik keaktifan pemain (DAU/WAU), split mode permainan, distribusi percobaan, dan deteksi otomatis anomali kesulitan kata.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="comic-btn text-sm bg-comic-yellow text-comic-ink hover:bg-yellow-400 shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> REFRESH DATA
        </button>
      </div>

      {/* Overview Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-sans font-bold text-gray-600 tracking-wide uppercase">TOTAL GAMEPLAY</span>
            <span className="font-bangers text-3xl sm:text-4xl text-comic-ink leading-none mt-1">
              {data?.totalGameSessions || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 comic-border flex items-center justify-center text-comic-klu comic-shadow-sm shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-sans font-bold text-gray-600 tracking-wide uppercase">TINGKAT KEMENANGAN</span>
            <span className="font-bangers text-3xl sm:text-4xl text-emerald-600 leading-none mt-1">
              {data?.overallWinRate || 0}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 comic-border flex items-center justify-center text-emerald-600 comic-shadow-sm shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-sans font-bold text-gray-600 tracking-wide uppercase">RATA-RATA COBA</span>
            <span className="font-bangers text-3xl sm:text-4xl text-comic-bayangan leading-none mt-1">
              {data?.avgAttempts || "0"}x
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 comic-border flex items-center justify-center text-comic-bayangan comic-shadow-sm shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-sans font-bold text-gray-600 tracking-wide uppercase">PEMAIN TERDAFTAR</span>
            <span className="font-bangers text-3xl sm:text-4xl text-comic-ink leading-none mt-1">
              {data?.totalUsers || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 comic-border flex items-center justify-center text-comic-ink comic-shadow-sm shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white comic-border p-8 rounded-xl comic-shadow text-center flex flex-col items-center gap-3">
          <Database className="w-12 h-12 text-gray-400 animate-pulse" />
          <h3 className="font-bangers text-2xl text-comic-ink">BELUM ADA DATA PERMAINAN SANGAT BARU</h3>
          <p className="text-xs font-sans text-gray-600 max-w-md">
            Statistik analitik dan grafik Recharts akan otomatis terisi secara real-time setelah pemain mulai merespons tebak kata!
          </p>
        </div>
      ) : (
        <>
          {/* Flagged Words Warning Panel */}
          <div className="bg-amber-50 comic-border p-4 sm:p-5 rounded-xl comic-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bangers text-xl sm:text-2xl text-comic-ink">
              <AlertTriangle className="w-6 h-6 text-orange-500 animate-bounce shrink-0" /> DETEKSI ANOMALI TINGKAT KESULITAN KATA
            </div>
            <p className="text-xs sm:text-sm font-sans text-gray-700 leading-relaxed">
              Sistem secara otomatis menandai kata yang <span className="font-bold text-red-600">Terlalu Sulit (&lt;10% menang)</span> atau <span className="font-bold text-emerald-600">Terlalu Mudah (&gt;90% menang di percobaan 1)</span>.
            </p>

            {data.flaggedWords.length === 0 ? (
              <div className="bg-white comic-border-sm p-3 rounded-lg text-xs font-sans text-emerald-700 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Semua kata seimbang & belum ada yang terdeteksi anomali kesulitan!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {data.flaggedWords.map((item) => (
                  <div
                    key={item.id}
                    className={`comic-border p-3.5 rounded-xl flex flex-col gap-1.5 bg-white ${
                      item.flag === "TOO_EASY" ? "border-emerald-500 shadow-[3px_3px_0_#22C55E]" : "border-red-500 shadow-[3px_3px_0_#F5402C]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bangers text-xl text-comic-ink">{item.text}</span>
                      <span
                        className={`font-bangers text-xs px-2.5 py-0.5 rounded comic-border-sm text-white ${
                          item.flag === "TOO_EASY" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      >
                        {item.flag === "TOO_EASY" ? "TERLALU MUDAH" : "TERLALU SULIT"}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-gray-700">{item.reason}</p>
                    <div className="flex justify-between items-center text-[11px] font-sans text-gray-500 pt-1 border-t border-gray-100 mt-0.5">
                      <span>Dimainkan: <strong>{item.totalPlayed}x</strong></span>
                      <span>Win Rate: <strong>{item.winRate}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart 1: DAU / WAU Trend AreaChart */}
          <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
            <div className="flex items-center justify-between border-b-2 border-comic-ink pb-2">
              <h2 className="font-bangers text-xl sm:text-2xl text-comic-ink flex items-center gap-2">
                <Users className="w-6 h-6 text-comic-klu" /> DAU / WAU (DAILY & WEEKLY ACTIVE USERS)
              </h2>
              <span className="bg-blue-100 text-comic-klu font-bangers text-xs px-2.5 py-1 rounded comic-border-sm">
                7 HARI TERAKHIR
              </span>
            </div>

            <div className="w-full h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dauWau} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND_COLORS.klu} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={BRAND_COLORS.klu} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorWau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND_COLORS.yellow} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={BRAND_COLORS.yellow} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fill: "#16161A", fontFamily: "var(--font-bangers)", fontSize: 13 }} />
                  <YAxis tick={{ fill: "#16161A", fontFamily: "var(--font-bangers)", fontSize: 13 }} />
                  <Tooltip content={<CustomComicTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: "var(--font-bangers)", fontSize: "14px", paddingTop: "8px" }} />
                  <Area type="monotone" dataKey="DAU" stroke={BRAND_COLORS.klu} strokeWidth={3} fillOpacity={1} fill="url(#colorDau)" />
                  <Area type="monotone" dataKey="WAU" stroke={BRAND_COLORS.yellow} strokeWidth={3} fillOpacity={1} fill="url(#colorWau)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 & 3: Attempt Distribution & Mode Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 2: Attempt Distribution */}
            <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
              <div className="flex items-center justify-between border-b-2 border-comic-ink pb-2">
                <h2 className="font-bangers text-xl text-comic-ink flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" /> DISTRIBUSI JUMLAH PERCOBAAN
                </h2>
              </div>
              <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.attemptsDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="attempt" tick={{ fill: "#16161A", fontFamily: "var(--font-bangers)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#16161A", fontFamily: "var(--font-bangers)", fontSize: 12 }} />
                    <Tooltip content={<CustomComicTooltip />} />
                    <Bar dataKey="count" name="Jumlah Sesi" fill={BRAND_COLORS.correct} radius={[6, 6, 0, 0]} stroke="#16161A" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Mode Normal vs Hardcore Voice Split */}
            <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
              <div className="flex items-center justify-between border-b-2 border-comic-ink pb-2">
                <h2 className="font-bangers text-xl text-comic-ink flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-comic-bayangan" /> SPLIT MODE NORMAL VS DENGAR
                </h2>
              </div>
              <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.modeDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.modeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#16161A" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomComicTooltip />} />
                    <Legend wrapperStyle={{ fontFamily: "var(--font-bangers)", fontSize: "14px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
