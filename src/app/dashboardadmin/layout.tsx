import Link from "next/link";
import { ShieldAlert, BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag, Home, Play } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-comic-paper pb-16 lg:pb-0">
      {/* 1. SIDEBAR (Shown ONLY on Desktop lg+) */}
      <aside className="hidden lg:flex w-64 bg-white border-r-4 border-comic-ink p-4 flex-col gap-4 shrink-0 shadow-[4px_0_0_#16161A]">
        <div className="bg-comic-yellow comic-border p-3 rounded-lg comic-shadow rotate-[-2deg]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-comic-ink" />
            <span className="font-bangers text-2xl text-comic-ink tracking-wide">ADMIN HUB</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 font-bangers text-base">
          <Link
            href="/dashboardadmin"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <Home className="w-4 h-4 text-comic-ink" /> Ringkasan & Form Cepat
          </Link>
          <Link
            href="/dashboardadmin/words"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-comic-klu" /> Kelola Kata (Words)
          </Link>
          <Link
            href="/dashboardadmin/chapters"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <Layers className="w-4 h-4 text-comic-bayangan" /> Kelola Chapter
          </Link>
          <Link
            href="/dashboardadmin/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Analitik & Recharts
          </Link>
          <Link
            href="/dashboardadmin/suggestions"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-600" /> Usulan Komunitas
          </Link>
          <Link
            href="/dashboardadmin/announcements"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <Megaphone className="w-4 h-4 text-purple-600" /> Pengumuman
          </Link>
          <Link
            href="/dashboardadmin/flags"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <Flag className="w-4 h-4 text-red-600" /> Feature Flags
          </Link>

          <div className="h-0.5 bg-comic-ink my-2" />

          <Link
            href="/play"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm bg-gray-100 hover:bg-gray-200 text-comic-ink mt-auto shadow-sm"
          >
            <Play className="w-4 h-4 text-comic-ink" /> Kembali ke Game
          </Link>
        </nav>
      </aside>

      {/* 2. BOTTOM NAV BAR (Shown ONLY on Mobile/Tablet < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-comic-ink shadow-[0_-4px_0_#16161A] px-2 py-2 flex items-center justify-around">
        <Link
          href="/dashboardadmin"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-comic-ink py-1 flex-1"
          title="Dashboard Ringkasan"
        >
          <Home className="w-5 h-5 text-comic-ink" />
          <span>RINGKASAN</span>
        </Link>
        <Link
          href="/dashboardadmin/words"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-comic-klu py-1 flex-1"
          title="Kelola Kata"
        >
          <BookOpen className="w-5 h-5" />
          <span>WORDS</span>
        </Link>
        <Link
          href="/dashboardadmin/chapters"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-comic-bayangan py-1 flex-1"
          title="Chapters"
        >
          <Layers className="w-5 h-5" />
          <span>CHAPTERS</span>
        </Link>
        <Link
          href="/dashboardadmin/analytics"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-emerald-700 py-1 flex-1"
          title="Analytics"
        >
          <BarChart3 className="w-5 h-5" />
          <span>ANALYTICS</span>
        </Link>
        <Link
          href="/dashboardadmin/suggestions"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-amber-700 py-1 flex-1"
          title="Suggestions"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>USULAN</span>
        </Link>
        <Link
          href="/play"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bangers text-red-600 py-1 flex-1"
          title="Kembali ke Game"
        >
          <Play className="w-5 h-5" />
          <span>KELUAR</span>
        </Link>
      </nav>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-full">{children}</main>
    </div>
  );
}
