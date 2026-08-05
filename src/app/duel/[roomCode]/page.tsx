"use client";

import { use, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Swords, Trophy, Clock, Share2, Play, Flame, BarChart3, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DuelData {
  roomCode: string;
  wordId: string;
  wordLength: number;
  category: string;
  difficulty: string;
  creatorSessionId: string;
  opponentSessionId: string | null;
  status: string;
  creatorName: string;
  creatorAvatar: string;
  opponentName: string;
  opponentAvatar: string;
  creatorSession?: {
    attemptsUsed: number;
    durationSeconds: number;
    won: boolean;
    guesses: string[];
    score: number;
  } | null;
  opponentSession?: {
    attemptsUsed: number;
    durationSeconds: number;
    won: boolean;
    guesses: string[];
    score: number;
  } | null;
}

export default function DuelRoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [duel, setDuel] = useState<DuelData | null>(null);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadDuelRoom = async () => {
    try {
      const res = await fetch(`/api/duel/${roomCode}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data duel room");
      }
      const data = await res.json();
      setDuel(data);
    } catch (e) {
      console.error("Gagal memuat room duel:", e);
      setErrorMsg("Gagal memuat detail duel room. Silakan muat ulang halaman.");
    }
  };

  useEffect(() => {
    loadDuelRoom();
    
    // Polling data duel secara live setiap 5 detik agar updates interaktif
    const interval = setInterval(loadDuelRoom, 5000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link Duel berhasil disalin ke clipboard! Kirim ke temanmu!");
  };

  const handleJoinRoom = async () => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/duel/${roomCode}`);
      return;
    }

    if (!session?.user?.id) return;

    setLoadingJoin(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/duel/${roomCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal bergabung ke room duel");
        return;
      }

      await loadDuelRoom();
    } catch (e) {
      console.error(e);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoadingJoin(false);
    }
  };

  if (errorMsg && !duel) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white comic-border p-6 rounded-2xl comic-shadow text-center max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="font-bangers text-2xl text-comic-ink mb-2">TERJADI KESALAHAN</h2>
            <p className="text-sm font-sans text-gray-700 mb-4">{errorMsg}</p>
            <Link href="/duel" className="comic-btn bg-comic-yellow text-comic-ink text-sm">
              KEMBALI KE MENU DUEL
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!duel) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
        <Header />
        <main className="flex-1 flex items-center justify-center font-bangers text-2xl text-comic-ink animate-pulse">
          MEMUAT ARENA DUEL KOMIK...
        </main>
      </div>
    );
  }

  const currentUserId = session?.user?.id;
  const isCreator = duel.creatorSessionId === currentUserId;
  const isOpponent = duel.opponentSessionId === currentUserId;
  const isParticipant = isCreator || isOpponent;

  const showPlayButton = isParticipant && (
    (isCreator && !duel.creatorSession) || 
    (isOpponent && !duel.opponentSession)
  );

  const canJoin = !duel.opponentSessionId && !isCreator && authStatus !== "loading";

  // Hitung pemenang jika kedua belah pihak sudah menyelesaikan permainan
  let winnerText = "";
  let winnerColor = "text-comic-ink";
  if (duel.creatorSession && duel.opponentSession) {
    const creatorScore = duel.creatorSession.score;
    const opponentScore = duel.opponentSession.score;

    if (creatorScore > opponentScore) {
      winnerText = `🏆 PEMENANG: ${duel.creatorName}!`;
      winnerColor = "text-comic-klu";
    } else if (opponentScore > creatorScore) {
      winnerText = `🏆 PEMENANG: ${duel.opponentName}!`;
      winnerColor = "text-comic-bayangan";
    } else {
      winnerText = "🤝 HASIL SERI / DRAW!";
      winnerColor = "text-emerald-600";
    }
  }

  // Tampilkan Avatar Url jika ada kustomisasi foto profil
  const renderAvatar = (avatarUrl: string | null, fallbackEmoji: string, label: string) => {
    if (avatarUrl) {
      return (
        <div className="w-14 h-14 rounded-full overflow-hidden comic-border comic-shadow relative shrink-0">
          <img src={avatarUrl} alt={label} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-full bg-blue-100 comic-border flex items-center justify-center font-bangers text-xl comic-shadow text-comic-klu select-none shrink-0">
        {fallbackEmoji}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-6 flex flex-col gap-6">
        {/* Banner Arena Duel */}
        <div className="bg-comic-bayangan comic-border p-4 rounded-xl comic-shadow text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 rotate-[-1deg]">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-white shrink-0" />
            <div>
              <span className="font-bangers text-xs bg-white text-comic-bayangan px-2 py-0.5 rounded comic-border-sm">
                ROOM: {duel.roomCode}
              </span>
              <h1 className="font-bangers text-3xl sm:text-4xl">ARENA PERTANDINGAN KOMIK</h1>
            </div>
          </div>

          <button onClick={copyShareLink} className="comic-btn text-xs bg-white text-comic-ink hover:bg-gray-100 self-start sm:self-center">
            <Share2 className="w-4 h-4" /> Bagikan Kode / Link
          </button>
        </div>

        {/* Status Pemenang / Duel Result */}
        {winnerText && (
          <div className="bg-white comic-border p-4 rounded-xl comic-shadow text-center animate-bounce">
            <h2 className={`font-bangers text-2xl sm:text-3xl ${winnerColor}`}>{winnerText}</h2>
            <p className="text-xs font-sans text-gray-700 mt-1">
              {duel.creatorName} ({duel.creatorSession?.score || 0} Poin) vs {duel.opponentName} ({duel.opponentSession?.score || 0} Poin)
            </p>
          </div>
        )}

        {/* Duel Mode Status Alert */}
        {canJoin && (
          <div className="bg-amber-50 comic-border p-5 rounded-xl comic-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h3 className="font-bangers text-xl text-comic-ink">ANDA DIUNDANG DUEL!</h3>
              <p className="text-xs font-sans text-gray-700 mt-0.5">
                Bergabunglah untuk membuktikan kemampuan detektif kata Anda menghadapi {duel.creatorName}.
              </p>
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={loadingJoin}
              className="comic-btn text-sm bg-comic-klu text-white hover:bg-blue-600 font-bangers w-full sm:w-auto px-6 py-2.5"
            >
              {loadingJoin ? "Bergabung..." : "TERIMA TANTANGAN"}
            </button>
          </div>
        )}

        {errorMsg && <div className="bg-red-100 comic-border-sm p-3 rounded text-xs font-bold text-red-600">{errorMsg}</div>}

        {/* 2-PANEL COMIC SIDE-BY-SIDE COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel Pembuat Duel (Kiri - Kapten Klu Style) */}
          <div className="bg-white comic-border p-5 rounded-2xl comic-shadow-klu flex flex-col items-center gap-3 relative">
            <div className="bg-comic-klu text-white comic-border px-3 py-1 rounded font-bangers text-lg rotate-[-2deg]">
              PANEL 1: PEMBUAT TANTANGAN
            </div>

            {renderAvatar(duel.creatorAvatar.startsWith("http") ? duel.creatorAvatar : null, "🦸‍♂️", duel.creatorName)}

            <h3 className="font-bangers text-2xl text-comic-ink">{duel.creatorName}</h3>

            {duel.creatorSession ? (
              <div className="w-full bg-blue-50 comic-border p-3.5 rounded-lg flex flex-col gap-2.5 text-sm font-sans">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-bold">Status:</span>
                  <span className={`font-bangers text-lg ${duel.creatorSession.won ? "text-emerald-600" : "text-red-600"}`}>
                    {duel.creatorSession.won ? "MENANG" : "GAGAL"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Skor Komik:</span>
                  <span className="font-bangers text-base text-comic-klu">{duel.creatorSession.score} Poin</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Percobaan:</span>
                  <span className="font-bangers text-base">{duel.creatorSession.attemptsUsed} / 6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu:
                  </span>
                  <span className="font-bangers text-base">{duel.creatorSession.durationSeconds} Detik</span>
                </div>
                <div className="mt-2 border-t border-blue-200 pt-2">
                  <span className="text-xs font-bold block mb-1">Riwayat Tebakan:</span>
                  <div className="flex flex-col gap-1 font-mono text-xs">
                    {duel.creatorSession.guesses.map((g, idx) => (
                      <div key={idx} className="bg-white px-2 py-0.5 rounded border border-blue-100 flex justify-between">
                        <span>{idx + 1}. {g}</span>
                        <span className="text-[10px] text-gray-500 font-sans">Selesai</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-gray-100 comic-border p-6 rounded-lg text-center text-gray-500 font-sans text-xs italic">
                Belum menyelesaikan permainan.
              </div>
            )}
          </div>

          {/* Panel Lawan Duel (Kanan - Bayangan Style) */}
          <div className="bg-white comic-border p-5 rounded-2xl comic-shadow-bayangan flex flex-col items-center gap-3 relative">
            <div className="bg-comic-bayangan text-white comic-border px-3 py-1 rounded font-bangers text-lg rotate-[2deg]">
              PANEL 2: LAWAN TANTANGAN
            </div>

            {renderAvatar(duel.opponentAvatar && duel.opponentAvatar.startsWith("http") ? duel.opponentAvatar : null, "🦹‍♀️", duel.opponentName)}

            <h3 className="font-bangers text-2xl text-comic-ink">{duel.opponentName}</h3>

            {duel.opponentSessionId ? (
              duel.opponentSession ? (
                <div className="w-full bg-pink-50 comic-border p-3.5 rounded-lg flex flex-col gap-2.5 text-sm font-sans">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 font-bold">Status:</span>
                    <span className={`font-bangers text-lg ${duel.opponentSession.won ? "text-emerald-600" : "text-red-600"}`}>
                      {duel.opponentSession.won ? "MENANG" : "GAGAL"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Skor Komik:</span>
                    <span className="font-bangers text-base text-comic-bayangan">{duel.opponentSession.score} Poin</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Percobaan:</span>
                    <span className="font-bangers text-base">{duel.opponentSession.attemptsUsed} / 6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Waktu:
                    </span>
                    <span className="font-bangers text-base">{duel.opponentSession.durationSeconds} Detik</span>
                  </div>
                  <div className="mt-2 border-t border-pink-200 pt-2">
                    <span className="text-xs font-bold block mb-1">Riwayat Tebakan:</span>
                    <div className="flex flex-col gap-1 font-mono text-xs">
                      {duel.opponentSession.guesses.map((g, idx) => (
                        <div key={idx} className="bg-white px-2 py-0.5 rounded border border-pink-100 flex justify-between">
                          <span>{idx + 1}. {g}</span>
                          <span className="text-[10px] text-gray-500 font-sans">Selesai</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gray-100 comic-border p-6 rounded-lg text-center text-gray-500 font-sans text-xs italic">
                  Sudah bergabung. Belum menyelesaikan permainan.
                </div>
              )
            ) : (
              <div className="w-full bg-gray-50 comic-border p-6 rounded-lg text-center text-gray-500 font-sans text-xs">
                Menunggu penantang bergabung...
              </div>
            )}
          </div>
        </div>

        {/* Play Button Action */}
        {showPlayButton && (
          <div className="flex justify-center mt-4">
            <Link
              href={`/play?duel=${duel.roomCode}`}
              className="comic-btn text-base sm:text-lg bg-comic-yellow hover:bg-yellow-400 text-comic-ink px-8 py-3.5 flex items-center gap-2 animate-pulse"
            >
              <Play className="w-5 h-5" /> MULAI GAME DUEL SEKARANG!
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
