import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "HARDCORE_VOICE" ? "HARDCORE_VOICE" : "NORMAL";
    const period = searchParams.get("period") || "alltime";

    const now = new Date();
    let dateFilter: { gte?: Date } = {};

    if (period === "daily") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { gte: startOfDay };
    } else if (period === "weekly") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { gte: sevenDaysAgo };
    }

    // Ambil semua game session yang menang dan bukan duel
    const sessions = await db.gameSession.findMany({
      where: {
        won: true,
        isDuel: false,
        mode: mode as "NORMAL" | "HARDCORE_VOICE",
        ...(period !== "alltime" ? { completedAt: dateFilter } : {}),
        OR: [
          { user: { isBanned: false } },
          { userId: null },
        ],
      },
      include: {
        user: { select: { username: true, avatarSeed: true, avatarUrl: true, currentStreak: true } },
      },
    });

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ leaderboard: [], mode, period, isEmpty: true });
    }

    // Akumulasi skor per pengguna (userId atau anonId)
    interface AggregatedUser {
      key: string;
      name: string;
      totalScore: number;
      totalSolved: number;
      totalAttempts: number;
      totalDuration: number;
      streak: number;
      avatarSeed: string;
      avatarUrl: string | null;
    }

    const userMap: Record<string, AggregatedUser> = {};

    for (const s of sessions) {
      const key = s.userId ? `user_${s.userId}` : `anon_${s.anonId || "guest"}`;
      const name = s.user?.username || (s.anonId ? `Guest_${s.anonId.slice(0, 6)}` : "Guest Agent");
      const streak = s.user?.currentStreak || 1;
      const avatarSeed = s.user?.avatarSeed || "klu_fan";
      const avatarUrl = s.user?.avatarUrl || null;

      if (!userMap[key]) {
        userMap[key] = {
          key,
          name,
          totalScore: 0,
          totalSolved: 0,
          totalAttempts: 0,
          totalDuration: 0,
          streak,
          avatarSeed,
          avatarUrl,
        };
      }

      userMap[key].totalScore += (s.score || 50);
      userMap[key].totalSolved += 1;
      userMap[key].totalAttempts += s.attemptsUsed;
      userMap[key].totalDuration += s.durationSeconds;
    }

    // Convert map to array & sort by totalScore descending
    const sortedUsers = Object.values(userMap).sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.totalSolved !== a.totalSolved) return b.totalSolved - a.totalSolved;
      return a.totalAttempts - b.totalAttempts;
    });

    const top50 = sortedUsers.slice(0, 50);

    const leaderboard = top50.map((u, idx) => {
      let badge = "💥 Sleuth";
      if (idx === 0) badge = "🦸‍♂️ Top Detective";
      else if (idx === 1) badge = "🔍 Master Decipher";
      else if (idx === 2) badge = "⚡ Comic Hero";

      return {
        rank: idx + 1,
        name: u.name,
        score: u.totalScore, // Poin Akumulatif
        totalSolved: u.totalSolved,
        attempts: Math.round(u.totalAttempts / u.totalSolved),
        duration: Math.round(u.totalDuration / u.totalSolved),
        mode,
        badge,
        streak: u.streak,
        avatarSeed: u.avatarSeed,
        avatarUrl: u.avatarUrl,
      };
    });

    return NextResponse.json({ leaderboard, mode, period });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Gagal mengambil data leaderboard" }, { status: 500 });
  }
}
