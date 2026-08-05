"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X, Sparkles, Trophy, ShieldAlert, BadgeCheck } from "lucide-react";

interface AchievementItem {
  id: string;
  title: string;
  category: string;
  target: number;
  rewardTinta: number;
  iconEmoji: string;
  description: string;
  funnyCertificateText: string;
}

interface AchievementCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: AchievementItem | null;
  username: string;
}

export function AchievementCertificateModal({
  isOpen,
  onClose,
  achievement,
  username,
}: AchievementCertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !achievement) return null;

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(certRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `sertifikat-tekakomik-${achievement.title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh sertifikat:", err);
      alert("Gagal mengunduh sertifikat gambar!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-comic-ink/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white comic-border rounded-xl comic-shadow-lg max-w-xl w-full p-4 sm:p-5 flex flex-col gap-4 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 comic-border-sm text-comic-ink z-10 bg-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="bg-comic-yellow comic-border p-2.5 rounded-lg comic-shadow-sm flex items-center gap-2">
          <Trophy className="w-5 h-5 text-comic-ink shrink-0 fill-comic-ink" />
          <h3 className="font-bangers text-lg sm:text-xl tracking-wide text-comic-ink">SERTIFIKAT PENCAPAIAN DETEKTIF</h3>
        </div>

        {/* CERTIFICATE PREVIEW PANEL (html-to-image target) */}
        <div className="w-full overflow-x-auto p-1 bg-gray-100 rounded-lg">
          <div
            ref={certRef}
            className="w-[500px] h-[350px] bg-[#FAF7F0] border-4 border-double border-[#16161A] p-6 flex flex-col items-center justify-between text-center relative shrink-0 select-none overflow-hidden"
          >
            {/* Halftone BG effect */}
            <div className="absolute inset-0 bg-halftone-dots opacity-[0.07] pointer-events-none" />

            {/* Comic Frame Lines */}
            <div className="absolute inset-2 border border-[#16161A]/20 pointer-events-none" />

            {/* Top Comic Badge */}
            <div className="bg-comic-klu text-white comic-border px-3 py-0.5 rounded text-[11px] font-bangers rotate-[-1deg] shadow-sm flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-white" /> TEKAKOMIK PENCAPAIAN RESMI
            </div>

            {/* Certificate Core Text */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="font-sans text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                DIBERIKAN KEPADA DETEKTIF HEBAT
              </span>
              <h2 className="font-bangers text-3xl text-comic-ink tracking-wide uppercase drop-shadow-sm">
                {username}
              </h2>
              <div className="w-24 h-0.5 bg-comic-ink mx-auto my-0.5" />
              <p className="font-sans text-[11px] text-gray-800 max-w-sm mx-auto leading-relaxed italic px-2">
                &ldquo;{achievement.funnyCertificateText}&rdquo;
              </p>
            </div>

            {/* Badge Icon and Title */}
            <div className="flex items-center gap-2 mt-1 z-10 bg-yellow-50 comic-border px-3 py-1.5 rounded-lg shadow-sm rotate-[1deg]">
              <span className="text-3xl">{achievement.iconEmoji}</span>
              <div className="text-left flex flex-col">
                <span className="font-bangers text-sm text-comic-ink leading-none">{achievement.title}</span>
                <span className="text-[9px] font-sans text-gray-600 font-bold mt-0.5">{achievement.description}</span>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="w-full flex justify-between items-end text-[9px] font-sans text-gray-500 mt-2">
              <span className="flex flex-col items-start leading-tight">
                <span>DIVERIFIKASI OLEH:</span>
                <strong className="text-comic-klu font-bangers text-[10px]">KAPTEN KLU 🦸‍♂️</strong>
              </span>
              <span className="font-bangers text-[10px] text-comic-ink">tekakomik.app</span>
              <span className="flex flex-col items-end leading-tight">
                <span>TANGGAL KLAIM:</span>
                <strong>{new Date().toLocaleDateString("id-ID")}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="comic-btn text-xs bg-gray-100 hover:bg-gray-200 text-comic-ink flex-1 py-2.5"
          >
            TUTUP
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink flex-1 py-2.5 flex items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" /> {downloading ? "Mengunduh..." : "UNDUH GAMBAR SERTIFIKAT"}
          </button>
        </div>
      </div>
    </div>
  );
}
