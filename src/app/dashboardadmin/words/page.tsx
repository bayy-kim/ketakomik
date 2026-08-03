"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface ChapterOption {
  id: string;
  title: string;
}

interface WordItem {
  id: string;
  text: string;
  difficulty: string;
  clueHonest: string;
  clueMisleading: string;
  scheduledDate: string;
  category: string;
  chapterId?: string | null;
  chapter?: { title: string };
}

export default function AdminWordsPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [clueHonest, setClueHonest] = useState("");
  const [clueMisleading, setClueMisleading] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Umum");
  const [chapterId, setChapterId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      const [resWords, resChapters] = await Promise.all([
        fetch("/api/admin/words"),
        fetch("/api/admin/chapters"),
      ]);
      const dataWords = await resWords.json();
      const dataChapters = await resChapters.json();

      if (dataWords.words) setWords(dataWords.words);
      if (dataChapters.chapters) setChapters(dataChapters.chapters);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !clueHonest || !clueMisleading || !scheduledDate) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const method = editingId ? "PUT" : "POST";
      const bodyData = editingId
        ? {
            id: editingId,
            text: text.trim().toUpperCase(),
            difficulty,
            clueHonest: clueHonest.trim(),
            clueMisleading: clueMisleading.trim(),
            scheduledDate,
            category: category.trim(),
            chapterId: chapterId || null,
          }
        : {
            text: text.trim().toUpperCase(),
            difficulty,
            clueHonest: clueHonest.trim(),
            clueMisleading: clueMisleading.trim(),
            scheduledDate,
            category: category.trim(),
            chapterId: chapterId || null,
          };

      const res = await fetch("/api/admin/words", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menyimpan kata");
        return;
      }

      setSuccessMsg(editingId ? "Kata berhasil diperbarui!" : "Kata berhasil disimpan!");
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setText("");
    setDifficulty("MEDIUM");
    setClueHonest("");
    setClueMisleading("");
    setScheduledDate(new Date().toISOString().split("T")[0]);
    setCategory("Umum");
    setChapterId("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleEditClick = (w: WordItem) => {
    setEditingId(w.id);
    setText(w.text);
    setDifficulty(w.difficulty);
    setClueHonest(w.clueHonest);
    setClueMisleading(w.clueMisleading);
    setScheduledDate(w.scheduledDate.split("T")[0]);
    setCategory(w.category || "Umum");
    setChapterId(w.chapterId || "");
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kata ini? Ini juga akan menghapus sesi permainan terkait.")) return;

    try {
      const res = await fetch(`/api/admin/words?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) {
          resetForm();
        }
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">KELOLA KATA HARIAN (WORDS / SOAL)</h1>
        <p className="text-xs font-sans text-gray-700">
          Tambah & edit kata tebakan, jadwal tanggal tayang, clue Kapten Klu (jujur), clue Bayangan (menyesatkan), dan chapter terkait.
        </p>
      </div>

      {/* Form Tambah/Edit Kata */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-comic-klu" /> {editingId ? "EDIT KATA / SOAL" : "TAMBAH KATA BARU"}
          </span>
          {editingId && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1 text-xs font-sans text-red-500 hover:underline"
            >
              <X className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </h2>

        {errorMsg && <div className="bg-red-100 comic-border-sm p-2 rounded text-xs font-bold text-red-600 mb-3">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 comic-border-sm p-2 rounded text-xs font-bold text-emerald-700 mb-3">{successMsg}</div>}

        <form onSubmit={handleSaveWord} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
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
            <label className="font-bangers text-sm text-comic-ink">CHAPTER STORY (OPSIONAL):</label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
            >
              <option value="">-- Tanpa Chapter (Soal Bebas/Harian) --</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
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
            {loading ? "Menyimpan..." : editingId ? "PERBARUI KATA HARIAN" : "SIMPAN KATA HARIAN"}
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
                <th className="p-2 border border-comic-ink">CHAPTER</th>
                <th className="p-2 border border-comic-ink">KESULITAN</th>
                <th className="p-2 border border-comic-ink">CLUE JUJUR</th>
                <th className="p-2 border border-comic-ink">CLUE BAYANGAN</th>
                <th className="p-2 border border-comic-ink text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {words.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                    Belum ada kata dalam database.
                  </td>
                </tr>
              ) : (
                words.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="p-2 font-bangers text-sm text-comic-klu">{w.text}</td>
                    <td className="p-2">{w.scheduledDate.split("T")[0]}</td>
                    <td className="p-2 italic text-gray-600">{w.chapter?.title || "-"}</td>
                    <td className="p-2 font-bold">{w.difficulty}</td>
                    <td className="p-2 text-gray-700 max-w-xs truncate">{w.clueHonest}</td>
                    <td className="p-2 text-gray-700 max-w-xs truncate">{w.clueMisleading}</td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(w)}
                          className="p-1 hover:bg-gray-200 rounded comic-border-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(w.id)}
                          className="p-1 hover:bg-gray-200 rounded comic-border-sm"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
