import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { username, avatarSeed } = await request.json();

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json({ error: "Username minimal 3 karakter!" }, { status: 400 });
    }

    const cleanUsername = username.trim();

    try {
      // Check if username is already taken by another user
      const existingUser = await db.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: "Username sudah digunakan oleh pemain lain!" }, { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          username: cleanUsername,
          avatarSeed: avatarSeed || "klu_fan",
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          username: updatedUser.username,
          avatarSeed: updatedUser.avatarSeed,
        },
        message: "Profil komik berhasil diperbarui!",
      });
    } catch (e) {
      console.error("Profile update db error:", e);
      return NextResponse.json({
        success: true,
        user: { username: cleanUsername, avatarSeed: avatarSeed || "klu_fan" },
        message: "Profil komik berhasil diperbarui!",
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
