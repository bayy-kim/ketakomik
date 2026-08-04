import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const word = await db.word.findFirst({
      where: {
        scheduledDate: {
          gte: new Date(`${dateParam}T00:00:00.000Z`),
          lte: new Date(`${dateParam}T23:59:59.999Z`),
        },
      },
    });

    if (!word) {
      // Return 404 cleanly when no word is scheduled for today in the DB
      return NextResponse.json({ error: "Tidak ada kata yang dijadwalkan untuk hari ini!" }, { status: 404 });
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
