"use client";

import { useState, useEffect } from "react";
import { Flag, ToggleLeft, ToggleRight } from "lucide-react";

interface FlagItem {
  id: string;
  key: string;
  isEnabled: boolean;
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/flags");
      const data = await res.json();
      if (data.flags) setFlags(data.flags);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleToggle = async (key: string, current: boolean) => {
    const nextState = !current;
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, isEnabled: nextState } : f)));

    try {
      await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, isEnabled: nextState }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">FEATURE FLAGS & MAINTENANCE TOGGLES</h1>
        <p className="text-xs font-sans text-gray-700">
          Aktifkan atau nonaktifkan fitur seperti Mode Duel, Hardcore Voice Mode, dan Mode Pemeliharaan.
        </p>
      </div>

      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        {loading ? (
          <div className="p-8 text-center font-bangers text-2xl text-comic-ink">MEMUAT FEATURE FLAGS...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {flags.map((flag) => (
              <div key={flag.key} className="comic-border p-4 rounded-lg flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <Flag className={`w-5 h-5 ${flag.isEnabled ? "text-emerald-600" : "text-gray-400"}`} />
                  <div>
                    <span className="font-bangers text-xl text-comic-ink uppercase">{flag.key.replace(/_/g, " ")}</span>
                    <p className="text-xs font-sans text-gray-500">Key: {flag.key}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(flag.key, flag.isEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded comic-border-sm font-bangers text-sm text-white transition-colors ${
                    flag.isEnabled ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  {flag.isEnabled ? (
                    <>
                      <ToggleRight className="w-5 h-5" /> AKTIF
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5" /> NONAKTIF
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
