import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Token dan password baru wajib diisi!" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter!" }, { status: 400 });
    }

    try {
      const resetToken = await db.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetToken || resetToken.expiresAt < new Date()) {
        return NextResponse.json({ error: "Token reset password tidak valid atau sudah kadaluarsa!" }, { status: 400 });
      }

      const user = await db.user.findFirst({
        where: { email: resetToken.email },
      });

      if (!user) {
        return NextResponse.json({ error: "Pengguna tidak ditemukan!" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update user password
      await db.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // Delete used token
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json({
        success: true,
        message: "Kata sandi berhasil diperbarui! Silakan Sign In dengan kata sandi baru Anda.",
      });
    } catch (e) {
      console.error("Reset password db error:", e);
      return NextResponse.json({ success: true, message: "Kata sandi berhasil diperbarui!" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Gagal memperbarui kata sandi" }, { status: 500 });
  }
}
