import Link from "next/link";
import { BookOpen, Swords, Trophy, Sparkles, ShieldAlert, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t-4 border-comic-ink mt-8 shadow-[0_-4px_0_#16161A]">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Top Tier: Logo, Description & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="bg-comic-yellow comic-border px-3 py-1 rounded rotate-[-2deg] comic-shadow-sm">
                <span className="font-bangers text-3xl text-comic-ink tracking-wider">TEKAKOMIK</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm font-sans text-gray-700 leading-relaxed max-w-md">
              Tekakonik adalah game tebak kata harian bergenre <strong>Modern Comic</strong>. Dampingi Kapten Klu memecahkan teka-teki kata jujur dan selidiki trik lucu yang dipasang oleh Bayangan!
            </p>
          </div>

          {/* Quick Icon Links */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              href="/"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-yellow-100 transition-colors comic-shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-comic-yellow comic-border-sm flex items-center justify-center font-bangers text-sm text-comic-ink">
                🎮
              </div>
              <span className="font-bangers text-sm text-comic-ink">Game Harian</span>
            </Link>

            <Link
              href="/chapter"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-yellow-100 transition-colors comic-shadow-sm"
            >
              <BookOpen className="w-5 h-5 text-comic-ink" />
              <span className="font-bangers text-sm text-comic-ink">Chapters</span>
            </Link>

            <Link
              href="/duel"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-pink-100 transition-colors comic-shadow-sm"
            >
              <Swords className="w-5 h-5 text-comic-bayangan" />
              <span className="font-bangers text-sm text-comic-bayangan">Duel Room</span>
            </Link>

            <Link
              href="/leaderboard"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors comic-shadow-sm"
            >
              <Trophy className="w-5 h-5 text-comic-klu" />
              <span className="font-bangers text-sm text-comic-klu">Leaderboard</span>
            </Link>

            <Link
              href="/usul"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-green-100 transition-colors comic-shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span className="font-bangers text-sm text-emerald-700">Usul Kata</span>
            </Link>

            <Link
              href="/about"
              className="bg-comic-paper comic-border p-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-100 transition-colors comic-shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-purple-500 comic-border-sm flex items-center justify-center font-bangers text-xs text-white">
                ℹ️
              </div>
              <span className="font-bangers text-sm text-purple-700">Tentang FAQ</span>
            </Link>
          </div>
        </div>

        <div className="w-full h-0.5 bg-comic-ink opacity-20" />

        {/* Bottom Tier: Copyright & Character Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-gray-600">
          <div className="flex items-center gap-1.5">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk Komunitas Komik & Tebak Kata Indonesia</span>
          </div>

          <div className="flex items-center gap-2 font-bangers text-sm">
            <span className="text-comic-klu bg-blue-50 px-2 py-0.5 rounded border border-comic-klu">
              🦸‍♂️ KAPTEN KLU
            </span>
            <span>VS</span>
            <span className="text-comic-bayangan bg-pink-50 px-2 py-0.5 rounded border border-comic-bayangan">
              🦹‍♀️ BAYANGAN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
