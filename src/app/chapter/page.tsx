"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, CheckCircle, Lock, Sparkles, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getLocalGameState } from "@/lib/storage";

interface WordItem {
  id: string;
  scheduledDate: string;
  difficulty: string;
  category: string;
}

interface ChapterItem {
  id: string;
  title: string;
  chapterNote: string;
  unlockComicImageUrl: string;
  totalWords: number;
  words: WordItem[];
}

export default function ChapterPage() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [completedWordIds, setCompletedWordIds] = useState<string[]>([]);
  const [selectedUnlockComic, setSelectedUnlockComic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadChapters = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/chapters");
      const data = await res.json();
      if (res.ok && data.chapters) {
        setChapters(data.chapters);
      } else {
        setErrorMsg(data.error || "Gagal memuat chapter cerita");
      }
    } catch (e) {
      console.error("Gagal memuat chapter:", e);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const state = getLocalGameState();
    if (state.completedWordIds) {
      setCompletedWordIds(state.completedWordIds);
    }
    loadChapters();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-6">
        {/* Title Header */}
        <div className="bg-comic-yellow comic-border p-4 rounded-xl comic-shadow rotate-[-1deg] mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-comic-ink" />
            <div>
              <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">CHAPTER STORY MINGGUAN</h1>
              <p className="text-xs sm:text-sm font-sans text-comic-ink">
                Selesaikan 5 kata dalam 1 Chapter untuk membuka Panel Komik Rahasia!
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white comic-border p-8 rounded-xl comic-shadow text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-comic-yellow comic-border flex items-center justify-center font-bangers text-xl text-comic-ink animate-spin">
              💥
            </div>
            <p className="font-bangers text-lg text-comic-ink">MEMUAT CHAPTER STORY...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-white comic-border p-6 rounded-xl comic-shadow text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="font-bangers text-xl text-comic-ink">GAGAL MEMUAT DATA</h3>
            <p className="text-xs font-sans text-gray-700">{errorMsg}</p>
            <button
              onClick={loadChapters}
              className="comic-btn text-xs bg-comic-yellow text-comic-ink flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> COBA LAGI
            </button>
          </div>
        ) : (
          /* Chapter List */
          <div className="flex flex-col gap-6">
            {chapters.map((chapter) => {
              const completedCount = chapter.words ? chapter.words.filter((w) => completedWordIds.includes(w.id)).length : 0;
              const totalWordsInChapter = chapter.words ? chapter.words.length : (chapter.totalWords || 5);
              const progressPercent = totalWordsInChapter > 0 ? Math.round((completedCount / totalWordsInChapter) * 100) : 0;
              const isAllCompleted = totalWordsInChapter > 0 && completedCount >= totalWordsInChapter;

              return (
                <div key={chapter.id} className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="bg-comic-klu text-white font-bangers text-sm px-2.5 py-0.5 rounded comic-border-sm">
                        CHAPTER SPESIAL
                      </span>
                      <h2 className="font-bangers text-2xl sm:text-3xl text-comic-ink mt-1">{chapter.title}</h2>
                      <p className="text-xs sm:text-sm text-gray-700 font-sans italic mt-0.5">
                        &ldquo;{chapter.chapterNote}&rdquo;
                      </p>
                    </div>

                    {isAllCompleted ? (
                      <button
                        onClick={() => setSelectedUnlockComic(chapter.unlockComicImageUrl)}
                        className="comic-btn text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                      >
                        <Sparkles className="w-4 h-4" /> Buka Komik
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-gray-100 comic-border-sm px-2.5 py-1 rounded text-xs font-bangers text-gray-600">
                        <Lock className="w-3.5 h-3.5" /> Terkunci
                      </div>
                    )}
                  </div>

                  {/* Progress Bar Bergaya Komik */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bangers text-comic-ink">
                      <span>PROGRESS PENCARIAN KATA</span>
                      <span>
                        {completedCount} / {totalWordsInChapter} KATA ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-200 comic-border-sm rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-comic-yellow comic-border-sm rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Words Grid inside Chapter */}
                  {chapter.words && chapter.words.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                      {chapter.words.map((word, idx) => {
                        const isSolved = completedWordIds.includes(word.id);

                        return (
                          <div
                            key={word.id}
                            className={`comic-border p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 ${
                              isSolved ? "bg-green-100" : "bg-gray-50"
                            }`}
                          >
                            <span className="font-bangers text-sm text-comic-ink">KATA #{idx + 1}</span>
                            <span className="text-[10px] text-gray-500 font-sans">{word.category}</span>
                            {isSolved ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Link
                                href={`/play?wordId=${word.id}`}
                                className="text-[10px] font-bangers text-comic-klu underline flex items-center gap-0.5"
                              >
                                Mainkan <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Coming Soon Card */}
            <div className="bg-gray-100 comic-border p-6 rounded-xl comic-shadow opacity-90 flex flex-col items-center text-center gap-3 border-dashed border-gray-400">
              <div className="bg-comic-bayangan text-white p-3 rounded-full comic-border-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="bg-pink-100 text-comic-bayangan font-bangers text-xs px-2.5 py-0.5 rounded comic-border-sm">
                  SEGERA HADIR
                </span>
                <h3 className="font-bangers text-2xl text-comic-ink mt-1">CHAPTER SELANJUTNYA DARI KAPTEN KLU</h3>
                <p className="text-xs sm:text-sm font-sans text-gray-600 max-w-md mt-1">
                  Kapten Klu dan Bayangan sedang mempersiapkan teka-teki misteri baru! Tambahan chapter baru dari admin akan langsung muncul di atas kartu ini.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Reveal Panel Komik Cerita Original */}
      {selectedUnlockComic && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-comic-paper comic-border p-5 rounded-xl comic-shadow-lg max-w-2xl w-full flex flex-col items-center gap-4 relative animate-in fade-in zoom-in">
            <div className="bg-comic-yellow comic-border px-4 py-1.5 rounded rotate-[-2deg]">
              <span className="font-bangers text-2xl sm:text-3xl text-comic-ink">
                🎉 PANEL KOMIK TERBUKA! 🎉
              </span>
            </div>

            <div className="w-full max-h-[60dvh] overflow-hidden comic-border rounded-xl relative aspect-video">
              <Image
                src={selectedUnlockComic}
                alt="Comic Story Panel"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 600px"
              />
            </div>

            <p className="text-xs sm:text-sm text-center font-sans text-gray-800 italic">
              Kapten Klu menemukan lokasi rahasia markas Bayangan! Cerita akan berlanjut di Chapter minggu depan.
            </p>

            <button
              onClick={() => setSelectedUnlockComic(null)}
              className="comic-btn bg-comic-klu text-white hover:bg-blue-600"
            >
              Tutup Komik
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
