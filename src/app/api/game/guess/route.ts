import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_WORDS } from "@/lib/game-data-fallback";

export type LetterFeedback = "CORRECT" | "PRESENT" | "ABSENT";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, guess, attemptNumber, anonId, userId, mode = "NORMAL", durationSeconds = 0, cluesUsed = 0 } = body;

    if (!wordId || !guess || typeof guess !== "string") {
      return NextResponse.json({ error: "Data tebakan tidak valid" }, { status: 400 });
    }

    const normalizedGuess = guess.trim().toUpperCase();

    let targetWordText = "";
    let wordDb;

    try {
      wordDb = await db.word.findUnique({ where: { id: wordId } });
      if (wordDb) {
        targetWordText = wordDb.normalizedText.toUpperCase();
      }
    } catch {
      // Prisma error fallback
    }

    if (!targetWordText) {
      const fallbackWord = FALLBACK_WORDS.find((w) => w.id === wordId) || FALLBACK_WORDS[0];
      targetWordText = fallbackWord.normalizedText.toUpperCase();
    }

    if (normalizedGuess.length !== targetWordText.length) {
      return NextResponse.json(
        { error: `Panjang kata harus ${targetWordText.length} huruf` },
        { status: 400 }
      );
    }

    // Evaluate feedback algorithm
    const feedback: LetterFeedback[] = new Array(targetWordText.length).fill("ABSENT");
    const targetLetterCounts: Record<string, number> = {};

    for (let i = 0; i < targetWordText.length; i++) {
      const char = targetWordText[i];
      targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
    }

    // Pass 1: EXACT Matches
    for (let i = 0; i < normalizedGuess.length; i++) {
      if (normalizedGuess[i] === targetWordText[i]) {
        feedback[i] = "CORRECT";
        targetLetterCounts[normalizedGuess[i]]--;
      }
    }

    // Pass 2: MISPLACED Matches
    for (let i = 0; i < normalizedGuess.length; i++) {
      if (feedback[i] !== "CORRECT") {
        const char = normalizedGuess[i];
        if (targetLetterCounts[char] && targetLetterCounts[char] > 0) {
          feedback[i] = "PRESENT";
          targetLetterCounts[char]--;
        }
      }
    }

    const isWon = feedback.every((f) => f === "CORRECT");
    const isGameOver = isWon || attemptNumber >= 6;

    // UNIK TEKAKOMIK COMIC SCORE FORMULA:
    // Base 100 - (attemptNumber - 1) * 15 - (cluesUsed * 10) + SpeedBonus (up to 15) + HardcoreVoiceBonus (25)
    let score = 0;
    let tintaEarned = 0;

    if (isWon) {
      const baseScore = Math.max(25, 100 - (attemptNumber - 1) * 15);
      const cluePenalty = cluesUsed * 10;
      const speedBonus = durationSeconds > 0 && durationSeconds < 30 ? Math.max(0, 30 - durationSeconds) : 0;
      const voiceBonus = mode === "HARDCORE_VOICE" ? 25 : 0;

      score = Math.max(10, baseScore - cluePenalty + speedBonus + voiceBonus);
      tintaEarned = Math.max(15, 60 - attemptNumber * 8) + (mode === "HARDCORE_VOICE" ? 20 : 0);
    }

    // Save GameSession if completed
    try {
      if (isGameOver) {
        await db.gameSession.create({
          data: {
            wordId: wordDb?.id || wordId,
            userId: userId || null,
            anonId: anonId || "guest",
            guesses: [{ guess: normalizedGuess, feedback, score }],
            attemptsUsed: attemptNumber,
            won: isWon,
            mode: mode === "HARDCORE_VOICE" ? "HARDCORE_VOICE" : "NORMAL",
            durationSeconds,
          },
        });

        if (isWon && userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              tinta: { increment: tintaEarned },
              currentStreak: { increment: 1 },
            },
          });
        }
      }
    } catch {
      // DB fallback
    }

    const responsePayload: {
      feedback: LetterFeedback[];
      isWon: boolean;
      isGameOver: boolean;
      tintaEarned: number;
      score: number;
      targetWord?: string;
    } = {
      feedback,
      isWon,
      isGameOver,
      tintaEarned,
      score,
    };

    if (isGameOver) {
      responsePayload.targetWord = targetWordText;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error evaluating guess:", error);
    return NextResponse.json({ error: "Gagal memproses tebakan" }, { status: 500 });
  }
}
