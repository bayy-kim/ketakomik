import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { LandingSimulationGrid } from "@/components/LandingSimulationGrid";
import { LandingFaqAccordion } from "@/components/LandingFaqAccordion";
import { FloatingHeroEmojis } from "@/components/FloatingHeroEmojis";
import { LandingGuideButton } from "@/components/LandingGuideButton";
import { LandingHeroCta } from "@/components/LandingHeroCta";

export const metadata = {
  title: "Tekakomik - Game Tebak Kata Harian Komik",
  description: "Dampingi Kapten Klu dengan petunjuk jujur, selidiki trik lucu Bayangan! Tebak kata rahasia harian bergaya komik modern.",
};

const FAQ_LIST = [
  {
    q: "Game ini tentang apa?",
    a: "Tekakomik adalah game tebak kata harian bergaya komik modern. Kamu punya 6 kesempatan menebak 1 kata rahasia setiap hari dengan panduan warna interaktif.",
  },
  {
    q: "Apa arti warna kotak tebakan?",
    a: "🟩 HIJAU = Huruf & posisinya 100% BENAR. 🟨 KUNING = Huruf ADA di dalam kata, tapi posisinya SALAH. ⬛ ABU-ABU = Huruf TIDAK ADA sama sekali di dalam kata.",
  },
  {
    q: "Siapa Kapten Klu dan Bayangan?",
    a: "Kapten Klu (Warna Biru #2B6CFF) adalah detektif superhero pemberi petunjuk 100% JUJUR. Bayangan (Warna Magenta #FF3D81) adalah rival trickster pemberi petunjuk MENYESATKAN dan lucu!",
  },
  {
    q: "Bagaimana cara kerja Tinta dan Streak?",
    a: "Tinta adalah poin untuk membuka petunjuk Kapten Klu atau Bayangan. Tinta didapatkan setiap berhasil menebak kata, menjaga Streak harian, dan menyelesaikan Story Chapter.",
  },
  {
    q: "Apakah pendaftaran akun itu gratis?",
    a: "100% GRATIS! Kamu bisa login instan dengan akun Google atau membuat akun baru dalam 30 detik untuk mendapatkan bonus +100 Tinta pendaftaran.",
  },
  {
    q: "Apa itu Mode Duel?",
    a: "Kamu bisa menantang teman menebak kata yang sama! Kirim kode room 6 digit via WhatsApp, lalu lihat perbandingan hasil tebakan dalam 2 Panel Komik bersebelahan.",
  },
  {
    q: "Kapan kata tebakan baru rilis?",
    a: "Setiap hari tepat jam 00:00 WIB rilis 1 kata rahasia baru yang siap diselidiki bersama Kapten Klu!",
  },
];

