import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Anda harus login!" }, { status: 401 });
    }

    const { achievementId } = await request.json();

    if (!achievementId) {
      return NextResponse.json({ error: "ID Pencapaian wajib diisi" }, { status: 400 });
    }

    // Verify achievement exists and matches definitions
    const ACHIEVEMENTS_LIST = [
      { id: "word_1", title: "Detektif Pemula", target: 1, rewardTinta: 15, category: "KATA" },
      { id: "word_5", title: "Pengumpul Bukti", target: 5, rewardTinta: 30, category: "KATA" },
      { id: "word_10", title: "Penyidik Berbakat", target: 10, rewardTinta: 50, category: "KATA" },
      { id: "word_25", title: "Pecah Kasus", target: 25, rewardTinta: 75, category: "KATA" },
      { id: "word_50", title: "Sherlock Modern", target: 50, rewardTinta: 100, category: "KATA" },
      { id: "word_100", title: "Legenda Sleuth", target: 100, rewardTinta: 200, category: "KATA" },
      { id: "time_60", title: "Kilat Analisis", target: 60, rewardTinta: 25, category: "WAKTU" }, // di bawah 60s
      { id: "time_30", title: "Kecepatan Cahaya", target: 30, rewardTinta: 50, category: "WAKTU" }, // di bawah 30s
      { id: "time_15", title: "Insting Murni", target: 15, rewardTinta: 100, category: "WAKTU" }, // di bawah 15s
      { id: "streak_7", title: "Streak Master", target: 7, rewardTinta: 80, category: "KATA" }, // streak 7 hari
    ];

    const achDef = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
    if (!achDef) {
      return NextResponse.json({ error: "Pencapaian tidak valid!" }, { status: 400 });
    }

    // Check if already claimed
    const existingClaim = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: currentUserId,
          achievementId,
        },
      },
    });

    if (existingClaim) {
      return NextResponse.json({ error: "Pencapaian ini sudah diklaim sebelumnya!" }, { status: 400 });
    }

    // Atomic transaction: create claim & increment user tinta
    await db.$transaction([
      db.userAchievement.create({
        data: {
          userId: currentUserId,
          achievementId,
        },
      }),
      db.user.update({
        where: { id: currentUserId },
        data: {
          tinta: { increment: achDef.rewardTinta },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      rewardTinta: achDef.rewardTinta,
    });
  } catch (error) {
    console.error("Error claiming achievement:", error);
    return NextResponse.json({ error: "Gagal mengklaim pencapaian tinta" }, { status: 500 });
  }
}
