"use client";

import { useState } from "react";
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
  ChevronUp,
  Play,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: "Apa itu Tekakonik?",
    answer:
      "Tekakonik adalah game tebak kata harian bergenre Modern Comic! Setiap hari ada 1 kata tebakan (4–8 huruf) yang harus dipecahkan dalam 6 kali percobaan dengan indikator warna hijau, kuning, dan abu.",
  },
  {
    question: "Siapakah Kapten Klu dan Bayangan?",
    answer:
      "Kapten Klu (Electric Blue #2B6CFF) adalah detektif superhero yang selalu memberikan petunjuk 100% JUJUR. Bayangan (Magenta #FF3D81) adalah rival trickster yang suka memberikan petunjuk MENYESATKAN dan lucu!",
  },
  {
    question: "Apakah bisa bermain tanpa membuat akun / login?",
    answer:
      "Tentu saja! Tekakonik mendukung fitur Guest Play tanpa login. Progres streak dan Tinta kamu akan tersimpan otomatis di browser HP atau komputer kamu.",
  },
  {
    question: "Bagaimana cara mendapatkan dan menggunakan Tinta?",
    answer:
      "Tinta didapatkan dari setiap kemenangan tebakan (makin sedikit percobaan, makin banyak Tinta), streak harian, dan menyelesaikan Story Chapter. Tinta digunakan untuk membuka petunjuk jujur Kapten Klu atau trik Bayangan.",
  },
  {
    question: "Apa itu Mode Dengar (Hardcore Voice)?",
    answer:
      "Mode Dengar menyembunyikan semua teks clue dan membacakan petunjuk secara langsung via suara Web Speech API dengan intonasi berbeda untuk Kapten Klu dan Bayangan. Jika browser kamu tidak mendukung audio, tersedia tombol fallback 'Tampilkan sebagai Teks'.",
  },
  {
    question: "Bagaimana cara bermain Mode Duel bersama teman?",
    answer:
      "Setelah menyelesaikan kata hari ini, kamu bisa membuat kode room duel 6 karakter dan mengirimkannya ke teman via WhatsApp. Hasil tebakan kedua pemain akan ditampilkan berdampingan dalam 2 Panel Komik!",
  },
];

export default function LandingAboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 py-6 flex flex-col gap-10">
        {/* HERO SECTION */}
        <section className="bg-white comic-border p-6 sm:p-10 rounded-2xl comic-shadow-lg relative overflow-hidden flex flex-col items-center text-center gap-6">
          <div className="absolute inset-0 bg-halftone-dots opacity-15 pointer-events-none" />

          {/* Burst Hero Title */}
          <div className="bg-comic-yellow comic-border px-5 py-2 rounded-xl comic-shadow rotate-[-2deg]">
            <h1 className="font-bangers text-4xl sm:text-6xl text-comic-ink tracking-wider">
              PETUALANGAN TEBAK KATA KOMIK!
            </h1>
          </div>

          <p className="font-sans text-sm sm:text-lg text-gray-800 max-w-2xl leading-relaxed">
            Selamat datang di <strong>Tekakonik</strong> — tempat di mana logika kata bertemu dengan estetika komik modern. Bantu <strong>Kapten Klu</strong> memecahkan petunjuk jujur dan waspadai trik lucu dari <strong>Bayangan</strong>!
          </p>

          {/* Superhero VS Rival Character Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-4 my-2 z-10 w-full justify-center">
            {/* Kapten Klu Card */}
            <div className="bg-blue-50 comic-border p-4 rounded-xl comic-shadow-klu flex items-center gap-3 w-full sm:w-64">
              <div className="w-12 h-12 rounded-full bg-comic-klu comic-border flex items-center justify-center font-bangers text-white text-xl comic-shadow">
                KLU
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bangers text-xl text-comic-klu">Kapten Klu</span>
                <span className="text-xs font-sans text-gray-600">Detektif Clue Jujur</span>
              </div>
            </div>

            <span className="font-bangers text-3xl text-comic-ink">VS</span>

            {/* Bayangan Card */}
            <div className="bg-pink-50 comic-border p-4 rounded-xl comic-shadow-bayangan flex items-center gap-3 w-full sm:w-64">
              <div className="w-12 h-12 rounded-full bg-comic-bayangan comic-border flex items-center justify-center font-bangers text-white text-xl comic-shadow">
                BAY
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bangers text-xl text-comic-bayangan">Bayangan</span>
                <span className="text-xs font-sans text-gray-600">Trickster Clue Lucu</span>
              </div>
            </div>
          </div>

          {/* Hero Action Buttons (CTA) */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md z-10">
            <Link
              href="/"
              className="comic-btn text-lg bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-3"
            >
              <Play className="w-5 h-5 fill-comic-ink" /> MULAI MAIN SEKARANG
            </Link>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="comic-btn text-base bg-white hover:bg-gray-100 text-comic-ink flex-1 py-3"
            >
              <LogIn className="w-5 h-5" /> LOGIN GOOGLE
            </button>
          </div>
        </section>

        {/* ICON-ONLY / ICON FEATURE HIGHLIGHTS */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-comic-ink text-white font-bangers text-xl px-3 py-1 rounded comic-border-sm">
              FITUR UNGGULAN
            </div>
            <div className="flex-1 h-1 bg-comic-ink rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Feature 1 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-yellow-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-comic-yellow comic-border flex items-center justify-center text-comic-ink comic-shadow-sm">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-comic-ink leading-tight">TEBAK HARIAN</span>
              <span className="text-[10px] font-sans text-gray-600">1 Kata Setiap Hari</span>
            </div>

            {/* Feature 2 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-comic-klu comic-border flex items-center justify-center text-white comic-shadow-sm">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-comic-klu leading-tight">MODE DENGAR</span>
              <span className="text-[10px] font-sans text-gray-600">Voice Clue Audio</span>
            </div>

            {/* Feature 3 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-yellow-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-comic-yellow comic-border flex items-center justify-center text-comic-ink comic-shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-comic-ink leading-tight">STORY CHAPTERS</span>
              <span className="text-[10px] font-sans text-gray-600">Unlock Panel Komik</span>
            </div>

            {/* Feature 4 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-pink-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white comic-shadow-sm">
                <Swords className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-comic-bayangan leading-tight">MODE DUEL</span>
              <span className="text-[10px] font-sans text-gray-600">Tantang Temanmu</span>
            </div>

            {/* Feature 5 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-comic-klu comic-border flex items-center justify-center text-white comic-shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-comic-klu leading-tight">LEADERBOARD</span>
              <span className="text-[10px] font-sans text-gray-600">Peringkat Detektif</span>
            </div>

            {/* Feature 6 */}
            <div className="comic-box p-4 flex flex-col items-center text-center gap-2 hover:bg-green-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-emerald-500 comic-border flex items-center justify-center text-white comic-shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-bangers text-base text-emerald-700 leading-tight">USUL KATA</span>
              <span className="text-[10px] font-sans text-gray-600">Karya Komunitas</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-comic-yellow text-comic-ink font-bangers text-xl px-3 py-1 rounded comic-border-sm">
              PERTANYAAN UMUM (FAQ)
            </div>
            <div className="flex-1 h-1 bg-comic-ink rounded-full" />
          </div>

          <div className="flex flex-col gap-3">
            {FAQ_LIST.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="bg-white comic-border rounded-xl comic-shadow overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left font-bangers text-lg text-comic-ink hover:bg-yellow-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-comic-ink shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-comic-ink shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm font-sans text-gray-700 border-t-2 border-gray-100 bg-amber-50/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
