import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { ACHIEVEMENTS_LIST } from "@/lib/achievements";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || !session?.user) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filterYear = searchParams.get("year");
    const filterMonth = searchParams.get("month");
    const filterDate = searchParams.get("date"); // Format: YYYY-MM-DD

    let user;
    let gameSessions: {
      id: string;
      attemptsUsed: number;
      won: boolean;
      durationSeconds: number;
      completedAt: Date;
      mode: string;
      isDuel: boolean;
    }[] = [];
    let claimedAchievements: { achievementId: string }[] = [];

    // Filter tanggal dinamis untuk query database
    let dateFilter: { gte?: Date; lte?: Date } = {};
    if (filterDate) {
      dateFilter = {
        gte: new Date(`${filterDate}T00:00:00.000Z`),
        lte: new Date(`${filterDate}T23:59:59.999Z`),
      };
    } else if (filterYear || filterMonth) {
      const year = filterYear ? parseInt(filterYear) : new Date().getFullYear();
      if (filterMonth) {
        const month = parseInt(filterMonth) - 1; // 0-indexed
        dateFilter = {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0, 23, 59, 59, 999),
        };
      } else {
        dateFilter = {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        };
      }
    }

    const hasFilter = !!(filterDate || filterYear || filterMonth);

    try {
      user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          avatarSeed: true,
          tinta: true,
          tintaSpent: true,
          currentStreak: true,
          longestStreak: true,
          role: true,
          createdAt: true,
        },
      });

      // Ambil game sessions reguler (non-duel) untuk statistik
      gameSessions = await db.gameSession.findMany({
        where: {
          userId,
          isDuel: false,
          ...(hasFilter ? { completedAt: dateFilter } : {}),
        },
        orderBy: { completedAt: "desc" },
        select: {
          id: true,
          attemptsUsed: true,
          won: true,
          durationSeconds: true,
          completedAt: true,
          mode: true,
          isDuel: true,
        },
      });

      claimedAchievements = await db.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      });
    } catch (e) {
      console.error("Dashboard query error:", e);
    }

    // Ambil total semua game session untuk progress achievements
    let allGameSessions: { won: boolean; mode: string; durationSeconds: number }[] = [];
    let totalDuels = 0;
    try {
      allGameSessions = await db.gameSession.findMany({
        where: { userId },
        select: { won: true, mode: true, durationSeconds: true },
      });

      totalDuels = await db.gameSession.count({
        where: { userId, isDuel: true },
      });
    } catch (e) {
      console.error("Failed to query progress metrics:", e);
    }

    const claimedSet = new Set(claimedAchievements.map((a) => a.achievementId));

    const totalPlayed = gameSessions.length;
    const totalWon = gameSessions.filter((s) => s.won).length;
    const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
    const totalDurationSeconds = gameSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

    // Calculate Daily Answer Analytics for the last 7 days
    const dailyAnalyticsMap: Record<string, { date: string; played: number; won: number; avgAttempts: number }> = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyAnalyticsMap[dateStr] = { date: dateStr, played: 0, won: 0, avgAttempts: 0 };
    }

    let totalAttemptsCalc = 0;
    gameSessions.forEach((s) => {
      const dateStr = s.completedAt.toISOString().split("T")[0];
      if (dailyAnalyticsMap[dateStr]) {
        dailyAnalyticsMap[dateStr].played += 1;
        if (s.won) dailyAnalyticsMap[dateStr].won += 1;
      }
      totalAttemptsCalc += s.attemptsUsed;
    });

    const avgAttempts = totalPlayed > 0 ? (totalAttemptsCalc / totalPlayed).toFixed(1) : "0.0";
    const dailyAnalytics = Object.values(dailyAnalyticsMap);

    // Hitung progress global untuk pencapaian
    const totalWonGlobal = allGameSessions.filter(s => s.won).length;
    const totalPlaytimeGlobal = allGameSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalVoiceWins = allGameSessions.filter(s => s.won && s.mode === "HARDCORE_VOICE").length;
    const currentStreak = user?.currentStreak || 0;
    const tintaSpent = user?.tintaSpent || 0;

    const achievementsList = ACHIEVEMENTS_LIST.map((ach) => {
      let progress = 0;
      if (ach.category === "KATA") progress = totalWonGlobal;
      else if (ach.category === "WAKTU") progress = totalPlaytimeGlobal;
      else if (ach.category === "DUEL") progress = totalDuels;
      else if (ach.category === "TINTA") progress = tintaSpent;
      else if (ach.category === "VOICE") progress = totalVoiceWins;
      else if (ach.category === "STREAK") progress = currentStreak;

      return {
        ...ach,
        currentProgress: progress,
        isUnlocked: progress >= ach.target,
        isClaimed: claimedSet.has(ach.id),
      };
    });

    return NextResponse.json({
      user: {
        username: user?.username || session.user.name || "Detektif",
        email: user?.email || session.user.email || "",
        avatarUrl: user?.avatarUrl || null,
        avatarSeed: user?.avatarSeed || "klu_fan",
        tinta: user?.tinta ?? 50,
        tintaSpent: user?.tintaSpent ?? 0,
        currentStreak: user?.currentStreak ?? 0,
        longestStreak: user?.longestStreak ?? 0,
        role: user?.role || "USER",
      },
      stats: {
        totalPlayed,
        totalWon,
        winRate,
        avgAttempts,
        totalDurationSeconds,
      },
      dailyAnalytics,
      achievements: achievementsList,
      recentHistory: gameSessions.slice(0, 5),
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return NextResponse.json({ error: "Gagal memuat dashboard pengguna" }, { status: 500 });
  }
}
