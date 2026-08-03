"use client";

import { useState } from "react";
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
  LogIn,
  UserPlus,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Flame,
  Droplet,
} from "lucide-react";

// Interactive FAQ list in simple everyday language
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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-white border-b-4 border-comic-ink overflow-hidden">
          {/* Halftone pattern */}
          <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

          {/* 3D Animated Floating Emojis Background Decor */}
          <motion.div
            className="absolute top-8 left-6 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-[4px_4px_0_#16161A]"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🦸‍♂️
          </motion.div>

          <motion.div
            className="absolute top-12 right-8 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-[4px_4px_0_#16161A]"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -12, 12, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            🦹‍♀️
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-12 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] hidden sm:block"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            💥
          </motion.div>

          <motion.div
            className="absolute bottom-12 right-16 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] hidden sm:block"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            🏆
          </motion.div>

          <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 flex flex-col items-center text-center gap-6 relative z-10">
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
              <div className="bg-comic-yellow comic-border px-5 py-2 rounded-xl comic-shadow rotate-[-2deg]">
                <h1 className="font-bangers text-4xl sm:text-6xl lg:text-7xl text-comic-ink tracking-wider leading-none">
                  TEKAKOMIK
                </h1>
              </div>
              <p className="font-bangers text-xl sm:text-2xl lg:text-3xl text-comic-ink mt-2">
                Game Tebak Kata Harian Bergaya Komik Modern!
              </p>
            </div>

            {/* Sub-description */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-gray-700 max-w-xl leading-relaxed">
              Dampingi <strong className="text-comic-klu">Kapten Klu</strong> dengan petunjuk 100% jujur, dan waspadai trik lucu dari <strong className="text-comic-bayangan">Bayangan</strong>! Tebak kata rahasia setiap hari dan kumpulkan Tinta!
            </p>

            {/* 3D Animated Character Cards */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg my-2">
              {/* Kapten Klu */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: -1 }}
                className="bg-blue-50 comic-border p-4 rounded-xl comic-shadow-klu flex items-center gap-3 w-full sm:w-64"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-full bg-comic-klu comic-border flex items-center justify-center text-3xl comic-shadow shrink-0 select-none"
                >
                  🦸‍♂️
                </motion.div>
                <div className="text-left">
                  <p className="font-bangers text-xl text-comic-klu leading-none">Kapten Klu</p>
                  <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Jujur 100%</p>
                </div>
              </motion.div>

              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-bangers text-3xl text-comic-ink shrink-0"
              >
                VS
              </motion.span>

              {/* Bayangan */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                className="bg-pink-50 comic-border p-4 rounded-xl comic-shadow-bayangan flex items-center gap-3 w-full sm:w-64"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="w-14 h-14 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-3xl comic-shadow shrink-0 select-none"
                >
                  🦹‍♀️
                </motion.div>
                <div className="text-left">
                  <p className="font-bangers text-xl text-comic-bayangan leading-none">Bayangan</p>
                  <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Trik & Lucu 😈</p>
                </div>
              </motion.div>
            </div>

            {/* Login & Join CTA */}
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

            <p className="text-xs font-sans text-gray-500">
              💡 Wajib login terlebih dahulu untuk menyimpan progress kata & memasuki arena permainan.
            </p>
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
