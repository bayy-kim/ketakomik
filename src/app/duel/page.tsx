"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Swords, Plus, ArrowRight, Clock, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ComicModal } from "@/components/ComicModal";

export default function DuelLandingPage() {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleJoinDuel = () => {
    if (!roomCodeInput || roomCodeInput.trim().length < 4) {
      setErrorMsg("Masukkan kode room duel yang valid!");
      setShowErrorModal(true);
      return;
    }
    router.push(`/duel/${roomCodeInput.trim().toUpperCase()}`);
  };

  const handleCreateNewDuel = async () => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/duel");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/duel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeLimitSeconds: 120 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal membuat room duel");
        setShowErrorModal(true);
        return;
      }

      if (data.roomCode) {
        router.push(`/duel/${data.roomCode}`);
      }
    } catch (e) {
      console.error("Gagal membuat room duel:", e);
      setErrorMsg("Koneksi bermasalah!");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      {/* Comic Modal for Error Notifications */}
      <ComicModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="INFO ARENA DUEL"
        type="warning"
        message={errorMsg}
      />

      {/* Comic Modal for Duel Guide & Rules */}
      <ComicModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title="PANDUAN & ATURAN DUEL 1V1"
        type="info"
        message="Selamat datang di Arena Duel Asinkron Tekakomik!
        
Aturan dan Cara Bermain Duel:
1. Buat Duel baru atau masukkan 6-digit kode room temanmu untuk bergabung.
2. Kedua pemain akan menebak kata rahasia yang SAMA persis.
3. Permainan duel dibatasi waktu 120 Detik (Hitung Mundur) semenjak kamu mulai mengetik!
4. Duel ini bersifat asinkron; kamu bisa bermain duluan, lalu membagikan kodenya ke temanmu untuk menyusul bermain.
5. Setelah kedua pemain selesai bermain, skor komik akhir akan dibandingkan bersandingan dalam 2 Panel Komik, dan pemenangnya akan ditahbiskan di atas!
6. Game duel TIDAK AKAN menambah perolehan Streak Harian atau kueri grafik statistik utama di Dashboard pribadimu agar persaingan tetap adil."
      />

      <main className="flex-1 max-w-xl mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-xl comic-shadow-lg w-full flex flex-col items-center gap-6 text-center">
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white comic-shadow rotate-[-4deg]">
            <Swords className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">MODE DUEL ASINKRON PERTANDINGAN KOMIK</h1>
            <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1">
              Tantang temanmu menebak kata yang SAMA dengan batasan waktu 120 Detik! Hasil tebakan akan otomatis tercatat di Papan Peringkat (Leaderboard).
            </p>
            <button
              onClick={() => setShowGuideModal(true)}
              className="mt-2 text-xs font-sans font-bold text-comic-klu underline hover:text-blue-700 flex items-center justify-center gap-1 mx-auto"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> BACA PANDUAN & ATURAN DUEL
            </button>
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
                className="comic-btn text-sm bg-comic-klu text-white hover:bg-blue-600 flex items-center justify-center gap-1.5 px-3 min-w-[48px] shrink-0"
                title="Gabung Duel"
              >
                <span className="hidden sm:inline">GABUNG</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
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
            disabled={loading}
            className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-3"
          >
            {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {loading ? "MEMBUAT ROOM DUEL..." : "BUAT DUEL BARU HARI INI"}
          </button>
        </div>
      </main>
    </div>
  );
}
