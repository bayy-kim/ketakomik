"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus } from "lucide-react";

interface AnnouncementItem {
  id: string;
  message: string;
  isActive: boolean;
  startAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), isActive }),
      });
      if (res.ok) {
        setMessage("");
        loadAnnouncements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">KELOLA PENGUMUMAN (BANNER)</h1>
        <p className="text-xs font-sans text-gray-700">
          Atur pengumuman/event aktif yang tampil di bagian paling atas aplikasi.
        </p>
      </div>

      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3 flex items-center gap-1.5">
          <Plus className="w-5 h-5 text-purple-600" /> BUAT PENGUMUMAN BARU
        </h2>

        <form onSubmit={handleAddAnnouncement} className="flex flex-col gap-3 text-xs font-sans">
          <div className="flex flex-col gap-1">
            <label className="font-bangers text-sm text-comic-ink">PESAN PENGUMUMAN:</label>
            <input
              type="text"
              required
              placeholder="🎉 Event Minggu Ini: Dapatkan 2x Tinta untuk setiap tebakan yang tepat!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activeCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="activeCheck" className="font-bangers text-sm text-comic-ink">
              Aktifkan Pengumuman Ini Sekarang
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn bg-comic-yellow text-comic-ink py-2.5 mt-1"
          >
            {loading ? "Menyimpan..." : "SIMPAN PENGUMUMAN"}
          </button>
        </form>
      </div>

      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        <h2 className="font-bangers text-xl text-comic-ink mb-3">PENGUMUMAN AKTIF / DRAFT</h2>
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="comic-border p-3.5 rounded-lg flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span className="font-sans text-sm text-comic-ink">{a.message}</span>
              </div>
              <span className={`font-bangers text-xs px-2 py-0.5 rounded comic-border-sm text-white ${a.isActive ? "bg-emerald-500" : "bg-gray-400"}`}>
                {a.isActive ? "AKTIF" : "NONAKTIF"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
