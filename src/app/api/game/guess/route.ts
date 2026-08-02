import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_WORDS } from "@/lib/game-data-fallback";

export type LetterFeedback = "CORRECT" | "PRESENT" | "ABSENT";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, guess, attemptNumber, anonId, userId, mode = "NORMAL", durationSeconds = 0 } = body;

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

    // Evaluate feedback algorithm (Wordle algorithm for duplicate letters handling)
    const feedback: LetterFeedback[] = new Array(targetWordText.length).fill("ABSENT");
    const targetLetterCounts: Record<string, number> = {};

    // Count available letters in target
    for (let i = 0; i < targetWordText.length; i++) {
      const char = targetWordText[i];
      targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
    }

    // First pass: Find EXACT matches (CORRECT)
    for (let i = 0; i < normalizedGuess.length; i++) {
      if (normalizedGuess[i] === targetWordText[i]) {
        feedback[i] = "CORRECT";
        targetLetterCounts[normalizedGuess[i]]--;
      }
    }

    // Second pass: Find misplaced matches (PRESENT)
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

    // Calculate Tinta reward if won
    let tintaEarned = 0;
    if (isWon) {
      // 1st try = 50 tinta, 2nd = 40, 3rd = 30, 4th = 25, 5th = 20, 6th = 15
      tintaEarned = Math.max(15, 60 - attemptNumber * 10);
      if (mode === "HARDCORE_VOICE") {
        tintaEarned += 20; // Bonus for Hardcore Voice Mode
      }
    }

    // Save GameSession if completed or Prisma exists
    try {
      if (isGameOver) {
        await db.gameSession.create({
          data: {
            wordId: wordDb?.id || wordId,
            userId: userId || null,
            anonId: anonId || "guest",
            guesses: [{ guess: normalizedGuess, feedback }],
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
      // DB log fallback ignoring for standalone preview
    }

    // Return targetWord ONLY when game is solved/failed
    const responsePayload: {
      feedback: LetterFeedback[];
      isWon: boolean;
      isGameOver: boolean;
      tintaEarned: number;
      targetWord?: string;
    } = {
      feedback,
      isWon,
      isGameOver,
      tintaEarned,
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
