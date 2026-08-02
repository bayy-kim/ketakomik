import Link from "next/link";
import { BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink">ADMIN DASHBOARD TEKAKOMIK</h1>
        <p className="text-xs sm:text-sm font-sans text-gray-700 mt-1">
          Kelola tebak kata harian, story chapter, analitik game, usulan komunitas, dan pengumuman.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/words" className="comic-box p-4 flex flex-col gap-2 hover:bg-yellow-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">KELOLA KATA</span>
            <BookOpen className="w-6 h-6 text-comic-klu" />
          </div>
          <p className="text-xs font-sans text-gray-600">Tambah kata baru, atur jadwal, clue Kapten Klu & Bayangan.</p>
        </Link>

        <Link href="/admin/chapters" className="comic-box p-4 flex flex-col gap-2 hover:bg-pink-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">CHAPTER STORY</span>
            <Layers className="w-6 h-6 text-comic-bayangan" />
          </div>
          <p className="text-xs font-sans text-gray-600">Unggah komik unlock via Vercel Blob, atur minggu rilis.</p>
        </Link>

        <Link href="/admin/analytics" className="comic-box p-4 flex flex-col gap-2 hover:bg-green-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">ANALITIK & RECHARTS</span>
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">DAU/WAU, tingkat kemenangan, auto-flag kata terlalu mudah/sulit.</p>
        </Link>

        <Link href="/admin/suggestions" className="comic-box p-4 flex flex-col gap-2 hover:bg-amber-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">MODERASI USULAN</span>
            <MessageSquarePlus className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Setujui atau tolak usulan kata dari komunitas.</p>
        </Link>

        <Link href="/admin/announcements" className="comic-box p-4 flex flex-col gap-2 hover:bg-purple-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">PENGUMUMAN</span>
            <Megaphone className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Atur banner berita/event aktif di bagian atas aplikasi.</p>
        </Link>

        <Link href="/admin/flags" className="comic-box p-4 flex flex-col gap-2 hover:bg-red-50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bangers text-xl text-comic-ink">FEATURE FLAGS</span>
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-xs font-sans text-gray-600">Toggle mode duel, hardcore voice, maintenance mode.</p>
        </Link>
      </div>
    </div>
  );
}
