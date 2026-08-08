"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, BookOpen, Layers, CheckCircle2, ArrowRight, Plus, Edit, Trash2, X, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { INITIAL_OFFLINE_CHAPTERS, OfflineChapter, OfflineWord } from "@/lib/offline-data";

export default function AdminOfflinePackPage() {
  const [offlineChapters, setOfflineChapters] = useState<OfflineChapter[]>(INITIAL_OFFLINE_CHAPTERS);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Chapter Modal state (Add / Edit)
  const [editingChapter, setEditingChapter] = useState<OfflineChapter | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chTitle, setChTitle] = useState("");
  const [chNarrative, setChNarrative] = useState("");
  const [chCategory, setChCategory] = useState("Pengetahuan Umum");
  const [chComicUrl, setChComicUrl] = useState("https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80");

  // Word Modal state (Add / Edit word inside chapter)
  const [activeChapterForWord, setActiveChapterForWord] = useState<OfflineChapter | null>(null);
  const [editingWord, setEditingWord] = useState<OfflineWord | null>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [wordText, setWordText] = useState("");
  const [wordCategory, setWordCategory] = useState("Umum");
  const [wordDifficulty, setWordDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");

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

  const saveToLocalAndNotify = (updated: OfflineChapter[], msg: string) => {
    setOfflineChapters(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("tekakomik_offline_custom_pack", JSON.stringify(updated));
    }
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const syncPackFromDb = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/offline-pack");
      const data = await res.json();
      if (res.ok && data.offlineChapters) {
        saveToLocalAndNotify(data.offlineChapters, `🎉 Berhasil menyinkronkan ${data.offlineChapters.length} Chapter Offline terbaru dari Database!`);
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

  // ----- CHAPTER HANDLERS -----
  const openNewChapterModal = () => {
    setEditingChapter(null);
    setChTitle("");
    setChNarrative("");
    setChCategory("Pengetahuan Umum");
    setChComicUrl("https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80");
    setIsChapterModalOpen(true);
  };

  const openEditChapterModal = (ch: OfflineChapter) => {
    setEditingChapter(ch);
    setChTitle(ch.title);
    setChNarrative(ch.narrative);
    setChCategory(ch.category || "Pengetahuan Umum");
    setChComicUrl(ch.unlockComicImageUrl || "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80");
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle || !chNarrative) {
      setErrorMsg("Judul dan Narasi cerita wajib diisi!");
      return;
    }

    if (editingChapter) {
      // Edit existing chapter
      const updated = offlineChapters.map((ch) =>
        ch.id === editingChapter.id
          ? {
              ...ch,
              title: chTitle.trim(),
              narrative: chNarrative.trim(),
              category: chCategory.trim(),
              unlockComicImageUrl: chComicUrl.trim(),
            }
          : ch
      );
      saveToLocalAndNotify(updated, `✅ Chapter #${editingChapter.chapterNumber} berhasil diperbarui!`);
    } else {
      // Create new chapter
      const newNum = offlineChapters.length + 1;
      const newCh: OfflineChapter = {
        id: `off_ch_${Date.now()}`,
        chapterNumber: newNum,
        title: chTitle.trim().startsWith("Chapter") ? chTitle.trim() : `Chapter ${newNum}: ${chTitle.trim()}`,
        narrative: chNarrative.trim(),
        category: chCategory.trim(),
        unlockComicImageUrl: chComicUrl.trim(),
        words: [],
      };
      const updated = [...offlineChapters, newCh];
      saveToLocalAndNotify(updated, `🎉 Chapter #${newNum} baru berhasil ditambahkan ke Paket Offline!`);
    }

    setIsChapterModalOpen(false);
  };

  const handleDeleteChapter = (chId: string, chNum: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus Chapter #${chNum} beserta seluruh kata di dalamnya?`)) return;
    const updated = offlineChapters
      .filter((ch) => ch.id !== chId)
      .map((ch, idx) => ({ ...ch, chapterNumber: idx + 1 }));
    saveToLocalAndNotify(updated, `🗑️ Chapter #${chNum} berhasil dihapus.`);
  };

  // ----- WORD HANDLERS -----
  const openNewWordModal = (ch: OfflineChapter) => {
    setActiveChapterForWord(ch);
    setEditingWord(null);
    setWordText("");
    setWordCategory("Umum");
    setWordDifficulty("EASY");
    setIsWordModalOpen(true);
  };

  const openEditWordModal = (ch: OfflineChapter, w: OfflineWord) => {
    setActiveChapterForWord(ch);
    setEditingWord(w);
    setWordText(w.text || w.normalizedText);
    setWordCategory(w.category || "Umum");
    setWordDifficulty(w.difficulty || "EASY");
    setIsWordModalOpen(true);
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChapterForWord || !wordText) {
      setErrorMsg("Teks kata wajib diisi!");
      return;
    }

    const cleanText = wordText.trim().toUpperCase();

    const updated = offlineChapters.map((ch) => {
      if (ch.id !== activeChapterForWord.id) return ch;

      let newWords = [...ch.words];
      if (editingWord) {
        // Edit word
        newWords = newWords.map((w) =>
          w.id === editingWord.id
            ? {
                ...w,
                text: cleanText,
                normalizedText: cleanText,
                length: cleanText.length,
                category: wordCategory.trim(),
                difficulty: wordDifficulty,
              }
            : w
        );
      } else {
        // Add new word
        const newWordObj: OfflineWord = {
          id: `off_w_${Date.now()}`,
          text: cleanText,
          normalizedText: cleanText,
          length: cleanText.length,
          category: wordCategory.trim(),
          difficulty: wordDifficulty,
        };
        newWords.push(newWordObj);
      }

      return { ...ch, words: newWords };
    });

    saveToLocalAndNotify(
      updated,
      editingWord
        ? `✅ Kata '${cleanText}' di Chapter #${activeChapterForWord.chapterNumber} berhasil diperbarui!`
        : `🎉 Kata '${cleanText}' berhasil ditambahkan ke Chapter #${activeChapterForWord.chapterNumber}!`
    );

    setIsWordModalOpen(false);
  };

  const handleDeleteWord = (chId: string, wordId: string, wordText: string) => {
    if (!confirm(`Hapus kata '${wordText}' dari chapter ini?`)) return;
    const updated = offlineChapters.map((ch) => {
      if (ch.id !== chId) return ch;
      return { ...ch, words: ch.words.filter((w) => w.id !== wordId) };
    });
    saveToLocalAndNotify(updated, `🗑️ Kata '${wordText}' berhasil dihapus.`);
  };

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
            Modul pengelola paket offline (PWA Offline Pack). Anda dapat menambah, mengedit, dan menghapus Chapter & Soal Kata Offline secara fleksibel.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openNewChapterModal}
            className="comic-btn text-sm bg-comic-yellow text-comic-ink hover:bg-yellow-400 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> TAMBAH CHAPTER
          </button>
          <button
            onClick={syncPackFromDb}
            disabled={loading}
            className="comic-btn text-sm bg-white text-comic-ink hover:bg-gray-100 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> SYNC DB
          </button>
        </div>
      </div>

      {successMsg && <div className="bg-green-100 comic-border-sm p-3 rounded-lg text-sm font-bold text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> {successMsg}</div>}
      {errorMsg && <div className="bg-red-100 comic-border-sm p-3 rounded-lg text-sm font-bold text-red-600 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> {errorMsg}</div>}

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

      {/* CHAPTER MODAL FORM (Create / Edit) */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white comic-border p-5 rounded-xl comic-shadow-lg max-w-lg w-full flex flex-col gap-4 relative">
            <button
              onClick={() => setIsChapterModalOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 comic-border-sm text-comic-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-bangers text-2xl text-comic-ink border-b-2 border-comic-ink pb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-comic-bayangan" />
              {editingChapter ? `EDIT CHAPTER #${editingChapter.chapterNumber}` : "TAMBAH CHAPTER OFFLINE BARU"}
            </h2>

            <form onSubmit={handleSaveChapter} className="flex flex-col gap-3.5 text-xs font-sans">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">JUDUL CHAPTER:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Chapter 22: Misi Rahasia Nusantara"
                  value={chTitle}
                  onChange={(e) => setChTitle(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">KATEGORI:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengetahuan Umum"
                  value={chCategory}
                  onChange={(e) => setChCategory(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">NARASI CERITA (STORY NARRATIVE):</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan cerita panjang menarik seputar latar belakang chapter ini..."
                  value={chNarrative}
                  onChange={(e) => setChNarrative(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">URL GAMBAR KOMIK PEMBUKA:</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={chComicUrl}
                  onChange={(e) => setChComicUrl(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-xs text-comic-ink"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="comic-btn text-xs bg-gray-100 hover:bg-gray-200 text-comic-ink px-4 py-2"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink px-5 py-2 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> SIMPAN CHAPTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WORD MODAL FORM (Create / Edit Word) */}
      {isWordModalOpen && activeChapterForWord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white comic-border p-5 rounded-xl comic-shadow-lg max-w-md w-full flex flex-col gap-4 relative">
            <button
              onClick={() => setIsWordModalOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 comic-border-sm text-comic-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-bangers text-2xl text-comic-ink border-b-2 border-comic-ink pb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-comic-klu" />
              {editingWord
                ? `EDIT KATA (${activeChapterForWord.title})`
                : `TAMBAH KATA BARU (${activeChapterForWord.title})`}
            </h2>

            <form onSubmit={handleSaveWord} className="flex flex-col gap-3.5 text-xs font-sans">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">KATA (TEXT):</label>
                <input
                  type="text"
                  required
                  placeholder="CONTOH: KOMIK"
                  value={wordText}
                  onChange={(e) => setWordText(e.target.value.toUpperCase())}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-bangers text-lg uppercase text-comic-ink tracking-wider"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">KATEGORI:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sejarah, Geografi, Sains"
                  value={wordCategory}
                  onChange={(e) => setWordCategory(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">TINGKAT KESULITAN:</label>
                <select
                  value={wordDifficulty}
                  onChange={(e) => setWordDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                >
                  <option value="EASY">EASY (Mudah)</option>
                  <option value="MEDIUM">MEDIUM (Sedang)</option>
                  <option value="HARD">HARD (Sangat Sulit)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsWordModalOpen(false)}
                  className="comic-btn text-xs bg-gray-100 hover:bg-gray-200 text-comic-ink px-4 py-2"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink px-5 py-2 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> SIMPAN KATA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapters & Words Interactive List */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-comic-ink pb-2">
          <h2 className="font-bangers text-2xl text-comic-ink">
            DAFTAR CHAPTER STORY & KATA OFFLINE
          </h2>
          <button
            onClick={openNewChapterModal}
            className="comic-btn text-xs bg-comic-yellow text-comic-ink hover:bg-yellow-400 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> BAHAS CHAPTER BARU
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {offlineChapters.map((ch) => (
            <div key={ch.id} className="bg-gray-50 comic-border-sm p-4 rounded-lg flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-comic-klu text-white font-bangers text-xs px-2.5 py-0.5 rounded comic-border-sm">
                    CHAPTER #{ch.chapterNumber}
                  </span>
                  <h3 className="font-bangers text-xl text-comic-ink leading-tight">{ch.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditChapterModal(ch)}
                    className="comic-btn text-[10px] bg-blue-100 hover:bg-blue-200 text-comic-klu px-2.5 py-1 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Edit Chapter
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(ch.id, ch.chapterNumber)}
                    className="comic-btn text-[10px] bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                  <button
                    onClick={() => openNewWordModal(ch)}
                    className="comic-btn text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Kata
                  </button>
                </div>
              </div>

              <p className="text-xs font-sans text-gray-700 italic leading-relaxed">&ldquo;{ch.narrative}&rdquo;</p>
              
              {/* Words Grid */}
              <div className="flex flex-wrap gap-2 mt-1">
                {ch.words && ch.words.length > 0 ? (
                  ch.words.map((w, idx) => (
                    <div
                      key={w.id || idx}
                      className="bg-white comic-border-sm px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bangers text-comic-ink shadow-sm"
                    >
                      <span>#{idx + 1} {w.text || w.normalizedText} ({w.length}H)</span>
                      <span className="text-[9px] font-sans text-gray-500 font-bold bg-gray-100 px-1.5 rounded">{w.category}</span>
                      
                      <div className="flex items-center gap-1 ml-1 border-l border-gray-200 pl-1">
                        <button
                          onClick={() => openEditWordModal(ch, w)}
                          className="text-comic-klu hover:text-blue-800 p-0.5"
                          title="Edit kata ini"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteWord(ch.id, w.id, w.text || w.normalizedText)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Hapus kata ini"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs font-sans text-gray-500 italic">Belum ada kata di chapter ini. Klik tombol &apos;Tambah Kata&apos; untuk menambahkan.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
