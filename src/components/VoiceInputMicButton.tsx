"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { ComicModal } from "./ComicModal";

interface VoiceInputMicButtonProps {
  wordLength: number;
  onVoiceResult: (text: string) => void;
}

export function VoiceInputMicButton({ wordLength, onVoiceResult }: VoiceInputMicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "id-ID";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setErrorMsg("Izin akses mikrofon ditolak oleh browser Anda. Silakan aktifkan izin mikrofon di setelan browser untuk menggunakan fitur tebak suara ini!");
            setShowErrorModal(true);
          } else if (event.error === "no-speech") {
            setErrorMsg("Tidak ada suara yang terdeteksi. Silakan coba lagi dan ucapkan kata tebakan Anda secara jelas!");
            setShowErrorModal(true);
          } else {
            setErrorMsg("Terjadi gangguan koneksi atau perekam suara. Silakan coba kembali.");
            setShowErrorModal(true);
          }
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            const cleanText = transcript
              .replace(/\s+/g, "")
              .trim()
              .toUpperCase();
            onVoiceResult(cleanText);
          }
        };

        setRecognition(rec);
      }
    }
  }, [wordLength, onVoiceResult]);

  const toggleListen = () => {
    if (!recognition) {
      setErrorMsg("🎙️ Web Speech API / Input suara menggunakan Mic tidak didukung di browser ini. Silakan gunakan browser Google Chrome untuk pengalaman terbaik!");
      setShowErrorModal(true);
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      // Check browser permissions beforehand if API is supported
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
          if (result.state === "denied") {
            setErrorMsg("Izin akses mikrofon ditolak! Silakan buka gembok izin setelan alamat di bar browser Anda untuk mengizinkan perekaman suara.");
            setShowErrorModal(true);
          } else {
            try {
              recognition.start();
            } catch (e) {
              console.error(e);
            }
          }
        }).catch(() => {
          // Fallback if query permissions fails on some browsers
          try {
            recognition.start();
          } catch (e) {
            console.error(e);
          }
        });
      } else {
        try {
          recognition.start();
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Comic Modal for Error Notifications */}
      <ComicModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="MASALAH MIKROFON / SUARA"
        type="warning"
        message={errorMsg}
      />

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
