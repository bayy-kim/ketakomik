"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Gamepad2,
  Volume2,
  BookOpen,
  Swords,
  Trophy,
  Sparkles,
  ChevronDown,
  UserPlus,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Flame,
  Droplet,
  Play,
  Lock,
} from "lucide-react";

// Interactive FAQ list in simple everyday language for beginners
const FAQ_LIST = [
  {
    q: "Game ini apa sih? Susah nggak?",
    a: "Tekakonik itu game tebak kata harian yang seru dan santai bergaya komik! Kamu diberi 6 kesempatan menebak 1 kata rahasia setiap hari. Petunjuk warna akan memandu kamu secara otomatis.",
  },
  {
    q: "Warna hijau, kuning, dan abu-abu itu maksudnya apa?",
    a: "🟩 HIJAU = Posisi & hurufnya sudah 100% BENAR! 🟨 KUNING = Hurufnya ADA di dalam kata, tapi posisinya masih SALAH. ⬛ ABU-ABU = Huruf ini TIDAK ADA sama sekali. Gunakan petunjuk ini untuk tebakan selanjutnya!",
  },
  {
    q: "Siapa Kapten Klu dan Bayangan?",
    a: "Kapten Klu (Warna Biru #2B6CFF) adalah superhero baik hati pemberi petunjuk 100% JUJUR. Bayangan (Warna Pink/Magenta #FF3D81) adalah rival cerdik yang suka memberi petunjuk LUCU & MENYESATKAN! Kamu bisa pilih mau percaya siapa! 😈",
  },
  {
    q: "Bagaimana cara kerja Tinta dan Streak?",
    a: "Tinta adalah poin yang kamu pakai untuk membuka petunjuk Kapten Klu atau Bayangan. Tinta didapatkan setiap kamu berhasil menebak kata, main berturut-turut (Streak), atau menyelesaikan Chapter komik.",
  },
  {
    q: "Apakah pendaftaran akun itu gratis?",
    a: "100% GRATIS! Kamu bisa langsung login instan menggunakan akun Google kamu, atau daftar username baru dalam 30 detik untuk dapat bonus +100 Tinta pendaftaran!",
  },
  {
    q: "Apa itu Mode Duel?",
    a: "Dalam Mode Duel, kamu bisa menantang temanmu menebak kata yang sama! Kirim kode room 6 digit via WhatsApp, lalu lihat perbandingan hasil tebakan dalam 2 Panel Komik bersebelahan!",
  },
  {
    q: "Kapan kata tebakan baru muncul?",
    a: "Setiap hari tepat jam 00:00 WIB akan ada 1 kata rahasia baru yang siap kamu selidiki bersama Kapten Klu!",
  },
];

