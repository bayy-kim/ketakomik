"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface VoiceInputMicButtonProps {
  wordLength: number;
  onVoiceResult: (text: string) => void;
}

export function VoiceInputMicButton({ wordLength, onVoiceResult }: VoiceInputMicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "id-ID"; // Set to Indonesian

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            // Bersihkan teks, hilangkan spasi, ubah ke uppercase
            const cleanText = transcript
              .replace(/\s+/g, "")
              .trim()
              .toUpperCase();
            
            // Kirim hasil suara jika panjang kata sesuai
            onVoiceResult(cleanText);
          }
        };

        setRecognition(rec);
      }
    }
  }, [wordLength, onVoiceResult]);

  const toggleListen = () => {
    if (!recognition) {
      alert("🎙️ Web Speech API / Perekam suara tidak didukung di browser ini. Silakan gunakan Google Chrome!");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={toggleListen}
        type="button"
        className={`comic-btn w-full py-3.5 flex items-center justify-center gap-2 font-bangers text-lg text-white transition-all active:scale-95 ${
          isListening 
            ? "bg-red-500 animate-pulse border-red-700 hover:bg-red-600" 
            : "bg-comic-bayangan hover:bg-pink-600 border-comic-ink"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5 animate-spin" />
            <span>SEDANG MENDENGAR... SUARAKAN ({wordLength} HURUF)</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>TEBAK PAKAI MIC (INPUT SUARA)</span>
          </>
        )}
      </button>
      {isListening && (
        <span className="text-[10px] font-sans text-gray-500 italic animate-pulse">
          Sebutkan kata secara jelas, cth: &ldquo;K-O-M-I-K&rdquo; atau langsung ucapkan &ldquo;KOMIK&rdquo;.
        </span>
      )}
    </div>
  );
}
