import Link from "next/link";
import { ShieldAlert, BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-comic-paper">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b-4 md:border-b-0 md:border-r-4 border-comic-ink p-4 flex flex-col gap-4 shrink-0 shadow-[4px_0_0_#16161A]">
        <div className="bg-comic-yellow comic-border p-3 rounded-lg comic-shadow rotate-[-2deg]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-comic-ink" />
            <span className="font-bangers text-2xl text-comic-ink">ADMIN TEKAKOMIK</span>
          </div>
        </div>

        <nav className="flex flex-row md:flex-col flex-wrap gap-1.5 font-bangers text-base">
          <Link
            href="/dashboardadmin"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <Home className="w-4 h-4 text-comic-ink" /> Ringkasan & Form Cepat
          </Link>
          <Link
            href="/dashboardadmin/words"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <BookOpen className="w-4 h-4 text-comic-klu" /> Kelola Kata (Words)
          </Link>
          <Link
            href="/dashboardadmin/chapters"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <Layers className="w-4 h-4 text-comic-bayangan" /> Kelola Chapter
          </Link>
          <Link
            href="/dashboardadmin/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Analitik & Recharts
          </Link>
          <Link
            href="/dashboardadmin/suggestions"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-600" /> Usulan Komunitas
          </Link>
          <Link
            href="/dashboardadmin/announcements"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <Megaphone className="w-4 h-4 text-purple-600" /> Pengumuman
          </Link>
          <Link
            href="/dashboardadmin/flags"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm hover:bg-yellow-100 text-comic-ink"
          >
            <Flag className="w-4 h-4 text-red-600" /> Feature Flags
          </Link>

          <div className="h-0.5 bg-comic-ink my-2 hidden md:block" />

          <Link
            href="/play"
            className="flex items-center gap-2 px-3 py-2 rounded comic-border-sm bg-gray-100 hover:bg-gray-200 text-comic-ink mt-auto"
          >
            Kembali ke Game
          </Link>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
