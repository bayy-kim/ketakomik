"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Gift, Timer } from "lucide-react";
import { ComicModal } from "./ComicModal";

interface ComicDailyClaimModalProps {
  isLoggedIn: boolean;
}

export function ComicDailyClaimModal({ isLoggedIn }: ComicDailyClaimModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [claimedTinta, setClaimedTinta] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Klien memanggil API untuk mencoba klaim tinta otomatis
    async function triggerDailyClaim() {
      try {
        const res = await fetch("/api/user/daily-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setClaimedTinta(data.tintaEarned);
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Gagal melakukan auto-claim tinta harian:", e);
      }
    }

    // Delay sedikit agar transisi loading game selesai
    const timer = setTimeout(triggerDailyClaim, 1500);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <ComicModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="BONUS HARIAN DETEKTIF!"
      type="success"
      message={`🎉 Selamat datang kembali, Detektif! Kamu mendapatkan +${claimedTinta || 70} Tinta Harian gratis untuk membantumu memecahkan teka-teki Kapten Klu hari ini!`}
    />
  );
}
