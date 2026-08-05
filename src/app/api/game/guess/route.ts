import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export type LetterFeedback = "CORRECT" | "PRESENT" | "ABSENT";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id || null;

    const body = await request.json();
    const { wordId, guess, attemptNumber, guessesHistory = [], mode = "NORMAL", durationSeconds = 0, cluesUsed = 0, roomCode } = body;

    if (!wordId || !guess || typeof guess !== "string") {
      return NextResponse.json({ error: "Data tebakan tidak valid" }, { status: 400 });
    }

    const normalizedGuess = guess.trim().toUpperCase();

    const wordDb = await db.word.findUnique({ where: { id: wordId } });
    if (!wordDb) {
      return NextResponse.json({ error: "Soal kata tidak ditemukan di database" }, { status: 404 });
    }

    const targetWordText = wordDb.normalizedText.toUpperCase();

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

    // Build complete guess history array
    const fullGuesses = Array.isArray(guessesHistory) && guessesHistory.length > 0
      ? [...guessesHistory, { guess: normalizedGuess, feedback }]
      : [{ guess: normalizedGuess, feedback }];

    // UNIK TEKAKOMIK COMIC SCORE FORMULA:
    let score = 0;
    let tintaEarned = 0;

    if (isWon) {
      const baseScore = Math.max(25, 100 - (attemptNumber - 1) * 15);
      const cluePenalty = cluesUsed * 10;
      const speedBonus = durationSeconds > 0 && durationSeconds < 120 ? Math.max(0, 120 - durationSeconds) : 0;
      const voiceBonus = mode === "HARDCORE_VOICE" ? 25 : 0;

      score = Math.max(10, baseScore - cluePenalty + speedBonus + voiceBonus);
      tintaEarned = Math.max(15, 60 - attemptNumber * 8) + (mode === "HARDCORE_VOICE" ? 20 : 0);
    }

    // Save GameSession if completed
    if (isGameOver && currentUserId) {
      const isDuelGame = !!roomCode;

      await db.gameSession.create({
        data: {
          wordId: wordDb.id,
          userId: currentUserId,
          guesses: fullGuesses,
          attemptsUsed: attemptNumber,
          won: isWon,
          mode: mode === "HARDCORE_VOICE" ? "HARDCORE_VOICE" : "NORMAL",
          durationSeconds,
          score: isDuelGame ? 0 : score, // Duel games do not contribute to stats score
          isDuel: isDuelGame,
        },
      });

      // Handle user streak and longestStreak updates - EXCLUDE duel games
      if (!isDuelGame) {
        const user = await db.user.findUnique({ where: { id: currentUserId } });
        if (user) {
          if (isWon) {
            const newStreak = user.currentStreak + 1;
            const newLongest = Math.max(user.longestStreak, newStreak);
            await db.user.update({
              where: { id: currentUserId },
              data: {
                tinta: { increment: tintaEarned },
                currentStreak: newStreak,
                longestStreak: newLongest,
              },
            });
          } else {
            // Reset streak on loss
            await db.user.update({
              where: { id: currentUserId },
              data: {
                currentStreak: 0,
              },
            });
          }
        }
      }

      // Update duel status if part of a room challenge
      if (roomCode) {
        const duel = await db.duelChallenge.findUnique({
          where: { roomCode: roomCode.toUpperCase() },
        });

        if (duel) {
          const isCreator = duel.creatorSessionId === currentUserId;
          const isOpponent = duel.opponentSessionId === currentUserId;

          if (isCreator || isOpponent) {
            const updatedStatus = duel.creatorSessionId && duel.opponentSessionId ? "COMPLETED" : "ACTIVE";
            await db.duelChallenge.update({
              where: { id: duel.id },
              data: { status: updatedStatus },
            });
          }
        }
      }
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
