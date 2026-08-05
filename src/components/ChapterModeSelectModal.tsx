"use client";

import { X, Gamepad2, Volume2, Mic, Clock } from "lucide-react";

interface ChapterModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordId: string;
  wordIndex: number;
  category: string;
  difficulty: string;
  onSelectMode: (mode: "NORMAL" | "HARDCORE_VOICE") => void;
}

export function ChapterModeSelectModal({
  isOpen,
  onClose,
  wordIndex,
  category,
  difficulty,
  onSelectMode,
}: ChapterModeSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-comic-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white comic-border rounded-xl comic-shadow-lg max-w-md w-full p-5 flex flex-col gap-4 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 comic-border-sm text-comic-ink"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-comic-yellow comic-border p-3 rounded-lg comic-shadow-sm flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-comic-ink shrink-0" />
          <h3 className="font-bangers text-xl tracking-wide text-comic-ink">PILIH MODE BERMAIN</h3>
        </div>

        {/* Word Info Info */}
        <div className="bg-gray-50 comic-border-sm p-3 rounded-lg flex flex-col gap-1 font-sans text-xs">
          <div>
            <strong className="text-comic-ink">SOAL TARGET:</strong> Kata #{wordIndex} ({category})
          </div>
          <div>
            <strong className="text-comic-ink">KESULITAN:</strong>{" "}
            <span className="font-bold text-comic-klu">{difficulty}</span>
          </div>
        </div>

        <p className="font-sans text-xs text-gray-700 leading-relaxed text-center">
          Pilih tingkat tantangan detektif komik Anda untuk memecahkan teka-teki kata ini!
        </p>

        {/* Mode Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Normal Mode Button */}
          <button
            onClick={() => onSelectMode("NORMAL")}
            className="comic-box p-3.5 flex flex-col sm:flex-row items-center gap-3 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-comic-klu comic-border flex items-center justify-center text-white shrink-0 shadow-sm">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bangers text-lg text-comic-klu leading-none">MODE NORMAL</h4>
              <p className="text-[10px] font-sans text-gray-600 mt-1">
                Tebak kata dengan input virtual/physical keyboard secara rileks tanpa batasan waktu pengerjaan.
              </p>
            </div>
          </button>

          {/* Hardcore Voice Mode Button */}
          <button
            onClick={() => onSelectMode("HARDCORE_VOICE")}
            className="comic-box p-3.5 flex flex-col sm:flex-row items-center gap-3 bg-pink-50 hover:bg-pink-100 transition-colors text-left border-comic-bayangan"
          >
            <div className="w-10 h-10 rounded-full bg-comic-bayangan comic-border flex items-center justify-center text-white shrink-0 shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bangers text-lg text-comic-bayangan leading-none flex items-center justify-center sm:justify-start gap-1">
                MODE DENGAR & MIC <span className="bg-red-500 text-white text-[9px] px-1 rounded">HARDCORE</span>
              </h4>
              <p className="text-[10px] font-sans text-gray-600 mt-1">
                <span className="text-red-500 font-bold flex items-center gap-0.5 justify-center sm:justify-start">
                  <Clock className="w-3 h-3" /> Waktu limit 120 detik!
                </span>{" "}
                Dengarkan petunjuk audio dan sebutkan tebakanmu memakai input suara Microphone!
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
