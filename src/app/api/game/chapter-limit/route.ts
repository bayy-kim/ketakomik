import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    // Ambil data game session user hari ini yang diselesaikan setelah jam 06:00 pagi
    const now = new Date();
    const resetTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0); // Jam 06:00 pagi hari ini

    // Jika sekarang sebelum jam 6 pagi, waktu mulai pembatas adalah jam 6 pagi kemarin
    if (now.getTime() < resetTimeToday.getTime()) {
      resetTimeToday.setDate(resetTimeToday.getDate() - 1);
    }

    const todaySessions = await db.gameSession.findMany({
      where: {
        userId: currentUserId,
        completedAt: {
          gte: resetTimeToday,
        },
        won: true,
      },
      include: {
        word: {
          select: {
            chapterId: true,
          },
        },
      },
    });

    // Cari chapter apa saja yang berhasil diselesaikan hari ini (seluruh kata dalam chapter terjawab)
    const completedChaptersToday: string[] = [];

    // Ambil semua chapter aktif
    const chapters = await db.chapter.findMany({
      where: { isPublished: true },
      include: { words: { select: { id: true } } },
    });

    for (const ch of chapters) {
      const chapterWordIds = ch.words.map((w) => w.id);
      if (chapterWordIds.length === 0) continue;

      // Cek apakah semua kata dari chapter ini diselesaikan setelah reset time
      const solvedInChapterToday = todaySessions.filter(
        (s) => s.won && chapterWordIds.includes(s.wordId)
      );

      if (solvedInChapterToday.length >= chapterWordIds.length) {
        completedChaptersToday.push(ch.id);
      }
    }

    return NextResponse.json({
      completedChapters: completedChaptersToday,
      limitReached: completedChaptersToday.length >= 1, // Batasi maksimal 1 chapter per hari
    });
  } catch (error) {
    console.error("Error checking chapter limit:", error);
    return NextResponse.json({ error: "Gagal memeriksa limit chapter harian" }, { status: 500 });
  }
}
