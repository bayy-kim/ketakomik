import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

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
          tinta: true,
          tintaSpent: true,
          currentStreak: true,
          longestStreak: true,
          role: true,
          createdAt: true,
        },
      });

      gameSessions = await db.gameSession.findMany({
        where: {
          userId,
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
        },
      });

      claimedAchievements = await db.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      });
    } catch (e) {
      console.error("Dashboard query error:", e);
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

    // Achievement Definitions (Word Milestones & Time Milestones)
    const achievementsList = [
      // Word Answered Milestones
      {
        id: "ach_words_25",
        title: "Penebak Pemula",
        category: "KATA",
        target: 25,
        currentProgress: totalWon,
        rewardTinta: 50,
        iconEmoji: "🥉",
        description: "Menjawab 25 Kata Rahasia dengan Benar",
      },
      {
        id: "ach_words_50",
        title: "Penebak Rajin",
        category: "KATA",
        target: 50,
        currentProgress: totalWon,
        rewardTinta: 100,
        iconEmoji: "🥈",
        description: "Menjawab 50 Kata Rahasia dengan Benar",
      },
      {
        id: "ach_words_75",
        title: "Detektif Berbakat",
        category: "KATA",
        target: 75,
        currentProgress: totalWon,
        rewardTinta: 150,
        iconEmoji: "🥇",
        description: "Menjawab 75 Kata Rahasia dengan Benar",
      },
      {
        id: "ach_words_100",
        title: "Pecah Teka-Teki",
        category: "KATA",
        target: 100,
        currentProgress: totalWon,
        rewardTinta: 200,
        iconEmoji: "🎖️",
        description: "Menjawab 100 Kata Rahasia dengan Benar",
      },
      {
        id: "ach_words_125",
        title: "Ahli Komik",
        category: "KATA",
        target: 125,
        currentProgress: totalWon,
        rewardTinta: 250,
        iconEmoji: "👑",
        description: "Menjawab 125 Kata Rahasia dengan Benar",
      },
      {
        id: "ach_words_150",
        title: "Legenda Tekakonik",
        category: "KATA",
        target: 150,
        currentProgress: totalWon,
        rewardTinta: 300,
        iconEmoji: "⚡",
        description: "Menjawab 150 Kata Rahasia dengan Benar",
      },
      // Total Playtime Milestones (seconds)
      {
        id: "ach_time_15m",
        title: "Detektif Kilat",
        category: "WAKTU",
        target: 900, // 15 mins = 900s
        currentProgress: totalDurationSeconds,
        rewardTinta: 30,
        iconEmoji: "⏱️",
        description: "Akumulasi Waktu Bermain 15 Menit",
      },
      {
        id: "ach_time_30m",
        title: "Fokus Tinggi",
        category: "WAKTU",
        target: 1800, // 30 mins = 1800s
        currentProgress: totalDurationSeconds,
        rewardTinta: 60,
        iconEmoji: "🧠",
        description: "Akumulasi Waktu Bermain 30 Menit",
      },
      {
        id: "ach_time_1h",
        title: "Penyelidik Jam-Jaman",
        category: "WAKTU",
        target: 3600, // 1 hour = 3600s
        currentProgress: totalDurationSeconds,
        rewardTinta: 120,
        iconEmoji: "⏳",
        description: "Akumulasi Waktu Bermain 1 Jam",
      },
      {
        id: "ach_time_2h",
        title: "Detektif Tanpa Lelah",
        category: "WAKTU",
        target: 7200, // 2 hours = 7200s
        currentProgress: totalDurationSeconds,
        rewardTinta: 250,
        iconEmoji: "🔥",
        description: "Akumulasi Waktu Bermain 2 Jam",
      },
    ].map((ach) => ({
      ...ach,
      isUnlocked: ach.currentProgress >= ach.target,
      isClaimed: claimedSet.has(ach.id),
    }));

    return NextResponse.json({
      user: {
        username: user?.username || session.user.name || "Detektif",
        email: user?.email || session.user.email || "",
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
