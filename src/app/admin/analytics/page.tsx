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
} from "recharts";
import { AlertTriangle, TrendingUp, Users, Award } from "lucide-react";

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
}

const COLORS = ["#2B6CFF", "#FF3D81", "#22C55E", "#FFD200", "#F5402C"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return <div className="p-8 font-bangers text-2xl text-comic-ink">MEMUAT GRAFIK ANALITIK...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
        <div>
          <h1 className="font-bangers text-3xl text-comic-ink">DASHBOARD ANALITIK & RECHARTS</h1>
          <p className="text-xs font-sans text-gray-700">
            Pantau DAU/WAU, distribusi mode, serta kata yang terdeteksi terlalu mudah atau terlalu sulit.
          </p>
        </div>
      </div>

      {/* Flagged Words Warning Panel (Auto-Difficulty Balancer) */}
      <div className="bg-amber-50 comic-border p-4 rounded-xl comic-shadow flex flex-col gap-3">
        <div className="flex items-center gap-2 font-bangers text-xl text-comic-ink">
          <AlertTriangle className="w-5 h-5 text-orange-500 animate-bounce" /> DETEKSI ANOMALI TINGKAT KESULITAN
        </div>
        <p className="text-xs font-sans text-gray-700">
          Sistem secara otomatis menandai kata yang <span className="font-bold text-red-600">Terlalu Sulit (&lt;10% menang)</span> atau <span className="font-bold text-emerald-600">Terlalu Mudah (&gt;90% menang di percobaan 1)</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {data.flaggedWords.map((item) => (
            <div
              key={item.id}
              className={`comic-border p-3 rounded-lg flex flex-col gap-1 bg-white ${
                item.flag === "TOO_EASY" ? "border-emerald-500" : "border-red-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bangers text-lg text-comic-ink">{item.text}</span>
                <span
                  className={`font-bangers text-xs px-2 py-0.5 rounded text-white ${
                    item.flag === "TOO_EASY" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  {item.flag === "TOO_EASY" ? "TERLALU MUDAH" : "TERLALU SULIT"}
                </span>
              </div>
              <span className="text-xs font-sans text-gray-600">{item.reason}</span>
              <span className="text-[10px] text-gray-400">Dimainkan: {item.totalPlayed}x | Win Rate: {item.winRate}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 1: DAU / WAU Trend BarChart */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
        <h2 className="font-bangers text-xl text-comic-ink flex items-center gap-2">
          <Users className="w-5 h-5 text-comic-klu" /> DAU / WAU (DAILY & WEEKLY ACTIVE USERS)
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dauWau}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="DAU" fill="#2B6CFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="WAU" fill="#FFD200" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: Attempt Distribution & Mode Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
          <h2 className="font-bangers text-xl text-comic-ink flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> DISTRIBUSI JUMLAH PERCOBAAN
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attemptsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
          <h2 className="font-bangers text-xl text-comic-ink flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-comic-bayangan" /> SPLIT MODE NORMAL VS DENGAR
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.modeDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {data.modeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
