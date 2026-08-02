"use client";

import { use, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Swords, Trophy, Clock, Share2, Play } from "lucide-react";
import Link from "next/link";

interface DuelData {
  roomCode: string;
  wordId: string;
  wordLength: number;
  category: string;
  difficulty: string;
  creatorSession?: {
    attemptsUsed: number;
    durationSeconds: number;
    won: boolean;
    guesses: string[];
  };
  opponentSession?: {
    attemptsUsed: number;
    durationSeconds: number;
    won: boolean;
    guesses: string[];
  };
  status: string;
}

export default function DuelRoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(params);
  const [duel, setDuel] = useState<DuelData | null>(null);

  useEffect(() => {
    async function loadDuelRoom() {
      try {
        const res = await fetch(`/api/duel/${roomCode}`);
        const data = await res.json();
        setDuel(data);
      } catch (e) {
        console.error("Gagal memuat room duel:", e);
      }
    }
    loadDuelRoom();
  }, [roomCode]);

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link Duel berhasil disalin ke clipboard!");
  };

  if (!duel) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
        <Header />
        <main className="flex-1 flex items-center justify-center font-bangers text-2xl">
          MEMUAT ARENA DUEL KOMIK...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-6 flex flex-col gap-6">
        {/* Banner Arena Duel */}
        <div className="bg-comic-bayangan comic-border p-4 rounded-xl comic-shadow text-white flex items-center justify-between rotate-[-1deg]">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-white" />
            <div>
              <span className="font-bangers text-xs bg-white text-comic-bayangan px-2 py-0.5 rounded comic-border-sm">
                ROOM: {duel.roomCode}
              </span>
              <h1 className="font-bangers text-3xl sm:text-4xl">ARENA PERTANDINGAN KOMIK</h1>
            </div>
          </div>

          <button onClick={copyShareLink} className="comic-btn text-xs bg-white text-comic-ink hover:bg-gray-100">
            <Share2 className="w-4 h-4" /> Salin Link
          </button>
        </div>

        {/* 2-PANEL COMIC SIDE-BY-SIDE COMPARISON (Visual 2 Panel Bersebelahan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel Pembuat Duel (Kiri - Kapten Klu Style) */}
          <div className="bg-white comic-border p-5 rounded-2xl comic-shadow-klu flex flex-col items-center gap-3 relative">
            <div className="bg-comic-klu text-white comic-border px-3 py-1 rounded font-bangers text-lg rotate-[-2deg]">
              PANEL 1: PEMBUAT TANTANGAN
            </div>

            <div className="w-14 h-14 rounded-full bg-comic-klu comic-border flex items-center justify-center text-white font-bangers text-xl comic-shadow">
              KLU
            </div>

            <h3 className="font-bangers text-2xl text-comic-ink">AGENT_KLU</h3>

            {duel.creatorSession ? (
              <div className="w-full bg-blue-50 comic-border p-3 rounded-lg flex flex-col gap-2 text-sm font-sans">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-bold">
                    <Trophy className="w-4 h-4 text-amber-500" /> Hasil:
                  </span>
                  <span className={`font-bangers text-lg ${duel.creatorSession.won ? "text-emerald-600" : "text-red-600"}`}>
                    {duel.creatorSession.won ? "MENANG" : "GAGAL"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">Percobaan:</span>
                  <span className="font-bangers text-base">{duel.creatorSession.attemptsUsed} / 6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu:
                  </span>
                  <span className="font-bangers text-base">{duel.creatorSession.durationSeconds} Detik</span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 font-sans text-xs">Belum menyelesaikan permainan.</div>
            )}
          </div>

          {/* Panel Lawan Duel (Kanan - Bayangan Style) */}
          <div className="bg-white comic-border p-5 rounded-2xl comic-shadow-bayangan flex flex-col items-center gap-3 relative">
            <div className="bg-comic-bayangan text-white comic-border px-3 py-1 rounded font-bangers text-lg rotate-[2deg]">
              PANEL 2: LAWAN (KAMU)
            </div>

            <div className="w-14 h-14 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white font-bangers text-xl comic-shadow">
              BAY
            </div>

            <h3 className="font-bangers text-2xl text-comic-ink">PENANTANG</h3>

            {duel.opponentSession ? (
              <div className="w-full bg-pink-50 comic-border p-3 rounded-lg flex flex-col gap-2 text-sm font-sans">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-bold">
                    <Trophy className="w-4 h-4 text-amber-500" /> Hasil:
                  </span>
                  <span className={`font-bangers text-lg ${duel.opponentSession.won ? "text-emerald-600" : "text-red-600"}`}>
                    {duel.opponentSession.won ? "MENANG" : "GAGAL"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">Percobaan:</span>
                  <span className="font-bangers text-base">{duel.opponentSession.attemptsUsed} / 6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu:
                  </span>
                  <span className="font-bangers text-base">{duel.opponentSession.durationSeconds} Detik</span>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-3 py-2">
                <p className="text-xs text-gray-700 font-sans text-center">
                  Kamu belum memainkan kata untuk duel ini! Mainkan sekarang untuk membuka hasil akhir.
                </p>
                <Link
                  href={`/?wordId=${duel.wordId}`}
                  className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full"
                >
                  <Play className="w-4 h-4" /> MAIN DUEL SEKARANG
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
