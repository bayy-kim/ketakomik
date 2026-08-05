import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const chapters = await db.chapter.findMany({
      where: { isPublished: true },
      include: {
        words: {
          select: {
            id: true,
            scheduledDate: true,
            difficulty: true,
            category: true,
          },
        },
      },
      orderBy: { weekStartDate: "asc" },
    });

    // Jika user login, ambil riwayat game session miliknya untuk menandai status normal & hardcore per kata
    if (currentUserId) {
      const userSessions = await db.gameSession.findMany({
        where: {
          userId: currentUserId,
          won: true,
        },
        select: {
          wordId: true,
          mode: true,
        },
      });

      // Map kata-kata di chapter dengan data status penyelesaian dari user
      const chaptersWithProgress = chapters.map((ch) => {
        const wordsWithStatus = ch.words.map((w) => {
          const solvedSessions = userSessions.filter((s) => s.wordId === w.id);
          const solvedNormal = solvedSessions.some((s) => s.mode === "NORMAL");
          const solvedHardcore = solvedSessions.some((s) => s.mode === "HARDCORE_VOICE");

          return {
            ...w,
            solvedNormal,
            solvedHardcore,
          };
        });

        return {
          ...ch,
          words: wordsWithStatus,
        };
      });

      return NextResponse.json({ chapters: chaptersWithProgress });
    }

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Gagal mengambil data chapter" }, { status: 500 });
  }
}
