"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag, Plus, Check } from "lucide-react";

export default function AdminDashboardPage() {
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [clueHonest, setClueHonest] = useState("");
  const [clueMisleading, setClueMisleading] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Umum");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleQuickAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !clueHonest || !clueMisleading || !scheduledDate) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim().toUpperCase(),
          difficulty,
          clueHonest: clueHonest.trim(),
          clueMisleading: clueMisleading.trim(),
          scheduledDate,
          category: category.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menambah kata baru!");
        return;
      }

      setSuccessMsg(`🎉 Kata '${text.trim().toUpperCase()}' berhasil disimpan ke database!`);
      setText("");
      setClueHonest("");
      setClueMisleading("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">ADMIN DASHBOARD TEKAKOMIK</h1>
        <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1">
          Pintu masuk utama pengelola Tekakonik. Tambahkan soal tebakan secara cepat di bawah ini atau navigasi ke modul spesifik.
        </p>
      </div>

      {/* QUICK ADD WORD FORM */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow border-l-8 border-l-comic-klu">
        <h2 className="font-bangers text-2xl text-comic-ink mb-1 flex items-center gap-2">
          <Plus className="w-6 h-6 text-comic-klu" /> INPUT SOAL TEBAKAN HARIAN CEPAAT
        </h2>
        <p className="text-xs font-sans text-gray-600 mb-4">
          Tambahkan soal kata baru langsung dari dashboard utama tanpa harus berpindah halaman.
        </p>

        {errorMsg && <div className="bg-red-100 comic-border-sm p-2.5 rounded text-xs font-bold text-red-600 mb-3">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 comic-border-sm p-2.5 rounded text-xs font-bold text-emerald-700 mb-3">{successMsg}</div>}

        <form onSubmit={handleQuickAddWord} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">KATA (TEXT):</label>
            <input
              type="text"
              required
              placeholder="CONTOH: KOMIK"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-bangers text-lg uppercase text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">TANGGAL JADWAL (SCHEDULED DATE):</label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">TINGKAT KESULITAN:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            >
              <option value="EASY">EASY (MUDAH)</option>
              <option value="MEDIUM">MEDIUM (SEDANG)</option>
              <option value="HARD">HARD (SULIT)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">KATEGORI:</label>
            <input
              type="text"
              placeholder="Umum / Misteri / Profesi"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-bangers text-sm text-comic-klu">CLUE KAPTEN KLU (100% JUJUR):</label>
            <textarea
              rows={2}
              required
              placeholder="Buku bergambar yang menceritakan sebuah kisah..."
              value={clueHonest}
              onChange={(e) => setClueHonest(e.target.value)}
              className="bg-blue-50 comic-border p-2.5 rounded font-sans text-xs text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-bangers text-sm text-comic-bayangan">CLUE BAYANGAN (MENYESATKAN/LUCU):</label>
            <textarea
              rows={2}
              required
              placeholder="Koleksi gambar kue mangkok kesukaan superhero..."
              value={clueMisleading}
              onChange={(e) => setClueMisleading(e.target.value)}
              className="bg-pink-50 comic-border p-2.5 rounded font-sans text-xs text-comic-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn bg-comic-yellow hover:bg-yellow-400 text-comic-ink sm:col-span-2 py-3 mt-1"
          >
            {loading ? "Menyimpan..." : "SIMPAN SOAL HARIAN SEKARANG"}
          </button>
        </form>
      </div>

      {/* MODULE LINKS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboardadmin/words" className="comic-box p-4 flex flex-col gap-2 hover:bg-yellow-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">KELOLA KATA (SEMUA)</span>
            <BookOpen className="w-6 h-6 text-comic-klu" />
          </div>
          <p className="text-xs font-sans text-gray-600">Lihat semua daftar kata dari database & atur jadwal.</p>
        </Link>

        <Link href="/dashboardadmin/chapters" className="comic-box p-4 flex flex-col gap-2 hover:bg-pink-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">CHAPTER STORY</span>
            <Layers className="w-6 h-6 text-comic-bayangan" />
          </div>
          <p className="text-xs font-sans text-gray-600">Unggah komik unlock via Vercel Blob, atur minggu rilis.</p>
        </Link>

        <Link href="/dashboardadmin/analytics" className="comic-box p-4 flex flex-col gap-2 hover:bg-green-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">ANALITIK & RECHARTS</span>
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">DAU/WAU, tingkat kemenangan, auto-flag kata terlalu mudah/sulit.</p>
        </Link>

        <Link href="/dashboardadmin/suggestions" className="comic-box p-4 flex flex-col gap-2 hover:bg-amber-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">MODERASI USULAN</span>
            <MessageSquarePlus className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Setujui atau tolak usulan kata dari komunitas.</p>
        </Link>

        <Link href="/dashboardadmin/announcements" className="comic-box p-4 flex flex-col gap-2 hover:bg-purple-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">PENGUMUMAN</span>
            <Megaphone className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Atur banner berita/event aktif di bagian atas aplikasi.</p>
        </Link>

        <Link href="/dashboardadmin/flags" className="comic-box p-4 flex flex-col gap-2 hover:bg-red-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">FEATURE FLAGS</span>
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Toggle mode duel, hardcore voice, maintenance mode.</p>
        </Link>
      </div>
    </div>
  );
}
