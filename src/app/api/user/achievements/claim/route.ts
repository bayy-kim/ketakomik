import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

const REWARD_MAP: Record<string, number> = {
  ach_words_25: 50,
  ach_words_50: 100,
  ach_words_75: 150,
  ach_words_100: 200,
  ach_words_125: 250,
  ach_words_150: 300,
  ach_time_15m: 30,
  ach_time_30m: 60,
  ach_time_1h: 120,
  ach_time_2h: 250,
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { achievementId } = await request.json();

    if (!achievementId || !REWARD_MAP[achievementId]) {
      return NextResponse.json({ error: "ID Pencapaian tidak valid!" }, { status: 400 });
    }

    const rewardTinta = REWARD_MAP[achievementId];

    try {
      // Check if already claimed
      const existing = await db.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Pencapaian ini sudah pernah diklaim sebelumnya!" }, { status: 400 });
      }

      // Record claim and increment user tinta atomically
      await db.$transaction([
        db.userAchievement.create({
          data: {
            userId,
            achievementId,
          },
        }),
        db.user.update({
          where: { id: userId },
          data: {
            tinta: { increment: rewardTinta },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        achievementId,
        rewardTinta,
        message: `🎉 Selamat! Kamu berhasil mengklaim +${rewardTinta} Tinta!`,
      });
    } catch (e) {
      console.error("Achievement claim error:", e);
      return NextResponse.json({ success: true, rewardTinta });
    }
  } catch (error) {
    console.error("Error claiming achievement:", error);
    return NextResponse.json({ error: "Gagal mengklaim pencapaian" }, { status: 500 });
  }
}
