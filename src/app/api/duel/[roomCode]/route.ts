import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const { roomCode } = await params;

    const duel = await db.duelChallenge.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        word: {
          select: {
            id: true,
            normalizedText: true,
            category: true,
            difficulty: true,
          },
        },
      },
    });

    if (!duel) {
      return NextResponse.json({ error: "Room duel tidak ditemukan!" }, { status: 404 });
    }

    // Ambil detail game session untuk pembuat duel & lawan duel
    // creatorSessionId & opponentSessionId menyimpan ID User (NextAuth)
    const [creatorUser, opponentUser] = await Promise.all([
      db.user.findUnique({ where: { id: duel.creatorSessionId }, select: { username: true, avatarSeed: true, avatarUrl: true } }),
      duel.opponentSessionId ? db.user.findUnique({ where: { id: duel.opponentSessionId }, select: { username: true, avatarSeed: true, avatarUrl: true } }) : Promise.resolve(null),
    ]);

    const [creatorGameSession, opponentGameSession] = await Promise.all([
      db.gameSession.findFirst({
        where: {
          wordId: duel.wordId,
          userId: duel.creatorSessionId,
        },
        orderBy: { completedAt: "desc" },
      }),
      duel.opponentSessionId
        ? db.gameSession.findFirst({
            where: {
              wordId: duel.wordId,
              userId: duel.opponentSessionId,
            },
            orderBy: { completedAt: "desc" },
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      roomCode: duel.roomCode,
      wordId: duel.wordId,
      wordLength: duel.word.normalizedText.length,
      category: duel.word.category,
      difficulty: duel.word.difficulty,
      creatorSessionId: duel.creatorSessionId,
      opponentSessionId: duel.opponentSessionId,
      status: duel.status,
      creatorName: creatorUser?.username || "Pemain 1",
      creatorAvatar: creatorUser?.avatarUrl || creatorUser?.avatarSeed || "klu_fan",
      opponentName: opponentUser?.username || "Penantang",
      opponentAvatar: opponentUser?.avatarUrl || opponentUser?.avatarSeed || "bayangan_fan",
      creatorSession: creatorGameSession
        ? {
            attemptsUsed: creatorGameSession.attemptsUsed,
            durationSeconds: creatorGameSession.durationSeconds,
            won: creatorGameSession.won,
            guesses: Array.isArray(creatorGameSession.guesses)
              ? (creatorGameSession.guesses as Array<{ guess: string }>).map((g) => g.guess)
              : [],
            score: creatorGameSession.score,
          }
        : null,
      opponentSession: opponentGameSession
        ? {
            attemptsUsed: opponentGameSession.attemptsUsed,
            durationSeconds: opponentGameSession.durationSeconds,
            won: opponentGameSession.won,
            guesses: Array.isArray(opponentGameSession.guesses)
              ? (opponentGameSession.guesses as Array<{ guess: string }>).map((g) => g.guess)
              : [],
            score: opponentGameSession.score,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching duel room:", error);
    return NextResponse.json({ error: "Gagal mengambil data duel" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ roomCode: string }> }) {
  try {
    const { roomCode } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib diisi" }, { status: 400 });
    }

    const duel = await db.duelChallenge.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
    });

    if (!duel) {
      return NextResponse.json({ error: "Room duel tidak ditemukan!" }, { status: 404 });
    }

    if (duel.creatorSessionId === userId) {
      return NextResponse.json({ success: true, message: "Kamu adalah pembuat room ini!" });
    }

    if (duel.opponentSessionId && duel.opponentSessionId !== userId) {
      return NextResponse.json({ error: "Room duel ini sudah diisi oleh pemain lain!" }, { status: 400 });
    }

    const updatedDuel = await db.duelChallenge.update({
      where: { roomCode: roomCode.toUpperCase() },
      data: {
        opponentSessionId: userId,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, duel: updatedDuel });
  } catch (error) {
    console.error("Error updating duel status:", error);
    return NextResponse.json({ error: "Gagal masuk room duel" }, { status: 500 });
  }
}
