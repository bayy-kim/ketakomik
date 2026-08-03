"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { ClueDualPanel } from "@/components/ClueDualPanel";
import { ResultShareCard } from "@/components/ResultShareCard";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { LetterState } from "@/components/LetterBox";
import { getLocalGameState, saveLocalGameState } from "@/lib/storage";
import { CheckCircle2, Lock, ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

function PlayGameContainer() {
  const [wordId, setWordId] = useState<string>("w1");
  const [wordLength, setWordLength] = useState<number>(5);
  const [category, setCategory] = useState<string>("Misteri");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  
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

  // Initialize word and local storage state
  useEffect(() => {
    const state = getLocalGameState();
    setTintaCount(state.tinta);
    setStreakCount(state.streak);
    setMode(state.mode);
    setStartTime(Date.now());

    async function initTodayWord() {
      try {
        const res = await fetch("/api/game/today");
        const data = await res.json();
        if (data.id) {
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
        }
      } catch (e) {
        console.error("Gagal memuat kata hari ini:", e);
      }
    }

    initTodayWord();
  }, []);

  const handleChar = useCallback((char: string) => {
    if (isGameOver || loading || isAlreadyCompletedToday) return;
    setCurrentGuess((prev) => {
      if (prev.length < wordLength) {
        return prev + char.toUpperCase();
      }
      return prev;
    });
  }, [isGameOver, loading, isAlreadyCompletedToday, wordLength]);

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
          anonId: state.anonId,
          mode,
          durationSeconds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Tebakan tidak valid");
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
        setIsWon(true);
        setIsGameOver(true);
        setIsAlreadyCompletedToday(true);
        setTintaEarned(data.tintaEarned || 30);
        setComicScore(data.score || 85);
        setTargetWord(data.targetWord || currentGuess);

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
        setIsGameOver(true);
        setIsAlreadyCompletedToday(true);
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
  }, [currentGuess, feedbacks, guesses, isAlreadyCompletedToday, isGameOver, loading, mode, startTime, streakCount, tintaCount, wordId, wordLength]);

  // Global Physical Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [handleChar, handleDelete, handleEnter]);

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

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header
        mode={mode}
        onModeToggle={(m) => setMode(m)}
        tintaCount={tintaCount}
        streakCount={streakCount}
      />

      <AnnouncementBanner />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-4 flex flex-col items-center justify-between pb-24 sm:pb-4">
        {/* Lock Banner if Already Solved Today */}
        {isAlreadyCompletedToday && (
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

        {/* Desktop 2-Column Responsive Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Game Board Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white lg:comic-border lg:p-6 lg:rounded-2xl lg:comic-shadow relative">
            {/* Category & Info Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white comic-border px-3 py-1 rounded-full font-bangers text-sm sm:text-base text-comic-ink comic-shadow-sm">
                KATEGORI: <span className="text-comic-klu">{category}</span>
              </span>
              <span className="bg-comic-yellow comic-border px-3 py-1 rounded-full font-bangers text-sm sm:text-base text-comic-ink comic-shadow-sm">
                TINGKAT: <span className="text-comic-ink">{difficulty}</span>
              </span>
            </div>

            {/* Desktop Keyboard Helper Hint */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-sans text-gray-500 mb-2">
              <span>⌨️ Ketik langsung lewat keyboard komputer: <strong className="text-comic-ink">A-Z</strong> (Huruf) | <strong className="text-comic-ink">Enter</strong> (Cek) | <strong className="text-comic-ink">Backspace</strong> (Hapus)</span>
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
              <ResultShareCard
                won={isWon}
                wordId={wordId}
                targetWord={targetWord}
                guesses={guesses}
                feedbacks={feedbacks}
                attemptsUsed={guesses.length}
                tintaEarned={tintaEarned}
              />
            )}

            {/* On-screen Virtual Keyboard (Inside left column, below game board) */}
            {!isGameOver && (
              <div className="w-full mt-4 z-30">
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