// Mock Word Rows for the Animated Background Auto-Filling Simulation
const ANIMATED_SIMULATION_WORDS = [
  { word: "KAPTE", status: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT"] },
  { word: "KOMIK", status: ["CORRECT", "CORRECT", "CORRECT", "CORRECT", "CORRECT"] },
  { word: "BAYAN", status: ["PRESENT", "ABSENT", "CORRECT", "ABSENT", "PRESENT"] },
  { word: "DETEK", status: ["CORRECT", "PRESENT", "ABSENT", "CORRECT", "ABSENT"] },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [animStep, setAnimStep] = useState(0);

  // Auto-step simulation loop for background gameboard animation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % ANIMATED_SIMULATION_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* ===== HERO SECTION WITH SIMULATED WORDLE BACKGROUND & GLASSMORPHISM ===== */}
        <section className="relative bg-white border-b-4 border-comic-ink overflow-hidden py-12 sm:py-20">
          {/* Halftone Dot Pattern */}
          <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

          {/* BACKGROUND ANIMATED WORD-FILLING GRID SIMULATION */}
          <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-16 pointer-events-none opacity-35 select-none overflow-hidden">
            {/* Left Simulated Gameboard Stack */}
            <div className="flex flex-col gap-3 scale-90 sm:scale-100 rotate-[-6deg] translate-x-[-10%]">
              {ANIMATED_SIMULATION_WORDS.map((row, rIdx) => {
                const isActive = rIdx === animStep;
                return (
                  <div key={rIdx} className="flex gap-2">
                    {row.word.split("").map((char, cIdx) => {
                      const st = row.status[cIdx];
                      const bgClass =
                        isActive && st === "CORRECT"
                          ? "bg-comic-correct text-white"
                          : isActive && st === "PRESENT"
                          ? "bg-comic-present text-comic-ink"
                          : "bg-gray-100 text-comic-ink";

                      return (
                        <motion.div
                          key={cIdx}
                          animate={{
                            rotateY: isActive ? [0, 180, 0] : 0,
                            scale: isActive ? [1, 1.1, 1] : 1,
                          }}
                          transition={{ delay: cIdx * 0.15, duration: 0.6 }}
                          className={`w-10 h-10 sm:w-14 sm:h-14 comic-border rounded-lg flex items-center justify-center font-bangers text-2xl sm:text-3xl ${bgClass} comic-shadow-sm`}
                        >
                          {char}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Right Simulated Gameboard Stack */}
            <div className="hidden md:flex flex-col gap-3 scale-90 sm:scale-100 rotate-[6deg] translate-x-[10%]">
              {ANIMATED_SIMULATION_WORDS.slice().reverse().map((row, rIdx) => {
                const isActive = rIdx === animStep;
                return (
                  <div key={rIdx} className="flex gap-2">
                    {row.word.split("").map((char, cIdx) => {
                      const st = row.status[cIdx];
                      const bgClass =
                        isActive && st === "CORRECT"
                          ? "bg-comic-correct text-white"
                          : isActive && st === "PRESENT"
                          ? "bg-comic-present text-comic-ink"
                          : "bg-gray-100 text-comic-ink";

                      return (
                        <motion.div
                          key={cIdx}
                          animate={{
                            scale: isActive ? [1, 1.15, 1] : 1,
                          }}
                          transition={{ delay: cIdx * 0.12, duration: 0.5 }}
                          className={`w-10 h-10 sm:w-14 sm:h-14 comic-border rounded-lg flex items-center justify-center font-bangers text-2xl sm:text-3xl ${bgClass} comic-shadow-sm`}
                        >
                          {char}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D Animated Floating Emojis Background Decor */}
          <motion.div
            className="absolute top-8 left-6 sm:left-24 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-[4px_4px_0_#16161A] z-20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🦸‍♂️
          </motion.div>

          <motion.div
            className="absolute top-12 right-6 sm:right-24 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-[4px_4px_0_#16161A] z-20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -12, 12, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            🦹‍♀️
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-16 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] hidden sm:block z-20"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            💥
          </motion.div>

          <motion.div
            className="absolute bottom-12 right-20 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] hidden sm:block z-20"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            🏆
          </motion.div>

          {/* HERO CONTENT WRAPPED IN GLASSMORPHISM BLUR CONTAINER */}
          <div className="max-w-4xl mx-auto px-4 relative z-20">
            <div className="backdrop-blur-md bg-white/80 border-4 border-comic-ink rounded-3xl comic-shadow-lg p-6 sm:p-10 flex flex-col items-center text-center gap-6">
              {/* Eyebrow badge */}
              <div className="bg-comic-bayangan comic-border px-4 py-1 rounded-full comic-shadow-sm rotate-[-1deg] flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg inline-block"
                >
                  ✨
                </motion.span>
                <span className="font-bangers text-sm sm:text-base text-white tracking-widest">
                  PENGENALAN GAME TEKAKOMIK
                </span>
              </div>

              {/* Main Title */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-comic-yellow comic-border px-6 py-2.5 rounded-2xl comic-shadow rotate-[-2deg]">
                  <h1 className="font-bangers text-4xl sm:text-6xl lg:text-7xl text-comic-ink tracking-wider leading-none">
                    TEKAKOMIK
                  </h1>
                </div>
                <p className="font-bangers text-xl sm:text-2xl lg:text-3xl text-comic-ink mt-2">
                  Game Tebak Kata Harian Bergaya Komik Modern!
                </p>
              </div>

              {/* Sub-description */}
              <p className="font-sans text-sm sm:text-base lg:text-lg text-gray-800 max-w-xl leading-relaxed">
                Dampingi <strong className="text-comic-klu">Kapten Klu</strong> dengan petunjuk 100% jujur, dan waspadai trik lucu dari <strong className="text-comic-bayangan">Bayangan</strong>! Tebak kata rahasia setiap hari dan kumpulkan Tinta!
              </p>

              {/* 3D Animated Character Cards */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg my-1">
                {/* Kapten Klu */}
                <motion.div
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  className="bg-blue-50/90 comic-border p-3.5 rounded-xl comic-shadow-klu flex items-center gap-3 w-full sm:w-64"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-comic-klu comic-border flex items-center justify-center text-2xl comic-shadow shrink-0 select-none"
                  >
                    🦸‍♂️
                  </motion.div>
                  <div className="text-left">
                    <p className="font-bangers text-lg text-comic-klu leading-none">Kapten Klu</p>
                    <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Jujur 100%</p>
                  </div>
                </motion.div>

                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-bangers text-2xl text-comic-ink shrink-0"
                >
                  VS
                </motion.span>

                {/* Bayangan */}
                <motion.div
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  className="bg-pink-50/90 comic-border p-3.5 rounded-xl comic-shadow-bayangan flex items-center gap-3 w-full sm:w-64"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-12 h-12 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-2xl comic-shadow shrink-0 select-none"
                  >
                    🦹‍♀️
                  </motion.div>
                  <div className="text-left">
                    <p className="font-bangers text-xl text-comic-bayangan leading-none">Bayangan</p>
                    <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Trik & Lucu 😈</p>
                  </div>
                </motion.div>
              </div>

              {/* Login & Join CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
                <Link
                  href="/auth/login"
                  className="comic-btn text-base sm:text-lg bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-3.5"
                >
                  <UserPlus className="w-5 h-5" />
                  MASUK / DAFTAR SEKARANG
                </Link>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/play" })}
                  className="comic-btn text-base bg-white hover:bg-gray-100 text-comic-ink flex-1 py-3.5"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                  </svg>
                  GOOGLE LOGIN
                </button>
              </div>

              <p className="text-xs font-sans text-gray-600 flex items-center justify-center gap-1 font-bold">
                <Lock className="w-3.5 h-3.5 text-red-600 inline" /> Wajib login terlebih dahulu untuk mengakses arena tebak kata & menyimpan progress.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CARA BERMAIN MODEREN & SEDERHANA ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-ink text-white font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                📘 CARA BERMAIN UNTUK ORANG AWAM
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-yellow comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-comic-ink comic-shadow-sm">1</div>
                <p className="font-bangers text-lg text-comic-ink">TEBAK KATA HARIAN</p>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Ketikkan kata yang kamu tebak. Kamu punya <strong>6 kali kesempatan</strong> untuk menemukan kata rahasia hari ini!
                </p>
              </div>

              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-klu comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-white comic-shadow-sm">2</div>
                <p className="font-bangers text-lg text-comic-ink">PERHATIKAN WARNA KOTAK</p>
                <div className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-comic-correct fill-comic-correct shrink-0" />
                    <span><strong>Hijau</strong> = Huruf & letaknya BENAR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="w-5 h-5 text-comic-present fill-comic-present shrink-0" />
                    <span><strong>Kuning</strong> = Huruf ADA, letak SALAH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-comic-absent shrink-0" />
                    <span><strong>Abu-abu</strong> = Huruf TIDAK ADA</span>
                  </div>
                </div>
              </div>

              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-bayangan comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-white comic-shadow-sm">3</div>
                <p className="font-bangers text-lg text-comic-ink">MINTA BANTUAN CLUE</p>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Buka petunjuk jujur Kapten Klu atau petunjuk trik Bayangan menggunakan <strong>Tinta</strong> yang kamu kumpulkan!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FITUR UNGGULAN ICON-ONLY ===== */}
        <section className="bg-white border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-yellow text-comic-ink font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                🌟 FITUR-FITUR SERU
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { emoji: "🎮", label: "TEBAK HARIAN", sub: "1 Kata Tiap Hari", bg: "bg-comic-yellow" },
                { emoji: "🔊", label: "MODE DENGAR", sub: "Petunjuk Audio Suara", bg: "bg-comic-klu" },
                { emoji: "📚", label: "STORY CHAPTER", sub: "Unlock Gambar Komik", bg: "bg-comic-yellow" },
                { emoji: "⚔️", label: "MODE DUEL", sub: "Tantang Temanmu", bg: "bg-comic-bayangan" },
                { emoji: "🏆", label: "LEADERBOARD", sub: "Papan Peringkat", bg: "bg-comic-klu" },
                { emoji: "💡", label: "USUL KATA", sub: "Usulan Komunitas", bg: "bg-emerald-500" },
              ].map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-yellow-50 transition-colors"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2 + idx * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-12 h-12 rounded-full ${f.bg} comic-border flex items-center justify-center text-2xl comic-shadow-sm select-none`}
                  >
                    {f.emoji}
                  </motion.div>
                  <span className="font-bangers text-base text-comic-ink leading-tight">{f.label}</span>
                  <span className="text-[10px] sm:text-xs font-sans text-gray-600">{f.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-bayangan text-white font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                ❓ PERTANYAAN UMUM (FAQ)
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="flex flex-col gap-3">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`comic-border rounded-xl overflow-hidden transition-all bg-white ${isOpen ? "comic-shadow" : "shadow-none"}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className={`w-full px-4 py-4 flex items-start justify-between gap-3 text-left transition-colors ${isOpen ? "bg-amber-50" : "hover:bg-gray-50"}`}
                    >
                      <span className="font-bangers text-base sm:text-lg text-comic-ink leading-snug">{faq.q}</span>
                      <span className={`shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-5 h-5 text-comic-ink" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-2 font-sans text-xs sm:text-sm text-gray-700 leading-relaxed border-t-2 border-amber-100 bg-amber-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
