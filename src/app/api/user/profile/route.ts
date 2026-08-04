import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Anda harus login!" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: currentUserId },
      select: { tinta: true, tintaSpent: true, currentStreak: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ tinta: user.tinta, tintaSpent: user.tintaSpent || 0, streak: user.currentStreak });
  } catch (error) {
    console.error("Error getting user status:", error);
    return NextResponse.json({ error: "Gagal memuat status user" }, { status: 500 });
  }
}
