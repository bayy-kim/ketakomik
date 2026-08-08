"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Layers, MessageSquarePlus, RefreshCw } from "lucide-react";

interface StatData {
  totalUsers: number;
  totalWords: number;
  totalChapters: number;
  pendingSuggestions: number;
}

export function AdminStatCards() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (res.ok) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalWords: data.totalWords || 0,
          totalChapters: data.totalChapters || 0,
          pendingSuggestions: data.pendingSuggestions || 0,
        });
      }
    } catch (e) {
      console.error("Gagal memuat statistik admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white comic-border p-4 rounded-xl comic-shadow animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "TOTAL PEMAIN",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-100 border-comic-klu text-comic-klu",
      iconBg: "bg-comic-klu text-white",
    },
    {
      label: "TOTAL SOAL KATA",
      value: stats?.totalWords || 0,
      icon: BookOpen,
      color: "bg-yellow-100 border-comic-yellow text-comic-ink",
      iconBg: "bg-comic-yellow text-comic-ink",
    },
    {
      label: "STORY CHAPTERS",
      value: stats?.totalChapters || 0,
      icon: Layers,
      color: "bg-pink-100 border-comic-bayangan text-comic-bayangan",
      iconBg: "bg-comic-bayangan text-white",
    },
    {
      label: "USULAN PENDING",
      value: stats?.pendingSuggestions || 0,
      icon: MessageSquarePlus,
      color: "bg-amber-100 border-amber-500 text-amber-800",
      iconBg: "bg-amber-500 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`comic-border p-4 rounded-xl comic-shadow flex items-center justify-between ${item.color}`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-sans font-bold text-gray-700 tracking-wide uppercase">
                {item.label}
              </span>
              <span className="font-bangers text-3xl sm:text-4xl text-comic-ink leading-none mt-1">
                {item.value}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-full comic-border flex items-center justify-center ${item.iconBg} comic-shadow-sm shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
