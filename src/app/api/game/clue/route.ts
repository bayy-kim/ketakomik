import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_WORDS } from "@/lib/game-data-fallback";

export async function POST(request: Request) {
  try {
    const { wordId, character, userId } = await request.json(); // character: 'klu' | 'bayangan' | 'both'

    if (!wordId) {
      return NextResponse.json({ error: "Word ID wajib diisi" }, { status: 400 });
    }

    let word;
    try {
      word = await db.word.findUnique({ where: { id: wordId } });
    } catch {
      // Prisma error fallback
    }

    if (!word) {
      word = FALLBACK_WORDS.find((w) => w.id === wordId) || FALLBACK_WORDS[0];
    }

    const tintaCost = character === "both" ? 15 : 10;

    // Deduct tinta if userId is present
    if (userId) {
      try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (user && user.tinta < tintaCost) {
          return NextResponse.json({ error: "Tinta kamu tidak cukup untuk membuka petunjuk!" }, { status: 400 });
        }
        await db.user.update({
          where: { id: userId },
          data: { tinta: { decrement: tintaCost } },
        });
      } catch {
        // Fallback for demo
      }
    }

    return NextResponse.json({
      clueHonest: character === "bayangan" ? null : word.clueHonest,
      clueMisleading: character === "klu" ? null : word.clueMisleading,
      tintaDeducted: tintaCost,
    });
  } catch (error) {
    console.error("Error fetching clue:", error);
    return NextResponse.json({ error: "Gagal mengambil clue" }, { status: 500 });
  }
}
