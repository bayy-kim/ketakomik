"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Footer } from "@/components/Footer";
import {
  Play,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Volume2,
  BookOpen,
  Swords,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Flame,
  Droplet,
} from "lucide-react";

const FAQ_LIST = [
  {
    q: "Game ini apa sih? Susah nggak?",
    a: "Tekakonik itu game tebak-tebakan kata satu kata per hari, bergaya komik keren! Kamu punya 6 kesempatan menebak. Setiap tebakan langsung dikasih warna petunjuk supaya kamu bisa lebih dekat ke jawaban. Cocok banget untuk semua orang — nggak perlu jago bahasa!",
  },
  {
    q: "Kotak warna itu artinya apa?",
    a: "🟩 HIJAU = Huruf tepat, posisi tepat! 🟨 KUNING = Huruf ada dalam kata, tapi posisinya salah. ⬛ ABU-ABU = Huruf ini tidak ada sama sekali dalam kata. Gunakan petunjuk warna ini untuk menyempurnakan tebakan berikutnya!",
  },
  {
    q: "Siapa Kapten Klu dan Bayangan?",
    a: "Kapten Klu (warna BIRU) adalah detektif superhero baik hati yang selalu kasih petunjuk JUJUR 100%. Bayangan (warna PINK/MAGENTA) adalah rival trickster yang suka kasih petunjuk ngaco dan MENYESATKAN tapi lucu! Kamu pilih mau minta bantuan siapa — tapi hati-hati sama Bayangan ya! 😈",
  },
  {
    q: "Apa itu Tinta? Dapat dari mana?",
    a: "Tinta itu mata uang di Tekakonik. Kamu pakai Tinta untuk buka petunjuk Kapten Klu atau Bayangan. Tinta bisa kamu dapat dari menang tebakan kata (makin sedikit percobaan, makin banyak Tinta!), login tiap hari (Streak), dan selesaikan Chapter cerita mingguan.",
  },
  {
    q: "Bisa main gratis tanpa buat akun?",
    a: "Tentu bisa! Kamu bisa langsung main sebagai tamu. Tapi kalau daftar akun (gratis!), progress Streak dan Tinta kamu tersimpan permanen, bisa ikut Papan Peringkat, dan dapat bonus 100 Tinta gratis saat pertama daftar! 🎉",
  },
  {
    q: "Mode Duel itu apa? Seru nggak?",
    a: "Mode Duel seru banget! Setelah kamu main, buat kode room 6 digit lalu kirim ke teman via WhatsApp. Teman kamu main kata yang SAMA, lalu hasilnya dibandingkan berdampingan gaya panel komik. Siapa yang paling cepat dan paling sedikit percobaan, dia pemenangnya! 🏆",
  },
  {
    q: "Kapan kata baru tersedia?",
    a: "Ada 1 kata baru setiap hari! Kamu punya 24 jam untuk menebaknya. Setiap kata punya kategori (Misteri, Ilmu Pengetahuan, Profesi, dll.) dan tingkat kesulitan (Mudah/Sedang/Sulit) yang ditampilkan di layar permainan.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      {/* === MINIMAL HEADER (tanpa navigasi lengkap) === */}
      <header className="w-full bg-white border-b-4 border-comic-ink shadow-[0_4px_0_#16161A] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <div className="bg-comic-yellow comic-border px-2.5 py-0.5 rounded rotate-[-2deg] comic-shadow-sm">
            <span className="font-bangers text-2xl sm:text-3xl text-comic-ink tracking-wider">TEKAKOMIK</span>
          </div>

          {/* CTA Header Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="comic-btn py-1.5 px-3 text-xs sm:text-sm bg-white hover:bg-gray-100 text-comic-ink"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">MASUK</span>
            </Link>
            <Link
              href="/auth/login"
              className="comic-btn py-1.5 px-3 text-xs sm:text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">DAFTAR GRATIS</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-white border-b-4 border-comic-ink overflow-hidden">
          {/* Halftone background */}
          <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 flex flex-col items-center text-center gap-6 relative z-10">
            {/* Eyebrow badge */}
            <div className="bg-comic-bayangan comic-border px-4 py-1 rounded-full comic-shadow-sm rotate-[-1deg]">
              <span className="font-bangers text-sm sm:text-base text-white tracking-widest">
                🎮 GAME TEBAK KATA HARIAN GRATIS!
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-comic-yellow comic-border px-5 py-2 rounded-xl comic-shadow rotate-[-2deg]">
                <h1 className="font-bangers text-4xl sm:text-6xl lg:text-7xl text-comic-ink tracking-wider leading-none">
                  TEKAKONIK
                </h1>
              </div>
              <p className="font-bangers text-xl sm:text-2xl lg:text-3xl text-comic-ink mt-2">
                Tebak Kata Rahasia Setiap Hari!
              </p>
            </div>

            {/* Sub-description */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-gray-700 max-w-xl leading-relaxed">
              Setiap hari ada <strong>1 kata rahasia</strong> yang harus kamu tebak dalam
              <strong> 6 kali percobaan</strong>. Dapat bantuan dari{" "}
              <span className="text-comic-klu font-bold">Kapten Klu</span> yang jujur, atau
              tergoda oleh trik jahil{" "}
              <span className="text-comic-bayangan font-bold">Bayangan</span>!
            </p>

            {/* Character cards side by side */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
              <div className="bg-blue-50 comic-border p-4 rounded-xl comic-shadow-klu flex items-center gap-3 w-full sm:w-auto flex-1">
                <div className="w-12 h-12 rounded-full bg-comic-klu comic-border flex items-center justify-center font-bangers text-xl text-white comic-shadow shrink-0">
                  🦸
                </div>
                <div className="text-left">
                  <p className="font-bangers text-lg text-comic-klu leading-none">Kapten Klu</p>
                  <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Jujur 100%</p>
                </div>
              </div>

              <span className="font-bangers text-3xl text-comic-ink shrink-0">VS</span>

              <div className="bg-pink-50 comic-border p-4 rounded-xl comic-shadow-bayangan flex items-center gap-3 w-full sm:w-auto flex-1">
                <div className="w-12 h-12 rounded-full bg-comic-bayangan comic-border flex items-center justify-center font-bangers text-xl text-white comic-shadow shrink-0">
                  🦹
                </div>
                <div className="text-left">
                  <p className="font-bangers text-lg text-comic-bayangan leading-none">Bayangan</p>
                  <p className="text-xs font-sans text-gray-600 mt-0.5">Petunjuk Trik & Lucu 😈</p>
                </div>
              </div>
            </div>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
              <Link
                href="/auth/login"
                className="comic-btn text-base sm:text-lg bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-3.5"
              >
                <Play className="w-5 h-5 fill-comic-ink" />
                MAIN SEKARANG!
              </Link>
              <Link
                href="/auth/login"
                className="comic-btn text-base bg-white hover:bg-gray-100 text-comic-ink flex-1 py-3.5"
              >
                <UserPlus className="w-5 h-5" />
                DAFTAR GRATIS
              </Link>
            </div>

            {/* Subtle social proof */}
            <p className="text-xs font-sans text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-comic-yellow fill-comic-yellow" />
              Gratis selamanya · Tidak perlu unduh aplikasi · Main langsung di browser
            </p>
          </div>
        </section>

        {/* ===== CARA BERMAIN SECTION ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-ink text-white font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                📖 CARA BERMAIN
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            {/* Step by step */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-yellow comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-comic-ink comic-shadow-sm">1</div>
                <p className="font-bangers text-lg text-comic-ink">TEBAK KATA</p>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Ketikkan kata yang kamu duga. Kata punya 4–8 huruf. Tekan <strong>CEK</strong> untuk lihat hasilnya. Kamu punya <strong>6 kesempatan</strong>!
                </p>
              </div>

              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-klu comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-white comic-shadow-sm">2</div>
                <p className="font-bangers text-lg text-comic-ink">BACA PETUNJUK WARNA</p>
                <div className="flex flex-col gap-1.5 font-sans text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-comic-correct fill-comic-correct shrink-0" />
                    <span><strong>Hijau</strong> = Huruf & posisi BENAR!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="w-5 h-5 text-comic-present fill-comic-present shrink-0" />
                    <span><strong>Kuning</strong> = Huruf ada, posisi SALAH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-comic-absent shrink-0" />
                    <span><strong>Abu</strong> = Huruf tidak ada</span>
                  </div>
                </div>
              </div>

              <div className="bg-white comic-border p-5 rounded-xl comic-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-comic-bayangan comic-border-sm rounded-full flex items-center justify-center font-bangers text-xl text-white comic-shadow-sm">3</div>
                <p className="font-bangers text-lg text-comic-ink">MINTA BANTUAN</p>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Setelah 2x gagal, minta bantuan! Pilih petunjuk jujur <strong>Kapten Klu</strong> atau tantang dirimu dengan trik <strong>Bayangan</strong>. Butuh <strong>Tinta</strong> untuk membuka petunjuk.
                </p>
              </div>
            </div>

            {/* Color Guide visual boxes */}
            <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
              <p className="font-bangers text-base sm:text-lg text-comic-ink mb-3">CONTOH TEBAKAN:</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1.5 items-center">
                  {["K","O","M","I","K"].map((l, i) => (
                    <div key={i} className={`w-10 h-10 sm:w-12 sm:h-12 comic-border rounded flex items-center justify-center font-bangers text-xl sm:text-2xl ${i === 0 ? "bg-comic-correct text-white" : i === 2 ? "bg-comic-present text-comic-ink" : "bg-comic-absent text-white"}`}>
                      {l}
                    </div>
                  ))}
                  <span className="font-sans text-xs text-gray-600 ml-2">K hijau = benar! O abu = tidak ada. M kuning = ada tapi salah posisi.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FITUR UNGGULAN ===== */}
        <section className="bg-white border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-yellow text-comic-ink font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                ⭐ FITUR SERU
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { icon: <Gamepad2 className="w-6 h-6" />, bg: "bg-comic-yellow", text: "text-comic-ink", label: "Tebak Harian", sub: "1 kata tiap hari" },
                { icon: <Volume2 className="w-6 h-6" />, bg: "bg-comic-klu", text: "text-white", label: "Mode Dengar", sub: "Petunjuk audio suara" },
                { icon: <BookOpen className="w-6 h-6" />, bg: "bg-comic-yellow", text: "text-comic-ink", label: "Chapters", sub: "Unlock komik cerita" },
                { icon: <Swords className="w-6 h-6" />, bg: "bg-comic-bayangan", text: "text-white", label: "Mode Duel", sub: "Tantang temanmu" },
                { icon: <Trophy className="w-6 h-6" />, bg: "bg-comic-klu", text: "text-white", label: "Leaderboard", sub: "Persaingan harian" },
                { icon: <Sparkles className="w-6 h-6" />, bg: "bg-emerald-500", text: "text-white", label: "Usul Kata", sub: "Kontribusi komunitas" },
              ].map((f, i) => (
                <div key={i} className="comic-box p-3 sm:p-4 flex flex-col items-center text-center gap-2 hover:bg-yellow-50 transition-colors cursor-default">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${f.bg} comic-border flex items-center justify-center ${f.text} comic-shadow-sm`}>
                    {f.icon}
                  </div>
                  <span className="font-bangers text-sm sm:text-base text-comic-ink leading-tight">{f.label}</span>
                  <span className="text-[10px] sm:text-xs font-sans text-gray-600">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KENAPA DAFTAR AKUN ===== */}
        <section className="bg-comic-paper border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-klu text-white font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                🎁 KENAPA HARUS DAFTAR?
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />, title: "Streak Tersimpan Permanen", desc: "Progress login tiap hari kamu tersimpan ke akun. Jangan sampai streak-mu putus!" },
                { icon: <Droplet className="w-5 h-5 text-comic-klu fill-comic-klu" />, title: "+100 Tinta Bonus Daftar", desc: "Langsung dapat 100 Tinta gratis saat daftar untuk membuka petunjuk-petunjuk seru!" },
                { icon: <Trophy className="w-5 h-5 text-comic-yellow fill-comic-yellow" />, title: "Masuk Papan Peringkat", desc: "Bersaing dengan pemain lain di Leaderboard harian, mingguan, & sepanjang masa!" },
                { icon: <Swords className="w-5 h-5 text-comic-bayangan" />, title: "Mode Duel Asinkron", desc: "Tantang teman main kata yang sama & bandingkan hasilnya dalam 2 panel komik seru!" },
              ].map((item, i) => (
                <div key={i} className="bg-white comic-border p-4 rounded-xl comic-shadow flex items-start gap-3">
                  <div className="w-9 h-9 bg-comic-yellow comic-border-sm rounded-full flex items-center justify-center comic-shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bangers text-base sm:text-lg text-comic-ink leading-tight">{item.title}</p>
                    <p className="font-sans text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Big CTA card */}
            <div className="bg-comic-klu comic-border p-6 rounded-2xl comic-shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-halftone-klu opacity-10 pointer-events-none" />
              <div className="flex flex-col gap-1 text-white z-10 text-center sm:text-left">
                <p className="font-bangers text-2xl sm:text-3xl">Siap bergabung?</p>
                <p className="font-sans text-xs sm:text-sm text-blue-100">Gratis selamanya · Daftar dalam 30 detik</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
                <Link href="/auth/login" className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink py-3 px-6">
                  <UserPlus className="w-5 h-5" /> DAFTAR GRATIS
                </Link>
                <button onClick={() => signIn("google", { callbackUrl: "/play" })} className="comic-btn text-sm bg-white hover:bg-gray-100 text-comic-ink py-3 px-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                  </svg>
                  GOOGLE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="bg-white border-b-4 border-comic-ink">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-comic-bayangan text-white font-bangers text-lg sm:text-xl px-4 py-1.5 rounded comic-border-sm">
                ❓ PERTANYAAN UMUM
              </div>
              <div className="flex-1 h-1 bg-comic-ink rounded-full" />
            </div>

            <div className="flex flex-col gap-3">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`comic-border rounded-xl overflow-hidden transition-all ${isOpen ? "comic-shadow" : "shadow-none"}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className={`w-full px-4 py-4 flex items-start justify-between gap-3 text-left transition-colors ${isOpen ? "bg-amber-50" : "bg-white hover:bg-gray-50"}`}
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
