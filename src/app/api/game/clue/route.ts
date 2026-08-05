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

    const { wordId, character, guessState = [] } = await request.json();

    if (!wordId || !character) {
      return NextResponse.json({ error: "Data clue tidak lengkap" }, { status: 400 });
    }

    const word = await db.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      return NextResponse.json({ error: "Soal kata tidak ditemukan" }, { status: 404 });
    }

    // Kapten Klu = 10 Tinta, Bayangan = 5 Tinta, Kedua-duanya = 12 Tinta, Huruf Clue = 15 Tinta
    const clueCost =
      character === "both"
        ? 12
        : character === "bayangan"
        ? 5
        : character === "letter"
        ? 15
        : 10;

    const user = await db.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user || user.tinta < clueCost) {
      return NextResponse.json({ error: "Tinta Komik tidak cukup untuk membuka petunjuk!" }, { status: 400 });
    }

    await db.user.update({
      where: { id: currentUserId },
      data: {
        tinta: { decrement: clueCost },
        tintaSpent: { increment: clueCost },
      },
    });

    let clueHonest: string | null = null;
    let clueMisleading: string | null = null;
    let letterClue: { letter: string; index: number } | null = null;

    if (character === "klu" || character === "both") {
      clueHonest = word.clueHonest;
    }
    if (character === "bayangan" || character === "both") {
      clueMisleading = word.clueMisleading;
    }

    if (character === "letter") {
      // Logic Clue Huruf: Membuka 1 huruf yang posisinya belum tepat (belum CORRECT)
      // targetWordText adalah kata asli
      const targetWord = word.normalizedText.toUpperCase();
      const length = targetWord.length;

      // Cari index mana saja yang belum berhasil ditebak (belum CORRECT) berdasarkan guessState yang dikirim client
      const solvedIndexes = new Set<number>();
      if (Array.isArray(guessState)) {
        guessState.forEach((state: string, idx: number) => {
          if (state === "CORRECT") {
            solvedIndexes.add(idx);
          }
        });
      }

      const unsolvedIndexes: number[] = [];
      for (let i = 0; i < length; i++) {
        if (!solvedIndexes.has(i)) {
          unsolvedIndexes.push(i);
        }
      }

      // Jika ada indeks yang belum terpecahkan, acak salah satu
      if (unsolvedIndexes.length > 0) {
        const randomIndex = unsolvedIndexes[Math.floor(Math.random() * unsolvedIndexes.length)];
        letterClue = {
          letter: targetWord[randomIndex],
          index: randomIndex,
        };
      } else {
        // Jika semua sudah terpecahkan, buka saja huruf pertama
        letterClue = {
          letter: targetWord[0],
          index: 0,
        };
      }
    }

    return NextResponse.json({
      success: true,
      clueHonest,
      clueMisleading,
      letterClue,
      tintaDeducted: clueCost,
      tintaRemaining: user.tinta - clueCost,
    });
  } catch (error) {
    console.error("Error revealing clue:", error);
    return NextResponse.json({ error: "Gagal membuka petunjuk" }, { status: 500 });
  }
}
