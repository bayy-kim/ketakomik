import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get("wordId");

    if (!wordId) {
      return NextResponse.json({ error: "wordId query parameter is required" }, { status: 400 });
    }

    const currentWord = await db.word.findUnique({
      where: { id: wordId },
      include: {
        chapter: {
          include: {
            words: {
              orderBy: { scheduledDate: "asc" },
              select: { id: true, scheduledDate: true },
            },
          },
        },
      },
    });

    if (!currentWord || !currentWord.chapter) {
      return NextResponse.json({ nextWordId: null });
    }

    const chapterWords = currentWord.chapter.words;
    const currentIndex = chapterWords.findIndex((w) => w.id === wordId);

    if (currentIndex !== -1 && currentIndex + 1 < chapterWords.length) {
      const nextWord = chapterWords[currentIndex + 1];
      return NextResponse.json({
        currentWordInfo: {
          id: currentWord.id,
          length: currentWord.normalizedText.length,
          category: currentWord.category,
          difficulty: currentWord.difficulty,
        },
        nextWordId: nextWord.id,
        nextWordIndex: currentIndex + 2,
        totalWords: chapterWords.length,
        chapterTitle: currentWord.chapter.title,
      });
    }

    return NextResponse.json({
      currentWordInfo: {
        id: currentWord.id,
        length: currentWord.normalizedText.length,
        category: currentWord.category,
        difficulty: currentWord.difficulty,
      },
      nextWordId: null,
      isLastInChapter: true,
      chapterTitle: currentWord.chapter.title,
    });
  } catch (error) {
    console.error("Error finding next word:", error);
    return NextResponse.json({ error: "Gagal memuat kata selanjutnya" }, { status: 500 });
  }
}
