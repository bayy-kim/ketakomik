"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { LetterState } from "@/components/LetterBox";
import { INITIAL_OFFLINE_CHAPTERS, OfflineChapter, OfflineWord } from "@/lib/offline-data";
import { evaluateOfflineGuess } from "@/lib/offline-evaluator";
import { BookOpen, CheckCircle2, ArrowRight, WifiOff, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

function PlayOfflineContainer() {
  const searchParams = useSearchParams();
  const queryChapterId = searchParams.get("chapterId") || "off_ch_1";
  const queryWordIndex = parseInt(searchParams.get("wordIndex") || "1", 10);

  const [chaptersData, setChaptersData] = useState<OfflineChapter[]>(INITIAL_OFFLINE_CHAPTERS);
  const [currentChapter, setCurrentChapter] = useState<OfflineChapter>(INITIAL_OFFLINE_CHAPTERS[0]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<OfflineWord>(INITIAL_OFFLINE_CHAPTERS[0].words[0]);

  const [wordLength, setWordLength] = useState<number>(5);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [isShaking, setIsShaking] = useState(false);

  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedbackBurst, setFeedbackBurst] = useState<string | null>(null);

  // Sync custom offline pack from localStorage if updated by Admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const customPack = localStorage.getItem("tekakomik_offline_custom_pack");
      if (customPack) {
        try {
          const parsed = JSON.parse(customPack);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChaptersData(parsed);
          }
        } catch (e) {
          console.error("Failed to parse custom offline pack:", e);
        }
      }
    }
  }, []);

  // Initialize selected chapter and word
  useEffect(() => {
    const foundChapter = chaptersData.find((c) => c.id === queryChapterId) || chaptersData[0];
    const wordIdx = Math.max(0, Math.min(queryWordIndex - 1, foundChapter.words.length - 1));
    const wordObj = foundChapter.words[wordIdx];

    setCurrentChapter(foundChapter);
    setCurrentWordIndex(wordIdx);
    setCurrentWord(wordObj);
    setWordLength(wordObj.length || wordObj.normalizedText.length);

    setGuesses([]);
    setFeedbacks([]);
    setCurrentGuess("");
    setIsWon(false);
    setIsGameOver(false);
  }, [queryChapterId, queryWordIndex, chaptersData]);

  const handleChar = useCallback((char: string) => {
    if (isGameOver) return;
    setCurrentGuess((prev) => {
      if (prev.length < wordLength) {
        return prev + char.toUpperCase();
      }
      return prev;
    });
  }, [isGameOver, wordLength]);

  const handleDelete = useCallback(() => {
    if (isGameOver) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [isGameOver]);

  const handleEnter = useCallback(() => {
    if (isGameOver) return;
    if (currentGuess.length !== wordLength) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const attemptNum = guesses.length + 1;
    const result = evaluateOfflineGuess(currentGuess, currentWord.normalizedText, attemptNum);

    const newGuesses = [...guesses, currentGuess];
    const newFeedbacks = [...feedbacks, result.feedback];

    setGuesses(newGuesses);
    setFeedbacks(newFeedbacks);
    setCurrentGuess("");

    if (result.isWon) {
      setFeedbackBurst("TEPAT!");
      setTimeout(() => setFeedbackBurst(null), 5000);
      setIsWon(true);
      setIsGameOver(true);
    } else if (result.isGameOver) {
      setFeedbackBurst("MELESET!");
      setTimeout(() => setFeedbackBurst(null), 5000);
      setIsGameOver(true);
    } else {
      const correctCount = result.feedback.filter((f) => f === "CORRECT").length;
      if (correctCount > 0) {
        setFeedbackBurst("NYARIS!");
      } else {
        setFeedbackBurst("COBA LAGI!");
      }
      setTimeout(() => setFeedbackBurst(null), 1200);
    }
  }, [currentGuess, currentWord, guesses, feedbacks, isGameOver, wordLength]);

  // Global keyboard shortcuts
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

  // Next word in chapter handler
  const handleNextWord = () => {
    if (currentWordIndex + 1 < currentChapter.words.length) {
      const nextIdx = currentWordIndex + 1;
      const nextWordObj = currentChapter.words[nextIdx];

      setCurrentWordIndex(nextIdx);
      setCurrentWord(nextWordObj);
      setWordLength(nextWordObj.length || nextWordObj.normalizedText.length);

      setGuesses([]);
      setFeedbacks([]);
      setCurrentGuess("");
      setIsWon(false);
      setIsGameOver(false);

      if (typeof window !== "undefined") {
        window.history.pushState({}, "", `/play-offline?chapterId=${currentChapter.id}&wordIndex=${nextIdx + 1}`);
      }
    }
  };

  const letterStatuses: Record<string, LetterState> = {};
  guesses.forEach((guess, rIdx) => {
    const rowFeedback = feedbacks[rIdx];
    if (rowFeedback) {
      guess.split("").forEach((char, cIdx) => {
        const next = rowFeedback[cIdx];
        if (letterStatuses[char] === "CORRECT") return;
        letterStatuses[char] = next;
      });
    }
  });

  const isLastWordInChapter = currentWordIndex + 1 >= currentChapter.words.length;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-4 flex flex-col items-center justify-between pb-24 sm:pb-6">
        {/* Offline Mode Banner */}
        <div className="w-full bg-comic-bayangan comic-border p-3.5 rounded-xl comic-shadow mb-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bangers text-lg">
            <WifiOff className="w-6 h-6 text-comic-yellow animate-pulse shrink-0" />
            <span>MODE OFFLINE STORY (TANPA INTERNET)</span>
          </div>
          <span className="bg-white text-comic-ink comic-border-sm px-3 py-1 rounded-full font-bangers text-sm">
            CHAPTER #{currentChapter.chapterNumber} ({currentWordIndex + 1}/{currentChapter.words.length})
          </span>
        </div>

        {/* Narrative Story Board on Top (No Clues) */}
        <div className="w-full bg-white comic-border p-4 sm:p-5 rounded-xl comic-shadow-klu mb-4 relative bubble-tail-left">
          <div className="flex items-center gap-2 mb-1.5 border-b-2 border-comic-ink pb-1">
            <BookOpen className="w-5 h-5 text-comic-klu" />
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu leading-none">
              {currentChapter.title}
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-gray-800 leading-relaxed italic">
            &ldquo;{currentChapter.narrative}&rdquo;
          </p>
        </div>

        {/* Main Game Area */}
        <div className="w-full bg-white comic-border p-4 sm:p-6 rounded-xl comic-shadow relative flex flex-col items-center">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-comic-paper comic-border px-3 py-1 rounded-full font-bangers text-sm text-comic-ink">
              KATEGORI: <span className="text-comic-klu">{currentWord.category}</span>
            </span>
            <span className="bg-comic-yellow comic-border px-3 py-1 rounded-full font-bangers text-sm text-comic-ink">
              TINGKAT: <span>{currentWord.difficulty}</span>
            </span>
          </div>

          {/* Feedback Burst */}
          {feedbackBurst && (
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce">
              <div className="bg-comic-yellow comic-border px-6 py-3 rounded-xl comic-shadow-lg rotate-[-4deg]">
                <span className="font-bangers text-4xl sm:text-6xl text-comic-ink tracking-widest drop-shadow">
                  {feedbackBurst}
                </span>
              </div>
            </div>
          )}

          {/* Game Board */}
          <GameBoard
            wordLength={wordLength}
            maxAttempts={6}
            guesses={guesses}
            feedbacks={feedbacks}
            currentGuess={currentGuess}
            isShaking={isShaking}
          />

          {/* GameOver Result & Next Word CTA */}
          {isGameOver && (
            <div className="w-full max-w-md mt-4 flex flex-col items-center gap-3">
              <div className="w-full bg-comic-paper comic-border p-4 rounded-xl comic-shadow text-center flex flex-col items-center gap-2">
                <div className="text-4xl">{isWon ? "🎉" : "💥"}</div>
                <h3 className="font-bangers text-2xl text-comic-ink">
                  {isWon ? "TEBAKAN KAMU BENAR!" : "KESEMPATAN HABIS!"}
                </h3>
                <p className="font-sans text-xs text-gray-700">
                  KATA RAHASIA ADALAH: <strong className="text-comic-klu font-bangers text-xl tracking-wider">{currentWord.normalizedText}</strong>
                </p>
              </div>

              {isWon && !isLastWordInChapter && (
                <button
                  onClick={handleNextWord}
                  className="comic-btn text-base bg-comic-yellow text-comic-ink hover:bg-yellow-400 w-full py-3.5 flex items-center justify-center gap-2 animate-bounce cursor-pointer shadow-md"
                >
                  LANJUT KE KATA BERIKUTNYA (#{currentWordIndex + 2} / {currentChapter.words.length}) <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {isWon && isLastWordInChapter && (
                <div className="w-full bg-emerald-100 comic-border p-4 rounded-xl comic-shadow text-center flex flex-col items-center gap-2">
                  <Sparkles className="w-8 h-8 text-emerald-600 animate-spin" />
                  <h3 className="font-bangers text-2xl text-emerald-800">
                    SELAMAT! CHAPTER #{currentChapter.chapterNumber} SELESAI!
                  </h3>
                  <p className="font-sans text-xs text-emerald-900">
                    Kamu berhasil menyelesaikan seluruh 5 kata Pengetahuan Umum di Chapter ini!
                  </p>
                  <div className="flex gap-2 w-full mt-1">
                    {currentChapter.chapterNumber < chaptersData.length && (
                      <Link
                        href={`/play-offline?chapterId=off_ch_${currentChapter.chapterNumber + 1}&wordIndex=1`}
                        className="comic-btn text-sm bg-comic-yellow text-comic-ink hover:bg-yellow-400 flex-1 py-2.5 text-center"
                      >
                        CHAPTER SELANJUTNYA (#{currentChapter.chapterNumber + 1}) <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Virtual Keyboard */}
          {!isGameOver && (
            <div className="w-full mt-4 z-30">
              <VirtualKeyboard
                onChar={handleChar}
                onDelete={handleDelete}
                onEnter={handleEnter}
                letterStatuses={letterStatuses}
              />
            </div>
          )}
        </div>

        {/* Offline Chapter Selector Carousel */}
        <div className="w-full mt-6 bg-white comic-border p-4 rounded-xl comic-shadow">
          <div className="flex items-center justify-between mb-3 border-b-2 border-comic-ink pb-2">
            <h3 className="font-bangers text-lg text-comic-ink flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-comic-klu" /> PILIH CHAPTER STORY OFFLINE (21 CHAPTERS)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {chaptersData.map((ch) => (
              <Link
                key={ch.id}
                href={`/play-offline?chapterId=${ch.id}&wordIndex=1`}
                className={`comic-border-sm p-2.5 rounded-lg flex items-center justify-between text-left transition-colors ${
                  ch.id === currentChapter.id
                    ? "bg-comic-yellow text-comic-ink font-bold"
                    : "bg-gray-50 hover:bg-yellow-50 text-comic-ink"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bangers text-sm leading-none">CH #{ch.chapterNumber}: {ch.title.split(":")[1] || ch.title}</span>
                  <span className="text-[10px] font-sans text-gray-600 mt-0.5">{ch.category}</span>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlayOfflinePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bangers text-2xl text-comic-ink">MEMUAT OFFLINE STORY ARENA...</div>}>
      <PlayOfflineContainer />
    </Suspense>
  );
}
