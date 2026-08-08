"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, BookOpen, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { INITIAL_OFFLINE_CHAPTERS, OfflineChapter } from "@/lib/offline-data";

export default function AdminOfflinePackPage() {
  const [offlineChapters, setOfflineChapters] = useState<OfflineChapter[]>(INITIAL_OFFLINE_CHAPTERS);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const syncPackFromDb = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/offline-pack");
      const data = await res.json();
      if (res.ok && data.offlineChapters) {
        setOfflineChapters(data.offlineChapters);
        if (typeof window !== "undefined") {
          localStorage.setItem("tekakomik_offline_custom_pack", JSON.stringify(data.offlineChapters));
        }
        setSuccessMsg(`🎉 Berhasil menyinkronkan ${data.offlineChapters.length} Chapter Offline terbaru dari Database!`);
      } else {
        setErrorMsg("Gagal memuat paket offline dari database.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localPack = localStorage.getItem("tekakomik_offline_custom_pack");
      if (localPack) {
        try {
          const parsed = JSON.parse(localPack);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOfflineChapters(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow border-l-8 border-l-comic-bayangan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <WifiOff className="w-7 h-7 text-comic-bayangan" />
            <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">MANAJEMEN PAKET MODE OFFLINE</h1>
          </div>
          <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1 max-w-2xl">
            Modul pengelola paket offline (PWA Offline Pack). Pastikan 21 Chapter Story Pengetahuan Umum tersinkronisasi untuk pemain yang mengunduh dari Google Play Store.
          </p>
        </div>

        <button
          onClick={syncPackFromDb}
          disabled={loading}
          className="comic-btn text-sm bg-comic-yellow text-comic-ink hover:bg-yellow-400 shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> SYNC DARI DB
        </button>
      </div>

      {successMsg && <div className="bg-green-100 comic-border-sm p-3 rounded-lg text-sm font-bold text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> {successMsg}</div>}
      {errorMsg && <div className="bg-red-100 comic-border-sm p-3 rounded-lg text-sm font-bold text-red-600">{errorMsg}</div>}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-sans text-gray-600 font-bold uppercase">TOTAL CHAPTER OFFLINE</span>
            <h3 className="font-bangers text-3xl text-comic-ink mt-0.5">{offlineChapters.length} Chapters</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 comic-border flex items-center justify-center text-comic-bayangan">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-sans text-gray-600 font-bold uppercase">TOTAL SOAL OFFLINE</span>
            <h3 className="font-bangers text-3xl text-comic-ink mt-0.5">
              {offlineChapters.reduce((acc, ch) => acc + (ch.words ? ch.words.length : 0), 0)} Soal
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 comic-border flex items-center justify-center text-comic-klu">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-sans text-gray-600 font-bold uppercase">UJI MODE OFFLINE</span>
            <Link href="/play-offline" className="font-bangers text-sm text-comic-klu underline flex items-center gap-1 mt-1">
              Buka Play Offline <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 comic-border flex items-center justify-center text-amber-700">
            <WifiOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-4">
        <h2 className="font-bangers text-2xl text-comic-ink border-b-2 border-comic-ink pb-2">
          DAFTAR 21 CHAPTER STORY OFFLINE PENGETAHUAN UMUM
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineChapters.map((ch) => (
            <div key={ch.id} className="bg-gray-50 comic-border-sm p-4 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="bg-comic-klu text-white font-bangers text-xs px-2.5 py-0.5 rounded comic-border-sm">
                  CHAPTER #{ch.chapterNumber}
                </span>
                <span className="text-xs font-bangers text-comic-bayangan bg-pink-50 px-2 py-0.5 rounded border border-comic-bayangan">
                  {ch.words?.length || 5} KATA
                </span>
              </div>
              <h3 className="font-bangers text-xl text-comic-ink leading-tight">{ch.title}</h3>
              <p className="text-xs font-sans text-gray-600 italic line-clamp-2">&ldquo;{ch.narrative}&rdquo;</p>
              
              <div className="flex flex-wrap gap-1.5 mt-1">
                {ch.words?.map((w, idx) => (
                  <span key={w.id || idx} className="bg-white comic-border-sm px-2 py-0.5 rounded text-[10px] font-bangers text-comic-ink">
                    #{idx + 1} {w.text || w.normalizedText} ({w.category})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
