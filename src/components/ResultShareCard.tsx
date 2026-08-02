"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Swords, RefreshCw, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { LetterState } from "./LetterBox";

interface ResultShareCardProps {
  won: boolean;
  wordId: string;
  targetWord?: string;
  guesses: string[];
  feedbacks: LetterState[][];
  attemptsUsed: number;
  tintaEarned: number;
  onPlayAgain?: () => void;
}

export function ResultShareCard({
  won,
  wordId,
  targetWord = "---",
  guesses,
  feedbacks,
  attemptsUsed,
  tintaEarned,
  onPlayAgain,
}: ResultShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [roomCodeCreated, setRoomCodeCreated] = useState<string | null>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `tekakomik-hasil-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh gambar hasil:", err);
    } finally {
      setDownloading(false);
    }
  };

  const createDuelChallenge = async () => {
    try {
      const res = await fetch("/api/duel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, creatorSessionId: `sess-${Date.now()}` }),
      });
      const data = await res.json();
      if (data.roomCode) {
        setRoomCodeCreated(data.roomCode);
      }
    } catch (e) {
      console.error("Gagal membuat duel:", e);
    }
  };

  const getEmojiGrid = () => {
    return feedbacks
      .map((row) =>
        row
          .map((f) => {
            if (f === "CORRECT") return "🟩";
            if (f === "PRESENT") return "🟨";
            return "⬛";
          })
          .join("")
      )
      .join("\n");
  };

  const shareToWhatsApp = () => {
    const text = `💥 TEKAKOMIK HARIAN 💥\n${
      won ? `Saya berhasil menebak kata dalam ${attemptsUsed}/6 percoban!` : `Saya hampir mengalahkan Bayangan!`
    }\n\n${getEmojiGrid()}\n\nMainkan tebak kata harian bergaya komik di Tekakonik!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 my-4">
      {/* Panel Komik Hasil (Captured by html-to-image) */}
      <div
        ref={cardRef}
        className={`w-full comic-box p-4 flex flex-col items-center gap-3 relative overflow-hidden bg-comic-paper ${
          won ? "border-comic-klu" : "border-comic-bayangan"
        }`}
      >
        {/* Halftone BG effect */}
        <div className="absolute inset-0 bg-halftone-dots opacity-20 pointer-events-none" />

        {/* Burst Header */}
        <div
          className={`px-4 py-1.5 rounded comic-border text-white font-bangers text-2xl sm:text-3xl rotate-[-2deg] comic-shadow ${
            won ? "bg-comic-correct" : "bg-comic-wrong"
          }`}
        >
          {won ? "✨ TEPAT HEBAT! ✨" : "💥 MELESET KALI INI! 💥"}
        </div>

        {/* Character Illustration / Burst Avatar */}
        <div className="flex items-center justify-center gap-3 my-1 z-10">
          <div
            className={`w-16 h-16 rounded-full comic-border flex items-center justify-center font-bangers text-2xl text-white comic-shadow ${
              won ? "bg-comic-klu" : "bg-comic-bayangan"
            }`}
          >
            {won ? "🦸‍♂️ KLU" : "🦹‍♀️ BAY"}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bangers text-lg text-comic-ink">
              KATA: <span className="text-comic-klu">{targetWord}</span>
            </span>
            <span className="text-xs font-sans text-gray-700">
              {won
                ? `Kapten Klu bangga! Berhasil dalam ${attemptsUsed} percobaan.`
                : "Bayangan tertawa puas! Coba lagi besok."}
            </span>
          </div>
        </div>

        {/* Emoji / Colored Feedback Grid Representation */}
        <div className="bg-white comic-border p-3 rounded-lg w-full flex flex-col items-center gap-1.5 z-10">
          <span className="text-xs font-bangers text-gray-500 tracking-wider">JEJAK TEBAKAN</span>
          {feedbacks.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`w-5 h-5 rounded border border-comic-ink ${
                    cell === "CORRECT"
                      ? "bg-comic-correct"
                      : cell === "PRESENT"
                      ? "bg-comic-present"
                      : "bg-comic-absent"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Rewards Summary */}
        {won && (
          <div className="flex items-center gap-4 bg-yellow-100 comic-border px-3 py-1.5 rounded-lg z-10">
            <div className="flex items-center gap-1 font-bangers text-base text-comic-ink">
              <Trophy className="w-4 h-4 text-comic-yellow fill-comic-yellow" /> +{tintaEarned} Tinta
            </div>
            <div className="flex items-center gap-1 font-bangers text-base text-comic-ink">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> Streak Bertambah!
            </div>
          </div>
        )}

        <div className="text-[10px] text-gray-400 font-sans mt-1">tekakomik.app — Game Tebak Kata Harian Komik</div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="comic-btn text-sm bg-white hover:bg-gray-100 text-comic-ink"
          >
            <Download className="w-4 h-4" /> {downloading ? "Menyiapkan..." : "Simpan Gambar"}
          </button>
          <button
            onClick={shareToWhatsApp}
            className="comic-btn text-sm bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Share2 className="w-4 h-4" /> Share WA
          </button>
        </div>

        {/* Duel Room Challenge Trigger */}
        {!roomCodeCreated ? (
          <button
            onClick={createDuelChallenge}
            className="comic-btn text-sm bg-comic-bayangan hover:bg-pink-600 text-white w-full"
          >
            <Swords className="w-4 h-4" /> Tantang Teman Duel!
          </button>
        ) : (
          <div className="bg-pink-100 comic-border p-2.5 rounded-lg text-center flex flex-col gap-1">
            <span className="text-xs font-sans text-comic-ink">Kode Room Duel:</span>
            <span className="font-bangers text-2xl text-comic-bayangan tracking-widest">{roomCodeCreated}</span>
            <Link
              href={`/duel/${roomCodeCreated}`}
              className="text-xs underline font-bold text-comic-bayangan hover:text-pink-700"
            >
              Buka Halaman Ruang Duel
            </Link>
          </div>
        )}

        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full mt-1"
          >
            <RefreshCw className="w-4 h-4" /> Main Kata Lainnya
          </button>
        )}
      </div>
    </div>
  );
}
