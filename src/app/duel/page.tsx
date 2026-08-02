"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Swords, Plus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DuelLandingPage() {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const router = useRouter();

  const handleJoinDuel = () => {
    if (!roomCodeInput || roomCodeInput.trim().length < 4) {
      alert("Masukkan kode room duel yang valid!");
      return;
    }
    router.push(`/duel/${roomCodeInput.trim().toUpperCase()}`);
  };

  const handleCreateNewDuel = async () => {
    try {
      const res = await fetch("/api/duel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId: "w1", creatorSessionId: `sess-${Date.now()}` }),
      });
      const data = await res.json();
      if (data.roomCode) {
        router.push(`/duel/${data.roomCode}`);
      }
    } catch (e) {
      console.error("Gagal membuat room duel:", e);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-2xl comic-shadow-lg w-full flex flex-col items-center gap-6 text-center">
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white comic-shadow rotate-[-4deg]">
            <Swords className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">MODE DUEL ASINKRON</h1>
            <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1">
              Tantang temanmu menebak kata yang SAMA dan bandingkan hasilnya dalam 2 Panel Komik Bersebelahan!
            </p>
          </div>

          {/* Join Duel Section */}
          <div className="w-full bg-amber-50 comic-border p-4 rounded-xl flex flex-col gap-2">
            <span className="font-bangers text-lg text-comic-ink text-left">PUNYA KODE ROOM?</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CONTOH: AB12CD"
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-white comic-border px-3 py-2 rounded font-bangers text-xl tracking-widest text-comic-ink uppercase"
              />
              <button
                onClick={handleJoinDuel}
                className="comic-btn text-sm bg-comic-klu text-white hover:bg-blue-600"
              >
                GABUNG <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-0.5 bg-comic-ink" />
            <span className="font-bangers text-sm text-gray-500">ATAU</span>
            <div className="flex-1 h-0.5 bg-comic-ink" />
          </div>

          {/* Create New Duel */}
          <button
            onClick={handleCreateNewDuel}
            className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-3"
          >
            <Plus className="w-5 h-5" /> BUAT DUEL BARU HARI INI
          </button>
        </div>
      </main>
    </div>
  );
}
