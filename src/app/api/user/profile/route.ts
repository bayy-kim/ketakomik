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
      select: { tinta: true, tintaSpent: true, currentStreak: true, username: true, email: true, avatarSeed: true, avatarUrl: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      tinta: user.tinta,
      tintaSpent: user.tintaSpent || 0,
      streak: user.currentStreak,
      username: user.username,
      email: user.email,
      avatarSeed: user.avatarSeed,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("Error getting user status:", error);
    return NextResponse.json({ error: "Gagal memuat status user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Anda harus login!" }, { status: 401 });
    }

    const { username, avatarSeed, avatarUrl } = await request.json();

    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: "Username minimal 3 karakter!" }, { status: 400 });
    }

    // Check if username is taken by another user
    const existing = await db.user.findFirst({
      where: {
        username: username.trim(),
        NOT: { id: currentUserId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Username sudah dipakai oleh pemain lain!" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: currentUserId },
      data: {
        username: username.trim(),
        avatarSeed: avatarSeed || "klu_fan",
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil komik" }, { status: 500 });
  }
}
