"use client";

import { useState } from "react";
import { Volume2, Droplet, Eye, HelpCircle } from "lucide-react";

interface ClueDualPanelProps {
  wordId: string;
  tintaCount: number;
  onDeductTinta?: (amount: number) => void;
  isHardcoreVoice?: boolean;
}

export function ClueDualPanel({
  wordId,
  tintaCount,
  onDeductTinta,
  isHardcoreVoice = false,
}: ClueDualPanelProps) {
  const [clueKlu, setClueKlu] = useState<string | null>(null);
  const [clueBayangan, setClueBayangan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Web Speech fallback state
  const [showTextFallbackKlu, setShowTextFallbackKlu] = useState(false);
  const [showTextFallbackBayangan, setShowTextFallbackBayangan] = useState(false);

  const fetchClue = async (char: "klu" | "bayangan" | "both") => {
    const cost = char === "both" ? 15 : 10;
    if (tintaCount < cost) {
      setErrorMsg(`Tinta tidak cukup! Butuh ${cost} Tinta.`);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/game/clue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, character: char }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengambil petunjuk");
        return;
      }

      if (data.clueHonest) {
        setClueKlu(data.clueHonest);
        if (isHardcoreVoice) speakClue(data.clueHonest, "klu");
      }
      if (data.clueMisleading) {
        setClueBayangan(data.clueMisleading);
        if (isHardcoreVoice) speakClue(data.clueMisleading, "bayangan");
      }

      if (onDeductTinta) {
        onDeductTinta(data.tintaDeducted);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  const speakClue = (text: string, char: "klu" | "bayangan") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";

      if (char === "klu") {
        utterance.pitch = 1.1; // Steady superhero pitch
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 0.7; // Mischievous lower trickster pitch
        utterance.rate = 0.9;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 my-2">
      {/* Help Action Trigger */}
      {!clueKlu && !clueBayangan && (
        <div className="bg-amber-50 comic-border p-3.5 rounded-lg comic-shadow text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 font-bangers text-xl text-comic-ink">
            <HelpCircle className="w-5 h-5 text-comic-klu animate-bounce" /> BUTUH BANTUAN DETEKTIF?
          </div>
          <p className="text-xs sm:text-sm text-gray-700">
            Kapten Klu memberi petunjuk JUJUR, Bayangan memberi trik MENYESATKAN!
          </p>

          {errorMsg && <p className="text-xs font-bold text-red-600 bg-red-100 p-1 rounded border border-red-400">{errorMsg}</p>}

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            <button
              onClick={() => fetchClue("klu")}
              disabled={loading}
              className="comic-btn text-sm bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Droplet className="w-4 h-4 fill-white" /> Kapten Klu (10 Tinta)
            </button>
            <button
              onClick={() => fetchClue("bayangan")}
              disabled={loading}
              className="comic-btn text-sm bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Droplet className="w-4 h-4 fill-white" /> Bayangan (10 Tinta)
            </button>
            <button
              onClick={() => fetchClue("both")}
              disabled={loading}
              className="comic-btn text-sm bg-comic-yellow hover:bg-yellow-400 text-comic-ink"
            >
              <Droplet className="w-4 h-4 fill-comic-ink" /> Buka Dua-duanya (15 Tinta)
            </button>
          </div>
        </div>
      )}

      {/* Comic Speech Bubbles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kapten Klu Speech Bubble */}
        {clueKlu && (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 font-bangers text-lg text-comic-klu">
              <span className="w-3 h-3 rounded-full bg-comic-klu border border-comic-ink inline-block" />
              Kapten Klu (Jujur)
            </div>
            <div className="w-full bg-white comic-border p-3.5 rounded-lg comic-shadow-klu relative bubble-tail-left">
              {isHardcoreVoice && !showTextFallbackKlu ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="font-bangers text-lg text-comic-klu flex items-center gap-2">
                    <Volume2 className="w-5 h-5 animate-pulse" /> Memutar Suara...
                  </span>
                  <button
                    onClick={() => speakClue(clueKlu, "klu")}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-comic-klu border border-comic-klu px-2 py-1 rounded font-bold"
                  >
                    Putar Ulang Suara
                  </button>
                  {/* Web Speech API Fallback button for iOS Safari / audio issues */}
                  <button
                    onClick={() => setShowTextFallbackKlu(true)}
                    className="text-xs underline text-gray-600 hover:text-comic-ink mt-1 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Tampilkan sebagai Teks
                  </button>
                </div>
              ) : (
                <p className="text-sm text-comic-ink font-medium leading-relaxed font-sans">
                  &ldquo;{clueKlu}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bayangan Speech Bubble */}
        {clueBayangan && (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 font-bangers text-lg text-comic-bayangan">
              Bayangan (Menyesatkan/Trik)
              <span className="w-3 h-3 rounded-full bg-comic-bayangan border border-comic-ink inline-block" />
            </div>
            <div className="w-full bg-white comic-border p-3.5 rounded-lg comic-shadow-bayangan relative bubble-tail-right">
              {isHardcoreVoice && !showTextFallbackBayangan ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="font-bangers text-lg text-comic-bayangan flex items-center gap-2">
                    <Volume2 className="w-5 h-5 animate-pulse" /> Memutar Suara Nakal...
                  </span>
                  <button
                    onClick={() => speakClue(clueBayangan, "bayangan")}
                    className="text-xs bg-pink-100 hover:bg-pink-200 text-comic-bayangan border border-comic-bayangan px-2 py-1 rounded font-bold"
                  >
                    Putar Ulang Suara
                  </button>
                  <button
                    onClick={() => setShowTextFallbackBayangan(true)}
                    className="text-xs underline text-gray-600 hover:text-comic-ink mt-1 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Tampilkan sebagai Teks
                  </button>
                </div>
              ) : (
                <p className="text-sm text-comic-ink font-medium leading-relaxed font-sans">
                  &ldquo;{clueBayangan}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
