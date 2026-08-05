import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { ACHIEVEMENTS_LIST } from "@/lib/achievements";

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
