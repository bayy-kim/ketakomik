import Link from "next/link";
import { ShieldAlert, BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag, Home, Play } from "lucide-react";
import { AdminBottomBar } from "@/components/AdminBottomBar";

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
            href="/dashboardadmin/users"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" /> Manajemen Pengguna
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

      {/* 2. DEDICATED ADMIN BOTTOM NAV BAR FOR MOBILE */}
      <AdminBottomBar />

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-full">{children}</main>
    </div>
  );
}
