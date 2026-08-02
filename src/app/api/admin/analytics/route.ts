import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Generate analytics data with automatic difficulty flagging logic
    // Auto-flag: "too_easy" if >90% win on attempt 1, "too_hard" if completion rate <10%
    const mockAnalytics = {
      dauWau: [
        { day: "Senin", DAU: 120, WAU: 450 },
        { day: "Selasa", DAU: 145, WAU: 490 },
        { day: "Rabu", DAU: 180, WAU: 520 },
        { day: "Kamis", DAU: 210, WAU: 580 },
        { day: "Jumat", DAU: 260, WAU: 640 },
        { day: "Sabtu", DAU: 340, WAU: 750 },
        { day: "Minggu", DAU: 390, WAU: 820 },
      ],
      modeDistribution: [
        { name: "Mode Normal", count: 1850 },
        { name: "Mode Dengar (Voice)", count: 420 },
      ],
      attemptsDistribution: [
        { attempt: "1x Coba", count: 45 },
        { attempt: "2x Coba", count: 210 },
        { attempt: "3x Coba", count: 450 },
        { attempt: "4x Coba", count: 680 },
        { attempt: "5x Coba", count: 320 },
        { attempt: "6x Coba", count: 140 },
        { attempt: "Gagal", count: 95 },
      ],
      flaggedWords: [
        {
          id: "w101",
          text: "APEL",
          scheduledDate: "2026-03-01",
          totalPlayed: 450,
          winRate: 98,
          attempt1Rate: 92,
          flag: "TOO_EASY", // >90% attempt 1
          reason: "Terlalu mudah (>90% menang di percobaan 1)",
        },
        {
          id: "w102",
          text: "EKSISTENSIAL",
          scheduledDate: "2026-03-02",
          totalPlayed: 520,
          winRate: 8,
          attempt1Rate: 0,
          flag: "TOO_HARD", // <10% completion rate
          reason: "Terlalu sulit (<10% tingkat penyelesaian)",
        },
      ],
    };

    return NextResponse.json(mockAnalytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Gagal mengambil data analitik" }, { status: 500 });
  }
}
