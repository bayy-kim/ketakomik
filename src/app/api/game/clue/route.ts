import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Anda harus login terlebih dahulu untuk membuka clue!" }, { status: 401 });
    }

    const { wordId, character, isHardcoreVoice = false } = await request.json();

    if (!wordId || !character) {
      return NextResponse.json({ error: "Data clue tidak lengkap" }, { status: 400 });
    }

    // Get the word
    const word = await db.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      return NextResponse.json({ error: "Soal kata tidak ditemukan" }, { status: 404 });
    }

    const clueCost = isHardcoreVoice ? 30 : 15;

    // Verify user has enough tinta
    const user = await db.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user || user.tinta < clueCost) {
      return NextResponse.json({ error: "Tinta Komik tidak cukup untuk membuka petunjuk!" }, { status: 400 });
    }

    // Deduct tinta
    await db.user.update({
      where: { id: currentUserId },
      data: { tinta: { decrement: clueCost } },
    });

    const clueText = character === "KLU" ? word.clueHonest : word.clueMisleading;

    return NextResponse.json({
      success: true,
      clue: clueText,
      tintaRemaining: user.tinta - clueCost,
    });
  } catch (error) {
    console.error("Error revealing clue:", error);
    return NextResponse.json({ error: "Gagal membuka petunjuk" }, { status: 500 });
  }
}