const ANIMATED_SIMULATION_WORDS = [
  { word: "KAPTE", status: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT"] },
  { word: "KOMIK", status: ["CORRECT", "CORRECT", "CORRECT", "CORRECT", "CORRECT"] },
  { word: "BAYAN", status: ["PRESENT", "ABSENT", "CORRECT", "ABSENT", "PRESENT"] },
  { word: "DETEK", status: ["CORRECT", "PRESENT", "ABSENT", "CORRECT", "ABSENT"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* ===== HERO SECTION WITH MODERN COMIC BACKGROUND & HIGH-CONTRAST PANEL ===== */}
        <section className="relative bg-white border-b-4 border-comic-ink overflow-hidden py-8 sm:py-16">
          {/* Halftone Dot Pattern */}
          <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

          {/* BACKGROUND ANIMATED WORD-FILLING GRID SIMULATION */}
          <LandingSimulationGrid simulationWords={ANIMATED_SIMULATION_WORDS} />

          {/* Floating Emojis */}
          <FloatingHeroEmojis />

          {/* HERO PANEL CONTAINER */}
          <div className="max-w-4xl mx-auto px-3 sm:px-4 relative z-20">
            <div className="bg-white/95 backdrop-blur-md comic-border rounded-xl comic-shadow-lg p-5 sm:p-8 flex flex-col items-center text-center gap-5">
              
              {/* Badge */}
              <div className="bg-comic-bayangan comic-border px-3.5 py-1 rounded-full comic-shadow-sm rotate-[-1deg] flex items-center gap-1.5">
                <span className="font-bangers text-xs sm:text-sm text-white tracking-widest uppercase">
                  ✨ PENGENALAN GAME TEKAKOMIK
                </span>
              </div>

              {/* Title Header */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-comic-yellow comic-border px-4 sm:px-6 py-2 rounded-xl comic-shadow rotate-[-2deg]">
                  <h1 className="font-bangers text-3xl sm:text-5xl lg:text-6xl text-comic-ink tracking-wider leading-none">
                    TEKAKOMIK
                  </h1>
                </div>
                <p className="font-bangers text-lg sm:text-2xl text-comic-ink mt-1">
                  Game Tebak Kata Harian Bergaya Komik Modern!
                </p>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-base text-gray-800 max-w-lg leading-relaxed">
                Dampingi <strong className="text-comic-klu">Kapten Klu</strong> dengan petunjuk 100% jujur, dan selidiki trik lucu dari <strong className="text-comic-bayangan">Bayangan</strong>! Tebak kata rahasia setiap hari dan kumpulkan Tinta.
              </p>

              <LandingGuideButton />

              {/* Character Cards */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md my-1">
                {/* Kapten Klu */}
                <div className="bg-blue-50 comic-border p-3 rounded-xl comic-shadow-klu flex items-center gap-3 w-full sm:w-1/2">
                  <div className="w-10 h-10 rounded-full bg-comic-klu comic-border flex items-center justify-center text-xl comic-shadow shrink-0 select-none">
                    🦸‍♂️
                  </div>
                  <div className="text-left">
                    <p className="font-bangers text-base text-comic-klu leading-none">Kapten Klu</p>
                    <p className="text-[11px] font-sans text-gray-700 font-bold mt-0.5">Petunjuk Jujur 100%</p>
                  </div>
                </div>

                <span className="font-bangers text-xl text-comic-ink shrink-0">VS</span>

                {/* Bayangan */}
                <div className="bg-pink-50 comic-border p-3 rounded-xl comic-shadow-bayangan flex items-center gap-3 w-full sm:w-1/2">
                  <div className="w-10 h-10 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-xl comic-shadow shrink-0 select-none">
                    🦹‍♀️
                  </div>
                  <div className="text-left">
                    <p className="font-bangers text-base text-comic-bayangan leading-none">Bayangan</p>
                    <p className="text-[11px] font-sans text-gray-700 font-bold mt-0.5">Petunjuk Trik 😈</p>
                  </div>
                </div>
              </div>

              {/* Login & Sign In / PLAY! CTA Buttons */}
              <LandingHeroCta />
            </div>
          </div>
        </section>

        {/* ===== CARA BERMAIN MODEREN & SEDERHANA ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="bg-comic-ink text-white font-bangers text-base sm:text-lg px-3.5 py-1 rounded comic-border-sm">
                📘 CARA BERMAIN UNTUK ORANG AWAM
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex flex-col gap-2">
                <div className="w-8 h-8 bg-comic-yellow comic-border-sm rounded-full flex items-center justify-center font-bangers text-lg text-comic-ink comic-shadow-sm">1</div>
                <p className="font-bangers text-base text-comic-ink">TEBAK KATA HARIAN</p>
                <p className="font-sans text-xs text-gray-700 leading-relaxed">
                  Ketikkan kata yang kamu tebak. Kamu punya <strong>6 kali kesempatan</strong> untuk menemukan kata rahasia hari ini!
                </p>
              </div>

              <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex flex-col gap-2">
                <div className="w-8 h-8 bg-comic-klu comic-border-sm rounded-full flex items-center justify-center font-bangers text-lg text-white comic-shadow-sm">2</div>
                <p className="font-bangers text-base text-comic-ink">PERHATIKAN WARNA KOTAK</p>
                <div className="flex flex-col gap-1.5 font-sans text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-comic-correct fill-comic-correct shrink-0" />
                    <span><strong>Hijau</strong> = Huruf & letaknya BENAR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="w-4 h-4 text-comic-present fill-comic-present shrink-0" />
                    <span><strong>Kuning</strong> = Huruf ADA, letak SALAH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-comic-absent shrink-0" />
                    <span><strong>Abu-abu</strong> = Huruf TIDAK ADA</span>
                  </div>
                </div>
              </div>

              <div className="bg-white comic-border p-4 rounded-xl comic-shadow flex flex-col gap-2">
                <div className="w-8 h-8 bg-comic-bayangan comic-border-sm rounded-full flex items-center justify-center font-bangers text-lg text-white comic-shadow-sm">3</div>
                <p className="font-bangers text-base text-comic-ink">MINTA BANTUAN CLUE</p>
                <p className="font-sans text-xs text-gray-700 leading-relaxed">
                  Buka petunjuk jujur Kapten Klu atau petunjuk trik Bayangan menggunakan <strong>Tinta</strong> yang kamu kumpulkan!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FITUR UNGGULAN ICON-ONLY ===== */}
        <section className="bg-white border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="bg-comic-yellow text-comic-ink font-bangers text-base sm:text-lg px-3.5 py-1 rounded comic-border-sm">
                🌟 FITUR-FITUR SERU
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { emoji: "🎮", label: "TEBAK HARIAN", sub: "1 Kata Tiap Hari", bg: "bg-comic-yellow" },
                { emoji: "🔊", label: "MODE DENGAR", sub: "Petunjuk Audio Suara", bg: "bg-comic-klu" },
                { emoji: "📚", label: "STORY CHAPTER", sub: "Unlock Gambar Komik", bg: "bg-comic-yellow" },
                { emoji: "⚔️", label: "MODE DUEL", sub: "Tantang Temanmu", bg: "bg-comic-bayangan" },
                { emoji: "🏆", label: "LEADERBOARD", sub: "Papan Peringkat", bg: "bg-comic-klu" },
                { emoji: "💡", label: "USUL KATA", sub: "Usulan Komunitas", bg: "bg-emerald-500" },
              ].map((f, idx) => (
                <div
                  key={idx}
                  className="comic-box p-3 flex flex-col items-center text-center gap-1.5 hover:bg-yellow-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full ${f.bg} comic-border flex items-center justify-center text-xl comic-shadow-sm select-none`}>
                    {f.emoji}
                  </div>
                  <span className="font-bangers text-sm text-comic-ink leading-tight">{f.label}</span>
                  <span className="text-[10px] font-sans text-gray-600">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="bg-comic-bayangan text-white font-bangers text-base sm:text-lg px-3.5 py-1 rounded comic-border-sm">
                ❓ PERTANYAAN UMUM (FAQ)
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <LandingFaqAccordion faqList={FAQ_LIST} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
