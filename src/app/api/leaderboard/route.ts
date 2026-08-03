import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "HARDCORE_VOICE" ? "HARDCORE_VOICE" : "NORMAL";
    const period = searchParams.get("period") || "alltime";

    interface DbSessionItem {
      id: string;
      attemptsUsed: number;
      durationSeconds: number;
      score: number;
      mode: string;
      anonId: string | null;
      user: { username: string; avatarSeed: string; currentStreak: number } | null;
    }

    let sessions: DbSessionItem[] = [];
    try {
      sessions = await db.gameSession.findMany({
        where: {
          won: true,
          mode: mode as "NORMAL" | "HARDCORE_VOICE",
        },
        include: {
          user: { select: { username: true, avatarSeed: true, currentStreak: true } },
          word: { select: { scheduledDate: true } },
        },
        orderBy: [{ score: "desc" }, { attemptsUsed: "asc" }, { durationSeconds: "asc" }],
        take: 50,
      });
    } catch {
      // Prisma fallback
    }

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ leaderboard: [], mode, period, isEmpty: true });
    }

    const leaderboard = sessions.map((s, idx) => {
      let badge = "💥 Sleuth";
      if (idx === 0) badge = "🦸‍♂️ Top Detective";
      else if (idx === 1) badge = "🔍 Master Decipher";
      else if (idx === 2) badge = "⚡ Comic Hero";

      return {
        rank: idx + 1,
        name: s.user?.username || `Guest_${s.anonId?.slice(0, 6) || "Agent"}`,
        score: s.score || 80,
        attempts: s.attemptsUsed,
        duration: s.durationSeconds,
        mode: s.mode,
        badge,
        streak: s.user?.currentStreak || 1,
        avatarSeed: s.user?.avatarSeed || "klu_fan",
      };
    });

    return NextResponse.json({ leaderboard, mode, period });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Gagal mengambil data leaderboard" }, { status: 500 });
  }
}
