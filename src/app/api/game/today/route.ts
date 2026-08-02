import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { FALLBACK_WORDS } from "@/lib/game-data-fallback";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

    let word;
    try {
      word = await db.word.findFirst({
        where: {
          scheduledDate: {
            gte: new Date(`${dateParam}T00:00:00.000Z`),
            lte: new Date(`${dateParam}T23:59:59.999Z`),
          },
        },
      });
    } catch {
      // Prisma error/fallback to in-memory mock
    }

    if (!word) {
      const foundFallback = FALLBACK_WORDS.find((w) => w.scheduledDate === dateParam) || FALLBACK_WORDS[0];
      return NextResponse.json({
        id: foundFallback.id,
        length: foundFallback.normalizedText.length,
        category: foundFallback.category,
        difficulty: foundFallback.difficulty,
        scheduledDate: foundFallback.scheduledDate,
        chapterId: foundFallback.chapterId || "ch1",
      });
    }

    // MANDATORY SECURITY RULE: NEVER EXPOSE word.text to client frontend!
    return NextResponse.json({
      id: word.id,
      length: word.normalizedText.length,
      category: word.category,
      difficulty: word.difficulty,
      scheduledDate: word.scheduledDate.toISOString().split("T")[0],
      chapterId: word.chapterId,
    });
  } catch (error) {
    console.error("Error fetching today's word:", error);
    return NextResponse.json({ error: "Gagal mengambil kata hari ini" }, { status: 500 });
  }
}
