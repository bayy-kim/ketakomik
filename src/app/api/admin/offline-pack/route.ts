import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { INITIAL_OFFLINE_CHAPTERS } from "@/lib/offline-data";

export async function GET() {
  try {
    const chapters = await db.chapter.findMany({
      where: { isPublished: true },
      include: {
        words: {
          select: {
            id: true,
            text: true,
            normalizedText: true,
            category: true,
            difficulty: true,
          },
        },
      },
      orderBy: { weekStartDate: "asc" },
    });

    if (!chapters || chapters.length === 0) {
      return NextResponse.json({ offlineChapters: INITIAL_OFFLINE_CHAPTERS });
    }

    const offlineChapters = chapters.map((ch, idx) => ({
      id: ch.id,
      chapterNumber: idx + 1,
      title: ch.title,
      narrative: ch.chapterNote || `Petualangan Chapter #${idx + 1} seputar pengetahuan umum Nusantara.`,
      category: "Pengetahuan Umum",
      unlockComicImageUrl: ch.unlockComicImageUrl || "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      words: ch.words.map((w) => ({
        id: w.id,
        text: w.text,
        normalizedText: w.normalizedText,
        length: w.normalizedText.length,
        category: w.category,
        difficulty: w.difficulty,
      })),
    }));

    return NextResponse.json({ offlineChapters });
  } catch (error) {
    console.error("Error fetching offline pack:", error);
    return NextResponse.json({ offlineChapters: INITIAL_OFFLINE_CHAPTERS });
  }
}
