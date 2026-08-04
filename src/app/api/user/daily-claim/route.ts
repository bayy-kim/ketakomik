import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: currentUserId },
      select: { lastDailyClaimAt: true, tinta: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const now = new Date();
    const resetTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0); // Jam 06:00 pagi hari ini

    // Jika sekarang sebelum jam 6 pagi, pembandingnya adalah jam 6 pagi kemarin
    if (now.getTime() < resetTimeToday.getTime()) {
      resetTimeToday.setDate(resetTimeToday.getDate() - 1);
    }

    // Cek apakah sudah pernah klaim hari ini setelah jam 6 pagi
    const lastClaim = user.lastDailyClaimAt;
    if (lastClaim && lastClaim.getTime() >= resetTimeToday.getTime()) {
      return NextResponse.json({
        success: false,
        alreadyClaimed: true,
        message: "Tinta harian sudah diklaim hari ini!",
      });
    }

    // Update tinta dan lastDailyClaimAt
    const updatedUser = await db.user.update({
      where: { id: currentUserId },
      data: {
        tinta: { increment: 70 }, // Klaim harian +70 Tinta
        lastDailyClaimAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      tintaEarned: 70,
      tintaRemaining: updatedUser.tinta,
      message: "Berhasil mengklaim +70 Tinta harian!",
    });
  } catch (error) {
    console.error("Error claiming daily tinta:", error);
    return NextResponse.json({ error: "Gagal memproses klaim tinta harian" }, { status: 500 });
  }
}
