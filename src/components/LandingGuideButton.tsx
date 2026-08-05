"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { ComicModal } from "./ComicModal";

export function LandingGuideButton() {
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowGuideModal(true)}
        className="comic-btn text-xs bg-white text-comic-ink hover:bg-gray-100 py-1.5 px-3 flex items-center gap-1.5"
      >
        <HelpCircle className="w-4 h-4 text-comic-klu animate-bounce" />
        <span>BACA PANDUAN LENGKAP FITUR GAME</span>
      </button>

      <ComicModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title="PANDUAN FITUR GAME TEKAKOMIK"
        type="info"
        message="Selamat datang di Tekakomik! Berikut adalah panduan lengkap fitur-fitur permainan yang bisa kamu nikmati:

🎮 TEBAK HARIAN:
Tebak 1 kata rahasia setiap hari dengan 6 kali kesempatan. Warna hijau artinya huruf & posisi tepat, kuning artinya huruf ada tapi posisi salah, dan abu-abu artinya huruf tidak ada.

🔊 MODE DENGAR & MIC (HARDCORE):
Tantangan suara 120 detik! Petunjuk diputar via audio dan kamu bisa menebak kata langsung menggunakan Microphone (input suara).

📚 STORY CHAPTERS:
Selesaikan 5 kata dalam 1 Chapter untuk membuka Panel Komik Cerita Rahasia dan melanjutkan kisah penyelidikan Kapten Klu vs Bayangan.

⚔️ MODE DUEL 1V1:
Tantang temanmu menebak kata yang SAMA dengan batasan waktu 120 Detik. Hasil akhir dibandingkan secara bersandingan dalam 2 Panel Komik.

🏆 PAPAN PERINGKAT (LEADERBOARD):
Kumpulkan Skor Komik tertinggi dan masuk ke dalam Papan Peringkat Detektif Global!

💡 USUL KATA KOMUNITAS:
Kirim usulan kata unik dari daerahmu ke admin untuk dimasukkan sebagai soal game berikutnya."
      />
    </>
  );
}
