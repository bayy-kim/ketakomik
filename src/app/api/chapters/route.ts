import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_CHAPTERS, FALLBACK_WORDS } from "@/lib/game-data-fallback";

export async function GET() {
  try {
    let chapters;
    try {
      chapters = await db.chapter.findMany({
        where: { isPublished: true },
        include: { words: { select: { id: true, scheduledDate: true, difficulty: true, category: true } } },
        orderBy: { weekStartDate: "asc" }, // Diubah agar Chapter 1 (weekStartDate paling awal) berada di atas/paling awal
      });
    } catch {
      // Prisma error fallback
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json({
        chapters: FALLBACK_CHAPTERS.map((ch) => ({
          id: ch.id,
          title: ch.title,
          chapterNote: ch.chapterNote,
          unlockComicImageUrl: ch.unlockComicImageUrl,
          weekStartDate: ch.weekStartDate,
          totalWords: ch.wordIds.length,
          words: FALLBACK_WORDS.map((w) => ({
            id: w.id,
            scheduledDate: w.scheduledDate,
            difficulty: w.difficulty,
            category: w.category,
          })),
        })),
      });
    }

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Gagal mengambil data chapter" }, { status: 500 });
  }
}
