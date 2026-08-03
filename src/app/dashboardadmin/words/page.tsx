"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface WordItem {
  id: string;
  text: string;
  difficulty: string;
  clueHonest: string;
  clueMisleading: string;
  scheduledDate: string;
  category: string;
  chapter?: { title: string };
}

export default function AdminWordsPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [clueHonest, setClueHonest] = useState("");
  const [clueMisleading, setClueMisleading] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Umum");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadWords = async () => {
    try {
      const res = await fetch("/api/admin/words");
      const data = await res.json();
      if (data.words) setWords(data.words);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleAddWord = async (e: React.FormEvent) => {
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
        setErrorMsg(data.error || "Gagal menambah kata");
        return;
      }

      setSuccessMsg("Kata berhasil disimpan!");
      setText("");
      setClueHonest("");
      setClueMisleading("");
      loadWords();
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">KELOLA KATA HARIAN (WORDS)</h1>
        <p className="text-xs font-sans text-gray-700">
          Tambah kata tebakan, jadwal tanggal tayang, clue Kapten Klu (jujur), dan clue Bayangan (menyesatkan).
        </p>
      </div>

      {/* Form Tambah Kata Baru */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3 flex items-center gap-1.5">
          <Plus className="w-5 h-5 text-comic-klu" /> TAMBAH KATA BARU
        </h2>

        {errorMsg && <div className="bg-red-100 comic-border-sm p-2 rounded text-xs font-bold text-red-600 mb-3">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 comic-border-sm p-2 rounded text-xs font-bold text-emerald-700 mb-3">{successMsg}</div>}

        <form onSubmit={handleAddWord} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">KATA (TEXT):</label>
            <input
              type="text"
              required
              placeholder="CONTOH: KOMIK"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-bangers text-lg uppercase"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">TANGGAL JADWAL (SCHEDULED DATE):</label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">TINGKAT KESULITAN:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
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
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
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
              className="bg-blue-50 comic-border p-2.5 rounded font-sans text-xs"
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
              className="bg-pink-50 comic-border p-2.5 rounded font-sans text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn bg-comic-yellow text-comic-ink sm:col-span-2 py-2.5 mt-1"
          >
            {loading ? "Menyimpan..." : "SIMPAN KATA HARIAN"}
          </button>
        </form>
      </div>

      {/* List Kata Yang Sudah Ada */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3">DAFTAR KATA DARI DATABASE ({words.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse comic-border-sm text-xs font-sans">
            <thead>
              <tr className="bg-comic-yellow comic-border-sm font-bangers text-sm">
                <th className="p-2 border border-comic-ink">KATA</th>
                <th className="p-2 border border-comic-ink">TANGGAL</th>
                <th className="p-2 border border-comic-ink">KESULITAN</th>
                <th className="p-2 border border-comic-ink">CLUE JUJUR</th>
                <th className="p-2 border border-comic-ink">CLUE BAYANGAN</th>
              </tr>
            </thead>
            <tbody>
              {words.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="p-2 font-bangers text-sm text-comic-klu">{w.text}</td>
                  <td className="p-2">{w.scheduledDate.split("T")[0]}</td>
                  <td className="p-2 font-bold">{w.difficulty}</td>
                  <td className="p-2 text-gray-700 max-w-xs truncate">{w.clueHonest}</td>
                  <td className="p-2 text-gray-700 max-w-xs truncate">{w.clueMisleading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
