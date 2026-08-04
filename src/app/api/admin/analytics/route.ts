import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const gameSessions = await db.gameSession.findMany({
      include: {
        word: { select: { id: true, text: true, scheduledDate: true } },
      },
      orderBy: { completedAt: "desc" },
    });

    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const now = new Date();
    const dauWauMap: Record<string, { day: string; DAU: number; WAU: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const dateKey = d.toISOString().split("T")[0];
      dauWauMap[dateKey] = { day: dayName, DAU: 0, WAU: 0 };
    }

    let normalCount = 0;
    let voiceCount = 0;

    const attemptsCountMap: Record<string, number> = {
      "1x Coba": 0,
      "2x Coba": 0,
      "3x Coba": 0,
      "4x Coba": 0,
      "5x Coba": 0,
      "6x Coba": 0,
      "Gagal": 0,
    };

    const wordStatsMap: Record<
      string,
      {
        id: string;
        text: string;
        scheduledDate: string;
        totalPlayed: number;
        totalWon: number;
        attempt1Won: number;
      }
    > = {};

    gameSessions.forEach((s) => {
      const dateKey = s.completedAt.toISOString().split("T")[0];
      if (dauWauMap[dateKey]) {
        dauWauMap[dateKey].DAU += 1;
        dauWauMap[dateKey].WAU += 1;
      }

      if (s.mode === "HARDCORE_VOICE") {
        voiceCount++;
      } else {
        normalCount++;
      }

      if (s.won) {
        const key = `${s.attemptsUsed}x Coba`;
        if (attemptsCountMap[key] !== undefined) {
          attemptsCountMap[key] += 1;
        }
      } else {
        attemptsCountMap["Gagal"] += 1;
      }

      if (s.word) {
        const wId = s.word.id;
        if (!wordStatsMap[wId]) {
          wordStatsMap[wId] = {
            id: wId,
            text: s.word.text,
            scheduledDate: s.word.scheduledDate ? s.word.scheduledDate.toISOString().split("T")[0] : "-",
            totalPlayed: 0,
            totalWon: 0,
            attempt1Won: 0,
          };
        }
        wordStatsMap[wId].totalPlayed += 1;
        if (s.won) {
          wordStatsMap[wId].totalWon += 1;
          if (s.attemptsUsed === 1) {
            wordStatsMap[wId].attempt1Won += 1;
          }
        }
      }
    });

    const flaggedWords: {
      id: string;
      text: string;
      scheduledDate: string;
      totalPlayed: number;
      winRate: number;
      attempt1Rate: number;
      flag: "TOO_EASY" | "TOO_HARD";
      reason: string;
    }[] = [];

    Object.values(wordStatsMap).forEach((w) => {
      if (w.totalPlayed >= 5) {
        const winRate = Math.round((w.totalWon / w.totalPlayed) * 100);
        const attempt1Rate = Math.round((w.attempt1Won / w.totalPlayed) * 100);

        if (attempt1Rate > 90) {
          flaggedWords.push({
            id: w.id,
            text: w.text,
            scheduledDate: w.scheduledDate,
            totalPlayed: w.totalPlayed,
            winRate,
            attempt1Rate,
            flag: "TOO_EASY",
            reason: `Terlalu mudah (${attempt1Rate}% menang di percobaan pertama)`,
          });
        } else if (winRate < 10) {
          flaggedWords.push({
            id: w.id,
            text: w.text,
            scheduledDate: w.scheduledDate,
            totalPlayed: w.totalPlayed,
            winRate,
            attempt1Rate,
            flag: "TOO_HARD",
            reason: `Terlalu sulit (hanya ${winRate}% tingkat kemenangan)`,
          });
        }
      }
    });

    const dauWau = Object.values(dauWauMap);
    const modeDistribution = [
      { name: "Mode Normal", count: normalCount },
      { name: "Mode Dengar (Voice)", count: voiceCount },
    ];
    const attemptsDistribution = Object.entries(attemptsCountMap).map(([attempt, count]) => ({
      attempt,
      count,
    }));

    return NextResponse.json({
      dauWau,
      modeDistribution,
      attemptsDistribution,
      flaggedWords,
      totalGameSessions: gameSessions.length,
    });
  } catch (error) {
    console.error("Error fetching real analytics:", error);
    return NextResponse.json({ error: "Gagal mengambil data analitik" }, { status: 500 });
  }
}
