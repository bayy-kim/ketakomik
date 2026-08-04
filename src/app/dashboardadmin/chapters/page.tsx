"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Edit2, Trash2, X } from "lucide-react";

interface ChapterItem {
  id: string;
  title: string;
  chapterNote: string;
  unlockComicImageUrl: string;
  weekStartDate: string;
  isPublished: boolean;
}

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [title, setTitle] = useState("");
  const [chapterNote, setChapterNote] = useState("");
  const [unlockComicImageUrl, setUnlockComicImageUrl] = useState("");
  const [weekStartDate, setWeekStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPublished, setIsPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadChapters = async () => {
    try {
      const res = await fetch("/api/admin/chapters");
      const data = await res.json();
      if (data.chapters) setChapters(data.chapters);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const res = await fetch(`/api/admin/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const blob = await res.json();
      if (blob.url) {
        setUnlockComicImageUrl(blob.url);
      }
    } catch (err) {
      console.error("Gagal unggah file:", err);
      alert("Gagal mengunggah gambar komik!");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !weekStartDate) {
      setErrorMsg("Judul dan tanggal rilis wajib diisi!");
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
            title: title.trim(),
            chapterNote: chapterNote.trim(),
            unlockComicImageUrl: unlockComicImageUrl.trim(),
            weekStartDate,
            isPublished,
          }
        : {
            title: title.trim(),
            chapterNote: chapterNote.trim(),
            unlockComicImageUrl: unlockComicImageUrl.trim(),
            weekStartDate,
            isPublished,
          };

      const res = await fetch("/api/admin/chapters", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menyimpan chapter");
        return;
      }

      setSuccessMsg(editingId ? "Chapter berhasil diperbarui!" : "Chapter berhasil dibuat!");
      handleCancelEdit();
      loadChapters();
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ch: ChapterItem) => {
    setEditingId(ch.id);
    setTitle(ch.title);
    setChapterNote(ch.chapterNote || "");
    setUnlockComicImageUrl(ch.unlockComicImageUrl || "");
    setWeekStartDate(ch.weekStartDate.split("T")[0]);
    setIsPublished(ch.isPublished);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setChapterNote("");
    setUnlockComicImageUrl("");
    setWeekStartDate(new Date().toISOString().split("T")[0]);
    setIsPublished(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus chapter ini? Hubungan dengan kata (Word) akan diatur menjadi NULL.")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/chapters?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menghapus chapter");
        return;
      }

      setSuccessMsg("Chapter berhasil dihapus!");
      if (editingId === id) {
        handleCancelEdit();
      }
      loadChapters();
    } catch (e) {
      console.error(e);
      setErrorMsg("Gagal menghapus chapter");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">KELOLA CHAPTER STORY & UNLOCK COMIC</h1>
        <p className="text-xs font-sans text-gray-700">
          Buat chapter cerita mingguan dan unggah gambar komik pembuka yang bisa di-unlock pemain.
        </p>
      </div>

      {/* Form Buat Chapter Baru */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-comic-bayangan" /> {editingId ? "EDIT CHAPTER" : "BUAT CHAPTER BARU"}
          </span>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 text-xs font-sans text-red-500 hover:underline"
            >
              <X className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </h2>

        {errorMsg && <div className="bg-red-100 comic-border-sm p-2 rounded text-xs font-bold text-red-600 mb-3">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 comic-border-sm p-2 rounded text-xs font-bold text-emerald-700 mb-3">{successMsg}</div>}

        <form onSubmit={handleSaveChapter} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-bangers text-sm text-comic-ink">JUDUL CHAPTER STORY:</label>
            <input
              type="text"
              required
              placeholder="Chapter 1: Jejak Pertama Bayangan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-bangers text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">TANGGAL MULAI MINGGU:</label>
            <input
              type="date"
              required
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">STATUS PUBLISH:</label>
            <select
              value={isPublished ? "true" : "false"}
              onChange={(e) => setIsPublished(e.target.value === "true")}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
            >
              <option value="true">PUBLISHED (TAMPIL DI GAME)</option>
              <option value="false">DRAFT (SEMBUNYI)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-bangers text-sm text-comic-ink">CATATAN CERITA (CHAPTER NOTE):</label>
            <textarea
              rows={2}
              placeholder="Catatan narasi singkat cerita misteri Kapten Klu mengejar Bayangan..."
              value={chapterNote}
              onChange={(e) => setChapterNote(e.target.value)}
              className="bg-gray-50 comic-border p-2.5 rounded font-sans text-xs"
            />
          </div>

          {/* Vercel Blob Image Upload */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-bangers text-sm text-comic-ink">UNGGAH GAMBAR KOMIK UNLOCK (VERCEL BLOB):</label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="bg-gray-50 comic-border p-2 rounded text-xs w-full sm:w-auto"
              />
              {uploading && <span className="font-bangers text-sm text-comic-klu">Mengunggah ke Vercel Blob...</span>}
            </div>
            {unlockComicImageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] text-gray-600 truncate max-w-md">{unlockComicImageUrl}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn bg-comic-yellow text-comic-ink sm:col-span-2 py-2.5 mt-1"
          >
            {loading ? "Menyimpan..." : editingId ? "PERBARUI CHAPTER" : "SIMPAN CHAPTER"}
          </button>
        </form>
      </div>

      {/* Chapter List */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3">DAFTAR CHAPTER ({chapters.length})</h2>
        <div className="flex flex-col gap-3">
          {chapters.length === 0 ? (
            <p className="text-sm text-gray-500 font-sans italic">Belum ada chapter.</p>
          ) : (
            chapters.map((ch) => (
              <div key={ch.id} className="comic-border p-3.5 rounded-lg flex items-center justify-between bg-gray-50">
                <div>
                  <span className="font-bangers text-lg text-comic-ink">{ch.title}</span>
                  <p className="text-xs font-sans text-gray-600 italic">&ldquo;{ch.chapterNote}&rdquo;</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-sans">Mulai: {ch.weekStartDate.split("T")[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bangers text-sm px-2 py-0.5 rounded comic-border-sm ${ch.isPublished ? "bg-emerald-500 text-white" : "bg-gray-400"}`}>
                    {ch.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEditClick(ch)}
                      className="p-1 hover:bg-gray-200 rounded comic-border-sm"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(ch.id)}
                      className="p-1 hover:bg-gray-200 rounded comic-border-sm"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
