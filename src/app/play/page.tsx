"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { ClueDualPanel } from "@/components/ClueDualPanel";
import { ResultShareCard } from "@/components/ResultShareCard";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { LetterState } from "@/components/LetterBox";
import { getLocalGameState, saveLocalGameState } from "@/lib/storage";
import { CheckCircle2, Lock, ArrowRight, BookOpen, Clock, Swords, Timer } from "lucide-react";
import Link from "next/link";
import { ComicDailyClaimModal } from "@/components/ComicDailyClaimModal";
import { VoiceInputMicButton } from "@/components/VoiceInputMicButton";

function PlayGameContainer() {
  const searchParams = useSearchParams();
  const duelRoomCode = searchParams.get("duel");
  const queryMode = searchParams.get("mode");
  const queryWordId = searchParams.get("wordId");
  const { data: session } = useSession();

  const [wordId, setWordId] = useState<string>("");
  const [wordLength, setWordLength] = useState<number>(5);
  const [category, setCategory] = useState<string>("Misteri");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [noWordAvailable, setNoWordAvailable] = useState<boolean>(false);
  
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [isShaking, setIsShaking] = useState(false);
  
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [targetWord, setTargetWord] = useState<string>("");
  const [tintaEarned, setTintaEarned] = useState<number>(0);
  const [comicScore, setComicScore] = useState<number>(0);
  const [isAlreadyCompletedToday, setIsAlreadyCompletedToday] = useState<boolean>(false);
  
  const [tintaCount, setTintaCount] = useState<number>(50);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [mode, setMode] = useState<"NORMAL" | "HARDCORE_VOICE">("NORMAL");
  const [loading, setLoading] = useState(false);
  const [feedbackBurst, setFeedbackBurst] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // DUEL MODE & COUNTDOWN TIMER STATES
  const [isDuelMode, setIsDuelMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 120 Detik Countdown Timer
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Next Word in Chapter State
  const [nextWordInfo, setNextWordInfo] = useState<{ nextWordId: string; nextWordIndex: number; totalWords: number; chapterTitle: string } | null>(null);

  // 1 Chapter Per Day Limit & 06:00 AM Reset Timer State
  const [isChapterLimitReached, setIsChapterLimitReached] = useState(false);
  const [resetTimerText, setResetTimerText] = useState("");

  // Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0 && !isGameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setIsGameOver(true);
            setFeedbackBurst("WAKTU HABIS!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, isGameOver]);

  // Countdown Timer to 06:00 AM Reset Effect
  useEffect(() => {
    function updateResetTimer() {
      const now = new Date();
      const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
      if (now.getTime() >= nextReset.getTime()) {
        nextReset.setDate(nextReset.getDate() + 1);
      }
      const diffMs = nextReset.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setResetTimerText(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }

    updateResetTimer();
    const interval = setInterval(updateResetTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize word and local storage state
  useEffect(() => {
    async function syncAndInit() {
      const state = getLocalGameState();
      let activeTinta = state.tinta;
      let activeStreak = state.streak;

      // Sync tinta & streak real-time dari database untuk user login
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/user/profile");
          const data = await res.json();
          if (res.ok && data.tinta !== undefined) {
            activeTinta = data.tinta;
            activeStreak = data.streak;
            saveLocalGameState({ tinta: data.tinta, streak: data.streak });
          }

          // Cek batas 1 chapter per hari dari database
          const limitRes = await fetch("/api/game/chapter-limit");
          const limitData = await limitRes.json();
          if (limitData.limitReached) {
            setIsChapterLimitReached(true);
          }
        } catch (e) {
          console.error("Gagal sinkron status tinta play:", e);
        }
      }

      // Atur mode berdasarkan searchParam (?mode=HARDCORE_VOICE)
      let activeMode: "NORMAL" | "HARDCORE_VOICE" = "NORMAL";
      if (queryMode === "HARDCORE_VOICE" || state.mode === "HARDCORE_VOICE") {
        activeMode = "HARDCORE_VOICE";
      }

      setTintaCount(activeTinta);
      setStreakCount(activeStreak);
      setMode(activeMode);
      setStartTime(Date.now());

      // Jika hardcore voice mode, aktifkan countdown 120s secara otomatis sejak awal
      if (activeMode === "HARDCORE_VOICE") {
        setTimeLeft(120);
        setTimerActive(true);
      }

      try {
        if (duelRoomCode) {
          setIsDuelMode(true);
          // Fetch data dari room duel
          const res = await fetch(`/api/duel/${duelRoomCode}`);
          const data = await res.json();
          if (data.wordId) {
            setWordId(data.wordId);
            setWordLength(data.wordLength || 5);
            setCategory(data.category || "Duel");
            setDifficulty(data.difficulty || "MEDIUM");
            setTimeLeft(120);
            setTimerActive(true);
            return;
          }
        }

        // Jika ada queryParam wordId dari halaman Chapter
        if (queryWordId) {
          const res = await fetch(`/api/game/next-word?wordId=${queryWordId}`);
          const data = await res.json();
          setWordId(queryWordId);
          if (data.currentWordInfo) {
            setWordLength(data.currentWordInfo.length || 5);
            setCategory(data.currentWordInfo.category || "Chapter");
            setDifficulty(data.currentWordInfo.difficulty || "MEDIUM");
          }
          if (state.completedWordIds && state.completedWordIds.includes(queryWordId)) {
            const saved = state.guessesHistory[queryWordId];
            if (saved) {
              setGuesses(saved.guesses || []);
              setFeedbacks(saved.feedbacks || []);
              setIsWon(saved.won);
              setIsGameOver(true);
              setIsAlreadyCompletedToday(true);
              setComicScore(saved.score || 80);
            }
          }
          return;
        }

        // Mode Normal Harian (Jika tidak ada queryWordId & duelRoomCode)
        const res = await fetch("/api/game/today");
        const data = await res.json();
        if (res.ok && data.id) {
          setWordId(data.id);
          setWordLength(data.length || 5);
          setCategory(data.category || "Umum");
          setDifficulty(data.difficulty || "MEDIUM");

          // Lock today's word if already solved in local history
          if (state.completedWordIds && state.completedWordIds.includes(data.id)) {
            const saved = state.guessesHistory[data.id];
            if (saved) {
              setGuesses(saved.guesses || []);
              setFeedbacks(saved.feedbacks || []);
              setIsWon(saved.won);
              setIsGameOver(true);
              setIsAlreadyCompletedToday(true);
              setComicScore(saved.score || 80);
            }
          }
        } else {
          setNoWordAvailable(true);
        }
      } catch (e) {
        console.error("Gagal memuat kata:", e);
        setNoWordAvailable(true);
      }
    }

    syncAndInit();
  }, [duelRoomCode, queryWordId, session]);

  const handleChar = useCallback((char: string) => {
    if (isGameOver || loading || isAlreadyCompletedToday) return;
    if (!timerActive && isDuelMode) setTimerActive(true);

    setCurrentGuess((prev) => {
      if (prev.length < wordLength) {
        return prev + char.toUpperCase();
      }
      return prev;
    });
  }, [isGameOver, loading, isAlreadyCompletedToday, wordLength, timerActive, isDuelMode]);

  const handleDelete = useCallback(() => {
    if (isGameOver || loading || isAlreadyCompletedToday) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [isGameOver, loading, isAlreadyCompletedToday]);

  const handleEnter = useCallback(async () => {
    if (isGameOver || loading || isAlreadyCompletedToday) return;
    if (currentGuess.length !== wordLength) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setLoading(true);
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      const state = getLocalGameState();
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordId,
          guess: currentGuess,
          attemptNumber: guesses.length + 1,
          guessesHistory: guesses.map((g, idx) => ({ guess: g, feedback: feedbacks[idx] })),
          anonId: state.anonId,
          userId: session?.user?.id || null,
          mode,
          durationSeconds,
          roomCode: duelRoomCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackBurst("TIDAK VALID!");
        setTimeout(() => setFeedbackBurst(null), 1200);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      const newFeedbacks = [...feedbacks, data.feedback];

      setGuesses(newGuesses);
      setFeedbacks(newFeedbacks);
      setCurrentGuess("");

      if (data.isWon) {
        setFeedbackBurst("TEPAT!");
        setTimeout(() => setFeedbackBurst(null), 5000);
        setIsWon(true);
        setIsGameOver(true);
        setTimerActive(false);
        if (!isDuelMode) setIsAlreadyCompletedToday(true);
        setTintaEarned(data.tintaEarned || 30);
        setComicScore(data.score || 85);
        setTargetWord(data.targetWord || currentGuess);

        // Fetch next word info in the same chapter
        fetch(`/api/game/next-word?wordId=${wordId}`)
          .then((r) => r.json())
          .then((nextData) => {
            if (nextData.nextWordId) {
              setNextWordInfo(nextData);
            }
          })
          .catch((e) => console.error("Gagal cari kata selanjutnya:", e));

        const newTinta = tintaCount + (data.tintaEarned || 30);
        const newStreak = streakCount + 1;
        setTintaCount(newTinta);
        setStreakCount(newStreak);

        // Lock & save completed word state permanently
        const completedIds = Array.from(new Set([...(state.completedWordIds || []), wordId]));
        saveLocalGameState({
          tinta: newTinta,
          streak: newStreak,
          completedWordIds: completedIds,
          guessesHistory: {
            ...state.guessesHistory,
            [wordId]: {
              guesses: newGuesses,
              feedbacks: newFeedbacks,
              won: true,
              completedAt: new Date().toISOString(),
              score: data.score || 85,
            },
          },
        });
      } else if (data.isGameOver) {
        setFeedbackBurst("MELESET!");
        setTimeout(() => setFeedbackBurst(null), 5000);
        setIsGameOver(true);
        setTimerActive(false);
        if (!isDuelMode) setIsAlreadyCompletedToday(true);
        setTargetWord(data.targetWord || "");

        const completedIds = Array.from(new Set([...(state.completedWordIds || []), wordId]));
        saveLocalGameState({
          completedWordIds: completedIds,
          guessesHistory: {
            ...state.guessesHistory,
            [wordId]: {
              guesses: newGuesses,
              feedbacks: newFeedbacks,
              won: false,
              completedAt: new Date().toISOString(),
              score: 0,
            },
          },
        });
      } else {
        const correctCount = data.feedback.filter((f: LetterState) => f === "CORRECT").length;
        if (correctCount > 0) {
          setFeedbackBurst("NYARIS!");
        } else {
          setFeedbackBurst("COBA LAGI!");
        }
        setTimeout(() => setFeedbackBurst(null), 1200);
      }
    } catch (err) {
      console.error("Error submitting guess:", err);
    } finally {
      setLoading(false);
    }
  }, [currentGuess, feedbacks, guesses, isAlreadyCompletedToday, isGameOver, loading, mode, startTime, streakCount, tintaCount, wordId, wordLength, session, duelRoomCode, isDuelMode]);

  // Global Physical Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Banned keyboard input in hardcore voice mode to enforce mic-only input
      if (mode === "HARDCORE_VOICE") {
        return;
      }

      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === "INPUT" || targetTag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleDelete();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleChar(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleChar, handleDelete, handleEnter, mode]);

  const handleDeductTinta = (amount: number) => {
    const updated = Math.max(0, tintaCount - amount);
    setTintaCount(updated);
    saveLocalGameState({ tinta: updated });
  };

  // Keyboard Status Mapping
  const letterStatuses: Record<string, LetterState> = {};
  guesses.forEach((guess, rIdx) => {
    const rowFeedback = feedbacks[rIdx];
    if (rowFeedback) {
      guess.split("").map((char, cIdx) => {
        const current = letterStatuses[char];
        const next = rowFeedback[cIdx];
        if (current === "CORRECT") return;
        if (next === "CORRECT" || current === "PRESENT") {
          letterStatuses[char] = next;
        } else {
          letterStatuses[char] = next;
        }
      });
    }
  });

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRevealLetter = useCallback((letter: string, index: number) => {
    // Reveal a letter at a specific index by automatically filling it
    setCurrentGuess((prev) => {
      const arr = prev.split("");
      arr[index] = letter;
      return arr.join("");
    });
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      {session && <ComicDailyClaimModal isLoggedIn={!!session} />}
      <Header
        mode={mode}
        onModeToggle={(m) => setMode(m)}
        tintaCount={tintaCount}
        streakCount={streakCount}
      />

      <AnnouncementBanner />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-4 flex flex-col items-center justify-between pb-24 sm:pb-4">
        {/* No Word Available Fallback Banner */}
        {noWordAvailable && (
          <div className="w-full bg-yellow-100 comic-border p-4 rounded-xl comic-shadow mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🕵️‍♂️</span>
              <div>
                <h3 className="font-bangers text-xl text-comic-ink leading-none">
                  TIDAK ADA KATA HARIAN UNTUK HARI INI!
                </h3>
                <p className="text-xs font-sans text-gray-700 mt-1">
                  Misteri harian belum dijadwalkan. Kamu bisa langsung memilih tantangan dari Chapter Story!
                </p>
              </div>
            </div>
            <Link
              href="/chapter"
              className="comic-btn text-xs sm:text-sm bg-comic-yellow text-comic-ink shrink-0 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> PILIH CHAPTER STORY <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Chapter Limit Reached Warning */}
        {isChapterLimitReached && (
          <div className="w-full bg-red-100 comic-border p-4 rounded-xl comic-shadow mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">⏳</span>
              <div>
                <h3 className="font-bangers text-xl text-red-600 leading-none">
                  LIMIT HARIAN: 1 CHAPTER SELESAI!
                </h3>
                <p className="text-xs font-sans text-gray-700 mt-1">
                  Kamu telah menyelesaikan 1 Chapter penuh hari ini. Petualangan berikutnya akan terbuka setelah waktu reset!
                </p>
              </div>
            </div>
            <div className="bg-white comic-border-sm px-4 py-2 rounded-lg font-bangers text-sm text-comic-ink shadow-sm flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-sans font-bold">RESET DALAM</span>
              <span className="text-red-500 text-base">{resetTimerText}</span>
            </div>
          </div>
        )}

        {/* Lock Banner if Already Solved Today */}
        {isAlreadyCompletedToday && !isDuelMode && !isChapterLimitReached && (
          <div className="w-full bg-amber-100 comic-border p-3.5 rounded-xl comic-shadow mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bangers text-xl text-comic-ink leading-none">
                  SOAL HARI INI TELAH SELESAI! (SKOR KOMIK: {comicScore})
                </h3>
                <p className="text-xs font-sans text-gray-700 mt-0.5">
                  Kamu tidak dapat mengulang kata hari ini. Lanjutkan petualangan ke Story Chapters atau Mode Duel!
                </p>
              </div>
            </div>

            <Link
              href="/chapter"
              className="comic-btn text-xs sm:text-sm bg-comic-yellow text-comic-ink shrink-0"
            >
              <BookOpen className="w-4 h-4" /> KATA SELANJUTNYA (CHAPTERS) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Duel Mode Timer Indicator Banner */}
        {isDuelMode && (
          <div className="w-full bg-comic-bayangan comic-border p-3 rounded-xl comic-shadow mb-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-bangers text-lg">
              <Swords className="w-5 h-5 text-comic-yellow" />
              <span>PER_DUELAN KOMIK ROOM: {duelRoomCode}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white text-comic-ink px-3 py-1 rounded-full font-bangers text-base comic-border-sm">
              <Timer className="w-4 h-4 text-red-500 animate-pulse" />
              <span>SISA WAKTU: {formatTimer(timeLeft)}</span>
            </div>
          </div>
        )}

        {/* Hardcore Voice Mode Timer Indicator Banner (Only if not in duel mode) */}
        {!isDuelMode && mode === "HARDCORE_VOICE" && (
          <div className="w-full bg-comic-bayangan comic-border p-3 rounded-xl comic-shadow mb-4 flex items-center justify-between text-white border-comic-bayangan">
            <div className="flex items-center gap-2 font-bangers text-lg">
              <span className="text-xl">🎙️</span>
              <span>MODE DENGAR & MIC (HARDCORE)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white text-comic-ink px-3 py-1 rounded-full font-bangers text-base comic-border-sm">
              <Timer className="w-4 h-4 text-red-500 animate-pulse" />
              <span>BATAS WAKTU: {formatTimer(timeLeft)}</span>
            </div>
          </div>
        )}

        {/* Desktop 2-Column Responsive Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Game Board Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white lg:comic-border lg:p-6 lg:rounded-xl lg:comic-shadow relative">
            {/* Category & Info Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white comic-border px-3 py-1 rounded-full font-bangers text-sm sm:text-base text-comic-ink comic-shadow-sm">
                KATEGORI: <span className="text-comic-klu">{category}</span>
              </span>
              <span className="bg-comic-yellow comic-border px-3 py-1 rounded-full font-bangers text-sm sm:text-base text-comic-ink comic-shadow-sm">
                TINGKAT: <span className="text-comic-ink">{difficulty}</span>
              </span>
            </div>

            {/* Visual Feedback Burst Overlay */}
            {feedbackBurst && (
              <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce">
                <div className="bg-comic-yellow comic-border px-6 py-3 rounded-xl comic-shadow-lg rotate-[-4deg]">
                  <span className="font-bangers text-4xl sm:text-6xl text-comic-ink tracking-widest drop-shadow">
                    {feedbackBurst}
                  </span>
                </div>
              </div>
            )}

            {/* Wordle Game Board */}
            <GameBoard
              wordLength={wordLength}
              maxAttempts={6}
              guesses={guesses}
              feedbacks={feedbacks}
              currentGuess={currentGuess}
              isShaking={isShaking}
            />

            {/* Result Share Card Modal if Game Over */}
            {isGameOver && (
              <div className="w-full flex flex-col items-center gap-3">
                <ResultShareCard
                  won={isWon}
                  wordId={wordId}
                  targetWord={targetWord}
                  guesses={guesses}
                  feedbacks={feedbacks}
                  attemptsUsed={guesses.length}
                  tintaEarned={tintaEarned}
                />
                
                {isWon && nextWordInfo && (
                  <button
                    onClick={async () => {
                      const targetNextId = nextWordInfo.nextWordId;
                      try {
                        const res = await fetch(`/api/game/next-word?wordId=${targetNextId}`);
                        const data = await res.json();
                        setGuesses([]);
                        setFeedbacks([]);
                        setCurrentGuess("");
                        setIsWon(false);
                        setIsGameOver(false);
                        setIsAlreadyCompletedToday(false);
                        setWordId(targetNextId);
                        if (data.currentWordInfo) {
                          setWordLength(data.currentWordInfo.length || 5);
                          setCategory(data.currentWordInfo.category || "Chapter");
                          setDifficulty(data.currentWordInfo.difficulty || "MEDIUM");
                        }
                        setNextWordInfo(null);
                        setStartTime(Date.now());
                        if (typeof window !== "undefined") {
                          window.history.pushState({}, "", `/play?wordId=${targetNextId}`);
                        }
                      } catch (e) {
                        console.error("Gagal transisi ke kata selanjutnya:", e);
                      }
                    }}
                    className="comic-btn text-base bg-comic-yellow text-comic-ink hover:bg-yellow-400 w-full py-3 text-center flex items-center justify-center gap-2 animate-bounce cursor-pointer"
                  >
                    LANJUT KE KATA BERIKUTNYA (#{nextWordInfo.nextWordIndex} / {nextWordInfo.totalWords}) <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {isDuelMode && (
                  <Link
                    href={`/duel/${duelRoomCode}`}
                    className="comic-btn text-base bg-comic-bayangan text-white hover:bg-pink-600 px-6 py-3"
                  >
                    <Swords className="w-5 h-5" /> LIHAT ARENA PERTANDINGAN DUEL
                  </Link>
                )}
              </div>
            )}

            {/* On-screen Virtual Keyboard (Inside left column, below game board) */}
            {!isGameOver && (
              <div className="w-full mt-4 z-30 flex flex-col gap-3">
                {mode === "HARDCORE_VOICE" && (
                  <VoiceInputMicButton 
                    wordLength={wordLength} 
                    onVoiceResult={(voiceText) => {
                      if (voiceText.length === wordLength) {
                        setCurrentGuess(voiceText);
                        setFeedbackBurst("TERDENGAR!");
                        setTimeout(() => setFeedbackBurst(null), 1200);
                      } else {
                        setFeedbackBurst("SUARA TIDAK JELAS!");
                        setTimeout(() => setFeedbackBurst(null), 1200);
                      }
                    }} 
                  />
                )}
                
                <VirtualKeyboard
                  onChar={handleChar}
                  onDelete={handleDelete}
                  onEnter={handleEnter}
                  letterStatuses={letterStatuses}
                  disabled={loading || isAlreadyCompletedToday}
                />
              </div>
            )}
          </div>

          {/* Comic Gutter Boundary Line for Desktop (lg+) */}
          <div className="hidden lg:block lg:col-span-1 h-full min-h-[400px] flex justify-center items-center">
            <div className="w-1.5 h-full bg-comic-ink rounded-full comic-shadow-sm" />
          </div>

          {/* Clues & Story Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 w-full">
            {/* Superhero vs Rival Character Header Banner */}
            <div className="bg-white comic-border p-3 rounded-lg comic-shadow flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-comic-klu comic-border flex items-center justify-center font-bangers text-white text-base">
                  KLU
                </div>
                <div className="flex flex-col">
                  <span className="font-bangers text-sm text-comic-klu leading-none">Kapten Klu</span>
                  <span className="text-[10px] text-gray-500 font-sans">Clue Jujur</span>
                </div>
              </div>

              <span className="font-bangers text-xl text-comic-ink">VS</span>

              <div className="flex items-center gap-2">
                <div className="flex flex-col text-right">
                  <span className="font-bangers text-sm text-comic-bayangan leading-none">Bayangan</span>
                  <span className="text-[10px] text-gray-500 font-sans">Trik Menyesatkan</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-comic-bayangan comic-border flex items-center justify-center font-bangers text-white text-base">
                  BAY
                </div>
              </div>
            </div>

            {/* Dual Speech Bubble Clue System */}
            <ClueDualPanel
              wordId={wordId}
              tintaCount={tintaCount}
              onDeductTinta={handleDeductTinta}
              isHardcoreVoice={mode === "HARDCORE_VOICE"}
              guesses={guesses}
              feedbacks={feedbacks}
              wordLength={wordLength}
              onRevealLetter={handleRevealLetter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bangers text-2xl">MEMUAT ARENA TEKAKOMIK...</div>}>
      <PlayGameContainer />
    </Suspense>
  );
}
