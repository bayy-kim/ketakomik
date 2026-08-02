"use client";

import { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch("/api/admin/announcements");
        const data = await res.json();
        if (data.announcements && data.announcements.length > 0) {
          const active = data.announcements.find((a: { isActive: boolean }) => a.isActive);
          if (active) setAnnouncement(active.message);
        }
      } catch {
        // Silently fallback if no announcement
      }
    }
    fetchBanner();
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <div className="w-full bg-comic-yellow comic-border-sm py-2 px-3 flex items-center justify-between shadow-[2px_2px_0_#16161A]">
      <div className="flex items-center gap-2 max-w-4xl mx-auto text-xs sm:text-sm font-bangers text-comic-ink tracking-wide">
        <Megaphone className="w-4 h-4 text-comic-ink shrink-0 animate-bounce" />
        <span>{announcement}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-yellow-400 rounded comic-border-sm text-comic-ink shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
