import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_WORDS } from "@/lib/game-data-fallback";

export async function GET(request: Request, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const { roomCode } = await params;

    let duel;
    try {
      duel = await db.duelChallenge.findUnique({
        where: { roomCode: roomCode.toUpperCase() },
        include: { word: true },
      });
    } catch {
      // Prisma error fallback
    }

    if (!duel) {
      // Fallback mock duel room
      const wordFallback = FALLBACK_WORDS[0];
      return NextResponse.json({
        roomCode: roomCode.toUpperCase(),
        wordId: wordFallback.id,
        wordLength: wordFallback.normalizedText.length,
        category: wordFallback.category,
        difficulty: wordFallback.difficulty,
        creatorSession: {
          attemptsUsed: 3,
          durationSeconds: 45,
          won: true,
          guesses: ["KIKIS", "KOALA", "KOMIK"],
        },
        opponentSession: null,
        status: "ACTIVE",
      });
    }

    return NextResponse.json({
      roomCode: duel.roomCode,
      wordId: duel.wordId,
      wordLength: duel.word.normalizedText.length,
      category: duel.word.category,
      difficulty: duel.word.difficulty,
      creatorSessionId: duel.creatorSessionId,
      opponentSessionId: duel.opponentSessionId,
      status: duel.status,
    });
  } catch (error) {
    console.error("Error fetching duel room:", error);
    return NextResponse.json({ error: "Gagal mengambil data duel" }, { status: 500 });
  }
}
